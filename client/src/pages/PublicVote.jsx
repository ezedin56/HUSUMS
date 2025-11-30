import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, User, IdCard, Vote as VoteIcon } from 'lucide-react';
import AnimatedNetworkBackground from '../components/AnimatedNetworkBackground';

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
        setSelectedVotes(prev => ({
            ...prev,
            [position]: { electionId, candidateId }
        }));
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
            background: 'transparent',
            padding: '2rem 1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <AnimatedNetworkBackground color="#22c55e" opacity={0.5} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ fontSize: '4rem', marginBottom: '1rem' }}
                    >
                        🗳️
                    </motion.div>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '0.5rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        Student Union Elections
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)' }}>
                        Make your voice heard! Cast your vote today.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="verify"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass"
                            style={{
                                borderRadius: '20px',
                                padding: '3rem',
                                maxWidth: '500px',
                                margin: '0 auto'
                            }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
                                }}>
                                    <User size={40} color="white" />
                                </div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>
                                    Verify Your Identity
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Enter your Student ID and Full Name to continue
                                </p>
                            </div>

                            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'white' }}>
                                        <IdCard size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                        Student ID
                                    </label>
                                    <input
                                        type="text"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        placeholder="e.g., 1209/16"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            fontSize: '1rem',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '10px',
                                            transition: 'all 0.3s',
                                            background: 'rgba(0,0,0,0.2)',
                                            color: 'white'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#16a34a';
                                            e.target.style.background = 'rgba(0,0,0,0.4)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                            e.target.style.background = 'rgba(0,0,0,0.2)';
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'white' }}>
                                        <User size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="e.g., Ezedin Aliyi Usman"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            fontSize: '1rem',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '10px',
                                            transition: 'all 0.3s',
                                            background: 'rgba(0,0,0,0.2)',
                                            color: 'white'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#16a34a';
                                            e.target.style.background = 'rgba(0,0,0,0.4)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                            e.target.style.background = 'rgba(0,0,0,0.2)';
                                        }}
                                    />
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            padding: '1rem',
                                            background: 'rgba(220, 38, 38, 0.2)',
                                            color: '#fca5a5',
                                            borderRadius: '10px',
                                            fontSize: '0.9rem',
                                            border: '1px solid rgba(220, 38, 38, 0.3)'
                                        }}
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        padding: '1rem 2rem',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        background: loading ? '#ccc' : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)'
                                    }}
                                >
                                    {loading ? 'Verifying...' : 'Continue to Vote'}
                                </motion.button>
                            </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="vote"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                        >
                            <div className="glass" style={{
                                borderRadius: '20px',
                                padding: '2rem',
                                marginBottom: '2rem'
                            }}>
                                <h2 style={{
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: '#22c55e',
                                    marginBottom: '0.5rem',
                                    textAlign: 'center',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}>
                                    YOU MAY NOW CAST YOUR VOTES!
                                </h2>
                                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.9)', marginBottom: '1rem' }}>
                                    {elections[0]?.title}
                                </p>
                                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                                    You can only vote for one candidate per position
                                </p>
                            </div>

                            {Object.entries(groupedCandidates).map(([position, candidates]) => (
                                <motion.div
                                    key={position}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass"
                                    style={{
                                        borderRadius: '20px',
                                        padding: '2rem',
                                        marginBottom: '2rem'
                                    }}
                                >
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        marginBottom: '1rem',
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        {position} Student Council
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
                                        You can only vote for one candidate
                                    </p>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '1.5rem'
                                    }}>
                                        {candidates.map((candidate) => {
                                            const isSelected = selectedVotes[position]?.candidateId === candidate.id;

                                            return (
                                                <motion.div
                                                    key={candidate.id}
                                                    whileHover={{ scale: 1.05, y: -5 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleVoteSelection(elections[0].id, candidate.id, position)}
                                                    style={{
                                                        background: isSelected ? 'linear-gradient(135deg, rgba(22, 163, 74, 0.8) 0%, rgba(21, 128, 61, 0.8) 100%)' : 'rgba(255,255,255,0.05)',
                                                        borderRadius: '15px',
                                                        padding: '1.5rem',
                                                        textAlign: 'center',
                                                        cursor: 'pointer',
                                                        border: isSelected ? '3px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
                                                        transition: 'all 0.3s',
                                                        position: 'relative',
                                                        backdropFilter: 'blur(5px)'
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '10px',
                                                                right: '10px',
                                                                background: '#FFD700',
                                                                borderRadius: '50%',
                                                                padding: '5px'
                                                            }}
                                                        >
                                                            <CheckCircle size={20} color="white" />
                                                        </motion.div>
                                                    )}

                                                    <div style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        borderRadius: '50%',
                                                        background: candidate.photo ? `url(${candidate.photo})` : 'rgba(255,255,255,0.1)',
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        margin: '0 auto 1rem',
                                                        border: isSelected ? ' 4px solid #FFD700' : '4px solid rgba(255,255,255,0.2)'
                                                    }} />

                                                    <h4 style={{
                                                        fontWeight: 'bold',
                                                        marginBottom: '0.5rem',
                                                        color: 'white',
                                                        fontSize: '1.1rem'
                                                    }}>
                                                        {candidate.name}
                                                    </h4>
                                                    <p style={{
                                                        fontSize: '0.85rem',
                                                        color: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
                                                        fontStyle: 'italic',
                                                        marginBottom: '0.5rem'
                                                    }}>
                                                        {candidate.description}
                                                    </p>

                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        style={{
                                                            marginTop: '1rem',
                                                            padding: '0.5rem 1.5rem',
                                                            background: isSelected ? 'white' : 'rgba(22, 163, 74, 0.8)',
                                                            color: isSelected ? '#16a34a' : 'white',
                                                            border: 'none',
                                                            borderRadius: '20px',
                                                            fontWeight: 'bold',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem'
                                                        }}
                                                    >
                                                        {isSelected ? 'SELECTED' : 'VOTE'}
                                                    </motion.button>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{
                                        padding: '1rem',
                                        background: 'rgba(220, 38, 38, 0.2)',
                                        color: '#fca5a5',
                                        borderRadius: '10px',
                                        marginBottom: '1rem',
                                        textAlign: 'center',
                                        border: '1px solid rgba(220, 38, 38, 0.3)'
                                    }}
                                >
                                    {error}
                                </motion.div>
                            )}

                            <motion.button
                                onClick={handleSubmitVotes}
                                disabled={loading || Object.keys(selectedVotes).length === 0}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    width: '100%',
                                    padding: '1.5rem',
                                    fontSize: '1.3rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: loading || Object.keys(selectedVotes).length === 0
                                        ? 'rgba(255,255,255,0.1)'
                                        : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                    border: 'none',
                                    borderRadius: '15px',
                                    cursor: loading || Object.keys(selectedVotes).length === 0 ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 10px 30px rgba(22, 163, 74, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1rem'
                                }}
                            >
                                <VoteIcon size={24} />
                                {loading ? 'SUBMITTING...' : 'SUBMIT VOTE'}
                            </motion.button>

                            <p style={{
                                textAlign: 'center',
                                marginTop: '1rem',
                                fontSize: '0.85rem',
                                color: 'rgba(255,255,255,0.8)'
                            }}>
                                Double-check your choices before submitting your votes
                            </p>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass"
                            style={{
                                borderRadius: '20px',
                                padding: '4rem 2rem',
                                maxWidth: '600px',
                                margin: '0 auto',
                                textAlign: 'center'
                            }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 1 }}
                                style={{ fontSize: '5rem', marginBottom: '1rem' }}
                            >
                                🎉
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 2rem',
                                    boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
                                }}
                            >
                                <CheckCircle size={60} color="white" />
                            </motion.div>

                            <h2 style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#22c55e',
                                marginBottom: '1rem',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}>
                                Vote Submitted Successfully!
                            </h2>

                            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
                                Thank you for participating in the Student Union Elections.
                                Your voice matters!
                            </p>

                            <div style={{
                                background: 'rgba(22, 163, 74, 0.1)',
                                padding: '1.5rem',
                                borderRadius: '10px',
                                marginBottom: '2rem',
                                border: '1px solid rgba(22, 163, 74, 0.3)'
                            }}>
                                <p style={{ fontSize: '0.9rem', color: '#4ade80', fontWeight: '600' }}>
                                    ✓ Your vote has been recorded
                                </p>
                                <p style={{ fontSize: '0.9rem', color: '#4ade80', fontWeight: '600' }}>
                                    ✓ Results will be announced after the election ends
                                </p>
                            </div>

                            <motion.button
                                onClick={() => window.location.href = '/'}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '1rem 2rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer'
                                }}
                            >
                                Return to Home
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PublicVote;
