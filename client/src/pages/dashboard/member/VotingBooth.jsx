import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../utils/api';
import { CheckCircle2, User, Award, ChevronRight, Info, Sparkles, Lock, Check } from 'lucide-react';
import '../memberDashboard.css';

const VotingBooth = () => {
    const { electionId } = useParams();
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState({});
    const [votedPositions, setVotedPositions] = useState([]);
    const [recordedVotes, setRecordedVotes] = useState([]);
    const [profileCandidate, setProfileCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchCandidates();
        checkVoteStatus();
    }, [electionId]);

    const fetchCandidates = async () => {
        try {
            const res = await api.get(`/candidates/${electionId}`);
            setCandidates(res);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching candidates:', error);
            setLoading(false);
        }
    };

    const checkVoteStatus = async () => {
        try {
            const res = await api.get(`/vote/status/${electionId}`);
            if (Array.isArray(res.votedPositions)) {
                setVotedPositions(res.votedPositions);
            }
            if (Array.isArray(res.votes)) {
                setRecordedVotes(res.votes);
            }
        } catch (error) {
            console.error('Error checking vote status:', error);
        }
    };

    const candidatesByPosition = useMemo(() => (
        candidates.reduce((acc, candidate) => {
            if (!acc[candidate.position]) {
                acc[candidate.position] = [];
            }
            acc[candidate.position].push(candidate);
            return acc;
        }, {})
    ), [candidates]);

    const positions = useMemo(() => Object.keys(candidatesByPosition), [candidatesByPosition]);

    const getCandidateName = (candidate) => {
        const first = candidate.userId?.firstName || candidate.firstName || '';
        const last = candidate.userId?.lastName || candidate.lastName || '';
        const fallback = candidate.userId?.username || candidate.name || 'Candidate';
        const composed = `${first} ${last}`.trim();
        return composed || fallback;
    };

    const votedCandidateMap = useMemo(() => (
        recordedVotes.reduce((acc, vote) => {
            if (vote && vote.position) {
                acc[vote.position] = vote;
            }
            return acc;
        }, {})
    ), [recordedVotes]);

    const handleSelectCandidate = (position, candidateId) => {
        if (votedPositions.includes(position)) {
            return; // Already voted for this position
        }
        setSelectedCandidates(prev => ({
            ...prev,
            [position]: candidateId
        }));
    };

    const handleSubmitVote = async (candidate) => {
        if (votedPositions.includes(candidate.position)) {
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post('/vote', {
                electionId,
                candidateId: candidate._id
            });

            const voteRecord = {
                candidateId: candidate._id,
                candidateName: getCandidateName(candidate),
                position: candidate.position,
                timestamp: new Date().toISOString()
            };

            setVotedPositions(prev => [...prev, candidate.position]);
            setRecordedVotes(prev => [...prev, voteRecord]);

            // Remove from selected after successful vote
            setSelectedCandidates(prev => {
                const newSelected = { ...prev };
                delete newSelected[candidate.position];
                return newSelected;
            });

            // Show success toast notification
            setSuccessMessage(`✅ Your vote for ${candidate.position} has been recorded!`);
            setShowSuccessToast(true);
            setTimeout(() => {
                setShowSuccessToast(false);
                setSuccessMessage('');
            }, 4000);
        } catch (error) {
            alert(error?.data?.message || error.message || 'Failed to submit vote');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="modern-voting-container">
                <div className="loading-state">
                    <div className="loading-spinner-modern"></div>
                    <p>Loading ballot...</p>
                </div>
            </div>
        );
    }

    const progressPercent = positions.length > 0 ? (votedPositions.length / positions.length) * 100 : 0;
    const allVotesCast = positions.length > 0 && votedPositions.length === positions.length;

    return (
        <div className="modern-voting-container">
            <div className="dashboard-stars" />
            <div className="dashboard-wave" />

            {/* Success Toast */}
            {showSuccessToast && (
                <div className="success-toast">
                    <CheckCircle2 size={24} />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Modern Header */}
            <div className="modern-voting-header">
                <div className="header-content">
                    <Sparkles className="header-icon" size={32} />
                    <div>
                        <h1 className="header-title">YOU MAY NOW CAST YOUR VOTES!</h1>
                        <p className="header-subtitle">Student Council Election • Select your preferred candidates</p>
                    </div>
                </div>

                {/* Quick Instructions */}
                <div className="voting-instructions">
                    <h3>📋 How to Vote:</h3>
                    <div className="instruction-steps">
                        <div className="instruction-step">
                            <span className="step-number">1</span>
                            <p>Review all candidates for each position</p>
                        </div>
                        <div className="instruction-step">
                            <span className="step-number">2</span>
                            <p>Click the radio button to select your choice</p>
                        </div>
                        <div className="instruction-step">
                            <span className="step-number">3</span>
                            <p>Click "Cast Vote" to submit your selection</p>
                        </div>
                        <div className="instruction-step">
                            <span className="step-number">4</span>
                            <p>Repeat for all positions</p>
                        </div>
                    </div>
                </div>
                
                {/* Progress Indicator */}
                <div className="voting-progress-indicator">
                    <div className="progress-label">
                        <span>Voting Progress</span>
                        <span className="progress-count">{votedPositions.length}/{positions.length} Complete</span>
                    </div>
                    <div className="progress-bar-track">
                        <div 
                            className="progress-bar-fill" 
                            style={{ width: `${progressPercent}%` }}
                        >
                            <div className="progress-bar-glow"></div>
                        </div>
                    </div>
                    {allVotesCast && (
                        <div className="progress-complete">
                            <CheckCircle2 size={16} />
                            <span>All votes cast!</span>
                        </div>
                    )}
                </div>
            </div>

            {positions.length === 0 ? (
                <div className="empty-state-modern">
                    <Award size={64} />
                    <h3>No candidates available</h3>
                    <p>Please check back later</p>
                </div>
            ) : (
                <div className="positions-container">
                    {positions.map((position, posIdx) => {
                        const positionCandidates = candidatesByPosition[position] || [];
                        const hasVoted = votedPositions.includes(position);
                        const votedCandidate = recordedVotes.find(v => v.position === position);

                        return (
                            <div key={position} className="position-section" style={{ animationDelay: `${posIdx * 0.1}s` }}>
                                {/* Position Header */}
                                <div className="position-header-modern">
                                    <div className="position-info">
                                        <Award className="position-icon" size={24} />
                                        <div>
                                            <h2 className="position-title">{position}</h2>
                                            <p className="position-meta">
                                                {positionCandidates.length} candidate{positionCandidates.length !== 1 ? 's' : ''} running
                                            </p>
                                        </div>
                                    </div>
                                    {hasVoted ? (
                                        <div className="position-voted-badge">
                                            <CheckCircle2 size={18} />
                                            <span>Vote Cast</span>
                                        </div>
                                    ) : (
                                        <div className="position-pending-badge">
                                            <span>Select One</span>
                                        </div>
                                    )}
                                </div>

                                {/* Selection Hint */}
                                {!hasVoted && !selectedCandidates[position] && (
                                    <div className="selection-hint">
                                        <Info size={18} />
                                        <span>Click on a candidate's radio button below to select them</span>
                                    </div>
                                )}

                                {/* Candidates Grid */}
                                <div className="modern-candidates-grid">
                                    {positionCandidates.map((candidate, candIdx) => {
                                        const isSelected = selectedCandidates[position] === candidate._id;
                                        const isVoted = votedCandidate?.candidateId === candidate._id;
                                        const isLocked = hasVoted && !isVoted;

                                        return (
                                            <div
                                                key={candidate._id}
                                                className={`modern-candidate-card ${isSelected ? 'selected' : ''} ${isVoted ? 'voted' : ''} ${isLocked ? 'locked' : ''}`}
                                                style={{ animationDelay: `${(posIdx * 0.1) + (candIdx * 0.05)}s` }}
                                            >
                                                {isVoted && (
                                                    <div className="voted-overlay">
                                                        <CheckCircle2 size={24} />
                                                        <span>Your Vote</span>
                                                    </div>
                                                )}
                                                {isLocked && (
                                                    <div className="locked-overlay">
                                                        <Lock size={20} />
                                                    </div>
                                                )}

                                                {/* Candidate Photo */}
                                                <div className="candidate-photo-container">
                                                    {candidate.photo ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}${candidate.photo}`}
                                                            alt={getCandidateName(candidate)}
                                                            className="candidate-photo"
                                                        />
                                                    ) : (
                                                        <div className="candidate-photo-placeholder">
                                                            <User size={40} />
                                                        </div>
                                                    )}
                                                    <div className="photo-ring"></div>
                                                </div>

                                                {/* Candidate Details */}
                                                <div className="candidate-details">
                                                    <h3 className="candidate-name-modern">
                                                        {getCandidateName(candidate)}
                                                    </h3>
                                                    <p className="candidate-affiliation">
                                                        {candidate.userId?.department || 'Independent'}
                                                    </p>
                                                </div>

                                                {/* Interactive Selection */}
                                                {!hasVoted && (
                                                    <div className="candidate-selection">
                                                        <button
                                                            className={`radio-button ${isSelected ? 'selected' : ''}`}
                                                            onClick={() => handleSelectCandidate(position, candidate._id)}
                                                        >
                                                            {isSelected && <Check size={14} />}
                                                        </button>
                                                        <button
                                                            className="info-button"
                                                            onClick={() => setProfileCandidate(candidate)}
                                                            title="View candidate profile and details"
                                                        >
                                                            <Info size={16} />
                                                            <span className="button-tooltip">View Details</span>
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Vote CTA */}
                                                {!hasVoted && isSelected && (
                                                    <button
                                                        className="vote-cta-button"
                                                        onClick={() => handleSubmitVote(candidate)}
                                                        disabled={submitting}
                                                    >
                                                        {submitting ? (
                                                            <span className="btn-spinner"></span>
                                                        ) : (
                                                            <>
                                                                <span>Cast Vote</span>
                                                                <ChevronRight size={18} />
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modern Profile Modal */}
            {profileCandidate && (
                <div className="modern-modal-overlay" onClick={() => setProfileCandidate(null)}>
                    <div className="modern-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modern-modal-close" onClick={() => setProfileCandidate(null)}>
                            ×
                        </button>

                        {/* Modal Header */}
                        <div className="modern-modal-header">
                            <div className="modal-photo-container">
                                {profileCandidate.photo ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}${profileCandidate.photo}`}
                                        alt={getCandidateName(profileCandidate)}
                                        className="modal-photo"
                                    />
                                ) : (
                                    <div className="modal-photo-placeholder">
                                        <User size={48} />
                                    </div>
                                )}
                                <div className="modal-photo-glow"></div>
                            </div>
                            <h3 className="modal-name">{getCandidateName(profileCandidate)}</h3>
                            <p className="modal-position-badge">{profileCandidate.position}</p>
                            <p className="modal-affiliation">
                                {profileCandidate.userId?.department || 'Independent Candidate'}
                            </p>
                        </div>

                        {/* Modal Body */}
                        <div className="modern-modal-body">
                            <div className="modal-info-section">
                                <h4>📋 Biography</h4>
                                <p>{profileCandidate.userId?.bio || 'Biography not available.'}</p>
                            </div>

                            <div className="modal-info-section">
                                <h4>🎯 Vision & Platform</h4>
                                <p>{profileCandidate.manifesto || 'Platform statement not available.'}</p>
                            </div>

                            <div className="modal-info-section">
                                <h4>⭐ Experience</h4>
                                <p>{profileCandidate.description || 'Experience details not available.'}</p>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        {!votedPositions.includes(profileCandidate.position) && (
                            <div className="modern-modal-actions">
                                <button
                                    className="modal-vote-button"
                                    onClick={() => {
                                        handleSelectCandidate(profileCandidate.position, profileCandidate._id);
                                        setProfileCandidate(null);
                                    }}
                                >
                                    <Check size={20} />
                                    <span>Select This Candidate</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VotingBooth;
