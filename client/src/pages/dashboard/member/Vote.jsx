import { useState, useEffect } from 'react';
import { api, API_URL } from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote as VoteIcon, CheckCircle, X, Trophy, Calendar, Users, Star, Crown, Sparkles } from 'lucide-react';
import '../memberDashboard.css';

const Vote = () => {
    const [activeElections, setActiveElections] = useState([]);
    const [completedElections, setCompletedElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [resultsData, setResultsData] = useState(null);
    const [votingFor, setVotingFor] = useState(null);

    useEffect(() => {
        fetchElections();
    }, []);

    const fetchElections = async () => {
        try {
            const activeData = await api.get('/elections/active');
            setActiveElections(activeData);

            const allData = await api.get('/president/elections');
            const completed = allData.filter(e => e.status === 'completed');
            setCompletedElections(completed);
        } catch (error) {
            console.error('Error fetching elections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (electionId, candidateId) => {
        setVotingFor(candidateId);
        try {
            await api.post('/vote', { electionId, candidateId });
            alert('Vote cast successfully!');
            fetchElections();
        } catch (error) {
            alert('Failed to cast vote: ' + (error.response?.data?.message || error.message));
        } finally {
            setVotingFor(null);
        }
    };

    const handleViewResults = async (electionId) => {
        try {
            const data = await api.get(`/elections/results/${electionId}`);
            setResultsData(data);
            setShowResultsModal(true);
        } catch (error) {
            alert('Error fetching results: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="member-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading Elections...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="member-page">
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">
                    <VoteIcon className="title-icon" />
                    Elections
                </h1>
                <p className="page-subtitle">Cast your vote and shape the future</p>
            </div>

            {/* Active Elections */}
            {activeElections.length > 0 && (
                <div className="elections-section active">
                    <div className="section-header">
                        <div className="section-badge live">
                            <span className="pulse-dot"></span>
                            LIVE
                        </div>
                        <h2 className="section-title">Active Elections</h2>
                    </div>

                    {activeElections.map(election => (
                        <div key={election.id} className="page-card election-detail-card">
                            <div className="election-detail-header">
                                <div className="election-info">
                                    <h3 className="election-name">{election.title}</h3>
                                    <div className="election-meta">
                                        <span className="meta-item">
                                            <Calendar size={16} />
                                            Ends: {new Date(election.endDate).toLocaleDateString()}
                                        </span>
                                        <span className="meta-item">
                                            <Users size={16} />
                                            {election.Candidates?.length || 0} Candidates
                                        </span>
                                    </div>
                                </div>
                                <span className="live-badge-large">
                                    <span className="pulse-dot"></span>
                                    Voting Open
                                </span>
                            </div>

                            <div className="candidates-grid">
                                {election.Candidates && election.Candidates.map(candidate => (
                                    <motion.div
                                        key={candidate.id}
                                        className="candidate-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="candidate-photo-wrapper">
                                            <img
                                                src={candidate.photo 
                                                    ? `${API_URL.replace('/api', '')}${candidate.photo}` 
                                                    : `https://ui-avatars.com/api/?name=${candidate.User?.firstName}+${candidate.User?.lastName}&background=0a0e1a&color=00f5ff`
                                                }
                                                alt="Candidate"
                                                className="candidate-photo"
                                            />
                                            <div className="photo-glow"></div>
                                        </div>
                                        
                                        <div className="candidate-info">
                                            <h4 className="candidate-name">
                                                {candidate.User?.firstName} {candidate.User?.lastName}
                                            </h4>
                                            <span className="candidate-position">{candidate.position}</span>
                                            
                                            {candidate.description && (
                                                <p className="candidate-description">{candidate.description}</p>
                                            )}
                                            
                                            {candidate.manifesto && (
                                                <p className="candidate-manifesto">"{candidate.manifesto}"</p>
                                            )}
                                        </div>

                                        <button
                                            className="vote-candidate-btn"
                                            onClick={() => handleVote(election.id, candidate.id)}
                                            disabled={votingFor === candidate.id}
                                        >
                                            {votingFor === candidate.id ? (
                                                <>
                                                    <div className="btn-spinner"></div>
                                                    Voting...
                                                </>
                                            ) : (
                                                <>
                                                    <Star size={18} />
                                                    Cast Vote
                                                </>
                                            )}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Completed Elections */}
            {completedElections.length > 0 && (
                <div className="elections-section completed">
                    <div className="section-header">
                        <h2 className="section-title">
                            <Trophy size={24} />
                            Completed Elections
                        </h2>
                    </div>

                    <div className="completed-elections-list">
                        {completedElections.map(election => (
                            <div key={election.id} className="completed-election-card">
                                <div className="completed-election-info">
                                    <h4 className="completed-election-title">{election.title}</h4>
                                    <span className="completed-date">
                                        <Calendar size={14} />
                                        Ended: {new Date(election.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <button
                                    className="view-results-btn"
                                    onClick={() => handleViewResults(election.id)}
                                >
                                    <Trophy size={16} />
                                    View Results
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Elections */}
            {activeElections.length === 0 && completedElections.length === 0 && (
                <div className="page-card">
                    <div className="empty-state">
                        <VoteIcon size={48} className="empty-icon" />
                        <p>No elections at the moment</p>
                        <span className="empty-hint">Check back later for upcoming elections</span>
                    </div>
                </div>
            )}

            {/* Results Modal */}
            <AnimatePresence>
                {showResultsModal && resultsData && (
                    <motion.div
                        className="results-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="results-modal"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        >
                            <button
                                className="modal-close-btn"
                                onClick={() => setShowResultsModal(false)}
                            >
                                <X size={24} />
                            </button>

                            <div className="results-header">
                                <motion.div
                                    className="results-trophy"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                >
                                    <Crown size={48} />
                                </motion.div>
                                <h2 className="results-title">{resultsData.election.title}</h2>
                                <p className="results-stats">
                                    <Users size={18} />
                                    Total Votes: <strong>{resultsData.totalVotes}</strong>
                                </p>
                            </div>

                            <div className="winners-list">
                                {Object.entries(resultsData.winners).map(([position, winner], index) => (
                                    <motion.div
                                        key={position}
                                        className="winner-card"
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.15 }}
                                    >
                                        <div className="winner-position-bar"></div>
                                        <span className="winner-position-label">{position}</span>
                                        
                                        <div className="winner-content">
                                            <div className="winner-photo-wrapper">
                                                {winner.photo ? (
                                                    <img
                                                        src={`${API_URL.replace('/api', '')}${winner.photo}`}
                                                        alt={winner.name}
                                                        className="winner-photo"
                                                    />
                                                ) : (
                                                    <div className="winner-initial">
                                                        {winner.name[0]}
                                                    </div>
                                                )}
                                                <Crown className="winner-crown" size={20} />
                                            </div>
                                            
                                            <div className="winner-details">
                                                <div className="winner-name-row">
                                                    <h4 className="winner-name">{winner.name}</h4>
                                                    <Sparkles size={20} className="sparkle-icon" />
                                                </div>
                                                <p className="winner-votes">
                                                    <CheckCircle size={16} />
                                                    <strong>{winner.voteCount}</strong> votes
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <button
                                className="close-results-btn"
                                onClick={() => setShowResultsModal(false)}
                            >
                                Close Results
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Vote;
