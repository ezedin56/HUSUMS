import { useState, useEffect } from 'react';
import axios from 'axios';

const Support = () => {
    const [reports, setReports] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('reports'); // 'reports' or 'inbox'
    const [formData, setFormData] = useState({
        category: 'academic',
        subject: '',
        description: ''
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [resReports, resMessages] = await Promise.all([
                axios.get('http://localhost:5000/api/communication/my-reports', { headers }),
                axios.get('http://localhost:5000/api/communication/inbox', { headers })
            ]);

            setReports(resReports.data);
            setMessages(resMessages.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmitReport = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/communication/report', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Report submitted successfully');
            setFormData({ category: 'academic', subject: '', description: '' });
            fetchData(); // Refresh reports
        } catch (error) {
            alert('Error submitting report');
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card animate-fade-up">
            <h2 style={{ marginBottom: '2rem' }}>Communication Center</h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                <button
                    className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('reports')}
                >
                    Problem Reports
                </button>
                <button
                    className={`btn ${activeTab === 'inbox' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('inbox')}
                >
                    Inbox ({messages.length})
                </button>
            </div>

            {activeTab === 'reports' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Report Form */}
                    <div>
                        <h3>Submit a Report</h3>
                        <form onSubmit={handleSubmitReport} style={{ marginTop: '1rem' }}>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    className="input"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="academic">Academic</option>
                                    <option value="facility">Facility</option>
                                    <option value="administrative">Administrative</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="input"
                                    rows="4"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit Report</button>
                        </form>
                    </div>

                    {/* My Reports */}
                    <div>
                        <h3>My Reports</h3>
                        {reports.length === 0 ? (
                            <p>No reports submitted.</p>
                        ) : (
                            <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
                                {reports.map(report => (
                                    <div key={report.id} style={{
                                        border: '1px solid var(--border-color)',
                                        padding: '1rem',
                                        borderRadius: '0.5rem',
                                        backgroundColor: 'var(--bg-body)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <strong>{report.subject}</strong>
                                            <span className={`badge badge-${report.status === 'resolved' ? 'success' : 'warning'}`}>
                                                {report.status}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            Category: {report.category} | {new Date(report.createdAt).toLocaleDateString()}
                                        </p>
                                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{report.description}</p>
                                        {report.response && (
                                            <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'rgba(0,255,0,0.1)', borderRadius: '0.25rem' }}>
                                                <strong>Response:</strong> {report.response}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'inbox' && (
                <div>
                    <h3>Inbox</h3>
                    {messages.length === 0 ? (
                        <p>No messages received.</p>
                    ) : (
                        <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
                            {messages.map(msg => (
                                <div key={msg.id} style={{
                                    border: '1px solid var(--border-color)',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: 'var(--bg-body)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <strong>{msg.subject}</strong>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        From: {msg.sender?.firstName} {msg.sender?.lastName} ({msg.sender?.role})
                                    </p>
                                    <p>{msg.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Support;
