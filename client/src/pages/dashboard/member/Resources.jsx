import { useState, useEffect } from 'react';
import axios from 'axios';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        resourceId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: ''
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [resResources, resBookings] = await Promise.all([
                axios.get('http://localhost:5000/api/resources', { headers }),
                axios.get('http://localhost:5000/api/resources/my-bookings', { headers })
            ]);

            setResources(resResources.data);
            setBookings(resBookings.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

            await axios.post('http://localhost:5000/api/resources/book', {
                resourceId: formData.resourceId,
                startTime: startDateTime,
                endTime: endDateTime,
                purpose: formData.purpose
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Booking request submitted!');
            setFormData({ resourceId: '', date: '', startTime: '', endTime: '', purpose: '' });
            fetchData(); // Refresh bookings
        } catch (error) {
            alert('Error creating booking');
            console.error(error);
        }
    };

    if (loading) return <div>Loading resources...</div>;

    return (
        <div className="card animate-fade-up">
            <h2 style={{ marginBottom: '2rem' }}>Resource Booking</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Booking Form */}
                <div>
                    <h3>Book a Resource</h3>
                    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                        <div className="form-group">
                            <label>Resource</label>
                            <select
                                className="input"
                                value={formData.resourceId}
                                onChange={e => setFormData({ ...formData, resourceId: e.target.value })}
                                required
                            >
                                <option value="">Select Resource</option>
                                {resources.map(r => (
                                    <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="time"
                                    className="input"
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="time"
                                    className="input"
                                    value={formData.endTime}
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Purpose</label>
                            <textarea
                                className="input"
                                rows="3"
                                value={formData.purpose}
                                onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit Request</button>
                    </form>
                </div>

                {/* My Bookings */}
                <div>
                    <h3>My Bookings</h3>
                    {bookings.length === 0 ? (
                        <p>No bookings yet.</p>
                    ) : (
                        <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
                            {bookings.map(booking => (
                                <div key={booking.id} style={{
                                    border: '1px solid var(--border-color)',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: 'var(--bg-body)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <strong>{booking.Resource?.name}</strong>
                                        <span className={`badge badge-${booking.status === 'approved' ? 'success' : 'warning'}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {new Date(booking.startTime).toLocaleDateString()} <br />
                                        {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                        {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{booking.purpose}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Resources;
