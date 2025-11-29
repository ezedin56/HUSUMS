import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';

const DepartmentSelection = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [currentDept, setCurrentDept] = useState(null);
    const [loading, setLoading] = useState(true);

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
            await api.get('/attendance/my'); // Using this as a proxy to check auth, but better to have /auth/me
            // Actually, let's check localStorage first, or if we have a profile endpoint.
            // We don't have a specific /auth/me endpoint in the list, but we can use any protected route or just rely on localStorage for display initially.
            // Let's try to get user from localStorage for now.
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
        // Ideally we should also fetch current user profile to see if they already have a department
        // But for now, let's assume the user object in localStorage might need updating or we fetch profile.
        // Let's fetch profile to be sure.
        fetchProfile();
    }, []);

    const handleSelect = async () => {
        if (!selectedDept) return;
        try {
            const res = await api.post('/departments/select', { departmentId: selectedDept });
            alert(res.message);
            setCurrentDept(res.department);

            // Update local storage
            const user = JSON.parse(localStorage.getItem('user'));
            user.department = res.department;
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            alert(error.message || 'Failed to join department');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>My Department</h2>
            <div className="card">
                {currentDept ? (
                    <p>You are currently a member of: <strong>{currentDept}</strong></p>
                ) : (
                    <div>
                        <p style={{ marginBottom: '1rem' }}>You have not joined a department yet. Please select one below:</p>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <select
                                className="input"
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                style={{ maxWidth: '300px' }}
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            <button className="btn btn-primary" onClick={handleSelect}>Join Department</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepartmentSelection;
