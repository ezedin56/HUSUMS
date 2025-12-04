import { useState } from 'react';
import { FaTimes, FaCheckCircle, FaBook, FaGavel, FaLock, FaCalendarAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';

const HowItWorksModal = ({ isOpen, onClose, initialTab = 'eligibility' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    if (!isOpen) return null;

    const theme = {
        primary: '#00ff00',
        secondary: '#00aaff',
        bg: '#0f172a',
        cardBg: 'rgba(30, 41, 59, 0.95)',
        text: '#f1f5f9',
        border: 'rgba(255, 255, 255, 0.1)'
    };

    const tabs = [
        { id: 'eligibility', label: 'Check Eligibility', icon: <FaCheckCircle /> },
        { id: 'contact', label: 'Contact Committee', icon: <FaPhone /> },
        { id: 'security', label: 'Security', icon: <FaLock /> },
        { id: 'timeline', label: 'Election Cycle', icon: <FaCalendarAlt /> }
    ];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', overflowY: 'auto'
        }} onClick={onClose}>
            <div style={{
                background: theme.cardBg, borderRadius: '25px',
                maxWidth: '900px', width: '100%', maxHeight: '90vh',
                border: `1px solid ${theme.border}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                display: 'flex', flexDirection: 'column', position: 'relative'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ padding: '2rem', borderBottom: `1px solid ${theme.border}`, position: 'relative' }}>
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '1.5rem', right: '1.5rem',
                        background: 'rgba(255, 255, 255, 0.1)', border: 'none',
                        color: theme.text, fontSize: '1.5rem', cursor: 'pointer',
                        width: '40px', height: '40px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s'
                    }} onMouseOver={e => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                        onMouseOut={e => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}>
                        <FaTimes />
                    </button>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: theme.primary, marginBottom: '0.5rem' }}>
                        GET INVOLVED IN DEMOCRACY
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>HOW IT WORKS</p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem 2rem', borderBottom: `1px solid ${theme.border}`, overflowX: 'auto' }}>
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                            padding: '1rem 2rem', borderRadius: '50px',
                            background: activeTab === tab.id ? theme.primary : 'rgba(255, 255, 255, 0.05)',
                            color: activeTab === tab.id ? '#000' : theme.text,
                            border: activeTab === tab.id ? 'none' : `1px solid ${theme.border}`,
                            fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem',
                            whiteSpace: 'nowrap'
                        }}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>

                    {/* ELIGIBILITY TAB */}
                    {activeTab === 'eligibility' && (
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: theme.primary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaCheckCircle /> WHO CAN PARTICIPATE?
                            </h3>
                            <p style={{ marginBottom: '1.5rem', color: '#cbd5e1' }}>According to Article 11 & Article 14:</p>

                            {/* To VOTE */}
                            <div style={{ background: 'rgba(0, 255, 0, 0.05)', padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem', border: `1px solid rgba(0, 255, 0, 0.2)` }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: theme.primary, marginBottom: '1rem' }}>To VOTE:</h4>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                        <FaCheckCircle style={{ color: theme.primary, marginTop: '0.2rem', flexShrink: 0 }} />
                                        <span>All regular undergraduate students of Haramaya University</span>
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                        <FaCheckCircle style={{ color: theme.primary, marginTop: '0.2rem', flexShrink: 0 }} />
                                        <span>Automatically union members upon admission</span>
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                        <FaCheckCircle style={{ color: theme.primary, marginTop: '0.2rem', flexShrink: 0 }} />
                                        <span>Must have paid annual membership fee (Article 15)</span>
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                        <FaCheckCircle style={{ color: theme.primary, marginTop: '0.2rem', flexShrink: 0 }} />
                                        <span>No discrimination (Article 13)</span>
                                    </li>
                                </ul>
                            </div>

                            {/* To RUN FOR OFFICE */}
                            <div style={{ background: 'rgba(0, 170, 255, 0.05)', padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem', border: `1px solid rgba(0, 170, 255, 0.2)` }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: theme.secondary, marginBottom: '1rem' }}>To RUN FOR OFFICE:</h4>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>For President (Article 26):</strong>
                                    <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1' }}>
                                        <li>Must be member of General Assembly</li>
                                        <li>Must receive highest votes in election</li>
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>For Vice President (Article 28):</strong>
                                    <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1' }}>
                                        <li>Must be member of General Assembly</li>
                                        <li>Directly elected by General Assembly</li>
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>For General Secretary (Article 30):</strong>
                                    <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1' }}>
                                        <li>Must be member of General Assembly</li>
                                        <li>Directly elected by General Assembly</li>
                                    </ul>
                                </div>

                                <div>
                                    <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>For Department Heads (Article 33):</strong>
                                    <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1' }}>
                                        <li>Must be member of General Assembly</li>
                                        <li>Recommended by President</li>
                                        <li>Approved by General Assembly</li>
                                    </ul>
                                </div>
                            </div>

                            {/* TERM LIMITS */}
                            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '1rem' }}>TERM LIMITS</h4>
                                <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <li>2-year term for most positions (Articles 18, 21, 24)</li>
                                    <li>Maximum 2 terms for re-election</li>
                                    <li>Special exception: General Assembly members may continue with vote of confidence</li>
                                </ul>
                            </div>

                            {/* ELECTION COUNCIL OVERSIGHT */}
                            <div style={{ marginTop: '2rem', background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FaGavel /> ELECTION COUNCIL OVERSIGHT
                                </h4>
                                <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>According to Articles 67-69:</p>
                                <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <li>Independent Elections Council administers all elections</li>
                                    <li>Accountable only to General Assembly</li>
                                    <li>Ensures free and fair elections</li>
                                    <li>Each college/institute has one representative</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* CONTACT TAB */}
                    {activeTab === 'contact' && (
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: theme.primary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaPhone /> CONTACT ELECTION COMMITTEE
                            </h3>

                            {/* Independent Elections Council */}
                            <div style={{ background: 'rgba(0, 255, 0, 0.05)', padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem', border: `1px solid rgba(0, 255, 0, 0.2)` }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: theme.primary, marginBottom: '1rem' }}>INDEPENDENT ELECTIONS COUNCIL</h4>
                                <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}><strong>Authority:</strong> Article 67-69</p>
                                <p style={{ marginBottom: '0.5rem', color: '#fff', fontWeight: '600' }}>Responsibilities:</p>
                                <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <li>Administer all union elections</li>
                                    <li>Verify candidate eligibility</li>
                                    <li>Manage election timeline</li>
                                    <li>Declare official results</li>
                                    <li>Handle election complaints</li>
                                </ul>
                            </div>

                            {/* Contact Points */}
                            <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '1rem' }}>CONTACT POINTS</h4>

                            <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                    <strong style={{ color: theme.secondary, display: 'block', marginBottom: '0.75rem' }}>Before Elections:</strong>
                                    <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <li>Nomination Submission: Submit candidate applications</li>
                                        <li>Eligibility Verification: Check if you meet requirements</li>
                                        <li>Campaign Guidelines: Get approval for campaign materials</li>
                                        <li>Manifesto Submission: Submit election promises</li>
                                    </ul>
                                </div>

                                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                    <strong style={{ color: theme.secondary, display: 'block', marginBottom: '0.75rem' }}>During Elections:</strong>
                                    <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <li>Technical Issues: Voting system problems</li>
                                        <li>Eligibility Questions: Voting rights clarification</li>
                                        <li>Complaints: Report election irregularities</li>
                                        <li>Accessibility: Special voting arrangements</li>
                                    </ul>
                                </div>

                                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                    <strong style={{ color: theme.secondary, display: 'block', marginBottom: '0.75rem' }}>After Elections:</strong>
                                    <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <li>Result Inquiries: Questions about vote counting</li>
                                        <li>Complaints: Challenge election outcomes</li>
                                        <li>Appeals: Formal election disputes</li>
                                        <li>Certification: Official result documentation</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Contact Methods */}
                            <div style={{ background: 'rgba(0, 170, 255, 0.05)', padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem', border: `1px solid rgba(0, 170, 255, 0.2)` }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: theme.secondary, marginBottom: '1rem' }}>CONTACT METHODS</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FaEnvelope style={{ color: theme.secondary }} />
                                        <span><strong>Email:</strong> elections@husums.edu.et</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FaMapMarkerAlt style={{ color: theme.secondary }} />
                                        <span><strong>Office:</strong> Union Building, Main Campus</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FaPhone style={{ color: theme.secondary }} />
                                        <span><strong>Hotline:</strong> +251-XXX-XXXX</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FaMapMarkerAlt style={{ color: theme.secondary }} />
                                        <span><strong>In-Person:</strong> Designated election centers on all campuses</span>
                                    </div>
                                </div>
                            </div>

                            {/* Complaint Process */}
                            <div style={{ background: 'rgba(255, 0, 0, 0.05)', padding: '1.5rem', borderRadius: '15px', border: `1px solid rgba(255, 0, 0, 0.2)` }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ff6b6b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FaExclamationTriangle /> COMPLAINT PROCESS
                                </h4>
                                <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>Per Articles 56-57 (Complaint & Inspection Body):</p>
                                <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <li>Submit written complaint within 48 hours</li>
                                    <li>Independent investigation by Complaint & Inspection Body</li>
                                    <li>Decision within 72 hours</li>
                                    <li>Right to appeal to General Assembly</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: theme.primary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaLock /> ENCRYPTED SYSTEM PROTECTIONS
                            </h3>

                            {/* Constitutional Guarantees */}
                            <div style={{ background: 'rgba(0, 255, 0, 0.05)', padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem', border: `1px solid rgba(0, 255, 0, 0.2)` }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: theme.primary, marginBottom: '1rem' }}>ELECTION SECURITY MEASURES</h4>
                                <p style={{ marginBottom: '1rem', color: '#fff', fontWeight: '600' }}>Constitutional Guarantees:</p>
                                <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <li>Article 16: Free and fair elections</li>
                                    <li>Article 14: Right to secret ballot</li>
                                    <li>Article 67: Independent election administration</li>
                                    <li>Article 56: Complaint investigation mechanism</li>
                                </ul>
                            </div>

                            {/* Technical Safeguards */}
                            <div style={{ background: 'rgba(0, 170, 255, 0.05)', padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem', border: `1px solid rgba(0, 170, 255, 0.2)` }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: theme.secondary, marginBottom: '1rem' }}>TECHNICAL SAFEGUARDS</h4>
                                <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <li><strong>One Student, One Vote:</strong> System prevents multiple voting</li>
                                    <li><strong>Anonymous Voting:</strong> No record of individual choices</li>
                                    <li><strong>Encrypted Ballots:</strong> Secure transmission and storage</li>
                                    <li><strong>Real-time Monitoring:</strong> Elections Council oversight</li>
                                    <li><strong>Backup Systems:</strong> Multiple redundancy protocols</li>
                                </ul>
                            </div>

                            {/* Integrity Checks */}
                            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '1rem' }}>INTEGRITY CHECKS</h4>
                                <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <li><strong>Voter Authentication:</strong> Student ID verification</li>
                                    <li><strong>Eligibility Validation:</strong> Automatic system checks</li>
                                    <li><strong>Vote Counting:</strong> Transparent, verifiable process</li>
                                    <li><strong>Result Audit:</strong> Independent verification available</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* TIMELINE TAB */}
                    {activeTab === 'timeline' && (
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: theme.primary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaCalendarAlt /> ELECTION CYCLE
                            </h3>

                            {/* Key Dates */}
                            <div style={{ background: 'rgba(0, 255, 0, 0.05)', padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem', border: `1px solid rgba(0, 255, 0, 0.2)` }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: theme.primary, marginBottom: '1rem' }}>KEY DATES (Per Constitution)</h4>
                                <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <li><strong>Third Meeting of GA (Article 20):</strong> Election Board appointment</li>
                                    <li><strong>Campaign Period:</strong> As per election calendar</li>
                                    <li><strong>Voting Window:</strong> Designated election days</li>
                                    <li><strong>Result Declaration:</strong> Official announcement</li>
                                    <li><strong>Fourth Meeting of GA (Article 20):</strong> New leadership inauguration</li>
                                </ul>
                            </div>

                            {/* Important Reminders */}
                            <div style={{ background: 'rgba(0, 170, 255, 0.05)', padding: '1.5rem', borderRadius: '15px', border: `1px solid rgba(0, 170, 255, 0.2)` }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: theme.secondary, marginBottom: '1rem' }}>IMPORTANT REMINDERS</h4>
                                <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <li>Elections follow Electoral Law of the Union (Article 69)</li>
                                    <li>Complaint & Inspection Body oversees fairness (Article 56-57)</li>
                                    <li>Students' Ombudsman available for grievances (Article 61-66)</li>
                                    <li>All processes must align with University regulations</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HowItWorksModal;
