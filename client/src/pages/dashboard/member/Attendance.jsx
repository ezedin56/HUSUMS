import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import '../memberDashboard.css';

const Attendance = () => {
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [checkInHistory, setCheckInHistory] = useState([]);
    const [stats, setStats] = useState({
        streak: 0,
        monthlyRate: 0,
        totalCheckIns: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        fetchAttendanceHistory();
        return () => clearInterval(timer);
    }, []);

    const fetchAttendanceHistory = async () => {
        try {
            const res = await api.get('/attendance/my');
            const attendanceData = res.data || [];
            
            // Format for display
            const formattedHistory = attendanceData.slice(0, 10).map(record => ({
                time: record.checkInTime || 'N/A',
                date: new Date(record.date).toLocaleDateString(),
                status: record.status
            }));
            setCheckInHistory(formattedHistory);

            // Calculate stats
            calculateStats(attendanceData);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const calculateStats = (attendanceData) => {
        if (!attendanceData || attendanceData.length === 0) return;

        // Total check-ins
        const totalCheckIns = attendanceData.filter(a => a.status === 'present' || a.status === 'late').length;

        // Calculate streak
        let streak = 0;
        const sortedData = [...attendanceData].sort((a, b) => new Date(b.date) - new Date(a.date));
        for (let i = 0; i < sortedData.length; i++) {
            if (sortedData[i].status === 'present' || sortedData[i].status === 'late') {
                streak++;
            } else {
                break;
            }
        }

        // Monthly rate
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyRecords = attendanceData.filter(a => new Date(a.date) >= firstDayOfMonth);
        const monthlyPresent = monthlyRecords.filter(a => a.status === 'present' || a.status === 'late').length;
        const daysInMonth = now.getDate();
        const monthlyRate = daysInMonth > 0 ? Math.round((monthlyPresent / daysInMonth) * 100) : 0;

        setStats({
            streak,
            monthlyRate,
            totalCheckIns
        });
    };

    const handleCheckIn = async () => {
        setLoading(true);
        try {
            const res = await api.post('/attendance/check-in', {});
            setStatus('success');
            setMessage(res.message || 'Successfully checked in!');
            
            // Refresh attendance history
            await fetchAttendanceHistory();
        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Check-in failed');
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const isWithinCheckInWindow = () => {
        const hour = currentTime.getHours();
        return hour >= 6 && hour < 21;
    };

    return (
        <div className="page-shell">
            <div className="dashboard-stars" />
            <div className="dashboard-wave" />

            <header className="page-header">
                <div>
                    <p className="page-label">📋 Check-In</p>
                    <h1 className="page-title">{getGreeting()}</h1>
                </div>
            </header>

            <div className="attendance-grid">
                {/* Main Check-in Card */}
                <div className="check-in-card">
                    <div className="time-display">
                        <div className="time-digits">
                            {currentTime.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                second: '2-digit'
                            })}
                        </div>
                        <div className="time-date">
                            {currentTime.toLocaleDateString('en-US', { 
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>

                    {status === 'success' ? (
                        <div className="check-in-success">
                            <div className="success-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20,6 9,17 4,12" />
                                </svg>
                            </div>
                            <h2>Checked In!</h2>
                            <p>{message}</p>
                        </div>
                    ) : (
                        <>
                            {status === 'error' && (
                                <div className="check-in-error">
                                    <span>⚠️</span> {message}
                                </div>
                            )}
                            
                            <button
                                onClick={handleCheckIn}
                                className={`check-in-btn ${loading ? 'loading' : ''} ${!isWithinCheckInWindow() ? 'disabled' : ''}`}
                                disabled={loading || !isWithinCheckInWindow()}
                            >
                                {loading ? (
                                    <div className="btn-loader" />
                                ) : (
                                    <>
                                        <span className="btn-icon">📍</span>
                                        <span>Check In Now</span>
                                    </>
                                )}
                            </button>

                            <p className="check-in-window">
                                Check-in window: <strong>6:00 AM - 9:00 PM</strong>
                            </p>
                        </>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="attendance-stats">
                    <div className="stat-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.streak}</span>
                            <span className="stat-label">Day Streak</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.monthlyRate}%</span>
                            <span className="stat-label">This Month</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.totalCheckIns}</span>
                            <span className="stat-label">Total Check-ins</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                {checkInHistory.length > 0 && (
                    <div className="recent-activity">
                        <h3>Recent Activity</h3>
                        <div className="activity-list">
                            {checkInHistory.map((item, idx) => (
                                <div key={idx} className="activity-item">
                                    <div className="activity-icon">✓</div>
                                    <div className="activity-info">
                                        <span className="activity-time">{item.time}</span>
                                        <span className="activity-date">{item.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;
