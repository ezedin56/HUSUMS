import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaVoteYea, FaUserCheck, FaClipboardCheck, FaShieldAlt, FaCheck,
    FaTimes, FaCalendarAlt, FaGavel, FaExclamationTriangle, FaDownload,
    FaPrint, FaUsers, FaLock, FaEnvelope, FaPhone, FaFileAlt, FaBook,
    FaCheckCircle, FaTimesCircle, FaBullhorn, FaClock, FaInfoCircle
} from 'react-icons/fa';

const VotersGuideModal = ({ isOpen, onClose, onOpenConstitution }) => {
    const [activeSection, setActiveSection] = useState(0);

    const theme = {
        bg: '#0f172a',
        text: '#f1f5f9',
        primary: '#00ff00',
        secondary: '#00aaff',
        cardBg: 'rgba(30, 41, 59, 0.95)',
        border: 'rgba(255, 255, 255, 0.1)'
    };

    const sections = [
        { id: 0, title: 'Voting Procedure', icon: <FaVoteYea /> },
        { id: 1, title: 'Voter Eligibility', icon: <FaUserCheck /> },
        { id: 2, title: 'Candidates', icon: <FaUsers /> },
        { id: 3, title: 'Timeline', icon: <FaCalendarAlt /> },
        { id: 4, title: 'Rules', icon: <FaGavel /> },
        { id: 5, title: 'Support', icon: <FaShieldAlt /> }
    ];

    const handlePrint = () => {
        window.print();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '1rem'
                }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            width: '100%',
                            maxWidth: '900px',
                            height: '90vh',
                            background: theme.cardBg,
                            borderRadius: '20px',
                            border: `1px solid ${theme.border}`,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderBottom: `1px solid ${theme.border}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(0, 0, 0, 0.2)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: 'rgba(0, 255, 0, 0.1)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: `1px solid ${theme.primary}`
                                }}>
                                    <FaClipboardCheck style={{ fontSize: '1.5rem', color: theme.primary }} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                                        VOTER'S GUIDE
                                    </h2>
                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
                                        Official HUSUMS Election Handbook 2025
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={handlePrint}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: `1px solid ${theme.border}`,
                                        color: '#cbd5e1',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s'
                                    }}
                                    className="print-btn"
                                >
                                    <FaPrint /> Print Guide
                                </button>
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        fontSize: '1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0.5rem',
                                        borderRadius: '50%',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={e => { e.target.style.background = 'rgba(255, 255, 255, 0.1)'; e.target.style.color = '#fff'; }}
                                    onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = '#94a3b8'; }}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            padding: '1.5rem 2rem 0 2rem',
                            borderBottom: `1px solid ${theme.border}`,
                            overflowX: 'auto',
                            background: 'rgba(0, 0, 0, 0.1)',
                            flexWrap: 'nowrap',
                            overflowY: 'hidden',
                            paddingBottom: '2.5rem'
                        }}>
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    style={{
                                        background: activeSection === section.id ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                        border: 'none',
                                        borderBottom: activeSection === section.id ? `3px solid ${theme.primary}` : '3px solid transparent',
                                        padding: '0.8rem 1.2rem',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.8rem',
                                        fontSize: '0.95rem',
                                        fontWeight: '800',
                                        transition: 'all 0.3s',
                                        whiteSpace: 'nowrap',
                                        borderRadius: '8px 8px 0 0',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                        border: activeSection !== section.id ? `1px solid rgba(255,255,255,0.1)` : 'none'
                                    }}
                                >
                                    <span style={{ color: activeSection === section.id ? theme.primary : '#cbd5e1' }}>
                                        {section.icon}
                                    </span>
                                    {section.title}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '2rem',
                            marginTop: '1rem'
                        }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeSection === 0 && (
                                        <div>
                                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '2rem', color: theme.text }}>
                                                🗳️ HOW TO VOTE
                                            </h3>

                                            <div style={{ display: 'grid', gap: '2rem' }}>
                                                {[
                                                    {
                                                        step: 1,
                                                        title: 'Login & Verification',
                                                        desc: 'Log in with your Student ID and Password. The system will automatically verify your eligibility status.',
                                                        icon: <FaLock />
                                                    },
                                                    {
                                                        step: 2,
                                                        title: 'Select Candidates',
                                                        desc: 'Browse through positions. You can view candidate manifestos and profiles before making a selection.',
                                                        icon: <FaUserCheck />
                                                    },
                                                    {
                                                        step: 3,
                                                        title: 'Review Selection',
                                                        desc: 'Review your choices carefully. You cannot change your vote once submitted.',
                                                        icon: <FaFileAlt />
                                                    },
                                                    {
                                                        step: 4,
                                                        title: 'Confirm & Submit',
                                                        desc: 'Enter your unique voting PIN sent to your email/phone to confirm and cast your vote.',
                                                        icon: <FaVoteYea />
                                                    }
                                                ].map((item) => (
                                                    <div key={item.step} style={{
                                                        display: 'flex',
                                                        gap: '1.5rem',
                                                        padding: '1.5rem',
                                                        background: 'rgba(255, 255, 255, 0.03)',
                                                        borderRadius: '15px',
                                                        border: `1px solid ${theme.border}`,
                                                        alignItems: 'flex-start'
                                                    }}>
                                                        <div style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '50%',
                                                            background: theme.primary,
                                                            color: '#000',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            fontSize: '1.2rem',
                                                            fontWeight: 'bold',
                                                            flexShrink: 0
                                                        }}>
                                                            {item.step}
                                                        </div>
                                                        <div>
                                                            <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: theme.text }}>
                                                                {item.title}
                                                            </h4>
                                                            <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                                                                {item.desc}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0, 255, 0, 0.05)', borderRadius: '15px', border: `1px solid ${theme.primary}` }}>
                                                <h4 style={{ color: theme.primary, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                                    <FaCheckCircle /> Voting Confirmation
                                                </h4>
                                                <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>After voting, you will receive:</p>
                                                <ul style={{ paddingLeft: '1.5rem', margin: 0, color: '#94a3b8' }}>
                                                    <li>Unique voting receipt number</li>
                                                    <li>Confirmation timestamp</li>
                                                    <li>No indication of candidate choice (secret ballot)</li>
                                                    <li>Email/SMS confirmation</li>
                                                </ul>
                                            </div>

                                            {/* About Student Elections */}
                                            <div style={{ marginTop: '3rem', marginBottom: '2rem' }}>
                                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', color: theme.primary, borderBottom: `1px solid ${theme.border}`, paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <FaBook /> ABOUT STUDENT ELECTIONS
                                                </h3>

                                                {/* Intro */}
                                                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                    <h4 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>🎯 THE HEARTBEAT OF STUDENT DEMOCRACY</h4>
                                                    <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                                                        Our elections represent the foundation of student governance at Haramaya University. Established under the authority of Articles 67-69 of our Constitution, these democratic processes ensure every student's voice is heard, respected, and represented in union affairs.
                                                    </p>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                                    {/* Constitutional Foundation */}
                                                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                        <h4 style={{ color: '#00aaff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <FaGavel /> CONSTITUTIONAL FOUNDATION
                                                        </h4>
                                                        <div style={{ marginBottom: '1rem' }}>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>LEGAL BASIS: ARTICLES 67-69</strong>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                                                                <li style={{ marginBottom: '0.5rem' }}><strong>Article 67:</strong> Establishes an Independent Elections Council as an impartial organ for administering all union elections according to constitutional provisions and electoral law.</li>
                                                                <li style={{ marginBottom: '0.5rem' }}><strong>Article 68:</strong> Defines Council membership requirements - representatives from each College/Institute, excluding current union officials to ensure neutrality.</li>
                                                                <li><strong>Article 69:</strong> References the Electoral Law of the Union which details election procedures, conditions, and requirements for candidates and voters.</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>CORE PRINCIPLES</strong>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                                                                <li><strong>Free & Fair:</strong> Every election conducted without interference or bias</li>
                                                                <li><strong>Periodic:</strong> Regular elections as mandated by constitution</li>
                                                                <li><strong>Transparent:</strong> Open processes with verifiable results</li>
                                                                <li><strong>Accountable:</strong> Elections Council reports to General Assembly</li>
                                                                <li><strong>Inclusive:</strong> Special representation guaranteed (Articles 70-71)</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* Election Frequency */}
                                                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                        <h4 style={{ color: '#f59e0b', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <FaCalendarAlt /> ELECTION FREQUENCY
                                                        </h4>
                                                        <div style={{ marginBottom: '1rem' }}>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>TERM DURATION</strong>
                                                            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Every 2 Years for most positions:</p>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                                                                <li>President, VP, Secretary (Article 24)</li>
                                                                <li>General Assembly members (Article 18)</li>
                                                                <li>Senate members (Article 21)</li>
                                                                <li>Department Heads (Article 33)</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>ELECTION CYCLE</strong>
                                                            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Aligned with Article 20 General Assembly meetings:</p>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                                                                <li><strong>Third Meeting:</strong> Appointment of Election Board members</li>
                                                                <li><strong>Campaign Period:</strong> Following established timelines</li>
                                                                <li><strong>Voting Period:</strong> Designated election days</li>
                                                                <li><strong>Fourth Meeting:</strong> Inauguration of new leadership</li>
                                                                <li><strong>Transition:</strong> Official handover ceremony</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* Independent Oversight */}
                                                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                        <h4 style={{ color: '#ec4899', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <FaShieldAlt /> INDEPENDENT OVERSIGHT
                                                        </h4>
                                                        <div style={{ marginBottom: '1rem' }}>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>ELECTIONS COUNCIL AUTHORITY</strong>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                                                                <li><strong>Mandate:</strong> Article 67 establishes complete independence</li>
                                                                <li><strong>Composition:</strong> One representative per College/Institute (Article 68)</li>
                                                                <li><strong>Accountability:</strong> Directly to General Assembly only</li>
                                                                <li><strong>Impartiality:</strong> No current union officials allowed (Article 68)</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>OVERSIGHT FUNCTIONS</strong>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                                                                <li>Administer all election processes</li>
                                                                <li>Verify candidate eligibility</li>
                                                                <li>Monitor campaign activities</li>
                                                                <li>Supervise voting procedures</li>
                                                                <li>Count and verify results</li>
                                                                <li>Handle election complaints</li>
                                                                <li>Declare official outcomes</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* Core Election Principles */}
                                                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                        <h4 style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <FaCheckCircle /> CORE ELECTION PRINCIPLES
                                                        </h4>
                                                        <div style={{ marginBottom: '1rem' }}>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>FREE ELECTIONS</strong>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                                                                <li>No coercion or intimidation</li>
                                                                <li>Equal opportunity for all candidates</li>
                                                                <li>Accessible voting for all students</li>
                                                                <li>Freedom to campaign within guidelines</li>
                                                            </ul>
                                                        </div>
                                                        <div style={{ marginBottom: '1rem' }}>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>FAIR ELECTIONS</strong>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                                                                <li>Level playing field for all candidates</li>
                                                                <li>Equal media access</li>
                                                                <li>Campaign spending limits</li>
                                                                <li>Neutral election administration</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>TRANSPARENT ELECTIONS</strong>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                                                                <li>Open nomination process</li>
                                                                <li>Public candidate information</li>
                                                                <li>Observable vote counting</li>
                                                                <li>Publishable results</li>
                                                                <li>Complaint mechanism (Articles 56-57)</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Democratic Processes */}
                                                <div style={{ marginTop: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                    <h4 style={{ color: '#3b82f6', fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        🗳️ DEMOCRATIC PROCESSES
                                                    </h4>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                                        <div>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>1. UNION EXECUTIVE ELECTIONS</strong>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                                                                <li><strong>Positions:</strong> President, Vice President, General Secretary</li>
                                                                <li><strong>Authority:</strong> Articles 26, 28, 30</li>
                                                                <li><strong>Process:</strong> Elected by General Assembly</li>
                                                                <li><strong>Term:</strong> 2 years (Article 24)</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>2. DEPARTMENT REPRESENTATIVE ELECTIONS</strong>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                                                                <li><strong>Positions:</strong> Heads of 10 Subsidiary Organs (Article 32)</li>
                                                                <li><strong>Authority:</strong> Article 33</li>
                                                                <li><strong>Process:</strong> President recommends, General Assembly approves</li>
                                                                <li><strong>Departments:</strong> Academic, Student Services, Diversity, Female Students, Special Needs, Discipline, Clubs & Societies, Sports, Public Relations, Treasury</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>3. SPECIAL REFERENDUMS</strong>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                                                                <li><strong>Purpose:</strong> Major union decisions requiring student input</li>
                                                                <li><strong>Authority:</strong> General Assembly discretion</li>
                                                                <li><strong>Process:</strong> University-wide voting on specific issues</li>
                                                                <li><strong>Examples:</strong> Constitution amendments, major policy changes</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>4. SENATE MEMBER ELECTIONS</strong>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                                                                <li><strong>Composition:</strong> Article 21</li>
                                                                <li><strong>Includes:</strong> Department heads + Higher Management</li>
                                                                <li><strong>Special Seats:</strong> Girls' Union & Special Needs Club representatives</li>
                                                                <li><strong>Term:</strong> 2 years (Article 21)</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                                                    {/* Special Provisions */}
                                                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                        <h4 style={{ color: '#8b5cf6', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <FaUsers /> SPECIAL PROVISIONS
                                                        </h4>
                                                        <div style={{ marginBottom: '1rem' }}>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>AFFIRMATIVE ACTION</strong>
                                                            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Article 71: Special attention for:</p>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                                                                <li>Female students</li>
                                                                <li>Students with disabilities</li>
                                                                <li>Students from specific regions</li>
                                                                <li>Reserved seats in union organs</li>
                                                            </ul>
                                                        </div>
                                                        <div style={{ marginBottom: '1rem' }}>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>PHYSICALLY CHALLENGED STUDENTS</strong>
                                                            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Article 70: Guarantees:</p>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                                                                <li>Accessible voting facilities</li>
                                                                <li>Special voting assistance</li>
                                                                <li>Equal participation opportunities</li>
                                                                <li>Supportive election environment</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>COMPLAINT MECHANISM</strong>
                                                            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Articles 56-57: Independent Complaint & Inspection Body:</p>
                                                            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                                                                <li>Investigates election irregularities</li>
                                                                <li>Reviews election complaints</li>
                                                                <li>Makes recommendations to General Assembly</li>
                                                                <li>Ensures constitutional compliance</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* Related Constitutional Articles & Election Support */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                            <h4 style={{ color: '#00aaff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <FaBook /> RELATED CONSTITUTIONAL ARTICLES
                                                            </h4>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                                <div>
                                                                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>VOTER RIGHTS</strong>
                                                                    <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                                                        <li>Art 11: Membership</li>
                                                                        <li>Art 13: Non-discrimination</li>
                                                                        <li>Art 14: Vote & Elected</li>
                                                                        <li>Art 15: Duties</li>
                                                                    </ul>
                                                                </div>
                                                                <div>
                                                                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>ELECTION INTEGRITY</strong>
                                                                    <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                                                        <li>Art 16: Free & Fair</li>
                                                                        <li>Art 56-57: Complaints</li>
                                                                        <li>Art 61-66: Ombudsman</li>
                                                                        <li>Art 70-71: Protections</li>
                                                                    </ul>
                                                                </div>
                                                                <div>
                                                                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>LEADERSHIP ACCOUNTABILITY</strong>
                                                                    <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                                                        <li>Art 18: GA Authority</li>
                                                                        <li>Art 20: Inauguration</li>
                                                                        <li>Art 33: Appointments</li>
                                                                        <li>Art 67-69: Admin</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}`, flex: 1 }}>
                                                            <h4 style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <FaPhone /> ELECTION SUPPORT
                                                            </h4>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                                                <div>
                                                                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>STUDENT RESOURCES</strong>
                                                                    <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                                                        <li>Election Guides</li>
                                                                        <li>Candidate Info</li>
                                                                        <li>FAQ Section</li>
                                                                        <li>Live Support</li>
                                                                    </ul>
                                                                </div>
                                                                <div>
                                                                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>TECHNICAL ASSISTANCE</strong>
                                                                    <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                                                        <li>Voting System</li>
                                                                        <li>Mobile Access</li>
                                                                        <li>Offline Options</li>
                                                                        <li>Accessibility</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <div style={{ fontSize: '0.9rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                                                                <p style={{ margin: '0.2rem 0' }}>📧 elections@husums.edu.et</p>
                                                                <p style={{ margin: '0.2rem 0' }}>📧 inspection@husums.edu.et</p>
                                                                <p style={{ margin: '0.2rem 0' }}>📞 Campus security hotline</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Button Description */}
                                                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                                    <p style={{ color: '#cbd5e1', marginBottom: '1rem', maxWidth: '600px', margin: '0 auto 1rem auto', lineHeight: '1.6' }}>
                                                        Explore the full legal framework governing our democratic processes and understand your rights and responsibilities as a voting member of Haramaya University Students' Union.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Read Constitution Button - Updated */}
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    setTimeout(onOpenConstitution, 300);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    marginTop: '1rem',
                                                    padding: '1.2rem',
                                                    background: 'transparent',
                                                    border: `2px solid ${theme.primary}`,
                                                    borderRadius: '50px',
                                                    color: theme.primary,
                                                    fontSize: '1.1rem',
                                                    fontWeight: '800',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.8rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px'
                                                }}
                                                onMouseOver={e => {
                                                    e.target.style.background = theme.primary;
                                                    e.target.style.color = '#000';
                                                    e.target.style.boxShadow = `0 0 25px ${theme.primary}60`;
                                                    e.target.style.transform = 'translateY(-2px)';
                                                }}
                                                onMouseOut={e => {
                                                    e.target.style.background = 'transparent';
                                                    e.target.style.color = theme.primary;
                                                    e.target.style.boxShadow = 'none';
                                                    e.target.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                <FaBook /> READ FULL ELECTION CONSTITUTION
                                            </button>
                                        </div>
                                    )}

                                    {activeSection === 1 && (
                                        <div>
                                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '2rem', color: theme.text }}>
                                                📋 VOTER ELIGIBILITY
                                            </h3>

                                            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: theme.primary }}>
                                                    According to Article 11 of the Constitution
                                                </h4>
                                                <div style={{ display: 'grid', gap: '1rem' }}>
                                                    {[
                                                        'All regular undergraduate students of Haramaya University',
                                                        'Automatically union members upon admission',
                                                        'Must have paid annual membership fee (Article 15)',
                                                        'No discrimination based on ethnicity, gender, religion, or disability (Article 13)'
                                                    ].map((item, i) => (
                                                        <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.8rem', padding: '1rem', background: 'rgba(0, 255, 0, 0.05)', borderRadius: '10px' }}>
                                                            <FaCheckCircle style={{ color: theme.primary, marginTop: '0.2rem', flexShrink: 0 }} />
                                                            <span style={{ color: '#cbd5e1' }}>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#3b82f6' }}>
                                                    Eligibility Verification
                                                </h4>
                                                <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>System automatically checks:</p>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                                    {[
                                                        'Active student status',
                                                        'Membership fee payment status',
                                                        'No ongoing disciplinary actions',
                                                        'Registration in current semester'
                                                    ].map((item, i) => (
                                                        <div key={i} style={{ padding: '0.8rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px', borderLeft: `3px solid ${theme.primary}` }}>
                                                            <FaCheck style={{ color: theme.primary, marginRight: '0.5rem' }} />
                                                            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 2 && (
                                        <div>
                                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '2rem', color: theme.text }}>
                                                👥 CANDIDATE INFORMATION
                                            </h3>

                                            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: theme.primary }}>
                                                    According to Article 33
                                                </h4>
                                                <ul style={{ paddingLeft: '1.5rem', margin: 0, color: '#cbd5e1', lineHeight: '2' }}>
                                                    <li>All candidates nominated by President (for department heads)</li>
                                                    <li>Approved by General Assembly</li>
                                                    <li>Manifestos and profiles available online</li>
                                                    <li>Campaign materials as per election guidelines</li>
                                                </ul>
                                            </div>

                                            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#3b82f6' }}>
                                                    Candidate Requirements
                                                </h4>
                                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                                    <div>
                                                        <strong style={{ color: '#10b981', display: 'block', marginBottom: '0.5rem' }}>For President/VP/Secretary:</strong>
                                                        <ul style={{ paddingLeft: '1.5rem', margin: 0, color: '#94a3b8' }}>
                                                            <li>Member of General Assembly</li>
                                                            <li>Highest vote in election (Article 26)</li>
                                                            <li>Good academic standing</li>
                                                            <li>No disciplinary record</li>
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <strong style={{ color: '#8b5cf6', display: 'block', marginBottom: '0.5rem' }}>For Department Heads:</strong>
                                                        <ul style={{ paddingLeft: '1.5rem', margin: 0, color: '#94a3b8' }}>
                                                            <li>Recommended by President (Article 33)</li>
                                                            <li>Approved by General Assembly</li>
                                                            <li>Member of General Assembly</li>
                                                            <li>Department-relevant experience</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 3 && (
                                        <div>
                                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '2rem', color: theme.text }}>
                                                📅 ELECTION TIMELINE 2025
                                            </h3>

                                            {[
                                                {
                                                    phase: 'PHASE 1: NOMINATION PERIOD',
                                                    dates: 'Nov 1-10, 2025',
                                                    color: '#10b981',
                                                    items: [
                                                        'Presidential, VP, and Secretary nominations open',
                                                        'Department head nominations (Article 33)',
                                                        'Eligibility verification by Elections Council',
                                                        'Submission of candidate profiles and manifestos'
                                                    ]
                                                },
                                                {
                                                    phase: 'PHASE 2: CAMPAIGN PERIOD',
                                                    dates: 'Nov 11-24, 2025',
                                                    color: '#3b82f6',
                                                    items: [
                                                        'Approved campaign materials only',
                                                        'Equal media access for all candidates',
                                                        'No negative campaigning',
                                                        'Campaign finance limits apply',
                                                        'Digital and physical campaigning allowed'
                                                    ]
                                                },
                                                {
                                                    phase: 'PHASE 3: VOTING PERIOD',
                                                    dates: 'Nov 25-Dec 5, 2025',
                                                    color: '#f59e0b',
                                                    items: [
                                                        'Daily: 6:00 AM - 10:00 PM (EAT)',
                                                        'Extended Hours: Last 3 days until midnight',
                                                        'Multiple Platforms: Web, mobile, designated voting centers'
                                                    ]
                                                },
                                                {
                                                    phase: 'PHASE 4: RESULTS DECLARATION',
                                                    dates: 'Dec 7, 2025',
                                                    color: '#ec4899',
                                                    items: [
                                                        'Vote counting by Elections Council',
                                                        'Results verification',
                                                        'Complaint period (48 hours)',
                                                        'Official declaration by Elections Council President',
                                                        'Inauguration ceremony (per Article 20)'
                                                    ]
                                                }
                                            ].map((phase, idx) => (
                                                <div key={idx} style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '15px', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${phase.color}` }}>
                                                    <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem', color: phase.color, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <FaCalendarAlt /> {phase.phase}
                                                    </h4>
                                                    <p style={{ color: '#94a3b8', marginBottom: '1rem', fontWeight: '600' }}>{phase.dates}</p>
                                                    <ul style={{ paddingLeft: '1.5rem', margin: 0, color: '#cbd5e1' }}>
                                                        {phase.items.map((item, i) => (
                                                            <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}

                                            {/* Key Dates */}
                                            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 170, 255, 0.1))', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: theme.primary }}>
                                                    📢 KEY DATES TO REMEMBER
                                                </h4>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                                                    {[
                                                        { label: 'Nominations open', date: 'Nov 1' },
                                                        { label: 'Nominations close', date: 'Nov 10' },
                                                        { label: 'Campaign begins', date: 'Nov 11' },
                                                        { label: 'Campaign ends', date: 'Nov 24' },
                                                        { label: 'Voting opens', date: 'Nov 25' },
                                                        { label: 'Voting closes', date: 'Dec 5' },
                                                        { label: 'Results verification', date: 'Dec 6-7' },
                                                        { label: 'Results declaration', date: 'Dec 7' }
                                                    ].map((item, i) => (
                                                        <div key={i} style={{ padding: '0.8rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', textAlign: 'center' }}>
                                                            <div style={{ color: theme.secondary, fontWeight: '700', fontSize: '1.1rem' }}>{item.date}</div>
                                                            <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.3rem' }}>{item.label}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 4 && (
                                        <div>
                                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '2rem', color: theme.text }}>
                                                ⚖️ RULES & REGULATIONS
                                            </h3>

                                            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: theme.primary }}>
                                                    Constitutional Requirements
                                                </h4>
                                                <ul style={{ paddingLeft: '1.5rem', margin: 0, color: '#cbd5e1', lineHeight: '2' }}>
                                                    <li><strong>Article 14(3):</strong> Right to vote and be elected</li>
                                                    <li><strong>Article 16:</strong> Free, fair, periodic elections</li>
                                                    <li><strong>Article 33:</strong> Department head election procedures</li>
                                                    <li><strong>Article 67-69:</strong> Elections Council authority</li>
                                                </ul>
                                            </div>

                                            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#3b82f6' }}>
                                                    Voter Responsibilities
                                                </h4>
                                                <ul style={{ paddingLeft: '1.5rem', margin: 0, color: '#cbd5e1', lineHeight: '2' }}>
                                                    <li>Verify your information before voting</li>
                                                    <li>Report any irregularities immediately</li>
                                                    <li>Respect other voters' privacy</li>
                                                    <li>Follow polling station rules</li>
                                                </ul>
                                            </div>

                                            <div style={{ padding: '1.5rem', background: 'rgba(255, 0, 0, 0.1)', borderRadius: '15px', border: '1px solid rgba(255, 0, 0, 0.3)' }}>
                                                <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <FaExclamationTriangle /> Important Disclaimers
                                                </h4>
                                                <ul style={{ paddingLeft: '1.5rem', margin: 0, color: '#fca5a5', lineHeight: '2' }}>
                                                    <li>Voting is compulsory for all eligible students</li>
                                                    <li>Vote selling/buying is strictly prohibited</li>
                                                    <li>Multiple voting attempts will be blocked</li>
                                                    <li>Results are final after complaint period</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 5 && (
                                        <div>
                                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '2rem', color: theme.text }}>
                                                🛡️ SECURITY & SUPPORT
                                            </h3>

                                            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: theme.primary }}>
                                                    Election Integrity Measures
                                                </h4>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                                    {[
                                                        { icon: <FaLock />, title: 'Real-time Monitoring', desc: 'Vote monitoring' },
                                                        { icon: <FaShieldAlt />, title: 'Backup Systems', desc: 'Multiple backups' },
                                                        { icon: <FaLock />, title: 'Cybersecurity', desc: 'Protected systems' },
                                                        { icon: <FaCheckCircle />, title: 'Verification', desc: 'Physical ballot option' }
                                                    ].map((item, i) => (
                                                        <div key={i} style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px', borderLeft: `3px solid ${theme.primary}` }}>
                                                            <div style={{ color: theme.primary, fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                                                            <div style={{ color: '#cbd5e1', fontWeight: '700', marginBottom: '0.3rem' }}>{item.title}</div>
                                                            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{item.desc}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#3b82f6' }}>
                                                    🆘 Help Centers
                                                </h4>
                                                <div style={{ display: 'grid', gap: '1rem' }}>
                                                    <div style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                                                        <FaInfoCircle style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
                                                        <strong style={{ color: '#cbd5e1' }}>Main Campus:</strong>
                                                        <span style={{ color: '#94a3b8', marginLeft: '0.5rem' }}>Union Office, Admin Building</span>
                                                    </div>
                                                    <div style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                                                        <FaEnvelope style={{ color: '#10b981', marginRight: '0.5rem' }} />
                                                        <strong style={{ color: '#cbd5e1' }}>Email:</strong>
                                                        <span style={{ color: '#94a3b8', marginLeft: '0.5rem' }}>elections@husums.edu.et</span>
                                                    </div>
                                                    <div style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                                                        <FaPhone style={{ color: '#f59e0b', marginRight: '0.5rem' }} />
                                                        <strong style={{ color: '#cbd5e1' }}>Hotline:</strong>
                                                        <span style={{ color: '#94a3b8', marginLeft: '0.5rem' }}>+251-XXX-XXXX (8 AM - 8 PM)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                                <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#8b5cf6' }}>
                                                    Accessibility Features (Articles 70-71)
                                                </h4>
                                                <ul style={{ paddingLeft: '1.5rem', margin: 0, color: '#cbd5e1', lineHeight: '2' }}>
                                                    <li>Special voting assistance for disabled students</li>
                                                    <li>Language support (Amharic/English)</li>
                                                    <li>Mobile voting for remote students</li>
                                                    <li>Extended hours for special needs</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderTop: `1px solid ${theme.border}`,
                            background: 'rgba(0, 0, 0, 0.2)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                <div><strong>Issued by:</strong> HUSUMS Elections Council</div>
                                <div><strong>Date:</strong> October 15, 2025</div>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', textAlign: 'right' }}>
                                <div>⚠️ Your vote shapes your union's future.</div>
                                <div><strong>Vote responsibly!</strong></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default VotersGuideModal;
