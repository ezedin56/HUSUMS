import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../utils/api';
import '../memberDashboard.css';

const VoteConfirmation = () => {
    const { electionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { candidate, alreadyVoted, vote, position, timestamp, confirmation } = location.state || {};
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchStatus = async () => {
            try {
                const response = await api.get(`/vote/status/${electionId}`);
                if (isMounted) {
                    setStatus(response);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err?.data?.message || err.message || 'Unable to load vote status.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    // Trigger celebration animation
                    setTimeout(() => setShowConfetti(true), 300);
                }
            }
        };

        fetchStatus();

        return () => {
            isMounted = false;
        };
    }, [electionId]);

    const deriveCandidateName = (candidateRecord) => {
        if (!candidateRecord) return 'Candidate';
        const first = candidateRecord.userId?.firstName || candidateRecord.firstName || '';
        const last = candidateRecord.userId?.lastName || candidateRecord.lastName || '';
        const fallback = candidateRecord.userId?.username || candidateRecord.name || candidateRecord.candidateName || 'Candidate';
        const composed = `${first} ${last}`.trim();
        return composed || fallback;
    };

    const latestVote = useMemo(() => {
        if (candidate) {
            return {
                candidateName: deriveCandidateName(candidate),
                position: position || candidate.position,
                timestamp: timestamp || new Date().toISOString()
            };
        }

        if (vote) {
            return {
                candidateName: vote.candidateName || deriveCandidateName(vote.candidate),
                position: vote.position,
                timestamp: vote.timestamp
            };
        }

        if (status?.votes?.length) {
            const record = status.votes[status.votes.length - 1];
            return {
                candidateName: record.candidateName,
                position: record.position,
                timestamp: record.timestamp
            };
        }

        return null;
    }, [candidate, vote, status, position, timestamp]);

    const recordedVotes = useMemo(() => {
        const votesFromStatus = status?.votes || [];
        const stateVotes = [];

        if (vote) {
            stateVotes.push({
                candidateName: vote.candidateName || deriveCandidateName(vote.candidate),
                position: vote.position,
                timestamp: vote.timestamp
            });
        }

        if (candidate && (position || candidate.position)) {
            stateVotes.push({
                candidateName: deriveCandidateName(candidate),
                position: position || candidate.position,
                timestamp: timestamp || new Date().toISOString()
            });
        }

        const combined = [...votesFromStatus, ...stateVotes];
        if (combined.length === 0) {
            return [];
        }

        const deduped = [];
        const seen = new Set();

        combined.forEach((record) => {
            const key = record.position || `${record.candidateName}-${record.timestamp}`;
            if (!seen.has(key)) {
                seen.add(key);
                deduped.push(record);
            }
        });

        return deduped.sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeA - timeB;
        });
    }, [status, vote, candidate, position, timestamp]);

    const showSuccessCopy = !alreadyVoted && (latestVote || status?.hasVoted);

    if (loading && !latestVote) {
        return (
            <div className="vote-confirmation-shell">
                <div className="dashboard-stars" />
                <div className="confirmation-loading">
                    <div className="confirmation-ring">
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,245,255,0.2)" strokeWidth="3" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#confirmGrad)" strokeWidth="3" strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="confirmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00f5ff" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <p>Verifying your vote...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="vote-confirmation-shell">
            <div className="dashboard-stars" />
            <div className="dashboard-wave" />
            
            {/* Particle Effects */}
            {showConfetti && showSuccessCopy && (
                <div className="particle-container">
                    {[...Array(30)].map((_, i) => (
                        <div 
                            key={i} 
                            className="confetti-particle"
                            style={{
                                '--x': `${Math.random() * 100}%`,
                                '--delay': `${Math.random() * 2}s`,
                                '--duration': `${2 + Math.random() * 2}s`,
                                '--color': ['#00f5ff', '#a855f7', '#fbbf24', '#22c55e', '#f472b6'][Math.floor(Math.random() * 5)]
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="confirmation-content">
                {(!showSuccessCopy || alreadyVoted) ? (
                    <div className="confirmation-card info">
                        <div className="confirmation-icon info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                        </div>
                        
                        <h1 className="confirmation-title info">Vote Already Recorded</h1>
                        <p className="confirmation-subtitle">
                            Your voice has already been counted in this election.
                        </p>

                        {recordedVotes.length > 0 && (
                            <div className="votes-summary">
                                <h3>Your Recorded Votes</h3>
                                <div className="votes-grid">
                                    {recordedVotes.map((record, index) => (
                                        <div key={`${record.position}-${index}`} className="vote-record-card">
                                            <div className="vote-record-position">{record.position || 'Position'}</div>
                                            <div className="vote-record-name">{record.candidateName || 'Candidate'}</div>
                                            {record.timestamp && (
                                                <div className="vote-record-time">
                                                    {new Date(record.timestamp).toLocaleString()}
                                                </div>
                                            )}
                                            <div className="vote-record-badge">✓ Recorded</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="confirmation-card success">
                        <div className="confirmation-glow" />
                        
                        <div className="confirmation-icon success">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20,6 9,17 4,12" />
                            </svg>
                        </div>
                        
                        <h1 className="confirmation-title success">Vote Confirmed!</h1>
                        <p className="confirmation-subtitle">
                            Your democratic voice has been securely recorded.
                        </p>

                        {latestVote && (
                            <div className="latest-vote-card">
                                <div className="latest-vote-label">You voted for</div>
                                <div className="latest-vote-name">{latestVote.candidateName}</div>
                                <div className="latest-vote-position">
                                    <span className="position-badge">{latestVote.position}</span>
                                </div>
                                {latestVote.timestamp && (
                                    <div className="latest-vote-time">
                                        <span className="time-icon">🕐</span>
                                        {new Date(latestVote.timestamp).toLocaleString()}
                                    </div>
                                )}
                            </div>
                        )}

                        {recordedVotes.length > 1 && (
                            <div className="votes-summary">
                                <h3>All Your Votes</h3>
                                <div className="votes-grid">
                                    {recordedVotes.map((record, index) => (
                                        <div key={`${record.position}-${index}`} className="vote-record-card">
                                            <div className="vote-record-position">{record.position || 'Position'}</div>
                                            <div className="vote-record-name">{record.candidateName || 'Candidate'}</div>
                                            <div className="vote-record-badge">✓</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="confirmation-notice">
                            <span className="notice-icon">🔒</span>
                            <p>Your vote is encrypted and cannot be modified. Results will be announced after voting closes.</p>
                        </div>
                    </div>
                )}

                <div className="confirmation-actions">
                    <button
                        className="btn-continue-voting"
                        onClick={() => navigate(`/dashboard/member/vote/${electionId}`)}
                    >
                        Continue Voting
                    </button>
                    <button
                        className="btn-view-elections"
                        onClick={() => navigate('/dashboard/member/elections')}
                    >
                        View All Elections
                    </button>
                    <button
                        className="btn-dashboard"
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                </div>

                {error && (
                    <div className="confirmation-error">
                        <span>⚠️</span> {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoteConfirmation;
