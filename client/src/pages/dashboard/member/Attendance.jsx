import { useState } from 'react';
import { api } from '../../../utils/api';

const Attendance = () => {
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheckIn = async () => {
        setLoading(true);
        try {
            const res = await api.post('/attendance/check-in', {});
            setStatus('success');
            setMessage(res.message);
        } catch (error) {
            setStatus('error');
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Attendance</h2>
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ marginBottom: '2rem', fontSize: '1.25rem' }}>
                    Current Time: {new Date().toLocaleTimeString()}
                </p>

                {status === 'success' ? (
                    <div style={{ color: 'green', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        ✅ {message || 'Checked In'}
                    </div>
                ) : (
                    <>
                        {status === 'error' && (
                            <div style={{ color: 'red', marginBottom: '1rem' }}>
                                ❌ {message}
                            </div>
                        )}
                        <button
                            onClick={handleCheckIn}
                            className="btn btn-primary"
                            style={{ fontSize: '1.5rem', padding: '1rem 3rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Checking In...' : 'Check In Now'}
                        </button>
                    </>
                )}

                <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
                    Check-in window: 6:00 AM - 9:00 AM
                </p>
            </div>
        </div>
    );
};

export default Attendance;
