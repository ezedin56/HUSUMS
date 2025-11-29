import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { Building2, Users, Check, ChevronRight, Sparkles } from 'lucide-react';
import '../memberDashboard.css';

const DepartmentSelection = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [currentDept, setCurrentDept] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    const fetchDepartments = async () => {
        try {
            const data = await api.get('/departments');
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchProfile = async () => {
        try {
            await api.get('/attendance/my');
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.department) {
                setCurrentDept(user.department);
            }
            setLoading(false);
        } catch {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchProfile();
    }, []);

    const handleSelect = async () => {
        if (!selectedDept) return;
        setJoining(true);
        try {
            const res = await api.post('/departments/select', { departmentId: selectedDept });
            alert(res.message);
            setCurrentDept(res.department);

            const user = JSON.parse(localStorage.getItem('user'));
            user.department = res.department;
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            alert(error.message || 'Failed to join department');
        } finally {
            setJoining(false);
        }
    };

    const getDepartmentIcon = (name) => {
        const icons = {
            'Technology': '💻',
            'Finance': '💰',
            'Marketing': '📢',
            'Operations': '⚙️',
            'HR': '👥',
            'Research': '🔬',
            'Design': '🎨',
            'Legal': '⚖️'
        };
        return icons[name] || '🏢';
    };

    if (loading) {
        return (
            <div className="member-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading Department Info...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="member-page">
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">
                    <Building2 className="title-icon" />
                    My Department
                </h1>
                <p className="page-subtitle">Join a department to collaborate with your team</p>
            </div>

            {currentDept ? (
                /* Current Department Card */
                <div className="page-card department-status-card">
                    <div className="department-status-content">
                        <div className="department-badge-large">
                            <Building2 size={32} />
                        </div>
                        <div className="department-info">
                            <span className="membership-label">Active Membership</span>
                            <h2 className="department-name-large">{currentDept}</h2>
                            <p className="membership-status">
                                <Check size={16} />
                                You are a verified member of this department
                            </p>
                        </div>
                    </div>
                    <div className="department-decoration">
                        <Sparkles className="sparkle-1" size={24} />
                        <Sparkles className="sparkle-2" size={16} />
                        <Sparkles className="sparkle-3" size={20} />
                    </div>
                </div>
            ) : (
                /* Department Selection */
                <div className="page-card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <Users size={20} />
                            Select Your Department
                        </h3>
                    </div>
                    
                    <p className="selection-intro">
                        You haven't joined a department yet. Choose one below to connect with your team and access department-specific features.
                    </p>

                    <div className="departments-grid">
                        {departments.map(dept => (
                            <button
                                key={dept.id}
                                className={`department-option ${selectedDept === dept.id ? 'selected' : ''}`}
                                onClick={() => setSelectedDept(dept.id)}
                            >
                                <span className="dept-icon">{getDepartmentIcon(dept.name)}</span>
                                <span className="dept-name">{dept.name}</span>
                                {selectedDept === dept.id && (
                                    <div className="selected-indicator">
                                        <Check size={16} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="selection-actions">
                        <button 
                            className="join-department-btn"
                            onClick={handleSelect}
                            disabled={!selectedDept || joining}
                        >
                            {joining ? (
                                <>
                                    <div className="btn-spinner"></div>
                                    Joining...
                                </>
                            ) : (
                                <>
                                    Join Department
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentSelection;
