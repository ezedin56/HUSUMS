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
    const [activeModal, setActiveModal] = useState(null); // 'about', 'howto', 'results', 'faq'

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
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            padding: '2rem 1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Vibrant Animated Gradient Orbs */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                    radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(74, 222, 128, 0.12) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)
                `,
                animation: 'floatingOrbs 25s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Flowing Wave Gradients */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                    linear-gradient(135deg, transparent 0%, transparent 40%, rgba(34, 197, 94, 0.08) 45%, rgba(34, 197, 94, 0.15) 50%, rgba(34, 197, 94, 0.08) 55%, transparent 60%, transparent 100%),
                    linear-gradient(-45deg, transparent 0%, transparent 40%, rgba(74, 222, 128, 0.06) 45%, rgba(74, 222, 128, 0.12) 50%, rgba(74, 222, 128, 0.06) 55%, transparent 60%, transparent 100%)
                `,
                backgroundSize: '1000px 1000px, 1200px 1200px',
                backgroundPosition: '0 0, 200px 100px',
                animation: 'waveFlow 35s linear infinite',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.8
            }} />

            {/* Floating Particles with Sparkle Effect */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    radial-gradient(circle at 10% 20%, rgba(74, 222, 128, 0.2) 0%, transparent 3%),
                    radial-gradient(circle at 90% 15%, rgba(34, 197, 94, 0.15) 0%, transparent 2.5%),
                    radial-gradient(circle at 30% 70%, rgba(74, 222, 128, 0.18) 0%, transparent 3.5%),
                    radial-gradient(circle at 70% 60%, rgba(16, 185, 129, 0.12) 0%, transparent 2.8%),
                    radial-gradient(circle at 50% 40%, rgba(34, 197, 94, 0.16) 0%, transparent 3.2%),
                    radial-gradient(circle at 85% 85%, rgba(74, 222, 128, 0.14) 0%, transparent 2.6%),
                    radial-gradient(circle at 15% 55%, rgba(34, 197, 94, 0.13) 0%, transparent 2.3%)
                `,
                backgroundSize: '100% 100%',
                animation: 'sparkleFloat 18s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Pulsing Light Rings */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '150%',
                height: '150%',
                transform: 'translate(-50%, -50%)',
                background: `
                    radial-gradient(circle, transparent 30%, rgba(34, 197, 94, 0.05) 31%, rgba(34, 197, 94, 0.05) 32%, transparent 33%),
                    radial-gradient(circle, transparent 50%, rgba(74, 222, 128, 0.04) 51%, rgba(74, 222, 128, 0.04) 52%, transparent 53%)
                `,
                animation: 'pulseRings 20s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Shimmer Effect */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(110deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.03) 50%, transparent 60%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 10s linear infinite',
                pointerEvents: 'none',
                zIndex: 1
            }} />

            <AnimatedNetworkBackground color="#22c55e" opacity={0.4} />

            {/* Enhanced Keyframe Animations */}
            <style>{`
                @keyframes floatingOrbs {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.6;
                    }
                    25% {
                        transform: translate(30px, -40px) scale(1.1);
                        opacity: 0.8;
                    }
                    50% {
                        transform: translate(-20px, -60px) scale(0.95);
                        opacity: 1;
                    }
                    75% {
                        transform: translate(-40px, -30px) scale(1.05);
                        opacity: 0.7;
                    }
                }

                @keyframes waveFlow {
                    0% {
                        transform: translate(0, 0) rotate(0deg);
                        opacity: 0.5;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-500px, 500px) rotate(10deg);
                        opacity: 0.5;
                    }
                }

                @keyframes sparkleFloat {
                    0%, 100% {
                        opacity: 0.3;
                        transform: translateY(0) scale(1) rotate(0deg);
                    }
                    25% {
                        opacity: 0.6;
                    }
                    50% {
                        opacity: 1;
                        transform: translateY(-50px) scale(1.15) rotate(180deg);
                    }
                    75% {
                        opacity: 0.5;
                    }
                }

                @keyframes pulseRings {
                    0%, 100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0.4;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2);
                        opacity: 0.7;
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }

                /* Glass Effect Enhancement */
                .glass {
                    background: rgba(255, 255, 255, 0.08) !important;
                    backdrop-filter: blur(25px) saturate(180%) !important;
                    -webkit-backdrop-filter: blur(25px) saturate(180%) !important;
                    border: 1.5px solid rgba(255, 255, 255, 0.18) !important;
                    box-shadow: 
                        0 8px 32px 0 rgba(0, 0, 0, 0.37),
                        0 0 0 1px rgba(34, 197, 94, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1),
                        0 20px 60px rgba(34, 197, 94, 0.15) !important;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }

                .glass:hover {
                    background: rgba(255, 255, 255, 0.12) !important;
                    border-color: rgba(34, 197, 94, 0.4) !important;
                    transform: translateY(-5px) !important;
                    box-shadow: 
                        0 12px 40px 0 rgba(0, 0, 0, 0.45),
                        0 0 0 1px rgba(34, 197, 94, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15),
                        0 25px 80px rgba(34, 197, 94, 0.25) !important;
                }
            `}</style>

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
                                padding: '3rem 2rem',
                                maxWidth: '800px',
                                margin: '0 auto',
                                textAlign: 'center'
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
                                }}
                            >
                                <CheckCircle size={50} color="white" />
                            </motion.div>

                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: '#22c55e',
                                marginBottom: '0.5rem',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}>
                                Vote Submitted Successfully!
                            </h2>

                            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
                                Here is a summary of your cast votes:
                            </p>

                            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                                {elections.map(election => (
                                    <div key={election.id} style={{ marginBottom: '2rem' }}>
                                        <h3 style={{
                                            color: '#22c55e',
                                            borderBottom: '1px solid rgba(34, 197, 94, 0.3)',
                                            paddingBottom: '0.5rem',
                                            marginBottom: '1rem',
                                            fontSize: '1.2rem'
                                        }}>
                                            {election.title}
                                        </h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '1rem'
                                        }}>
                                            {election.candidates.map(candidate => {
                                                const isVoted = selectedVotes[election.id] === candidate.id;
                                                return (
                                                    <div key={candidate.id} style={{
                                                        padding: '1rem',
                                                        borderRadius: '15px',
                                                        background: isVoted
                                                            ? 'linear-gradient(145deg, rgba(22, 163, 74, 0.2), rgba(22, 163, 74, 0.1))'
                                                            : 'rgba(255, 255, 255, 0.03)',
                                                        border: isVoted
                                                            ? '2px solid #22c55e'
                                                            : '1px solid rgba(255, 255, 255, 0.1)',
                                                        opacity: isVoted ? 1 : 0.5,
                                                        transform: isVoted ? 'scale(1.02)' : 'scale(1)',
                                                        transition: 'all 0.3s ease',
                                                        position: 'relative',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        textAlign: 'center'
                                                    }}>
                                                        {isVoted && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '-10px',
                                                                right: '-10px',
                                                                background: '#22c55e',
                                                                color: 'white',
                                                                padding: '0.25rem 0.75rem',
                                                                borderRadius: '20px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 'bold',
                                                                boxShadow: '0 4px 10px rgba(34, 197, 94, 0.4)'
                                                            }}>
                                                                YOUR VOTE
                                                            </div>
                                                        )}

                                                        <div style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            borderRadius: '50%',
                                                            background: candidate.photo ? `url(${candidate.photo})` : 'rgba(255,255,255,0.1)',
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            marginBottom: '0.5rem',
                                                            border: isVoted ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.1)'
                                                        }} />

                                                        <h4 style={{
                                                            color: isVoted ? '#fff' : 'rgba(255,255,255,0.7)',
                                                            fontSize: '1rem',
                                                            marginBottom: '0.25rem'
                                                        }}>
                                                            {candidate.name}
                                                        </h4>

                                                        <p style={{
                                                            fontSize: '0.8rem',
                                                            color: 'rgba(255,255,255,0.5)',
                                                            fontStyle: 'italic'
                                                        }}>
                                                            {candidate.party || 'Independent'}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <motion.button
                                onClick={() => window.location.href = '/'}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '1rem 3rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
                                }}
                            >
                                Return to Home
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Information Modals */}
            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveModal(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '2rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass"
                            style={{
                                maxWidth: '800px',
                                width: '100%',
                                maxHeight: '80vh',
                                overflowY: 'auto',
                                padding: '2.5rem',
                                borderRadius: '20px',
                                position: 'relative'
                            }}
                        >
                            <button
                                onClick={() => setActiveModal(null)}
                                style={{
                                    position: 'absolute',
                                    top: '1.5rem',
                                    right: '1.5rem',
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    border: '1px solid rgba(239, 68, 68, 0.4)',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#ef4444',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                                    e.target.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                                    e.target.style.transform = 'scale(1)';
                                }}
                            >
                                ×
                            </button>

                            {activeModal === 'about' && (
                                <div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#22c55e' }}>
                                        About HUSUMS Elections
                                    </h2>
                                    <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '1rem' }}>
                                        The Haramaya University Student Union Management System (HUSUMS) is a comprehensive digital platform
                                        designed to facilitate transparent, secure, and accessible student union elections.
                                    </p>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '1rem', color: '#22c55e' }}>
                                        Our Mission
                                    </h3>
                                    <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '1rem' }}>
                                        To empower every student's voice through a modern, secure voting system that ensures fairness,
                                        transparency, and accessibility in the democratic process.
                                    </p>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '1rem', color: '#22c55e' }}>
                                        Key Features
                                    </h3>
                                    <ul style={{ fontSize: '1rem', lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.9)', paddingLeft: '1.5rem' }}>
                                        <li>🔒 Secure authentication and vote encryption</li>
                                        <li>✅ One person, one vote verification</li>
                                        <li>📊 Real-time election results</li>
                                        <li>📱 Mobile-friendly interface</li>
                                        <li>🌐 Accessible from anywhere</li>
                                    </ul>
                                </div>
                            )}

                            {activeModal === 'howto' && (
                                <div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#22c55e' }}>
                                        How to Vote
                                    </h2>
                                    <div style={{ fontSize: '1rem', lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.9)' }}>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', color: '#22c55e' }}>
                                                Step 1: Verify Your Identity
                                            </h3>
                                            <p>Enter your Student ID and Full Name exactly as registered in the university system.</p>
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', color: '#22c55e' }}>
                                                Step 2: Review Candidates
                                            </h3>
                                            <p>Browse through the candidate profiles, read their manifestos, and review their qualifications.</p>
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', color: '#22c55e' }}>
                                                Step 3: Cast Your Vote
                                            </h3>
                                            <p>Select one candidate per position. You can only vote once for each position.</p>
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', color: '#22c55e' }}>
                                                Step 4: Submit
                                            </h3>
                                            <p>Review your selections and click "Submit Vote". Your vote will be recorded securely and anonymously.</p>
                                        </div>
                                        <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #22c55e' }}>
                                            <strong style={{ color: '#22c55e' }}>Important:</strong> Once submitted, votes cannot be changed.
                                            Make sure to review your choices carefully!
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'results' && (
                                <div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#22c55e' }}>
                                        Election Results
                                    </h2>
                                    <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '1.5rem' }}>
                                        Results will be announced immediately after the voting period ends. All results are calculated
                                        automatically and displayed in real-time.
                                    </p>
                                    <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '1.5rem', borderRadius: '10px', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem', color: '#22c55e' }}>
                                            Current Status
                                        </h3>
                                        <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                                            {elections.length > 0 ? '🟢 Voting is currently active' : '🔴 No active elections'}
                                        </p>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Results include total votes cast, percentage breakdown, and winning candidates for each position.
                                        All registered students can view the results once announced.
                                    </p>
                                </div>
                            )}

                            {activeModal === 'faq' && (
                                <div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#22c55e' }}>
                                        Frequently Asked Questions
                                    </h2>
                                    {[
                                        {
                                            q: 'Can I change my vote after submitting?',
                                            a: 'No, votes are final once submitted. This ensures the integrity of the election process.'
                                        },
                                        {
                                            q: 'Is my vote anonymous?',
                                            a: 'Yes, your vote is completely anonymous. We only verify your eligibility, not your choices.'
                                        },
                                        {
                                            q: 'What if I forget my Student ID?',
                                            a: 'Contact the student affairs office or check your student portal for your ID.'
                                        },
                                        {
                                            q: 'Can I vote from my phone?',
                                            a: 'Yes! The voting system is fully responsive and works on all devices.'
                                        },
                                        {
                                            q: 'When will results be announced?',
                                            a: 'Results are announced automatically when the voting period ends.'
                                        },
                                        {
                                            q: 'What happens if there is a tie?',
                                            a: 'In case of a tie, the election rules specify a runoff election between tied candidates.'
                                        }
                                    ].map((faq, idx) => (
                                        <div key={idx} style={{ marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#22c55e' }}>
                                                {faq.q}
                                            </h3>
                                            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)' }}>
                                                {faq.a}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="glass"
                style={{
                    marginTop: '4rem',
                    padding: '2rem',
                    borderRadius: '20px 20px 0 0',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    color: 'rgba(255, 255, 255, 0.9)'
                }}>
                    {/* About Section */}
                    <div>
                        <h3 style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            HUSUMS Elections
                        </h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.7)' }}>
                            Empowering student voices through secure and transparent digital voting.
                            Making democracy accessible to everyone.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            color: '#22c55e'
                        }}>
                            Quick Links
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {[
                                { label: 'About Us', modal: 'about' },
                                { label: 'How to Vote', modal: 'howto' },
                                { label: 'Election Results', modal: 'results' },
                                { label: 'FAQs', modal: 'faq' }
                            ].map((link, idx) => (
                                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                                    <button
                                        onClick={() => setActiveModal(link.modal)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            padding: 0,
                                            transition: 'color 0.3s',
                                            textAlign: 'left'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#22c55e'}
                                        onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            color: '#22c55e'
                        }}>
                            Contact Us
                        </h4>
                        <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.8' }}>
                            <p style={{ marginBottom: '0.5rem' }}>📧 elections@husums.edu</p>
                            <p style={{ marginBottom: '0.5rem' }}>📱 +251 XXX XXX XXX</p>
                            <p>📍 Haramaya University</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                        © {new Date().getFullYear()} HUSUMS. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {['Privacy Policy', 'Terms of Service'].map((item, idx) => (
                            <a key={idx} href="#" style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255, 255, 255, 0.6)',
                                textDecoration: 'none',
                                transition: 'color 0.3s'
                            }}
                                onMouseEnter={(e) => e.target.style.color = '#22c55e'}
                                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </motion.footer>
        </div>
    );
};

export default PublicVote;
