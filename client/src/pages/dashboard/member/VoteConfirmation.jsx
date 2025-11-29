import { useParams, useNavigate, useLocation } from 'react-router-dom';

const VoteConfirmation = () => {
    const { electionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { candidate, alreadyVoted, vote } = location.state || {};

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div className="card" style={{ padding: '3rem' }}>
                {alreadyVoted ? (
                    <>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>ℹ️</div>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                            You Have Already Voted
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            You have already cast your vote in this election.
                        </p>
                        {vote && (
                            <div style={{
                                backgroundColor: 'var(--bg-secondary)',
                                padding: '1.5rem',
                                borderRadius: '0.5rem',
                                marginBottom: '2rem'
                            }}>
                                <p style={{ marginBottom: '0.5rem' }}>
                                    <strong>Your Vote:</strong>
                                </p>
                                <p style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                                    {vote.candidateName}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    Position: {vote.position}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Voted on: {new Date(vote.timestamp).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--success)' }}>
                            Vote Submitted Successfully!
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Thank you for participating in this election.
                        </p>

                        {candidate && (
                            <div style={{
                                backgroundColor: 'var(--bg-secondary)',
                                padding: '1.5rem',
                                borderRadius: '0.5rem',
                                marginBottom: '2rem'
                            }}>
                                <p style={{ marginBottom: '0.5rem' }}>
                                    <strong>You voted for:</strong>
                                </p>
                                <p style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                                    {candidate.userId.firstName} {candidate.userId.lastName}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Position: {candidate.position}
                                </p>
                            </div>
                        )}

                        <div style={{
                            backgroundColor: '#fff3cd',
                            border: '1px solid #ffc107',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            marginBottom: '2rem',
                            fontSize: '0.875rem'
                        }}>
                            <strong>Important:</strong> Your vote has been recorded and cannot be changed.
                            The election results will be announced after the voting period ends.
                        </div>
                    </>
                )}

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/dashboard/member/elections')}
                    >
                        View Elections
                    </button>
                    <button
                        className="btn"
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoteConfirmation;
