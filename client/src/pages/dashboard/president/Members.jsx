import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { Users, AlertTriangle, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import './MembersLuxury.css';
import '../../../overflowFix.css';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [membersWithWarnings, setMembersWithWarnings] = useState([]);
    const [registrationStatus, setRegistrationStatus] = useState({ isOpen: true });
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [animationReady, setAnimationReady] = useState(false);

    useEffect(() => {
        fetchMembers();
        fetchWarnings();
        fetchRegistrationStatus();

        // Trigger animations after mount
        setTimeout(() => setAnimationReady(true), 100);

        // Generate floating particles
        generateParticles();
    }, []);

    const generateParticles = () => {
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) return;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${15 + Math.random() * 10}s`;
            particlesContainer.appendChild(particle);
        }
    };

    const fetchMembers = async () => {
        try {
            const data = await api.get('/president/members');
            setMembers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching members:', error);
            setLoading(false);
        }
    };

    const fetchWarnings = async () => {
        try {
            const data = await api.get('/president/members/warnings');
            setMembersWithWarnings(data);
        } catch (error) {
            console.error('Error fetching warnings:', error);
        }
    };

    const fetchRegistrationStatus = async () => {
        try {
            const data = await api.get('/president/registration/status');
            setRegistrationStatus(data);
        } catch (error) {
            console.error('Error fetching registration status:', error);
        }
    };

    const handleDelete = async (memberId) => {
        try {
            await api.delete(`/president/members/${memberId}`);
            alert('Member deleted successfully');
            setDeleteConfirm(null);
            fetchMembers();
        } catch (error) {
            alert(error.message || 'Failed to delete member');
        }
    };

    const toggleRegistration = async () => {
        try {
            const newStatus = !registrationStatus.isOpen;
            await api.put('/president/registration/status', { isOpen: newStatus });
            setRegistrationStatus({ isOpen: newStatus });
            alert(`Registration ${newStatus ? 'opened' : 'closed'} successfully`);
        } catch (error) {
            alert('Failed to update registration status');
        }
    };

    const hasWarning = (memberId) => {
        return membersWithWarnings.find(m => m.id === memberId);
    };

    if (loading) {
        return (
            <div className="luxury-dashboard">
                <div className="particles"></div>
                <div className="noise-layer"></div>
                <div className="luxury-loading">
                    <div className="loading-spinner"></div>
                    <p>Initializing Command Center...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="luxury-dashboard">
            {/* Atmospheric Elements */}
            <div className="particles"></div>
            <div className="noise-layer"></div>

            {/* Header Section */}
            <div className="luxury-header">
                <div className="header-icon-wrapper">
                    <Users className="header-icon" size={56} />
                    <div className="icon-glow"></div>
                </div>
                <div className="header-text">
                    <h1 className="luxury-title" data-text="Member Management">
                        Member Management
                    </h1>
                    <p className="luxury-subtitle">Manage student members and registration status</p>
                </div>
            </div>

            {/* Primary Status Section */}
            <div className="status-primary">
                <div className="status-label">Registration Status</div>
                <button
                    onClick={toggleRegistration}
                    className={`status-toggle ${registrationStatus.isOpen ? 'status-open' : 'status-closed'}`}
                >
                    <div className="toggle-ring"></div>
                    <div className="toggle-content">
                        {registrationStatus.isOpen ? (
                            <>
                                <ToggleRight size={36} />
                                <span className="toggle-text">OPEN</span>
                            </>
                        ) : (
                            <>
                                <ToggleLeft size={36} />
                                <span className="toggle-text">CLOSED</span>
                            </>
                        )}
                    </div>
                    <div className="toggle-glow"></div>
                </button>
            </div>

            {/* Statistics Section */}
            <div className="stats-grid">
                <div className={`stat-card ${animationReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.2s' }}>
                    <div className="stat-icon-wrapper">
                        <Users className="stat-icon" size={36} />
                        <div className="stat-icon-glow"></div>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Total Members</div>
                        <div className="stat-value">{members.length}</div>
                    </div>
                    <div className="card-shimmer"></div>
                </div>

                <div className={`stat-card ${animationReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.35s' }}>
                    <div className="stat-icon-wrapper warning">
                        <AlertTriangle className="stat-icon" size={36} />
                        <div className="stat-icon-glow warning"></div>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Members with Warnings</div>
                        <div className="stat-value warning-value">{membersWithWarnings.length}</div>
                    </div>
                    <div className="card-shimmer"></div>
                </div>

                <div className={`stat-card ${animationReady ? 'slide-up' : ''}`} style={{ animationDelay: '0.5s' }}>
                    <div className="stat-icon-wrapper status">
                        {registrationStatus.isOpen ? (
                            <>
                                <ToggleRight className="stat-icon" size={36} />
                                <div className="stat-icon-glow success"></div>
                            </>
                        ) : (
                            <>
                                <ToggleLeft className="stat-icon" size={36} />
                                <div className="stat-icon-glow warning"></div>
                            </>
                        )}
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Registration Status</div>
                        <div className={`stat-value ${registrationStatus.isOpen ? 'success-value' : 'warning-value'}`}>
                            {registrationStatus.isOpen ? 'OPEN' : 'CLOSED'}
                        </div>
                    </div>
                    <div className="card-shimmer"></div>
                </div>
            </div>

            {/* Members Table */}
            <div className="luxury-table-container">
                <div className="table-wrapper">
                    <table className="luxury-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Student ID</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member, index) => {
                                const warning = hasWarning(member.id);
                                return (
                                    <tr
                                        key={member.id}
                                        className={animationReady ? 'fade-in' : ''}
                                        style={{ animationDelay: `${0.9 + index * 0.05}s` }}
                                    >
                                        <td data-label="Name">
                                            <div className="member-name-cell">
                                                <div className="member-avatar-placeholder">
                                                    {member.firstName?.[0]}{member.lastName?.[0]}
                                                </div>
                                                <div className="member-name-wrapper">
                                                    <span className="member-name">{member.firstName} {member.lastName}</span>
                                                    {warning && (
                                                        <div className="warning-indicator">
                                                            <AlertTriangle size={16} />
                                                            <span className="warning-tooltip">{warning.warningCount} consecutive absences</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td data-label="Student ID"><span className="mono-text">{member.studentId}</span></td>
                                        <td data-label="Role">
                                            <span className="role-badge">{member.role.replace('_', ' ')}</span>
                                        </td>
                                        <td data-label="Department">{member.department || '—'}</td>
                                        <td data-label="Status">
                                            <span className={`status-badge ${warning ? 'warning' : 'active'}`}>
                                                {warning ? 'Warning' : 'Active'}
                                            </span>
                                        </td>
                                        <td data-label="Actions">
                                            <button
                                                onClick={() => setDeleteConfirm(member)}
                                                className="action-button delete"
                                                title="Delete member"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="luxury-modal-overlay">
                    <div className="luxury-modal">
                        <h3 className="modal-title">Confirm Deletion</h3>
                        <p className="modal-text">
                            Are you sure you want to delete <strong>{deleteConfirm.firstName} {deleteConfirm.lastName}</strong>?
                            <br />This action cannot be undone.
                        </p>
                        <div className="modal-actions">
                            <button onClick={() => setDeleteConfirm(null)} className="btn-secondary">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm.id)} className="btn-danger">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Members;
