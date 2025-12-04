import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../utils/api';

const LiveResults = () => {
    const { electionId } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (electionId && electionId !== 'undefined') {
            fetchResults();
            fetchAnalytics();
            // Refresh every 10 seconds for live updates
            const interval = setInterval(() => {
                fetchResults();
                fetchAnalytics();
            }, 10000);
            return () => clearInterval(interval);
        } else {
            setLoading(false);
        }
    }, [electionId]);

    const fetchResults = async () => {
        try {
            const res = await api.get(`/president/results/${electionId}`);
            setResults(res);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching results:', error);
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const res = await api.get(`/president/analytics/${electionId}`);
            setAnalytics(res);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    if (loading) return <div>Loading results...</div>;
    if (!results) return <div>No results available</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Live Election Results</h2>
                <button className="btn" onClick={() => navigate('/dashboard/president/elections')}>
                    Back to Elections
                </button>
            </div>

            {/* Analytics Summary */}
            {analytics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            {results.totalVotes}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Total Votes</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                            {analytics.turnoutPercentage}%
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Voter Turnout</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--info)' }}>
                            {analytics.totalMembers}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Total Members</div>
                    </div>
                </div>
            )}

            {/* Results */}
            <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Candidate Results</h3>

                {results.results.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No votes cast yet</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {results.results.map((candidate, index) => (
                            <div
                                key={candidate._id}
                                style={{
                                    padding: '1.5rem',
                                    backgroundColor: index === 0 ? 'var(--primary-light)' : 'var(--bg-secondary)',
                                    borderRadius: '0.5rem',
                                    border: index === 0 ? '2px solid var(--primary)' : '1px solid var(--border-color)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                            {index === 0 && '🏆 '}
                                            {candidate.name}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            {candidate.position}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                            {candidate.voteCount}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            {candidate.percentage}%
                                        </div>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${candidate.percentage}%`,
                                        height: '100%',
                                        backgroundColor: index === 0 ? 'var(--primary)' : 'var(--secondary)',
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Department Breakdown */}
            {analytics && analytics.departmentBreakdown && Object.keys(analytics.departmentBreakdown).length > 0 && (
                <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Votes by Department</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {Object.entries(analytics.departmentBreakdown).map(([dept, count]) => (
                            <div key={dept} style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{dept}</div>
                                <div style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveResults;
