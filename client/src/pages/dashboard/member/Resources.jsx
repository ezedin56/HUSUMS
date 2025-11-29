import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import '../memberDashboard.css';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        resourceId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: ''
    });

    const fetchData = async () => {
        try {
            const [resResources, resBookings] = await Promise.all([
                api.get('/resources').catch(() => []),
                api.get('/resources/my-bookings').catch(() => [])
            ]);

            setResources(resResources || []);
            setBookings(resBookings || []);
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
            const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

            await api.post('/resources/book', {
                resourceId: formData.resourceId,
                startTime: startDateTime,
                endTime: endDateTime,
                purpose: formData.purpose
            });

            setFormData({ resourceId: '', date: '', startTime: '', endTime: '', purpose: '' });
            setShowForm(false);
            fetchData();
        } catch (error) {
            console.error('Error creating booking:', error);
        }
    };

    const getResourceIcon = (type) => {
        const icons = {
            'room': '🏛️',
            'equipment': '🎛️',
            'vehicle': '🚗',
            'computer': '💻',
            'projector': '📽️',
            'default': '📦'
        };
        return icons[type?.toLowerCase()] || icons.default;
    };

    const getStatusBadge = (status) => {
        const badges = {
            'pending': { label: 'Pending', class: 'pending' },
            'approved': { label: 'Approved', class: 'approved' },
            'rejected': { label: 'Rejected', class: 'rejected' }
        };
        return badges[status?.toLowerCase()] || badges.pending;
    };

    if (loading) {
        return (
            <div className="page-shell">
                <div className="dashboard-stars" />
                <div className="page-loading">
                    <div className="holo-loader" />
                    <p>Loading resources...</p>
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
                    <p className="page-label">📚 Resources</p>
                    <h1 className="page-title">Resource Booking</h1>
                </div>
                <button className="btn-neon" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Book Resource'}
                </button>
            </header>

            {/* Booking Form */}
            {showForm && (
                <div className="booking-form-card">
                    <h3>Book a Resource</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Resource</label>
                                <select
                                    className="holo-input"
                                    value={formData.resourceId}
                                    onChange={e => setFormData({ ...formData, resourceId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Resource</option>
                                    {resources.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {getResourceIcon(r.type)} {r.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    className="holo-input"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="time"
                                    className="holo-input"
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="time"
                                    className="holo-input"
                                    value={formData.endTime}
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Purpose</label>
                                <textarea
                                    className="holo-input"
                                    rows="3"
                                    value={formData.purpose}
                                    onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                                    placeholder="Describe the purpose of your booking..."
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-glass" onClick={() => setShowForm(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-neon">
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="resources-layout">
                {/* Available Resources */}
                <section className="resources-section">
                    <h3 className="section-title">Available Resources</h3>
                    {resources.length === 0 ? (
                        <div className="empty-mini">No resources available</div>
                    ) : (
                        <div className="resources-grid">
                            {resources.map((resource, index) => (
                                <div 
                                    key={resource.id} 
                                    className="resource-card"
                                    style={{ '--card-delay': `${index * 0.1}s` }}
                                >
                                    <div className="resource-icon">
                                        {getResourceIcon(resource.type)}
                                    </div>
                                    <div className="resource-info">
                                        <h4>{resource.name}</h4>
                                        <span className="resource-type">{resource.type}</span>
                                    </div>
                                    <div className={`availability ${resource.available ? 'available' : 'booked'}`}>
                                        {resource.available ? 'Available' : 'In Use'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* My Bookings */}
                <section className="bookings-section">
                    <h3 className="section-title">My Bookings</h3>
                    {bookings.length === 0 ? (
                        <div className="empty-mini">No bookings yet</div>
                    ) : (
                        <div className="bookings-list">
                            {bookings.map((booking, index) => {
                                const statusBadge = getStatusBadge(booking.status);
                                return (
                                    <div 
                                        key={booking.id} 
                                        className="booking-card"
                                        style={{ '--card-delay': `${index * 0.1}s` }}
                                    >
                                        <div className="booking-header">
                                            <h4>{booking.Resource?.name || 'Resource'}</h4>
                                            <span className={`status-badge ${statusBadge.class}`}>
                                                {statusBadge.label}
                                            </span>
                                        </div>
                                        <div className="booking-details">
                                            <div className="detail-item">
                                                <span className="detail-icon">📅</span>
                                                <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-icon">🕐</span>
                                                <span>
                                                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {' - '}
                                                    {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        {booking.purpose && (
                                            <p className="booking-purpose">{booking.purpose}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Resources;
