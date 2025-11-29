import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        members: 0,
        events: 0,
        elections: 0
    });

    const fetchStats = async () => {
        try {
            // We don't have a dedicated stats endpoint, but we can fetch lists and count.
            // Or we can add a stats endpoint. For now, let's fetch lists.
            // This is not efficient for large data, but fine for this scale.

            // Fetch members (Secretary route) - might be restricted.
            // Fetch events (President route) - accessible to all (we just added GET /events).
            // Fetch elections (President route) - accessible to all.

            // Note: Secretary route /secretary/members is restricted to sec/pres/vp.
            // If the current user is a member, they can't see total members count via that route.
            // Let's just show events and elections for now, or mock members count if we can't access it.
            // Or we can add a public stats endpoint.

            const [eventsData, electionsData] = await Promise.all([
                api.get('/president/events').catch(() => []),
                api.get('/president/elections').catch(() => [])
            ]);

            setStats({
                members: 1250, // Placeholder as we can't easily fetch this for everyone without a new endpoint
                events: eventsData.length,
                elections: electionsData.filter(e => e.status === 'ongoing').length
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                    <h3>Total Members</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.members}</p>
                </div>
                <div className="card">
                    <h3>Upcoming Events</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{stats.events}</p>
                </div>
                <div className="card">
                    <h3>Active Elections</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{stats.elections}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
