import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, User, IdCard, Vote as VoteIcon } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const PublicVote = () => {
    const [step, setStep] = useState(1); // 1: Verify, 2: Vote, 3: Success
    const [studentId, setStudentId] = useState('');
    const [fullName, setFullName] = useState('');
    const [elections, setElections] = useState([]);
    const [selectedVotes, setSelectedVotes] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (step === 2) {
            fetchElections();
        }
    }, [step]);

    const fetchElections = async () => {
        try {
            const response = await fetch(`${API_URL}/public/elections/active`);
            const data = await response.json();
            setElections(data);
        } catch (err) {
            setError('Failed to load elections');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/public/verify-student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, fullName })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVoteSelection = (electionId, candidateId, position) => {
        setSelectedVotes(prev => {
            // If the same candidate is clicked again, deselect them
            if (prev[position]?.candidateId === candidateId) {
                const newVotes = { ...prev };
                delete newVotes[position];
                return newVotes;
            }
            // Otherwise, select the new candidate
            return {
                ...prev,
                [position]: { electionId, candidateId }
            };
        });
    };

    const handleSubmitVotes = async () => {
        setLoading(true);
        setError('');

        try {
            const votes = Object.values(selectedVotes);

            if (votes.length === 0) {
                throw new Error('Please select at least one candidate');
            }

            const response = await fetch(`${API_URL}/public/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    fullName,
                    votes
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setSuccess(true);
            setStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Group candidates by position
    const groupedCandidates = elections.length > 0 ? elections[0].candidates.reduce((acc, candidate) => {
        if (!acc[candidate.position]) {
            acc[candidate.position] = [];
        }
        acc[candidate.position].push(candidate);
        return acc;
    }, {}) : {};

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            color: 'white',
            overflowY: 'auto'
        }}>
            {/* Background Image & Overlay (Matches Login) */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(/src/assets/background.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: -2
            }} />
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(/src/assets/background.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(3px)',
                zIndex: -1,
                opacity: 0.8
            }} />

            {/* Navigation Bar - Only show on steps 2 and 3 */}
            {(step === 2 || step === 3) && (
                <nav style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '1rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <Link to="/" style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#00ff00',
                        textDecoration: 'none',
                        letterSpacing: '2px'
                    }}>
                        HUSUMS
                    </Link>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <Link to="/" style={{
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            transition: 'color 0.3s'
                        }}
                            onMouseOver={(e) => e.target.style.color = '#00ff00'}
                            onMouseOut={(e) => e.target.style.color = 'white'}>
                            Home
                        </Link>
                        <Link to="/about" style={{
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            transition: 'color 0.3s'
                        }}
                            onMouseOver={(e) => e.target.style.color = '#00ff00'}
                            onMouseOut={(e) => e.target.style.color = 'white'}>
                            About
                        </Link>
                        <Link to="/login" style={{
                            background: '#00ff00',
                            color: 'black',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'all 0.3s'
                        }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#00cc00';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = '#00ff00';
                                e.target.style.transform = 'translateY(0)';
                            }}>
                            Login
                        </Link>
                    </div>
                </nav>
            )}

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', paddingTop: step === 2 || step === 3 ? '100px' : '20px' }}>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="verify"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{
                                width: '380px',
                                padding: '32px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(20px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                                position: 'relative',
                                zIndex: 1
                            }}
                        >
                            {/* Back to Home Button */}
                            <Link to="/" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#00ff00',
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                marginBottom: '24px',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.gap = '12px';
                                    e.currentTarget.style.color = '#00cc00';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.gap = '8px';
                                    e.currentTarget.style.color = '#00ff00';
                                }}>
                                <span>←</span> Back to Home
                            </Link>

                            {/* Header Section (Inside Card) */}
                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <h2 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '600',
                                    margin: '0 0 8px 0',
                                    color: '#222'
                                }}>Verify Your Identity</h2>
                                <p style={{
                                    margin: 0,
                                    color: '#000',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    lineHeight: '1.5'
                                }}>Enter your Student ID and Full Name to continue</p>
                            </div>

                            <form onSubmit={handleVerify}>
                                <div style={{ marginBottom: '20px' }}>
                                    <input
                                        type="text"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        placeholder="Student ID"
                                        required
                                        style={{
                                            width: '100%',
                                            height: '48px',
                                            padding: '0 16px',
                                            fontSize: '1rem',
                                            border: '1px solid #16a34a',
                                            borderRadius: '12px',
                                            outline: 'none',
                                            background: 'rgba(0, 0, 0, 0.4)',
                                            color: 'white',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 0 10px rgba(22, 163, 74, 0.1)'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.boxShadow = '0 0 20px rgba(22, 163, 74, 0.4), inset 0 0 10px rgba(22, 163, 74, 0.2)';
                                            e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.boxShadow = '0 0 10px rgba(22, 163, 74, 0.1)';
                                            e.target.style.background = 'rgba(0, 0, 0, 0.4)';
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Full Name"
                                        required
                                        style={{
                                            width: '100%',
                                            height: '48px',
                                            padding: '0 16px',
                                            fontSize: '1rem',
                                            border: '1px solid #16a34a',
                                            borderRadius: '12px',
                                            outline: 'none',
                                            background: 'rgba(0, 0, 0, 0.4)',
                                            color: 'white',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 0 10px rgba(22, 163, 74, 0.1)'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.boxShadow = '0 0 20px rgba(22, 163, 74, 0.4), inset 0 0 10px rgba(22, 163, 74, 0.2)';
                                            e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.boxShadow = '0 0 10px rgba(22, 163, 74, 0.1)';
                                            e.target.style.background = 'rgba(0, 0, 0, 0.4)';
                                        }}
                                    />
                                </div>

                                {error && (
                                    <div style={{
                                        padding: '12px',
                                        marginBottom: '20px',
                                        background: 'rgba(220, 38, 38, 0.2)',
                                        border: '1px solid rgba(220, 38, 38, 0.4)',
                                        borderRadius: '8px',
                                        color: '#fca5a5',
                                        textAlign: 'center'
                                    }}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        height: '50px',
                                        background: 'linear-gradient(135deg, #00cc00, #00ff00)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 4px 15px rgba(0, 204, 0, 0.3)'
                                    }}
                                    onMouseOver={(e) => {
                                        if (!loading) {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 20px rgba(0, 204, 0, 0.4)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!loading) {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 15px rgba(0, 204, 0, 0.3)';
                                        }
                                    }}
                                >
                                    {loading ? 'Verifying...' : 'Continue to Vote'}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="vote"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            style={{ width: '100%', maxWidth: '1000px' }}
                        >
                            {/* Voting Interface Header - Modern & Attractive */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15), rgba(0, 255, 0, 0.1))',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '24px',
                                padding: '40px 30px',
                                marginBottom: '40px',
                                border: '1px solid rgba(0, 255, 0, 0.2)',
                                boxShadow: '0 8px 32px rgba(0, 255, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🗳️</div>
                                    <h2 style={{
                                        fontSize: '2.5rem',
                                        fontWeight: '800',
                                        background: 'linear-gradient(135deg, #00ff00, #00cc00)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textAlign: 'center',
                                        marginBottom: '12px',
                                        letterSpacing: '0.5px',
                                        textShadow: '0 0 30px rgba(0, 255, 0, 0.3)'
                                    }}>
                                        YOU MAY NOW CAST YOUR VOTES!
                                    </h2>
                                    <p style={{
                                        textAlign: 'center',
                                        color: 'rgba(255,255,255,0.95)',
                                        fontSize: '1.2rem',
                                        fontWeight: '500',
                                        margin: 0
                                    }}>{elections[0]?.title}</p>
                                </div>
                            </div>

                            {Object.entries(groupedCandidates).map(([position, candidates]) => (
                                <div key={position} style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '20px',
                                    padding: '30px',
                                    marginBottom: '30px'
                                }}>
                                    {/* Position Header - Modern & Attractive */}
                                    <div style={{
                                        background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.2), rgba(0, 255, 0, 0.1))',
                                        borderRadius: '16px',
                                        padding: '24px 30px',
                                        marginBottom: '30px',
                                        border: '1px solid rgba(0, 255, 0, 0.3)',
                                        boxShadow: '0 4px 20px rgba(0, 255, 0, 0.1)'
                                    }}>
                                        <h3 style={{
                                            fontSize: '2rem',
                                            fontWeight: '800',
                                            background: 'linear-gradient(135deg, #ffffff, #e0e0e0)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            margin: 0,
                                            textTransform: 'uppercase',
                                            textAlign: 'center',
                                            letterSpacing: '1px'
                                        }}>{position}</h3>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                        {candidates.map(candidate => {
                                            const isSelected = selectedVotes[position]?.candidateId === candidate._id;
                                            // Get first and last name for display in circle
                                            const nameParts = candidate.name.split(' ');
                                            const firstName = nameParts[0] || '';
                                            const lastName = nameParts[nameParts.length - 1] || '';

                                            return (
                                                <div
                                                    key={candidate._id}
                                                    onClick={() => handleVoteSelection(elections[0]._id, candidate._id, position)}
                                                    style={{
                                                        background: '#2d3748',
                                                        borderRadius: '16px',
                                                        padding: '30px 20px',
                                                        cursor: 'pointer',
                                                        border: isSelected ? '2px solid #00ff00' : '2px solid rgba(0, 255, 0, 0.3)',
                                                        transition: 'all 0.3s',
                                                        position: 'relative',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 255, 0, 0.3)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    {/* Checkmark in top-right corner */}
                                                    {isSelected && (
                                                        <CheckCircle style={{
                                                            position: 'absolute',
                                                            top: '15px',
                                                            right: '15px',
                                                            color: '#00ff00'
                                                        }} size={28} />
                                                    )}

                                                    {/* Circular profile with name inside */}
                                                    <div style={{
                                                        width: '140px',
                                                        height: '140px',
                                                        borderRadius: '50%',
                                                        border: '3px solid #00ff00',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginBottom: '20px',
                                                        background: 'rgba(0, 255, 0, 0.1)',
                                                        overflow: 'hidden',
                                                        position: 'relative'
                                                    }}>
                                                        {/* If there's a photo, show it as background */}
                                                        {candidate.photo && (
                                                            <img
                                                                src={candidate.photo}
                                                                alt={candidate.name}
                                                                style={{
                                                                    position: 'absolute',
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                    opacity: 0.3
                                                                }}
                                                            />
                                                        )}
                                                        {/* Name inside circle */}
                                                        <div style={{
                                                            textAlign: 'center',
                                                            zIndex: 1,
                                                            padding: '10px'
                                                        }}>
                                                            <div style={{
                                                                fontSize: '1.1rem',
                                                                fontWeight: '600',
                                                                color: 'white',
                                                                lineHeight: '1.2'
                                                            }}>{firstName}</div>
                                                            <div style={{
                                                                fontSize: '1.1rem',
                                                                fontWeight: '600',
                                                                color: 'white',
                                                                lineHeight: '1.2'
                                                            }}>{lastName}</div>
                                                        </div>
                                                    </div>

                                                    {/* Candidate name below circle */}
                                                    <h4 style={{
                                                        margin: '0 0 8px 0',
                                                        fontSize: '1.3rem',
                                                        fontWeight: '700',
                                                        color: 'white',
                                                        textAlign: 'center'
                                                    }}>{candidate.name}</h4>

                                                    {/* Additional info */}
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '0.95rem',
                                                        color: 'rgba(255, 255, 255, 0.7)',
                                                        textAlign: 'center'
                                                    }}>{candidate.description || '3rd Year, General'}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {error && (
                                <div style={{
                                    padding: '15px',
                                    marginBottom: '20px',
                                    background: 'rgba(220, 38, 38, 0.2)',
                                    border: '1px solid rgba(220, 38, 38, 0.4)',
                                    borderRadius: '10px',
                                    color: '#fca5a5',
                                    textAlign: 'center'
                                }}>
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleSubmitVotes}
                                disabled={loading || Object.keys(selectedVotes).length === 0}
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    background: 'linear-gradient(135deg, #00cc00, #00ff00)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    cursor: loading || Object.keys(selectedVotes).length === 0 ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 4px 15px rgba(0, 204, 0, 0.3)',
                                    opacity: loading || Object.keys(selectedVotes).length === 0 ? 0.5 : 1
                                }}
                                onMouseOver={(e) => {
                                    if (!loading && Object.keys(selectedVotes).length > 0) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(0, 204, 0, 0.4)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!loading && Object.keys(selectedVotes).length > 0) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(0, 204, 0, 0.3)';
                                    }
                                }}
                            >
                                {loading ? 'Submitting...' : 'Submit Votes'}
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                textAlign: 'center',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                padding: '60px 40px',
                                maxWidth: '500px'
                            }}
                        >
                            <CheckCircle size={80} style={{ color: '#00ff00', marginBottom: '20px' }} />
                            <h2 style={{ fontSize: '2rem', marginBottom: '15px', color: 'white' }}>Vote Submitted Successfully!</h2>
                            <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '30px' }}>
                                Thank you for participating in the election. Your vote has been recorded.
                            </p>
                            <Link
                                to="/"
                                style={{
                                    display: 'inline-block',
                                    padding: '15px 40px',
                                    background: 'linear-gradient(135deg, #00cc00, #00ff00)',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '10px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(0, 204, 0, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                Return to Home
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Section - Only show on steps 2 and 3 */}
            {(step === 2 || step === 3) && (
                <footer style={{
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '40px 20px',
                    marginTop: '60px'
                }}>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '40px'
                    }}>
                        <div>
                            <h3 style={{ color: '#00ff00', marginBottom: '15px', fontSize: '1.3rem' }}>HUSUMS Elections</h3>
                            <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6' }}>
                                Empowering student voices through secure and transparent digital voting. Making democracy accessible to everyone.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '15px' }}>Quick Links</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '10px' }}>
                                    <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}
                                        onMouseOver={(e) => e.target.style.color = '#00ff00'}
                                        onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                                        About Us
                                    </a>
                                </li>
                                <li style={{ marginBottom: '10px' }}>
                                    <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}
                                        onMouseOver={(e) => e.target.style.color = '#00ff00'}
                                        onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                                        How to Vote
                                    </a>
                                </li>
                                <li style={{ marginBottom: '10px' }}>
                                    <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}
                                        onMouseOver={(e) => e.target.style.color = '#00ff00'}
                                        onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                                        Election Results
                                    </a>
                                </li>
                                <li style={{ marginBottom: '10px' }}>
                                    <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.3s' }}
                                        onMouseOver={(e) => e.target.style.color = '#00ff00'}
                                        onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                                        FAQs
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '15px' }}>Contact Us</h4>
                            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '10px' }}>📧 elections@husums.edu</p>
                            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '10px' }}>📱 +251 XXX XXX XXX</p>
                            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>📍 Haramaya University</p>
                        </div>
                    </div>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '30px auto 0',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.9rem'
                    }}>
                        <p>© 2025 HUSUMS. All rights reserved.</p>
                        <div style={{ marginTop: '10px' }}>
                            <a href="#" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none', marginRight: '20px' }}>Privacy Policy</a>
                            <a href="#" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>Terms of Service</a>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default PublicVote;
