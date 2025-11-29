import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';

const Records = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const data = await api.get('/secretary/records');
            setMembers(data);
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading records...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Member Records</h2>
            <div className="card">
                {members.length === 0 ? (
                    <p>No records found.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem' }}>Name</th>
                                    <th style={{ padding: '0.75rem' }}>ID</th>
                                    <th style={{ padding: '0.75rem' }}>Role</th>
                                    <th style={{ padding: '0.75rem' }}>Department</th>
                                    <th style={{ padding: '0.75rem' }}>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map(member => (
                                    <tr key={member.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.75rem' }}>{member.firstName} {member.lastName}</td>
                                        <td style={{ padding: '0.75rem' }}>{member.studentId}</td>
                                        <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{member.role.replace('_', ' ')}</td>
                                        <td style={{ padding: '0.75rem' }}>{member.Department ? member.Department.name : member.department || '-'}</td>
                                        <td style={{ padding: '0.75rem' }}>{member.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Records;
