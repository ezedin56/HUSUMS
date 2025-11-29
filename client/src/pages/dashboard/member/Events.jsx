import { useState, useEffect } from 'react';
import axios from 'axios';
import '../memberDashboard.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [myRsvps, setMyRsvps] = useState({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchEventsAndRsvps = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const eventsRes = await axios.get('http://localhost:5000/api/president/events', { headers });
            const rsvpsRes = await axios.get('http://localhost:5000/api/rsvp/my-rsvps', { headers }).catch(() => ({ data: [] }));

            const rsvpMap = {};
            (rsvpsRes.data || []).forEach(rsvp => {
                rsvpMap[rsvp.eventId] = rsvp.status;
            });

            setEvents(eventsRes.data || []);
            setMyRsvps(rsvpMap);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventsAndRsvps();
    }, []);

    const handleRSVP = async (eventId, status) => {
        try {
            await api.post(`/rsvp/${eventId}`, { status });

            setMyRsvps(prev => ({ ...prev, [eventId]: status }));
        } catch (error) {
            console.error('Error updating RSVP:', error);
        }
    };

    const getEventStatus = (date) => {
        const eventDate = new Date(date);
        const now = new Date();
        const diff = eventDate - now;
        
        if (diff < 0) return { label: 'Past', class: 'past' };
        if (diff < 24 * 60 * 60 * 1000) return { label: 'Today', class: 'today' };
        if (diff < 7 * 24 * 60 * 60 * 1000) return { label: 'This Week', class: 'soon' };
        return { label: 'Upcoming', class: 'upcoming' };
    };

    if (loading) {
        return (
            <div className="page-shell">
                <div className="dashboard-stars" />
                <div className="page-loading">
                    <div className="holo-loader" />
                    <p>Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <div className="dashboard-stars" />
            <div className="dashboard-wave" />

            <header className="page-header">
                <div>
                    <p className="page-label">🎉 Events</p>
                    <h1 className="page-title">Upcoming Events</h1>
                </div>
                <div className="filter-tabs">
                    {['all', 'going', 'maybe'].map(tab => (
                        <button
                            key={tab}
                            className={`filter-tab ${filter === tab ? 'active' : ''}`}
                            onClick={() => setFilter(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </header>

            {events.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <h3>No Events Scheduled</h3>
                    <p>There are no upcoming events at the moment.</p>
                </div>
            ) : (
                <div className="events-grid">
                    {events
                        .filter(event => filter === 'all' || myRsvps[event.id] === filter)
                        .map((event, index) => {
                            const status = getEventStatus(event.date);
                            const myStatus = myRsvps[event.id];
                            
                            return (
                                <article 
                                    key={event.id} 
                                    className="event-card"
                                    style={{ '--card-delay': `${index * 0.1}s` }}
                                >
                                    <div className={`event-status-badge ${status.class}`}>
                                        {status.label}
                                    </div>

                                    <div className="event-date-display">
                                        <span className="event-month">
                                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                        <span className="event-day">
                                            {new Date(event.date).getDate()}
                                        </span>
                                    </div>

                                    <div className="event-content">
                                        <h3 className="event-title">{event.title}</h3>
                                        <p className="event-description">{event.description}</p>
                                        
                                        <div className="event-meta">
                                            <div className="meta-item">
                                                <span className="meta-icon">📍</span>
                                                <span>{event.venue || 'TBD'}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-icon">🕐</span>
                                                <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rsvp-actions">
                                        <button
                                            className={`rsvp-btn going ${myStatus === 'going' ? 'active' : ''}`}
                                            onClick={() => handleRsvp(event.id, 'going')}
                                        >
                                            ✓ Going
                                        </button>
                                        <button
                                            className={`rsvp-btn maybe ${myStatus === 'maybe' ? 'active' : ''}`}
                                            onClick={() => handleRsvp(event.id, 'maybe')}
                                        >
                                            ? Maybe
                                        </button>
                                        <button
                                            className={`rsvp-btn not-going ${myStatus === 'not_going' ? 'active' : ''}`}
                                            onClick={() => handleRsvp(event.id, 'not_going')}
                                        >
                                            ✗ Can't Go
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                </div>
            )}
        </div>
    );
};

export default Events;
