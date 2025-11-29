import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const data = await api.get('/departments/messages');
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/departments/messages/${selectedMessage.id}/reply`, { content: replyContent });
            alert('Reply sent successfully');
            setReplyContent('');
            setSelectedMessage(null);
        } catch {
            alert('Failed to send reply');
        }
    };

    if (loading) return <div>Loading messages...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Inbox</h2>
            <div className="card">
                {messages.length === 0 ? (
                    <p>No messages found.</p>
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} style={{
                            padding: '1rem',
                            borderBottom: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            backgroundColor: selectedMessage?.id === msg.id ? 'var(--bg-secondary)' : 'transparent'
                        }} onClick={() => setSelectedMessage(msg)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h4 style={{ marginBottom: '0.25rem' }}>{msg.subject}</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        From: {msg.sender ? `${msg.sender.firstName} ${msg.sender.lastName}` : msg.senderName || 'Anonymous'}
                                    </p>
                                </div>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedMessage && (
                <div className="card" style={{ marginTop: '2rem' }}>
                    <h3>Re: {selectedMessage.subject}</h3>
                    <p style={{ margin: '1rem 0', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
                        {selectedMessage.content}
                    </p>
                    <form onSubmit={handleReply}>
                        <textarea
                            className="input"
                            rows="4"
                            placeholder="Type your reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            required
                            style={{ marginBottom: '1rem' }}
                        ></textarea>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">Send Reply</button>
                            <button type="button" className="btn btn-outline" onClick={() => setSelectedMessage(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Inbox;
