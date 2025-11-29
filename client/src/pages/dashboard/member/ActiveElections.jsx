import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../utils/api';

const ActiveElections = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
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

    if (loading) return <div>Loading elections...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Active Elections</h2>

            {elections.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        No active elections at the moment
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {elections.map(election => (
                        <div key={election._id} className="card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{election.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                        {election.description}
                                    </p>

                                    {election.positions && election.positions.length > 0 && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <strong>Positions:</strong>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                                {election.positions.map((position, idx) => (
                                                    <span
                                                        key={idx}
                                                        style={{
                                                            padding: '0.25rem 0.75rem',
                                                            backgroundColor: 'var(--primary-light)',
                                                            color: 'var(--primary)',
                                                            borderRadius: '1rem',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        {position}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        <div>Start: {new Date(election.startDate).toLocaleDateString()}</div>
                                        <div>End: {new Date(election.endDate).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleVoteClick(election._id)}
                                    style={{ marginLeft: '1rem' }}
                                >
                                    Vote Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveElections;
