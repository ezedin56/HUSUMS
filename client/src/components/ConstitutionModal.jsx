import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBook, FaGavel, FaUsers, FaUniversity, FaShieldAlt,
    FaVoteYea, FaMoneyBillWave, FaInfoCircle, FaTimes,
    FaStar, FaCheckCircle, FaBalanceScale, FaUserGraduate,
    FaHandHoldingHeart, FaChartLine, FaFileAlt
} from 'react-icons/fa';

const ConstitutionModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState(0);

    const theme = {
        bg: '#0f172a',
        text: '#f1f5f9',
        primary: '#00ff00',
        secondary: '#00aaff',
        cardBg: 'rgba(30, 41, 59, 0.95)',
        border: 'rgba(255, 255, 255, 0.1)'
    };

    const tabs = [
        { id: 0, icon: <FaBook />, label: 'Overview', color: theme.primary },
        { id: 1, icon: <FaCheckCircle />, label: 'Rights & Duties', color: '#10b981' },
        { id: 2, icon: <FaUsers />, label: 'Leadership', color: '#3b82f6' },
        { id: 3, icon: <FaUniversity />, label: 'Departments', color: '#8b5cf6' },
        { id: 4, icon: <FaShieldAlt />, label: 'Protections', color: '#ec4899' },
        { id: 5, icon: <FaVoteYea />, label: 'Elections', color: '#f59e0b' },
        { id: 6, icon: <FaMoneyBillWave />, label: 'Finance', color: '#14b8a6' },
        { id: 7, icon: <FaInfoCircle />, label: 'Quick Ref', color: '#6366f1' }
    ];

    const content = [
        // Tab 0: Overview
        {
            title: '📜 QUICK OVERVIEW',
            sections: [
                {
                    title: 'Basic Information',
                    icon: <FaBook />,
                    items: [
                        { label: 'Full Title', value: 'Constitution of Haramaya University Students\' Union, 2017' },
                        { label: 'Adoption Date', value: 'June 20, 2017' },
                        { label: 'Status', value: 'Governing law of the Student Union' },
                        { label: 'Official Language', value: 'English (final legal authority)' }
                    ]
                },
                {
                    title: '🌟 Foundation & Purpose',
                    icon: <FaStar />,
                    items: [
                        { label: 'Vision', value: 'To be a leading Student Union in Ethiopia by 2025' },
                        { label: 'Mission', value: 'Advocate for student needs, create vibrant campus life, enhance academic experience' },
                        { label: 'Membership', value: 'All regular undergraduate students are automatically members' },
                        { label: 'Nature', value: 'Secular, non-partisan, non-profit organization' }
                    ]
                }
            ]
        },
        // Tab 1: Rights & Duties
        {
            title: '⚖️ STUDENT RIGHTS & DUTIES',
            sections: [
                {
                    title: 'Student Rights (Article 14)',
                    icon: <FaBalanceScale />,
                    description: 'Every student has the right to:',
                    list: [
                        'Vote and be elected to union positions',
                        'Submit complaints and grievances',
                        'Access information about union activities',
                        'Participate in clubs, societies, and university events',
                        'Equal treatment without discrimination'
                    ]
                },
                {
                    title: 'Student Duties (Article 15)',
                    icon: <FaGavel />,
                    description: 'Every student must:',
                    list: [
                        'Pay annual membership fee (determined by General Assembly)',
                        'Follow union constitution and decisions',
                        'Respect university property and reputation',
                        'Report misconduct'
                    ]
                }
            ]
        },
        // Tab 2: Leadership
        {
            title: '👥 LEADERSHIP STRUCTURE',
            sections: [
                {
                    title: 'General Assembly (Highest Authority)',
                    icon: <FaUsers />,
                    items: [
                        { label: 'Composition', value: 'Student representatives from all departments/batches' },
                        { label: 'Term', value: '2 years (maximum 2 terms)' },
                        { label: 'Powers', value: 'Legislation, budget approval, impeachment of leaders' }
                    ]
                },
                {
                    title: 'Higher Management (Executive)',
                    icon: <FaUserGraduate />,
                    list: [
                        'President: Highest authority, elected by General Assembly',
                        'Vice President: Assists President, acts in President\'s absence',
                        'General Secretary: Manages documents, meetings, and correspondence',
                        'Campus Representatives: 3 vice presidents for different campuses'
                    ]
                },
                {
                    title: 'Senate',
                    icon: <FaUniversity />,
                    items: [
                        { label: 'Composition', value: 'Heads of subsidiary organs + Higher Management' },
                        { label: 'Role', value: 'Second-highest organ, oversight of daily operations' },
                        { label: 'Meetings', value: 'Every two weeks' }
                    ]
                }
            ]
        },
        // Tab 3: Departments
        {
            title: '🏛️ KEY DEPARTMENTS',
            sections: [
                {
                    title: 'Subsidiary Organs',
                    icon: <FaUniversity />,
                    description: 'Key departments that serve students:',
                    grid: [
                        { name: 'Academic Affairs', desc: 'Academic programs, library services' },
                        { name: 'Student Services', desc: 'Food, housing, transportation' },
                        { name: 'Diversity Affairs', desc: 'Campus harmony and inclusion' },
                        { name: 'Female Students Affairs', desc: 'Gender equality and representation' },
                        { name: 'Special Needs Affairs', desc: 'Support for disabled students' },
                        { name: 'Discipline Affairs', desc: 'Code of conduct enforcement' },
                        { name: 'Clubs & Societies', desc: 'Student organizations management' },
                        { name: 'Sports & Recreation', desc: 'Sports and entertainment' },
                        { name: 'Public Relations', desc: 'Communications and publications' },
                        { name: 'Treasury', desc: 'Financial management' }
                    ]
                }
            ]
        },
        // Tab 4: Special Protections
        {
            title: '🛡️ SPECIAL PROTECTIONS',
            sections: [
                {
                    title: 'Affirmative Action (Article 71)',
                    icon: <FaHandHoldingHeart />,
                    description: 'Female students and students from specific regions (Afar, Somali, Harari, etc.) get:',
                    list: [
                        'Special attention and support',
                        'Reserved seats in union organs',
                        'Preferential access to facilities and mentoring'
                    ]
                },
                {
                    title: 'Physically Challenged Students (Article 70)',
                    icon: <FaShieldAlt />,
                    list: [
                        'Disability-friendly campus facilities',
                        'Priority access to academic materials',
                        'Special training and support programs'
                    ]
                }
            ]
        },
        // Tab 5: Elections
        {
            title: '🗳️ ELECTION SYSTEM & ACCOUNTABILITY',
            sections: [
                {
                    title: 'Election System',
                    icon: <FaVoteYea />,
                    list: [
                        'Independent Elections Council manages all elections',
                        'Free, fair, and periodic elections',
                        'Eligibility criteria defined in electoral law',
                        'Results subject to verification'
                    ]
                },
                {
                    title: 'Accountability Mechanisms',
                    icon: <FaGavel />,
                    subsections: [
                        {
                            name: 'Complaint & Inspection Body',
                            points: [
                                'Independent organ for oversight',
                                'Investigates mismanagement and financial issues',
                                'Makes recommendations to General Assembly'
                            ]
                        },
                        {
                            name: 'Students\' Ombudsman',
                            points: [
                                'Handles grievances against union/university officials',
                                'Protects students from maladministration',
                                'Provides legal assistance when needed'
                            ]
                        }
                    ]
                },
                {
                    title: 'Important Numbers',
                    icon: <FaChartLine />,
                    items: [
                        { label: 'Quorum for General Assembly', value: 'More than half of members' },
                        { label: 'Impeachment votes', value: '2/3 majority required' },
                        { label: 'Amendment approval', value: '2/3 majority required' },
                        { label: 'Department head election', value: '3/4 of General Assembly must be present' }
                    ]
                }
            ]
        },
        // Tab 6: Finance
        {
            title: '💰 FINANCIAL SOURCES',
            sections: [
                {
                    title: 'Revenue Sources',
                    icon: <FaMoneyBillWave />,
                    list: [
                        'Biannual student contributions',
                        'University budget allocation',
                        'Donations from lawful sources',
                        'Income-generating activities'
                    ]
                }
            ]
        },
        // Tab 7: Quick Reference
        {
            title: '📋 QUICK REFERENCE',
            sections: [
                {
                    title: 'For Regular Students',
                    icon: <FaUserGraduate />,
                    list: [
                        'You\'re automatically a union member',
                        'You can vote and run for office',
                        'You must pay membership fees',
                        'You have right to information and complaint submission'
                    ]
                },
                {
                    title: 'For Leaders',
                    icon: <FaUsers />,
                    list: [
                        '2-year term limits (maximum 2 terms)',
                        'Accountable to General Assembly',
                        'Subject to impeachment for misconduct',
                        'Must work for student interests'
                    ]
                },
                {
                    title: 'For Departments',
                    icon: <FaUniversity />,
                    list: [
                        'Each has specific functions',
                        'Heads are appointed by President, approved by General Assembly',
                        'Must submit regular reports',
                        'Work under Higher Management supervision'
                    ]
                },
                {
                    title: 'Where to Find Specific Info',
                    icon: <FaFileAlt />,
                    items: [
                        { label: 'Election Procedures', value: 'Check Electoral Law (separate document)' },
                        { label: 'Club Regulations', value: 'See Clubs and Societies Regulations' },
                        { label: 'Financial Rules', value: 'Treasury Office guidelines' },
                        { label: 'Disciplinary Actions', value: 'Students\' Code of Conduct' }
                    ]
                }
            ]
        }
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(8px)'
                        }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '1000px',
                            maxHeight: '90vh',
                            background: theme.cardBg,
                            backdropFilter: 'blur(20px)',
                            borderRadius: '25px',
                            border: `1px solid ${theme.border}`,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '2rem',
                            borderBottom: `1px solid ${theme.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.1) 0%, rgba(0, 170, 255, 0.1) 100%)'
                        }}>
                            <div>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: '1.8rem',
                                    fontWeight: '800',
                                    color: theme.primary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem'
                                }}>
                                    <FaBook /> HUSUMS Constitution 2017
                                </h2>
                                <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.95rem' }}>
                                    Governing law of Haramaya University Students' Union
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: 'none',
                                    color: theme.text,
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={e => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                                onMouseOut={e => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'nowrap',
                            gap: '1.5rem',
                            padding: '1.5rem 2rem 2.5rem 2rem',
                            borderBottom: `1px solid ${theme.border}`,
                            overflowX: 'auto',
                            overflowY: 'hidden',
                            background: 'rgba(15, 23, 42, 0.6)'
                        }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        padding: '0.7rem 1.2rem',
                                        borderRadius: '12px',
                                        border: activeTab === tab.id ? `2px solid ${tab.color}` : `2px solid rgba(255, 255, 255, 0.4)`,
                                        background: activeTab === tab.id ? `${tab.color}33` : 'rgba(255, 255, 255, 0.25)',
                                        color: activeTab === tab.id ? tab.color : '#ffffff',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.95rem',
                                        fontWeight: '900',
                                        transition: 'all 0.2s',
                                        whiteSpace: 'nowrap',
                                        textShadow: activeTab === tab.id ? '0 0 8px rgba(0, 0, 0, 0.5)' : '2px 2px 4px rgba(0, 0, 0, 1)'
                                    }}
                                    onMouseOver={e => {
                                        if (activeTab !== tab.id) {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.35)';
                                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                                        }
                                    }}
                                    onMouseOut={e => {
                                        if (activeTab !== tab.id) {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                                        }
                                    }}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '2rem',
                            marginTop: '1rem'
                        }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 style={{
                                        fontSize: '1.8rem',
                                        fontWeight: '700',
                                        marginBottom: '2rem',
                                        color: theme.text
                                    }}>
                                        {content[activeTab].title}
                                    </h3>

                                    {content[activeTab].sections.map((section, idx) => (
                                        <div key={idx} style={{
                                            marginBottom: '2rem',
                                            padding: '1.5rem',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            borderRadius: '15px',
                                            border: `1px solid ${theme.border}`
                                        }}>
                                            <h4 style={{
                                                fontSize: '1.3rem',
                                                fontWeight: '700',
                                                marginBottom: '1rem',
                                                color: tabs[activeTab].color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                {section.icon} {section.title}
                                            </h4>

                                            {section.description && (
                                                <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                                                    {section.description}
                                                </p>
                                            )}

                                            {section.items && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                    {section.items.map((item, i) => (
                                                        <div key={i} style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            padding: '0.8rem',
                                                            background: 'rgba(0, 0, 0, 0.2)',
                                                            borderRadius: '8px',
                                                            gap: '1rem'
                                                        }}>
                                                            <span style={{ fontWeight: '600', color: '#94a3b8' }}>{item.label}:</span>
                                                            <span style={{ color: theme.text, textAlign: 'right' }}>{item.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {section.list && (
                                                <ul style={{ paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {section.list.map((item, i) => (
                                                        <li key={i} style={{ color: '#cbd5e1', lineHeight: '1.6' }}>{item}</li>
                                                    ))}
                                                </ul>
                                            )}

                                            {section.grid && (
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                                    gap: '1rem'
                                                }}>
                                                    {section.grid.map((item, i) => (
                                                        <div key={i} style={{
                                                            padding: '1rem',
                                                            background: 'rgba(0, 0, 0, 0.3)',
                                                            borderRadius: '10px',
                                                            borderLeft: `3px solid ${tabs[activeTab].color}`
                                                        }}>
                                                            <div style={{ fontWeight: '700', marginBottom: '0.5rem', color: theme.text }}>
                                                                {item.name}
                                                            </div>
                                                            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                                                                {item.desc}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {section.subsections && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                    {section.subsections.map((sub, i) => (
                                                        <div key={i} style={{
                                                            padding: '1rem',
                                                            background: 'rgba(0, 0, 0, 0.2)',
                                                            borderRadius: '10px'
                                                        }}>
                                                            <div style={{ fontWeight: '700', marginBottom: '0.5rem', color: theme.primary }}>
                                                                {sub.name}
                                                            </div>
                                                            <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                                                                {sub.points.map((point, j) => (
                                                                    <li key={j} style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{point}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
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
                                <div><strong>Last Updated:</strong> 2017</div>
                                <div><strong>Status:</strong> Active</div>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                                This constitution overrides all other union rules
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConstitutionModal;
