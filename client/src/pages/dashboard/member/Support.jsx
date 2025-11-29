import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { MessageSquare, AlertTriangle, Inbox, Send, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import '../memberDashboard.css';

const Support = () => {
    const [reports, setReports] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('reports');
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        category: 'academic',
        subject: '',
        description: ''
    });

    const fetchData = async () => {
        try {
            const [resReports, resMessages] = await Promise.all([
                api.get('/communication/my-reports'),
                api.get('/communication/inbox')
            ]);

            setReports(resReports);
            setMessages(resMessages);
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
        setSubmitting(true);
        try {
            await api.post('/communication/report', formData);

            alert('Report submitted successfully');
            setFormData({ category: 'academic', subject: '', description: '' });
            fetchData();
        } catch (error) {
            alert('Error submitting report');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'resolved': return <CheckCircle size={14} />;
            case 'in-progress': return <Clock size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'academic': return '📚';
            case 'facility': return '🏢';
            case 'administrative': return '📋';
            default: return '📝';
        }
    };

    if (loading) {
        return (
            <div className="member-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading Communication Center...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="member-page">
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">
                    <MessageSquare className="title-icon" />
                    Communication Center
                </h1>
                <p className="page-subtitle">Submit reports and view your inbox</p>
            </div>

            {/* Tab Navigation */}
            <div className="support-tabs">
                <button
                    className={`support-tab ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                >
                    <AlertTriangle size={18} />
                    <span>Problem Reports</span>
                    <span className="tab-count">{reports.length}</span>
                </button>
                <button
                    className={`support-tab ${activeTab === 'inbox' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inbox')}
                >
                    <Inbox size={18} />
                    <span>Inbox</span>
                    <span className="tab-count">{messages.length}</span>
                </button>
            </div>

            {activeTab === 'reports' && (
                <div className="support-grid">
                    {/* Report Form */}
                    <div className="page-card support-form-card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <Send size={20} />
                                Submit a Report
                            </h3>
                        </div>
                        <form onSubmit={handleSubmitReport} className="support-form">
                            <div className="holo-fieldset">
                                <label className="field-label">Category</label>
                                <div className="select-wrapper">
                                    <select
                                        className="holo-select"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="academic">📚 Academic</option>
                                        <option value="facility">🏢 Facility</option>
                                        <option value="administrative">📋 Administrative</option>
                                        <option value="other">📝 Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="holo-fieldset">
                                <label className="field-label">Subject</label>
                                <input
                                    type="text"
                                    className="holo-input"
                                    placeholder="Enter the subject of your report"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="holo-fieldset">
                                <label className="field-label">Description</label>
                                <textarea
                                    className="holo-textarea"
                                    rows="5"
                                    placeholder="Describe your issue in detail..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="submit-report-btn"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <div className="btn-spinner"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Submit Report
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* My Reports List */}
                    <div className="page-card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <AlertTriangle size={20} />
                                My Reports
                            </h3>
                            <span className="report-count">{reports.length} total</span>
                        </div>
                        
                        {reports.length === 0 ? (
                            <div className="empty-state">
                                <AlertTriangle size={48} className="empty-icon" />
                                <p>No reports submitted yet</p>
                                <span className="empty-hint">Use the form to submit your first report</span>
                            </div>
                        ) : (
                            <div className="reports-list">
                                {reports.map(report => (
                                    <div key={report.id} className="report-card">
                                        <div className="report-header">
                                            <div className="report-category">
                                                <span className="category-icon">{getCategoryIcon(report.category)}</span>
                                                <span className="category-name">{report.category}</span>
                                            </div>
                                            <span className={`status-badge status-${report.status}`}>
                                                {getStatusIcon(report.status)}
                                                {report.status}
                                            </span>
                                        </div>
                                        <h4 className="report-subject">{report.subject}</h4>
                                        <p className="report-description">{report.description}</p>
                                        <div className="report-footer">
                                            <span className="report-date">
                                                <Clock size={14} />
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {report.response && (
                                            <div className="report-response">
                                                <div className="response-header">
                                                    <CheckCircle size={16} />
                                                    <span>Official Response</span>
                                                </div>
                                                <p>{report.response}</p>
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
                <div className="page-card inbox-card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <Inbox size={20} />
                            Messages
                        </h3>
                        <span className="message-count">{messages.length} messages</span>
                    </div>
                    
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <Inbox size={48} className="empty-icon" />
                            <p>Your inbox is empty</p>
                            <span className="empty-hint">Messages from leadership will appear here</span>
                        </div>
                    ) : (
                        <div className="messages-list">
                            {messages.map(msg => (
                                <div key={msg.id} className="message-card">
                                    <div className="message-header">
                                        <div className="sender-info">
                                            <div className="sender-avatar">
                                                <User size={20} />
                                            </div>
                                            <div className="sender-details">
                                                <span className="sender-name">
                                                    {msg.sender?.firstName} {msg.sender?.lastName}
                                                </span>
                                                <span className="sender-role">{msg.sender?.role}</span>
                                            </div>
                                        </div>
                                        <span className="message-date">
                                            <Clock size={14} />
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="message-subject">{msg.subject}</h4>
                                    <p className="message-content">{msg.content}</p>
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
