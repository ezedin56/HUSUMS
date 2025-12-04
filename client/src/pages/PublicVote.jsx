import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUniversity, FaVoteYea, FaClock, FaUsers, FaCheckCircle, FaLock,
    FaShieldAlt, FaCalendarAlt, FaMapMarkerAlt, FaEnvelope, FaPhone,
    FaBook, FaGavel, FaBalanceScale, FaMoon, FaSun, FaHome, FaArrowLeft
} from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const PublicVote = () => {
    const [step, setStep] = useState(1); // 1: Verify, 2: Vote, 3: Success
    const [studentId, setStudentId] = useState('');
    const [fullName, setFullName] = useState('');
    const [elections, setElections] = useState([]);
    const [selectedVotes, setSelectedVotes] = useState({});
    const [submittedPositions, setSubmittedPositions] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('02:14:25');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmingPosition, setConfirmingPosition] = useState(null);
    const [ballotId] = useState(`HUS-VOTE-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('voting_theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    const [showPlatformModal, setShowPlatformModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        localStorage.setItem('voting_theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const theme = {
        bg: darkMode ? '#0f172a' : '#f9fafb',
        cardBg: darkMode ? '#1e293b' : '#ffffff',
        text: darkMode ? '#f1f5f9' : '#111827',
        textSecondary: darkMode ? '#cbd5e1' : '#6b7280',
        border: darkMode ? '#334155' : '#e5e7eb',
        primary: '#059669',
        primaryHover: '#047857',
        headerBg: darkMode ? '#1e293b' : '#059669',
        footerBg: darkMode ? '#0f172a' : '#111827',
        sidebarBg: darkMode ? '#1e293b' : '#ffffff',
        selectedBg: darkMode ? 'rgba(5, 150, 105, 0.2)' : '#f0fdf4',
        hoverBg: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
    };

    useEffect(() => {
        const savedStudentId = localStorage.getItem('husums_student_id');
        const savedFullName = localStorage.getItem('husums_full_name');
        if (savedStudentId && savedFullName) {
            setStudentId(savedStudentId);
            setFullName(savedFullName);
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        if (step === 2) {
            fetchElections();
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    const [h, m, s] = prev.split(':').map(Number);
                    let totalSeconds = h * 3600 + m * 60 + s - 1;
                    if (totalSeconds < 0) totalSeconds = 0;
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = totalSeconds % 60;
                    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step]);

    const fetchElections = async () => {
        try {
            const response = await fetch(`${API_URL}/public/elections/active`);
            if (!response.ok) {
                throw new Error('Failed to fetch elections');
            }
            const data = await response.json();

            // Transform API data to match component structure
            // Group candidates by position
            const positionsMap = {};

            data.forEach(election => {
                election.candidates.forEach(candidate => {
                    const position = candidate.position;

                    if (!positionsMap[position]) {
                        positionsMap[position] = {
                            id: position.toLowerCase().replace(/\s+/g, ''),
                            title: position,
                            icon: getPositionIcon(position),
                            electionId: election.id,
                            candidates: []
                        };
                    }

                    // Transform candidate data
                    positionsMap[position].candidates.push({
                        _id: candidate.id,
                        name: candidate.name,
                        fullName: candidate.name,
                        department: 'Student',
                        year: '',
                        slogan: candidate.slogan || candidate.description || 'Vote for change',
                        platform: candidate.platform && candidate.platform.length > 0
                            ? candidate.platform
                            : (candidate.manifesto ? candidate.manifesto.split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(1).trim()).slice(0, 3) : ['Leadership', 'Innovation', 'Service']),
                        currentSupport: 0,
                        photo: candidate.photo,
                        manifesto: candidate.manifesto || '',
                        description: candidate.description || '',
                        // New detailed fields
                        phone: candidate.phone || '',
                        email: candidate.email || '',
                        region: candidate.region || '',
                        zone: candidate.zone || '',
                        woreda: candidate.woreda || '',
                        city: candidate.city || '',
                        background: candidate.background || '',
                        education: candidate.education || [],
                        experience: candidate.experience || [],
                        achievements: candidate.achievements || []
                    });
                });
            });

            const positions = Object.values(positionsMap);
            setElections(positions);
        } catch (err) {
            console.error('Error fetching elections:', err);
            setError('Failed to load elections. Please try again later.');
        }
    };

    // Helper function to get icon for position
    const getPositionIcon = (position) => {
        const positionLower = position.toLowerCase();
        if (positionLower.includes('president') && !positionLower.includes('vice')) return '🏛️';
        if (positionLower.includes('vice')) return '🤝';
        if (positionLower.includes('secretary')) return '📝';
        if (positionLower.includes('treasurer')) return '💰';
        return '👤';
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

            if (rememberMe) {
                localStorage.setItem('husums_student_id', studentId);
                localStorage.setItem('husums_full_name', fullName);
            } else {
                localStorage.removeItem('husums_student_id');
                localStorage.removeItem('husums_full_name');
            }

            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const handleCandidateClick = (positionId, candidateId) => {
        // Don't allow selection if position already submitted
        if (submittedPositions[positionId]) return;

        // Single click: Always select the candidate
        setSelectedVotes(prev => ({
            ...prev,
            [positionId]: candidateId
        }));
    };

    const handleCandidateDoubleClick = (positionId, candidateId) => {
        // Don't allow changes if position already submitted
        if (submittedPositions[positionId]) return;

        // Double click: Unselect only if this candidate is currently selected
        setSelectedVotes(prev => {
            if (prev[positionId] === candidateId) {
                const newVotes = { ...prev };
                delete newVotes[positionId];
                return newVotes;
            }
            return prev;
        });
    };


    const handleSubmitPosition = (positionId) => {
        if (!selectedVotes[positionId]) {
            setError('Please select a candidate for this position first.');
            return;
        }
        setConfirmingPosition(positionId);
        setShowConfirmModal(true);
    };

    const confirmSubmitPosition = async () => {
        setLoading(true);
        setError('');

        try {
            const position = elections.find(p => p.id === confirmingPosition);
            const candidateId = selectedVotes[confirmingPosition];

            // Submit vote to API
            const response = await fetch(`${API_URL}/public/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    fullName,
                    votes: [{
                        electionId: position.electionId,
                        candidateId: candidateId
                    }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit vote');
            }

            setSubmittedPositions(prev => ({
                ...prev,
                [confirmingPosition]: true
            }));

            setShowConfirmModal(false);
            setConfirmingPosition(null);

            // Check if all positions are submitted
            const allSubmitted = elections.every(p => submittedPositions[p.id] || p.id === confirmingPosition);
            if (allSubmitted) {
                localStorage.removeItem('husums_student_id');
                localStorage.removeItem('husums_full_name');
                setSuccess(true);
                setStep(3);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getSelectedCandidateName = (positionId) => {
        const position = elections.find(p => p.id === positionId);
        const candidateId = selectedVotes[positionId];
        const candidate = position?.candidates.find(c => c._id === candidateId);
        return candidate?.name || 'Not Selected';
    };

    const getSubmittedCount = () => Object.keys(submittedPositions).length;
    const getTotalPositions = () => elections.length;

    return (
        <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: "'Inter', sans-serif", transition: 'background 0.3s' }}>
            <AnimatePresence mode="wait">
                {/* Step 1: Verification */}
                {step === 1 && (
                    <motion.div
                        key="verify"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            minHeight: '100vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: darkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            padding: '20px'
                        }}
                    >
                        <div style={{
                            width: '100%',
                            maxWidth: '400px',
                            background: theme.cardBg,
                            borderRadius: '20px',
                            padding: '40px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                            position: 'relative'
                        }}>
                            {/* Theme Toggle */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    background: 'transparent',
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: theme.text,
                                    fontSize: '1.2rem'
                                }}
                            >
                                {darkMode ? <FaSun /> : <FaMoon />}
                            </button>

                            <Link to="/" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: theme.primary,
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                marginBottom: '24px'
                            }}>
                                <FaArrowLeft /> Back to Home
                            </Link>

                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗳️</div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: theme.text, marginBottom: '8px' }}>
                                    Verify Your Identity
                                </h2>
                                <p style={{ color: theme.textSecondary, fontSize: '0.95rem' }}>
                                    Enter your Student ID and Full Name to continue
                                </p>
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
                                            padding: '14px 16px',
                                            fontSize: '1rem',
                                            border: `2px solid ${theme.border}`,
                                            borderRadius: '12px',
                                            outline: 'none',
                                            transition: 'all 0.3s',
                                            background: theme.bg,
                                            color: theme.text
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = theme.primary}
                                        onBlur={(e) => e.target.style.borderColor = theme.border}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Full Name"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            fontSize: '1rem',
                                            border: `2px solid ${theme.border}`,
                                            borderRadius: '12px',
                                            outline: 'none',
                                            transition: 'all 0.3s',
                                            background: theme.bg,
                                            color: theme.text
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = theme.primary}
                                        onBlur={(e) => e.target.style.borderColor = theme.border}
                                    />
                                </div>

                                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: theme.primary }}
                                    />
                                    <label htmlFor="rememberMe" style={{ color: theme.text, fontSize: '0.95rem', cursor: 'pointer' }}>
                                        Remember me
                                    </label>
                                </div>

                                {error && (
                                    <div style={{
                                        padding: '12px',
                                        marginBottom: '20px',
                                        background: '#fee2e2',
                                        border: '1px solid #fca5a5',
                                        borderRadius: '8px',
                                        color: '#dc2626',
                                        fontSize: '0.9rem',
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
                                        padding: '14px',
                                        background: theme.primary,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1.05rem',
                                        fontWeight: '600',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseOver={(e) => !loading && (e.target.style.background = theme.primaryHover)}
                                    onMouseOut={(e) => !loading && (e.target.style.background = theme.primary)}
                                >
                                    {loading ? 'Verifying...' : 'Continue to Vote'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Voting Interface */}
                {step === 2 && (
                    <motion.div
                        key="vote"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Header */}
                        <header style={{
                            background: theme.headerBg,
                            color: 'white',
                            padding: '16px 20px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            position: 'sticky',
                            top: 0,
                            zIndex: 100
                        }}>
                            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <Link to="/" style={{
                                        color: 'white',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.1)',
                                        transition: 'background 0.2s'
                                    }}
                                        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                                        onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                    >
                                        <FaHome /> Home
                                    </Link>
                                    <h1 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaVoteYea /> UNION ELECTIONS 2025
                                    </h1>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <FaClock /> {timeRemaining}
                                    </div>
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            width: '36px',
                                            height: '36px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: 'white',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        {darkMode ? <FaSun /> : <FaMoon />}
                                    </button>
                                </div>
                            </div>
                        </header>

                        {/* Main Content */}
                        <div style={{
                            display: 'flex',
                            maxWidth: '1400px',
                            margin: '0 auto',
                            gap: '20px',
                            padding: '20px',
                            alignItems: 'flex-start',
                            flexDirection: window.innerWidth < 1024 ? 'column' : 'row'
                        }}>
                            {/* Sidebar */}
                            <aside style={{
                                width: window.innerWidth < 1024 ? '100%' : '280px',
                                flexShrink: 0,
                                position: window.innerWidth >= 1024 ? 'sticky' : 'relative',
                                top: window.innerWidth >= 1024 ? '100px' : 'auto'
                            }}>
                                <div style={{
                                    background: theme.sidebarBg,
                                    borderRadius: '16px',
                                    padding: '20px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    border: `1px solid ${theme.border}`
                                }}>
                                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                        <FaUniversity style={{ fontSize: '2rem', color: theme.primary, marginBottom: '8px' }} />
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: theme.text, margin: '0 0 4px 0' }}>HUSUMS</h3>
                                        <p style={{ fontSize: '0.85rem', color: theme.textSecondary, margin: 0 }}>VOTING PORTAL</p>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: theme.text, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            📋 BALLOT PROGRESS
                                        </h4>
                                        {elections.map(position => (
                                            <div key={position.id} style={{ marginBottom: '10px', fontSize: '0.85rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.text }}>
                                                    <span style={{ color: theme.textSecondary }}>{position.icon} {position.title}:</span>
                                                    {submittedPositions[position.id] ? (
                                                        <span style={{ color: theme.primary, fontWeight: '600', fontSize: '0.75rem' }}>✓ Submitted</span>
                                                    ) : selectedVotes[position.id] ? (
                                                        <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>Selected</span>
                                                    ) : (
                                                        <span style={{ color: '#dc2626', fontSize: '0.75rem' }}>Pending</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div style={{ marginTop: '12px', padding: '10px', background: theme.selectedBg, borderRadius: '8px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.85rem', color: theme.text, fontWeight: '600' }}>
                                                {getSubmittedCount()} / {getTotalPositions()} Submitted
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '20px', padding: '14px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#166534', marginBottom: '6px', fontWeight: '600' }}>
                                            ⏰ TIME REMAINING
                                        </div>
                                        <div style={{ fontSize: '1.3rem', fontWeight: '800', color: theme.primary, textAlign: 'center' }}>
                                            {timeRemaining}
                                        </div>
                                    </div>

                                    <div style={{ padding: '14px', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fde047' }}>
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#92400e', marginBottom: '8px' }}>
                                            ⚠️ VOTING RULES
                                        </h4>
                                        <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '0.75rem', color: '#78350f', lineHeight: '1.6' }}>
                                            <li>Double-click to select</li>
                                            <li>Submit individually</li>
                                            <li>Vote is anonymous</li>
                                            <li>Results: Dec 7, 3PM</li>
                                        </ul>
                                    </div>
                                </div>
                            </aside>

                            {/* Main Voting Area */}
                            <main style={{ flex: 1, minWidth: 0 }}>
                                {elections.map((position) => (
                                    <section key={position.id} style={{
                                        background: theme.cardBg,
                                        borderRadius: '16px',
                                        padding: 'clamp(20px, 4vw, 32px)',
                                        marginBottom: '20px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        border: `1px solid ${theme.border}`,
                                        opacity: submittedPositions[position.id] ? 0.6 : 1,
                                        pointerEvents: submittedPositions[position.id] ? 'none' : 'auto'
                                    }}>
                                        <div style={{
                                            background: submittedPositions[position.id]
                                                ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                                                : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                            color: 'white',
                                            padding: '16px 20px',
                                            borderRadius: '12px',
                                            marginBottom: '20px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: '12px'
                                        }}>
                                            <div>
                                                <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '800', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    {position.icon} {position.title.toUpperCase()}
                                                </h2>
                                                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
                                                    {submittedPositions[position.id] ? '✓ Vote Submitted Successfully' : 'Click to select, double-click to unselect'}
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                                            gap: '16px'
                                        }}>
                                            {position.candidates.map(candidate => {
                                                const isSelected = selectedVotes[position.id] === candidate._id;
                                                return (
                                                    <motion.div
                                                        key={candidate._id}
                                                        whileHover={{ y: -4 }}
                                                        onClick={(e) => {
                                                            // Delay to check if it's a double-click
                                                            if (e.detail === 1) {
                                                                setTimeout(() => {
                                                                    if (e.detail === 1) {
                                                                        handleCandidateClick(position.id, candidate._id);
                                                                    }
                                                                }, 200);
                                                            }
                                                        }}
                                                        onDoubleClick={() => handleCandidateDoubleClick(position.id, candidate._id)}
                                                        style={{
                                                            background: isSelected ? theme.selectedBg : theme.cardBg,
                                                            border: isSelected ? `3px solid ${theme.primary}` : `2px solid ${theme.border}`,
                                                            borderRadius: '16px',
                                                            padding: '20px',
                                                            cursor: submittedPositions[position.id] ? 'not-allowed' : 'pointer',
                                                            transition: 'all 0.3s',
                                                            position: 'relative',
                                                            boxShadow: isSelected ? `0 8px 30px rgba(5,150,105,0.2)` : '0 2px 10px rgba(0,0,0,0.05)'
                                                        }}
                                                    >
                                                        {isSelected && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '12px',
                                                                right: '12px',
                                                                background: theme.primary,
                                                                color: 'white',
                                                                borderRadius: '50%',
                                                                width: '28px',
                                                                height: '28px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <FaCheckCircle />
                                                            </div>
                                                        )}

                                                        <div style={{
                                                            width: '80px',
                                                            height: '80px',
                                                            borderRadius: '50%',
                                                            backgroundColor: isSelected ? theme.primary : theme.border,
                                                            color: isSelected ? 'white' : theme.textSecondary,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '2rem',
                                                            fontWeight: '800',
                                                            margin: '0 auto 14px',
                                                            border: `3px solid ${isSelected ? theme.primaryHover : theme.border}`,
                                                            overflow: 'hidden',
                                                            backgroundImage: candidate.photo ? `url(http://localhost:5000${candidate.photo})` : 'none',
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center'
                                                        }}>
                                                            {!candidate.photo && candidate.name.split(' ').map(n => n[0]).join('')}
                                                        </div>

                                                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: theme.text, margin: '0 0 4px 0', textAlign: 'center' }}>
                                                            {candidate.name}
                                                        </h3>
                                                        <p style={{ fontSize: '0.85rem', color: theme.textSecondary, margin: '0 0 10px 0', textAlign: 'center' }}>
                                                            {candidate.department} • {candidate.year}
                                                        </p>

                                                        <p style={{ fontSize: '0.9rem', color: theme.text, fontStyle: 'italic', margin: '0 0 14px 0', textAlign: 'center', lineHeight: '1.4' }}>
                                                            "{candidate.slogan}"
                                                        </p>

                                                        <div style={{ marginBottom: '14px' }}>
                                                            {candidate.platform.map((item, i) => (
                                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.8rem', color: theme.text }}>
                                                                    <FaCheckCircle style={{ color: theme.primary, flexShrink: 0, fontSize: '0.7rem' }} />
                                                                    <span>{item}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div style={{ marginBottom: '12px' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.8rem' }}>
                                                                <span style={{ color: theme.textSecondary }}>Support:</span>
                                                                <span style={{ fontWeight: '700', color: theme.primary }}>{candidate.currentSupport}%</span>
                                                            </div>
                                                            <div style={{ width: '100%', height: '6px', background: theme.border, borderRadius: '3px', overflow: 'hidden' }}>
                                                                <div style={{
                                                                    width: `${candidate.currentSupport}%`,
                                                                    height: '100%',
                                                                    background: 'linear-gradient(90deg, #059669, #047857)',
                                                                    transition: 'width 0.5s'
                                                                }} />
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedCandidate(candidate);
                                                                    setShowPlatformModal(true);
                                                                }}
                                                                style={{
                                                                    padding: '8px 12px',
                                                                    background: theme.primary,
                                                                    border: 'none',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.75rem',
                                                                    color: 'white',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s',
                                                                    fontWeight: '600'
                                                                }}
                                                                onMouseOver={(e) => e.target.style.background = theme.primaryHover}
                                                                onMouseOut={(e) => e.target.style.background = theme.primary}
                                                            >
                                                                📋 Platform
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedCandidate(candidate);
                                                                    setShowDetailModal(true);
                                                                }}
                                                                style={{
                                                                    padding: '8px 12px',
                                                                    background: 'transparent',
                                                                    border: `2px solid ${theme.primary}`,
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.75rem',
                                                                    color: theme.primary,
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s',
                                                                    fontWeight: '600'
                                                                }}
                                                                onMouseOver={(e) => {
                                                                    e.target.style.background = theme.primary;
                                                                    e.target.style.color = 'white';
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    e.target.style.background = 'transparent';
                                                                    e.target.style.color = theme.primary;
                                                                }}
                                                            >
                                                                👤 View Detail
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>

                                        {/* Beautiful Submit Button */}
                                        {selectedVotes[position.id] && !submittedPositions[position.id] && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                style={{
                                                    marginTop: '24px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '12px'
                                                }}
                                            >
                                                <div style={{
                                                    textAlign: 'center',
                                                    padding: '12px 20px',
                                                    background: theme.selectedBg,
                                                    borderRadius: '12px',
                                                    border: `2px dashed ${theme.primary}`,
                                                    width: '100%',
                                                    maxWidth: '400px'
                                                }}>
                                                    <div style={{ fontSize: '0.9rem', color: theme.text, fontWeight: '600', marginBottom: '4px' }}>
                                                        ✓ Selected: {elections.find(p => p.id === position.id)?.candidates.find(c => c._id === selectedVotes[position.id])?.name}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: theme.textSecondary }}>
                                                        Ready to submit your vote for {position.title}?
                                                    </div>
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: loading ? 1 : 1.05 }}
                                                    whileTap={{ scale: loading ? 1 : 0.95 }}
                                                    onClick={() => handleSubmitPosition(position.id)}
                                                    disabled={loading}
                                                    style={{
                                                        width: '100%',
                                                        maxWidth: '400px',
                                                        padding: '16px 32px',
                                                        background: loading ? '#9ca3af' : `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryHover} 100%)`,
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '16px',
                                                        fontSize: '1.1rem',
                                                        fontWeight: '800',
                                                        cursor: loading ? 'not-allowed' : 'pointer',
                                                        transition: 'all 0.3s',
                                                        boxShadow: loading ? 'none' : '0 8px 24px rgba(5,150,105,0.3)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '12px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}
                                                >
                                                    <FaVoteYea style={{ fontSize: '1.3rem' }} />
                                                    {loading ? 'Submitting...' : `Submit My Vote for ${position.title}`}
                                                </motion.button>

                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: theme.textSecondary,
                                                    textAlign: 'center',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    <FaLock /> This action is final and cannot be undone
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Success Message for Submitted Position */}
                                        {submittedPositions[position.id] && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                style={{
                                                    marginTop: '24px',
                                                    padding: '20px',
                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    borderRadius: '16px',
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    boxShadow: '0 8px 24px rgba(5,150,105,0.3)'
                                                }}
                                            >
                                                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✓</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>
                                                    Vote Submitted Successfully!
                                                </div>
                                                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                                                    Your vote for {position.title} has been recorded
                                                </div>
                                            </motion.div>
                                        )}
                                    </section>
                                ))}

                                {error && (
                                    <div style={{
                                        padding: '14px',
                                        marginBottom: '20px',
                                        background: '#fee2e2',
                                        border: '1px solid #fca5a5',
                                        borderRadius: '12px',
                                        color: '#dc2626',
                                        textAlign: 'center',
                                        fontSize: '0.9rem'
                                    }}>
                                        {error}
                                    </div>
                                )}
                            </main>
                        </div>

                        {/* Footer */}
                        <footer style={{
                            background: theme.footerBg,
                            color: '#f9fafb',
                            padding: 'clamp(40px, 6vw, 60px) clamp(20px, 4vw, 40px) 30px',
                            marginTop: '40px'
                        }}>
                            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                                    gap: 'clamp(24px, 4vw, 40px)',
                                    marginBottom: '30px'
                                }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', color: theme.primary }}>
                                            HUSUMS ELECTIONS
                                        </h3>
                                        <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: '1.5' }}>
                                            Empowering student voices through secure digital voting.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px' }}>CONTACT</h4>
                                        <div style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FaEnvelope /> elections@husums.edu
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FaPhone /> +251 XXX XXX XXX
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px' }}>LINKS</h4>
                                        <div style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <Link to="/about" style={{ color: '#9ca3af', textDecoration: 'none' }}>About Us</Link>
                                            <Link to="/faqs" style={{ color: '#9ca3af', textDecoration: 'none' }}>FAQs</Link>
                                            <Link to="/rules" style={{ color: '#9ca3af', textDecoration: 'none' }}>Rules</Link>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px' }}>CONSTITUTIONAL</h4>
                                        <div style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div>Article 11: Rights</div>
                                            <div>Article 14: Vote</div>
                                            <div>Article 67: Council</div>
                                            <div>Article 68: Fair Elections</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid #374151', paddingTop: '20px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '8px' }}>
                                        © 2025 HUSUMS. All rights reserved.
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: theme.primary, fontStyle: 'italic', fontWeight: '600' }}>
                                        "Your Vote, Your Voice, Your Union"
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </motion.div>
                )}

                {/* Step 3: Success Screen */}
                {step === 3 && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            minHeight: '100vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: darkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            padding: '20px'
                        }}
                    >
                        <div style={{
                            maxWidth: '600px',
                            width: '100%',
                            background: theme.cardBg,
                            borderRadius: '24px',
                            padding: 'clamp(40px, 6vw, 60px) clamp(24px, 4vw, 40px)',
                            textAlign: 'center',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', marginBottom: '20px' }}>✅</div>
                            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '800', color: theme.text, marginBottom: '14px' }}>
                                VOTE SUCCESSFULLY SUBMITTED!
                            </h2>
                            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', color: theme.textSecondary, marginBottom: '28px', lineHeight: '1.6' }}>
                                🎉 Thank you for participating in student democracy!
                            </p>

                            <div style={{ background: theme.bg, borderRadius: '16px', padding: '20px', marginBottom: '28px', textAlign: 'left' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: theme.text, marginBottom: '14px' }}>
                                    📋 Your Voting Receipt:
                                </h3>
                                <div style={{ fontSize: '0.85rem', color: theme.textSecondary, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Ballot ID:</span>
                                        <span style={{ fontWeight: '600', color: theme.text }}>{ballotId}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Time:</span>
                                        <span style={{ fontWeight: '600', color: theme.text }}>{new Date().toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Status:</span>
                                        <span style={{ fontWeight: '600', color: theme.primary }}>Confirmed</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Positions:</span>
                                        <span style={{ fontWeight: '600', color: theme.text }}>{getTotalPositions()}/{getTotalPositions()}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: '#f0fdf4', borderRadius: '16px', padding: '18px', marginBottom: '28px', border: '1px solid #bbf7d0' }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#166534', marginBottom: '6px' }}>
                                    📅 Results Announcement:
                                </h3>
                                <p style={{ fontSize: '1rem', fontWeight: '700', color: theme.primary, margin: 0 }}>
                                    December 7, 2025 at 3:00 PM
                                </p>
                            </div>

                            <Link to="/" style={{
                                display: 'inline-block',
                                width: '100%',
                                padding: '14px',
                                background: theme.primary,
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: 'white',
                                textDecoration: 'none',
                                textAlign: 'center'
                            }}>
                                <FaHome style={{ marginRight: '8px' }} />
                                RETURN TO HOMEPAGE
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirmation Modal */}
            {showConfirmModal && confirmingPosition && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px'
                }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                            background: theme.cardBg,
                            borderRadius: '20px',
                            padding: 'clamp(24px, 5vw, 40px)',
                            maxWidth: '500px',
                            width: '100%',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                        }}
                    >
                        <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '800', color: theme.text, marginBottom: '20px', textAlign: 'center' }}>
                            CONFIRM VOTE SUBMISSION
                        </h3>
                        <p style={{ fontSize: '0.95rem', color: theme.textSecondary, marginBottom: '20px', textAlign: 'center' }}>
                            You are about to submit your vote for:
                        </p>

                        <div style={{ background: theme.bg, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '1.5rem' }}>
                                    {elections.find(p => p.id === confirmingPosition)?.icon}
                                </span>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: theme.textSecondary }}>
                                        {elections.find(p => p.id === confirmingPosition)?.title}:
                                    </div>
                                    <div style={{ fontSize: '1rem', fontWeight: '700', color: theme.text }}>
                                        {getSelectedCandidateName(confirmingPosition)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#fef3c7', borderRadius: '12px', padding: '14px', marginBottom: '20px', border: '1px solid #fde047' }}>
                            <p style={{ fontSize: '0.85rem', color: '#92400e', margin: 0, lineHeight: '1.4' }}>
                                ⚠️ <strong>Important:</strong> This action cannot be undone. Your vote will be recorded anonymously.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setConfirmingPosition(null);
                                }}
                                style={{
                                    padding: '12px',
                                    background: 'transparent',
                                    border: `2px solid ${theme.border}`,
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    color: theme.text,
                                    cursor: 'pointer'
                                }}
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={confirmSubmitPosition}
                                disabled={loading}
                                style={{
                                    padding: '12px',
                                    background: theme.primary,
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    color: 'white',
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'SUBMITTING...' : 'CONFIRM'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Platform Modal */}
            {showPlatformModal && selectedCandidate && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '20px'
                }}
                    onClick={() => setShowPlatformModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: theme.cardBg,
                            borderRadius: '24px',
                            padding: '32px',
                            maxWidth: '700px',
                            width: '100%',
                            maxHeight: '85vh',
                            overflow: 'auto',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 8px 0', color: theme.text }}>
                                Platform & Manifesto
                            </h2>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 4px 0', color: theme.primary }}>
                                {selectedCandidate.name}
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: theme.textSecondary }}>
                                {selectedCandidate.department} • {selectedCandidate.year}
                            </p>
                        </div>

                        {/* Slogan */}
                        <div style={{
                            background: theme.selectedBg,
                            padding: '16px',
                            borderRadius: '12px',
                            marginBottom: '24px',
                            border: `2px solid ${theme.primary}`,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: theme.primary, marginBottom: '4px', textTransform: 'uppercase' }}>
                                Campaign Slogan
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: theme.text }}>
                                "{selectedCandidate.slogan}"
                            </div>
                        </div>

                        {/* Key Points */}
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 12px 0', color: theme.text }}>
                                Key Platform Points
                            </h4>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {selectedCandidate.platform.map((item, idx) => (
                                    <div key={idx} style={{
                                        padding: '12px 16px',
                                        background: theme.bg,
                                        borderRadius: '8px',
                                        border: `1px solid ${theme.border}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}>
                                        <span style={{ fontSize: '1.2rem', color: theme.primary, fontWeight: '700' }}>✓</span>
                                        <span style={{ fontSize: '0.9rem', color: theme.text, fontWeight: '500' }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Full Manifesto */}
                        {selectedCandidate.manifesto && (
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 12px 0', color: theme.text }}>
                                    Complete Manifesto
                                </h4>
                                <div style={{
                                    padding: '20px',
                                    background: theme.bg,
                                    borderRadius: '12px',
                                    border: `1px solid ${theme.border}`,
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.7',
                                    color: theme.text
                                }}>
                                    {selectedCandidate.manifesto}
                                </div>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => setShowPlatformModal(false)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: theme.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedCandidate && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '20px'
                }}
                    onClick={() => setShowDetailModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: theme.cardBg,
                            borderRadius: '24px',
                            padding: '32px',
                            maxWidth: '800px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👤</div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 8px 0', color: theme.text }}>
                                {selectedCandidate.fullName || selectedCandidate.name}
                            </h2>
                            <div style={{ fontSize: '1.1rem', color: theme.primary, fontWeight: '600', marginBottom: '8px' }}>
                                Candidate for {elections.find(p => p.candidates.some(c => c._id === selectedCandidate._id))?.title || 'Position'}
                            </div>
                            <div style={{ fontSize: '0.95rem', color: theme.textSecondary }}>
                                {selectedCandidate.department} • {selectedCandidate.year}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 16px 0', color: theme.text, borderBottom: `2px solid ${theme.primary}`, paddingBottom: '8px' }}>
                                📞 Contact Information
                            </h3>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                <div style={{ padding: '12px 16px', background: theme.bg, borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                                    <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>Phone Number</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.text }}>{selectedCandidate.phone || 'Not provided'}</div>
                                </div>
                                <div style={{ padding: '12px 16px', background: theme.bg, borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                                    <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>Email Address</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.text }}>{selectedCandidate.email || 'Not provided'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 16px 0', color: theme.text, borderBottom: `2px solid ${theme.primary}`, paddingBottom: '8px' }}>
                                📍 Location Information
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                <div style={{ padding: '12px 16px', background: theme.bg, borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                                    <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>Region</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.text }}>{selectedCandidate.region || 'Not provided'}</div>
                                </div>
                                <div style={{ padding: '12px 16px', background: theme.bg, borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                                    <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>Zone</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.text }}>{selectedCandidate.zone || 'Not provided'}</div>
                                </div>
                                <div style={{ padding: '12px 16px', background: theme.bg, borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                                    <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>Woreda</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.text }}>{selectedCandidate.woreda || 'Not provided'}</div>
                                </div>
                                <div style={{ padding: '12px 16px', background: theme.bg, borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                                    <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>City</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.text }}>{selectedCandidate.city || 'Not provided'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Background */}
                        {selectedCandidate.background && (
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 12px 0', color: theme.text, borderBottom: `2px solid ${theme.primary}`, paddingBottom: '8px' }}>
                                    ✨ Background
                                </h3>
                                <div style={{
                                    padding: '16px',
                                    background: theme.bg,
                                    borderRadius: '12px',
                                    border: `1px solid ${theme.border}`,
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    color: theme.text
                                }}>
                                    {selectedCandidate.background}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {selectedCandidate.education && (
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 12px 0', color: theme.text, borderBottom: `2px solid ${theme.primary}`, paddingBottom: '8px' }}>
                                    🎓 Educational Background
                                </h3>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {selectedCandidate.education.map((edu, idx) => (
                                        <div key={idx} style={{
                                            padding: '12px 16px',
                                            background: theme.bg,
                                            borderRadius: '8px',
                                            border: `1px solid ${theme.border}`,
                                            display: 'flex',
                                            alignItems: 'start',
                                            gap: '12px'
                                        }}>
                                            <span style={{ fontSize: '1.2rem', color: theme.primary }}>•</span>
                                            <span style={{ fontSize: '0.9rem', color: theme.text, lineHeight: '1.5' }}>{edu}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Experience */}
                        {selectedCandidate.experience && (
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 12px 0', color: theme.text, borderBottom: `2px solid ${theme.primary}`, paddingBottom: '8px' }}>
                                    💼 Experience
                                </h3>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {selectedCandidate.experience.map((exp, idx) => (
                                        <div key={idx} style={{
                                            padding: '12px 16px',
                                            background: theme.bg,
                                            borderRadius: '8px',
                                            border: `1px solid ${theme.border}`,
                                            display: 'flex',
                                            alignItems: 'start',
                                            gap: '12px'
                                        }}>
                                            <span style={{ fontSize: '1.2rem', color: theme.primary }}>•</span>
                                            <span style={{ fontSize: '0.9rem', color: theme.text, lineHeight: '1.5' }}>{exp}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Achievements */}
                        {selectedCandidate.achievements && (
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 12px 0', color: theme.text, borderBottom: `2px solid ${theme.primary}`, paddingBottom: '8px' }}>
                                    🏆 Achievements
                                </h3>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {selectedCandidate.achievements.map((achievement, idx) => (
                                        <div key={idx} style={{
                                            padding: '12px 16px',
                                            background: theme.bg,
                                            borderRadius: '8px',
                                            border: `1px solid ${theme.border}`,
                                            display: 'flex',
                                            alignItems: 'start',
                                            gap: '12px'
                                        }}>
                                            <span style={{ fontSize: '1.2rem', color: theme.primary }}>🌟</span>
                                            <span style={{ fontSize: '0.9rem', color: theme.text, lineHeight: '1.5' }}>{achievement}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => setShowDetailModal(false)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: theme.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}


            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 768px) {
                    .grid-responsive {
                        grid-template-columns: 1fr !important;
                    }
                }
                @media (min-width: 769px) and (max-width: 1023px) {
                    .grid-responsive {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default PublicVote;
