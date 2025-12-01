import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, IdCard, Lock, Shield, Search, UserPlus } from 'lucide-react';
import AnimatedNetworkBackground from '../../../components/AnimatedNetworkBackground';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        studentId: '',
        password: '',
        role: 'member'
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await api.get('/secretary/members');
            setMembers(res);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', formData);
            alert(`Member registered successfully!\nStudent ID: ${formData.studentId}\nPassword: ${formData.password}\n\nPlease provide these credentials to the member.`);
            setShowModal(false);
            setFormData({
                firstName: '',
                lastName: '',
                studentId: '',
                password: '',
                role: 'member'
            });
            fetchMembers();
        } catch (error) {
            setError(error?.data?.message || error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const filteredMembers = members.filter(m =>
        m.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="member-dashboard-shell">


            <style>{`
                @keyframes floatingOrbs {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
                    25% { transform: translate(30px, -40px) scale(1.1); opacity: 0.8; }
                    50% { transform: translate(-20px, -60px) scale(0.95); opacity: 1; }
                    75% { transform: translate(-40px, -30px) scale(1.05); opacity: 0.7; }
                }
                @keyframes waveFlow {
                    0% { transform: translate(0, 0) rotate(0deg); opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { transform: translate(-500px, 500px) rotate(10deg); opacity: 0.5; }
                }
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
            `}</style>

            <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ textAlign: 'center', marginBottom: '2rem' }}
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ fontSize: '3rem', marginBottom: '1rem' }}
                    >
                        👥
                    </motion.div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '0.5rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        Member Management
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>
                        Manage and register student union members
                    </p>
                </motion.div>

                {/* Action Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem',
                        flexWrap: 'wrap'
                    }}
                >
                    {/* Search Bar */}
                    <div style={{ position: 'relative', flex: '1', minWidth: '300px', maxWidth: '500px' }}>
                        <Search size={20} style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'rgba(255,255,255,0.5)'
                        }} />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem 0.875rem 3rem',
                                fontSize: '1rem',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '12px',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                transition: 'all 0.3s'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#16a34a';
                                e.target.style.background = 'rgba(0,0,0,0.5)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                e.target.style.background = 'rgba(0,0,0,0.3)';
                            }}
                        />
                    </div>

                    {/* Register Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowModal(true)}
                        style={{
                            padding: '0.875rem 2rem',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            color: 'white',
                            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <UserPlus size={20} />
                        Register New Member
                    </motion.button>
                </motion.div>

                {/* Members Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass"
                    style={{
                        borderRadius: '20px',
                        padding: '0',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse'
                        }}>
                            <thead>
                                <tr style={{
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    borderBottom: '2px solid rgba(34, 197, 94, 0.3)'
                                }}>
                                    <th style={{
                                        padding: '1.25rem',
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                        color: '#4ade80',
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>Name</th>
                                    <th style={{
                                        padding: '1.25rem',
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                        color: '#4ade80',
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>Student ID</th>
                                    <th style={{
                                        padding: '1.25rem',
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                        color: '#4ade80',
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>Role</th>
                                    <th style={{
                                        padding: '1.25rem',
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                        color: '#4ade80',
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>Department</th>
                                    <th style={{
                                        padding: '1.25rem',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#4ade80',
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((member, index) => (
                                    <motion.tr
                                        key={member.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                                            transition: 'background 0.3s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{
                                            padding: '1.25rem',
                                            color: 'white'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '45px',
                                                    height: '45px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.3), rgba(74, 222, 128, 0.3))',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '2px solid rgba(34, 197, 94, 0.3)',
                                                    fontSize: '1rem',
                                                    fontWeight: 'bold',
                                                    color: 'white'
                                                }}>
                                                    {member.firstName?.[0]}{member.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                                                        {member.firstName} {member.lastName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{
                                            padding: '1.25rem',
                                            color: 'rgba(255,255,255,0.8)',
                                            fontFamily: 'monospace',
                                            fontSize: '0.95rem'
                                        }}>
                                            {member.studentId}
                                        </td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <span style={{
                                                padding: '0.4rem 1rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                display: 'inline-block',
                                                background: member.role === 'president' ? 'rgba(168, 85, 247, 0.2)' :
                                                    member.role === 'secretary' ? 'rgba(59, 130, 246, 0.2)' :
                                                        member.role === 'dept_head' ? 'rgba(249, 115, 22, 0.2)' :
                                                            'rgba(34, 197, 94, 0.2)',
                                                color: member.role === 'president' ? '#c084fc' :
                                                    member.role === 'secretary' ? '#60a5fa' :
                                                        member.role === 'dept_head' ? '#fb923c' :
                                                            '#4ade80',
                                                border: `1px solid ${member.role === 'president' ? 'rgba(168, 85, 247, 0.4)' :
                                                    member.role === 'secretary' ? 'rgba(59, 130, 246, 0.4)' :
                                                        member.role === 'dept_head' ? 'rgba(249, 115, 22, 0.4)' :
                                                            'rgba(34, 197, 94, 0.4)'}`
                                            }}>
                                                {member.role === 'dept_head' ? 'Dept. Head' :
                                                    member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{
                                            padding: '1.25rem',
                                            color: 'rgba(255,255,255,0.7)',
                                            fontSize: '0.9rem'
                                        }}>
                                            {member.Department?.name || 'Unassigned'}
                                        </td>
                                        <td style={{
                                            padding: '1.25rem',
                                            textAlign: 'center'
                                        }}>
                                            <span style={{
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '15px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                background: member.isApproved ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                                color: member.isApproved ? '#4ade80' : '#fbbf24',
                                                border: `1px solid ${member.isApproved ? 'rgba(34, 197, 94, 0.4)' : 'rgba(234, 179, 8, 0.4)'}`
                                            }}>
                                                {member.isApproved ? 'ACTIVE' : 'PENDING'}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredMembers.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: 'rgba(255,255,255,0.6)'
                        }}>
                            <p style={{ fontSize: '1.1rem' }}>No members found.</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Registration Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100,
                            padding: '1rem'
                        }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="glass"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                borderRadius: '20px',
                                padding: '2.5rem',
                                maxWidth: '500px',
                                width: '100%',
                                maxHeight: '90vh',
                                overflow: 'auto'
                            }}
                        >
                            {/* Modal Header */}
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
                                }}>
                                    <UserPlus size={35} color="white" />
                                </div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>
                                    Register New Member
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                                    Create credentials for the new member
                                </p>
                            </div>

                            {/* Registration Form */}
                            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {/* Name Fields */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'white', fontSize: '0.9rem' }}>
                                            <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            placeholder="First Name"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem',
                                                fontSize: '1rem',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '10px',
                                                background: 'rgba(0,0,0,0.2)',
                                                color: 'white',
                                                transition: 'all 0.3s'
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
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'white', fontSize: '0.9rem' }}>
                                            <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            placeholder="Last Name"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem',
                                                fontSize: '1rem',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '10px',
                                                background: 'rgba(0,0,0,0.2)',
                                                color: 'white',
                                                transition: 'all 0.3s'
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
                                </div>

                                {/* Student ID */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'white', fontSize: '0.9rem' }}>
                                        <IdCard size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                        Student ID
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                        placeholder="e.g., 1234/16"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            fontSize: '1rem',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '10px',
                                            background: 'rgba(0,0,0,0.2)',
                                            color: 'white',
                                            transition: 'all 0.3s'
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

                                {/* Password - REQUIRED */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'white', fontSize: '0.9rem' }}>
                                        <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                        Create Password <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Enter password for member"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            fontSize: '1rem',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '10px',
                                            background: 'rgba(0,0,0,0.2)',
                                            color: 'white',
                                            transition: 'all 0.3s'
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
                                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                                        💡 This password will be given to the member for login
                                    </p>
                                </div>

                                {/* Role */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'white', fontSize: '0.9rem' }}>
                                        <Shield size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                        Role
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            fontSize: '1rem',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '10px',
                                            background: 'rgba(0,0,0,0.2)',
                                            color: 'white',
                                            transition: 'all 0.3s',
                                            cursor: 'pointer'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#16a34a';
                                            e.target.style.background = 'rgba(0,0,0,0.4)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                            e.target.style.background = 'rgba(0,0,0,0.2)';
                                        }}
                                    >
                                        <option value="member">Member</option>
                                        <option value="dept_head">Department Head</option>
                                        <option value="secretary">Secretary</option>
                                        <option value="president">President</option>
                                    </select>
                                </div>

                                {/* Error Message */}
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

                                {/* Buttons */}
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowModal(false)}
                                        style={{
                                            padding: '0.875rem 1.75rem',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: 'rgba(255,255,255,0.9)',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            padding: '0.875rem 1.75rem',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            color: 'white',
                                            background: loading ? '#999' : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                            border: 'none',
                                            borderRadius: '10px',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)'
                                        }}
                                    >
                                        {loading ? 'Registering...' : 'Register Member'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Members;
