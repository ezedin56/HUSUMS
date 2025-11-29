import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../utils/api';
import { Vote, Clock, Users, Calendar, ChevronRight, Zap, Award } from 'lucide-react';
import '../memberDashboard.css';

const ActiveElections = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedElection, setSelectedElection] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchActiveElections();
    }, []);

    const fetchActiveElections = async () => {
        try {
            const res = await api.get('/elections/active');
            setElections(res);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching elections:', error);
            setLoading(false);
        }
    };

    const handleVoteClick = (electionId) => {
        navigate(`/dashboard/member/vote/${electionId}`);
    };

    const getTimeRemaining = (endDate) => {
        const now = new Date();
        const end = new Date(endDate);
        const diff = end - now;
        
        if (diff <= 0) return { text: 'Ended', urgent: true };
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) return { text: `${days}d ${hours}h left`, urgent: days < 1 };
        if (hours > 0) return { text: `${hours}h ${minutes}m left`, urgent: hours < 6 };
        return { text: `${minutes}m left`, urgent: true };
    };

    const getPositionSummary = (election) => {
        if (election.positionSummary && election.positionSummary.length > 0) {
            return election.positionSummary;
        }
        return (election.Candidates || []).reduce((acc, candidate) => {
            const existing = acc.find(item => item.position === candidate.position);
            if (existing) {
                existing.candidateCount += 1;
            } else {
                acc.push({ position: candidate.position, candidateCount: 1 });
            }
            return acc;
        }, []);
    };

    const getTotalCandidates = (election) => {
        const summary = getPositionSummary(election);
        return summary.reduce((total, pos) => total + pos.candidateCount, 0);
    };

    if (loading) {
        return (
            <div className="live-polls-page">
                <div className="polls-loading">
                    <div className="loading-pulse">
                        <Vote size={48} />
                    </div>
                    <p>Loading elections...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="live-polls-page">
            {/* Header Section */}
            <div className="polls-header">
                <div className="polls-header-content">
                    <div className="polls-icon-wrapper">
                        <Vote size={32} />
                    </div>
                    <div>
                        <h1 className="polls-title">Election</h1>
                        <p className="polls-subtitle">Make your voice heard - vote in active elections</p>
                    </div>
                </div>
                {elections.length > 0 && (
                    <div className="polls-stats-badge">
                        <Zap size={16} />
                        <span>{elections.length} Active</span>
                    </div>
                )}
            </div>

            {/* Main Content */}
            {elections.length === 0 ? (
                <div className="polls-empty">
                    <div className="empty-illustration">
                        <Vote size={64} />
                    </div>
                    <h2>No Active Elections</h2>
                    <p>There are no elections running at the moment.</p>
                    <p className="empty-hint">Check back later for upcoming voting opportunities!</p>
                </div>
            ) : (
                <div className="polls-grid">
                    {elections.map((election, index) => {
                        const timeInfo = getTimeRemaining(election.endDate);
                        const positions = getPositionSummary(election);
                        const totalCandidates = getTotalCandidates(election);

                        return (
                            <div 
                                key={election._id || election.id} 
                                className="poll-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Card Header */}
                                <div className="poll-card-header">
                                    <div className="live-badge">
                                        <span className="live-dot"></span>
                                        LIVE
                                    </div>
                                    <div className={`time-badge ${timeInfo.urgent ? 'urgent' : ''}`}>
                                        <Clock size={14} />
                                        {timeInfo.text}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="poll-card-body">
                                    <h3 className="poll-title">{election.title}</h3>
                                    <p className="poll-description">
                                        {election.description || 'Cast your vote and help shape the future of our organization.'}
                                    </p>

                                    {/* Quick Stats */}
                                    <div className="poll-quick-stats">
                                        <div className="quick-stat">
                                            <Award size={16} />
                                            <span>{positions.length} Position{positions.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="quick-stat">
                                            <Users size={16} />
                                            <span>{totalCandidates} Candidate{totalCandidates !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>

                                    {/* Positions Preview */}
                                    <div className="poll-positions">
                                        <span className="positions-label">Open Positions:</span>
                                        <div className="positions-list">
                                            {positions.slice(0, 3).map(({ position, candidateCount }) => (
                                                <span key={position} className="position-tag">
                                                    {position}
                                                    <span className="tag-count">{candidateCount}</span>
                                                </span>
                                            ))}
                                            {positions.length > 3 && (
                                                <span className="position-tag more">
                                                    +{positions.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date Info */}
                                    <div className="poll-dates">
                                        <div className="date-info">
                                            <Calendar size={14} />
                                            <span>Ends {new Date(election.endDate).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="poll-card-footer">
                                    <button
                                        className="vote-btn"
                                        onClick={() => handleVoteClick(election._id || election.id)}
                                    >
                                        <span>Vote Now</span>
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Help Section */}
            <div className="polls-help">
                <h4>How Voting Works</h4>
                <div className="help-steps">
                    <div className="help-step">
                        <div className="step-number">1</div>
                        <p>Select an election to view candidates</p>
                    </div>
                    <div className="help-step">
                        <div className="step-number">2</div>
                        <p>Review each candidate's profile</p>
                    </div>
                    <div className="help-step">
                        <div className="step-number">3</div>
                        <p>Cast your vote for each position</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveElections;
