import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import './memberDashboard.css';

const DashboardOverview = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [stats, setStats] = useState({
        members: 0,
        events: 0,
        elections: 0,
        votescast: 0,
        impact: 87,
        pulse: 72,
        badges: 3
    });
    const [activityIndex, setActivityIndex] = useState(0);
    const [liveFeed, setLiveFeed] = useState([
        { id: 1, label: 'Council Election • Live', value: '+24 votes', type: 'vote' },
        { id: 2, label: 'Campus Event RSVP • 18:21', value: '+12 responses', type: 'event' },
        { id: 3, label: 'New Member Joined • 18:02', value: 'Welcome!', type: 'member' }
    ]);
    const [hoveredCard, setHoveredCard] = useState(null);

    const isMember = user?.role === 'member';

    const fetchStats = async () => {
        try {
            const statsData = await api.get('/users/stats');
            
            setStats(prev => ({
                ...prev,
                members: statsData.members || 0,
                events: statsData.events || 0,
                elections: statsData.elections || 0,
                votescast: statsData.votescast || 0,
                impact: statsData.attendance?.attendanceRate || prev.impact,
                pulse: Math.floor(Math.random() * 15) + 70,
                badges: statsData.attendance?.totalCheckIns > 20 ? 4 : statsData.attendance?.totalCheckIns > 10 ? 3 : statsData.attendance?.totalCheckIns > 5 ? 2 : 1
            }));
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        const ticker = setInterval(() => {
            const types = ['vote', 'event', 'member', 'action'];
            const labels = [
                'Community Vote • Live',
                'Event Check-in Detected',
                'New Member Verified',
                'Task Completed'
            ];
            const values = ['+' + (Math.floor(Math.random() * 30) + 5) + ' votes', 'Recorded', 'Welcome!', '+10 XP'];
            const typeIdx = Math.floor(Math.random() * types.length);
            
            setLiveFeed(prev => {
                const nextEntry = {
                    id: Date.now(),
                    label: `${labels[typeIdx]} • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                    value: values[typeIdx],
                    type: types[typeIdx]
                };
                return [nextEntry, ...prev].slice(0, 6);
            });
        }, 5000);
        return () => clearInterval(ticker);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setActivityIndex(prev => (prev + 1) % 48);
        }, 1500);
        return () => clearInterval(timer);
    }, []);

    const activityTrail = useMemo(() => (
        new Array(48).fill(null).map((_, idx) => {
            const amplitude = Math.sin((idx + activityIndex) / 4) * 22 + 40;
            return Math.max(8, Math.round(amplitude));
        })
    ), [activityIndex]);

    const getTypeColor = (type) => {
        switch (type) {
            case 'vote': return '#00f5ff';
            case 'event': return '#a855f7';
            case 'member': return '#22c55e';
            default: return '#fb923c';
        }
    };

    return (
        <div className="member-dashboard-shell">
            <div className="dashboard-stars" />
            <div className="dashboard-wave" />

            {/* Welcome Header */}
            <header style={{
                position: 'relative',
                zIndex: 1,
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <p style={{
                        fontSize: '0.8rem',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: 'rgba(0, 245, 255, 0.8)',
                        marginBottom: '0.25rem'
                    }}>Command Center</p>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #fff 0%, #00f5ff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0
                    }}>
                        Welcome back, {user?.firstName || 'Member'}
                    </h1>
                </div>
                {isMember && (
                    <button
                        className="btn-neon"
                        onClick={() => navigate('/dashboard/member/elections')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #00f5ff, #a855f7)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 20px rgba(0, 245, 255, 0.3)'
                        }}
                    >
                        🗳️ Vote Now
                    </button>
                )}
            </header>

            <section className="command-center">
                <div className="ring-wrapper">
                    <div className="ring-core">
                        <span>Community Pulse</span>
                        <strong>{stats.pulse}%</strong>
                        <p>Operational Integrity</p>
                    </div>
                    <div className="ring-halo" />
                </div>

                <div className="holo-panels">
                    <article 
                        className="holo-card"
                        onMouseEnter={() => setHoveredCard('polls')}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => isMember && navigate('/dashboard/member/elections')}
                        style={{ cursor: isMember ? 'pointer' : 'default' }}
                    >
                        <p>Active Polls</p>
                        <h3 style={{
                            transform: hoveredCard === 'polls' ? 'scale(1.1)' : 'scale(1)',
                            transition: 'transform 0.3s ease'
                        }}>{stats.elections}</h3>
                        <small>Real-time ballots</small>
                        {stats.elections > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                width: '10px',
                                height: '10px',
                                background: '#22c55e',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px #22c55e',
                                animation: 'pulse 2s infinite'
                            }} />
                        )}
                    </article>
                    <article 
                        className="holo-card"
                        onMouseEnter={() => setHoveredCard('members')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <p>Community</p>
                        <h3 style={{
                            transform: hoveredCard === 'members' ? 'scale(1.1)' : 'scale(1)',
                            transition: 'transform 0.3s ease'
                        }}>{stats.members.toLocaleString()}</h3>
                        <small>Verified members</small>
                    </article>
                    <article 
                        className="holo-card"
                        onMouseEnter={() => setHoveredCard('impact')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <p>Your Impact Score</p>
                        <h3 style={{
                            transform: hoveredCard === 'impact' ? 'scale(1.1)' : 'scale(1)',
                            transition: 'transform 0.3s ease'
                        }}>{stats.impact}</h3>
                        <small>Influence index</small>
                    </article>
                    <article 
                        className="holo-card"
                        onMouseEnter={() => setHoveredCard('badges')}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => isMember && navigate('/dashboard/member/profile')}
                        style={{ cursor: isMember ? 'pointer' : 'default' }}
                    >
                        <p>Badges Earned</p>
                        <h3 style={{
                            transform: hoveredCard === 'badges' ? 'scale(1.1)' : 'scale(1)',
                            transition: 'transform 0.3s ease'
                        }}>🏆 {stats.badges}</h3>
                        <small>Achievements</small>
                    </article>
                </div>
            </section>

            <section className="data-stream">
                <div className="stream-left">
                    <header>
                        <h2>Your Activity Vector</h2>
                        <span style={{ color: '#22c55e' }}>+12% vs last cycle</span>
                    </header>
                    <div className="activity-graph">
                        {activityTrail.map((value, idx) => (
                            <span 
                                key={idx} 
                                style={{ 
                                    height: `${value}%`,
                                    opacity: idx > activityTrail.length - 10 ? 1 : 0.6
                                }} 
                            />
                        ))}
                        <div className="particle-flow" />
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '1rem',
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.5)'
                    }}>
                        <span>30 days ago</span>
                        <span>Today</span>
                    </div>
                </div>

                <div className="stream-right">
                    <header>
                        <h2>Live Civic Feed</h2>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{
                                width: '8px',
                                height: '8px',
                                background: '#22c55e',
                                borderRadius: '50%',
                                animation: 'pulse 1.5s infinite'
                            }} />
                            Streaming
                        </span>
                    </header>
                    <div className="ticker">
                        {liveFeed.map(item => (
                            <div 
                                key={item.id} 
                                className="ticker-row"
                                style={{ borderLeftColor: getTypeColor(item.type) }}
                            >
                                <div>
                                    <p>{item.label}</p>
                                    <small>detected</small>
                                </div>
                                <strong style={{ color: getTypeColor(item.type) }}>{item.value}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Actions for Members */}
            {isMember && (
                <section style={{
                    position: 'relative',
                    zIndex: 1,
                    marginTop: '2rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                }}>
                    {[
                        { label: 'View Profile', icon: '👤', path: '/dashboard/member/profile', color: '#a855f7' },
                        { label: 'My Attendance', icon: '📋', path: '/dashboard/member/attendance', color: '#00f5ff' },
                        { label: 'Browse Events', icon: '🎉', path: '/dashboard/member/events', color: '#fb923c' },
                        { label: 'Resources', icon: '📚', path: '/dashboard/member/resources', color: '#22c55e' }
                    ].map((action) => (
                        <button
                            key={action.label}
                            onClick={() => navigate(action.path)}
                            style={{
                                background: 'rgba(15, 23, 42, 0.6)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '1rem',
                                padding: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                color: 'white'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = action.color;
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = `0 10px 30px ${action.color}30`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>{action.icon}</span>
                            <span style={{ fontWeight: 600 }}>{action.label}</span>
                        </button>
                    ))}
                </section>
            )}
        </div>
    );
};

export default DashboardOverview;
