import { useState, useEffect } from 'react';
import axios from 'axios';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [myRsvps, setMyRsvps] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchEventsAndRsvps = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch all events (assuming public or president endpoint works for now, or we need a new one)
            // Using president endpoint for now as it returns all events
            const eventsRes = await axios.get('http://localhost:5000/api/president/events', { headers });

            // Fetch my RSVPs
            const rsvpsRes = await axios.get('http://localhost:5000/api/rsvp/my-rsvps', { headers });

            // Map RSVPs for easy lookup
            const rsvpMap = {};
            rsvpsRes.data.forEach(rsvp => {
                rsvpMap[rsvp.eventId] = rsvp.status;
            });

            setEvents(eventsRes.data);
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

    const handleRsvp = async (eventId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/rsvp/${eventId}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMyRsvps(prev => ({ ...prev, [eventId]: status }));
            alert(`RSVP updated: ${status}`);
        } catch (error) {
            alert('Error updating RSVP');
            console.error(error);
        }
    };

    if (loading) return <div>Loading events...</div>;

    return (
        <div className="card animate-fade-up">
            <h2 style={{ marginBottom: '2rem' }}>Upcoming Events</h2>

            {events.length === 0 ? (
                <p>No upcoming events.</p>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {events.map(event => (
                        <div key={event.id} style={{
                            border: '1px solid var(--border-color)',
                            padding: '1.5rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'var(--bg-body)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{event.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        {new Date(event.date).toLocaleDateString()} at {event.venue}
                                    </p>
                                    <p>{event.description}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className={`btn ${myRsvps[event.id] === 'going' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => handleRsvp(event.id, 'going')}
                                    >
                                        Going
                                    </button>
                                    <button
                                        className={`btn ${myRsvps[event.id] === 'maybe' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => handleRsvp(event.id, 'maybe')}
                                    >
                                        Maybe
                                    </button>
                                    <button
                                        className={`btn ${myRsvps[event.id] === 'not_going' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => handleRsvp(event.id, 'not_going')}
                                    >
                                        Not Going
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
