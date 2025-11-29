import { useState, useEffect } from 'react';
import { api, API_URL } from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

const Vote = () => {
    const [activeElections, setActiveElections] = useState([]);
    const [completedElections, setCompletedElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [resultsData, setResultsData] = useState(null);

    useEffect(() => {
        fetchElections();
    }, []);

    const fetchElections = async () => {
        try {
            // Fetch active elections
            const activeData = await api.get('/elections/active');
            setActiveElections(activeData);

            // Fetch all elections to get completed ones
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
        try {
            await api.post('/vote', { electionId, candidateId });
            alert('Vote cast successfully!');
            fetchElections();
        } catch (error) {
            alert('Failed to cast vote: ' + (error.response?.data?.message || error.message));
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

    if (loading) return <div>Loading elections...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Elections</h2>

            {/* Active Elections */}
            {activeElections.length > 0 && (
                <>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Active Elections - Cast Your Vote</h3>
                    {activeElections.map(election => (
                        <div key={election.id} className="card" style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>{election.title}</h3>
                                <span className="badge badge-success">
                                    {election.status}
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                Ends: {new Date(election.endDate).toLocaleDateString()}
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                                {election.Candidates && election.Candidates.map(candidate => (
                                    <div key={candidate.id} style={{
                                        border: '1px solid var(--border-color)',
                                        padding: '1rem',
                                        borderRadius: '0.5rem',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            backgroundColor: '#ddd',
                                            margin: '0 auto 1rem',
                                            overflow: 'hidden'
                                        }}>
                                            <img
                                                src={candidate.photo ? `${API_URL.replace('/api', '')}${candidate.photo}` : `https://ui-avatars.com/api/?name=${candidate.User?.firstName}+${candidate.User?.lastName}`}
                                                alt="Candidate"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <h4 style={{ marginBottom: '0.5rem' }}>{candidate.User?.firstName} {candidate.User?.lastName}</h4>
                                        <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '0.5rem' }}>{candidate.position}</p>
                                        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>{candidate.description}</p>
                                        <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{candidate.manifesto}</p>
                                        <button
                                            className="btn btn-primary"
                                            style={{ width: '100%' }}
                                            onClick={() => handleVote(election.id, candidate.id)}
                                        >
                                            Vote
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* Completed Elections */}
            {completedElections.length > 0 && (
                <>
                    <h3 style={{ marginBottom: '1rem', marginTop: '2rem', color: 'var(--text-secondary)' }}>Completed Elections</h3>
                    {completedElections.map(election => (
                        <div key={election.id} className="card" style={{ marginBottom: '1rem', backgroundColor: '#f9fafb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ marginBottom: '0.25rem' }}>{election.title}</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        Ended: {new Date(election.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleViewResults(election.id)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <CheckCircle size={16} /> View Results
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {activeElections.length === 0 && completedElections.length === 0 && (
                <div className="card">
                    <p>No elections at the moment.</p>
                </div>
            )}

            {/* Results Modal */}
            <AnimatePresence>
                {showResultsModal && resultsData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 50,
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card"
                            style={{
                                width: '100%',
                                maxWidth: '42rem',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                                border: '4px solid #FFD700',
                                position: 'relative'
                            }}
                        >
                            <button
                                onClick={() => setShowResultsModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                <X size={24} />
                            </button>

                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    style={{ fontSize: '3.75rem', marginBottom: '1rem' }}
                                >
                                    🎓
                                </motion.div>
                                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                                    {resultsData.election.title}
                                </h2>
                                <p style={{ fontSize: '1.25rem', color: '#4b5563' }}>
                                    Total Participations: <span style={{ fontWeight: 'bold', color: 'black' }}>{resultsData.totalVotes}</span>
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {Object.entries(resultsData.winners).map(([position, winner], index) => (
                                    <motion.div
                                        key={position}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        style={{
                                            backgroundColor: 'white',
                                            padding: '1.5rem',
                                            borderRadius: '0.75rem',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                            borderLeft: '4px solid var(--primary)'
                                        }}
                                    >
                                        <h3 style={{
                                            fontSize: '1.125rem',
                                            fontWeight: 'bold',
                                            color: '#6b7280',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            marginBottom: '1rem'
                                        }}>
                                            {position}
                                        </h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <div style={{
                                                width: '6rem',
                                                height: '6rem',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                border: '4px solid #FFD700',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}>
                                                {winner.photo ? (
                                                    <img
                                                        src={`${API_URL.replace('/api', '')}${winner.photo}`}
                                                        alt={winner.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        backgroundColor: '#e5e7eb',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.5rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {winner.name[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                    <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{winner.name}</h4>
                                                    <span style={{ fontSize: '1.5rem' }}>🎉</span>
                                                </div>
                                                <p style={{ color: '#4b5563' }}>
                                                    Received <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{winner.voteCount}</span> votes
                                                </p>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                                    "Congratulations to {winner.name} for winning the position of {position}!"
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                <button
                                    onClick={() => setShowResultsModal(false)}
                                    className="btn btn-primary"
                                    style={{
                                        padding: '0.75rem 2rem',
                                        borderRadius: '9999px',
                                        fontSize: '1.125rem',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    Close Results
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Vote;
