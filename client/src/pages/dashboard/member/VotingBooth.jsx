import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../utils/api';

const VotingBooth = () => {
    const { electionId } = useParams();
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [voteStatus, setVoteStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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
            setVoteStatus(res);
            if (res.hasVoted) {
                // User already voted, redirect to confirmation
                navigate(`/dashboard/member/vote-confirmation/${electionId}`, {
                    state: { alreadyVoted: true, vote: res.vote }
                });
            }
        } catch (error) {
            console.error('Error checking vote status:', error);
        }
    };

    const handleSubmitVote = async () => {
        if (!selectedCandidate) {
            alert('Please select a candidate');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/vote', {
                electionId,
                candidateId: selectedCandidate._id
            });
            navigate(`/dashboard/member/vote-confirmation/${electionId}`, {
                state: { candidate: selectedCandidate }
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit vote');
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading candidates...</div>;

    // Group candidates by position
    const candidatesByPosition = candidates.reduce((acc, candidate) => {
        if (!acc[candidate.position]) {
            acc[candidate.position] = [];
        }
        acc[candidate.position].push(candidate);
        return acc;
    }, {});

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Cast Your Vote</h2>
                <button className="btn" onClick={() => navigate('/dashboard/member/elections')}>
                    Back to Elections
                </button>
            </div>

            {Object.keys(candidatesByPosition).length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>No candidates available for this election</p>
                </div>
            ) : (
                <>
                    {Object.entries(candidatesByPosition).map(([position, positionCandidates]) => (
                        <div key={position} style={{ marginBottom: '3rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border-color)' }}>
                                {position}
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {positionCandidates.map(candidate => (
                                    <div
                                        key={candidate._id}
                                        className="card"
                                        onClick={() => setSelectedCandidate(candidate)}
                                        style={{
                                            cursor: 'pointer',
                                            border: selectedCandidate?._id === candidate._id ? '3px solid var(--primary)' : '1px solid var(--border-color)',
                                            transition: 'all 0.2s',
                                            transform: selectedCandidate?._id === candidate._id ? 'scale(1.02)' : 'scale(1)'
                                        }}
                                    >
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{
                                                width: '120px',
                                                height: '120px',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                margin: '0 auto 1rem',
                                                backgroundColor: '#f3f4f6'
                                            }}>
                                                {candidate.photo ? (
                                                    <img
                                                        src={`http://localhost:5000${candidate.photo}`}
                                                        alt={`${candidate.userId.firstName} ${candidate.userId.lastName}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem', color: '#9ca3af' }}>
                                                        👤
                                                    </div>
                                                )}
                                            </div>

                                            <h4 style={{ marginBottom: '0.5rem' }}>
                                                {candidate.userId.firstName} {candidate.userId.lastName}
                                            </h4>

                                            {candidate.manifesto && (
                                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                    {candidate.manifesto}
                                                </p>
                                            )}

                                            {candidate.description && (
                                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                    {candidate.description}
                                                </p>
                                            )}

                                            {selectedCandidate?._id === candidate._id && (
                                                <div style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                                                    ✓ Selected
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div style={{ position: 'sticky', bottom: '2rem', textAlign: 'center', marginTop: '2rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmitVote}
                            disabled={!selectedCandidate || submitting}
                            style={{
                                padding: '1rem 3rem',
                                fontSize: '1.1rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                        >
                            {submitting ? 'Submitting...' : 'Submit Vote'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default VotingBooth;
