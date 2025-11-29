import { useState, useEffect } from 'react';
import { api, API_URL } from '../../../utils/api';
import { Users, Trash2, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [membersWithWarnings, setMembersWithWarnings] = useState([]);
    const [registrationStatus, setRegistrationStatus] = useState({ isOpen: true });
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchMembers();
        fetchWarnings();
        fetchRegistrationStatus();
    }, []);

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
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Users className="text-[var(--primary)]" size={32} />
                    <h2 className="text-3xl font-bold">Member Management</h2>
                </div>

                {/* Registration Control */}
                <div className="flex items-center gap-3 card px-4 py-2">
                    <span className="text-sm font-medium">Registration:</span>
                    <button
                        onClick={toggleRegistration}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${registrationStatus.isOpen
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                    >
                        {registrationStatus.isOpen ? (
                            <>
                                <ToggleRight size={20} />
                                <span>Open</span>
                            </>
                        ) : (
                            <>
                                <ToggleLeft size={20} />
                                <span>Closed</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card">
                    <div className="text-sm text-[var(--text-secondary)]">Total Members</div>
                    <div className="text-3xl font-bold text-[var(--primary)]">{members.length}</div>
                </div>
                <div className="card">
                    <div className="text-sm text-[var(--text-secondary)]">Members with Warnings</div>
                    <div className="text-3xl font-bold text-red-500">{membersWithWarnings.length}</div>
                </div>
                <div className="card">
                    <div className="text-sm text-[var(--text-secondary)]">Registration Status</div>
                    <div className={`text-3xl font-bold ${registrationStatus.isOpen ? 'text-green-500' : 'text-red-500'}`}>
                        {registrationStatus.isOpen ? 'Open' : 'Closed'}
                    </div>
                </div>
            </div>

            {/* Members Table */}
            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="text-left p-4 font-semibold">Photo</th>
                                <th className="text-left p-4 font-semibold">Name</th>
                                <th className="text-left p-4 font-semibold">Student ID</th>
                                <th className="text-left p-4 font-semibold">Email</th>
                                <th className="text-left p-4 font-semibold">Role</th>
                                <th className="text-left p-4 font-semibold">Department</th>
                                <th className="text-left p-4 font-semibold">Status</th>
                                <th className="text-right p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(member => {
                                const warning = hasWarning(member.id);
                                return (
                                    <tr key={member.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]">
                                        <td className="p-4">
                                            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold overflow-hidden">
                                                {member.profilePicture ? (
                                                    <img
                                                        src={`${API_URL.replace('/api', '')}${member.profilePicture}`}
                                                        alt={`${member.firstName} ${member.lastName}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span>{member.firstName?.[0]}{member.lastName?.[0]}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span>{member.firstName} {member.lastName}</span>
                                                {warning && (
                                                    <div className="relative group">
                                                        <AlertTriangle size={18} className="text-red-500" />
                                                        <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                                            {warning.warningCount} consecutive absences
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">{member.studentId}</td>
                                        <td className="p-4">{member.email}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                                                {member.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4">{member.department || '-'}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${warning ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {warning ? 'Warning' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setDeleteConfirm(member)}
                                                className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="card max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                        <p className="text-[var(--text-secondary)] mb-6">
                            Are you sure you want to delete <strong>{deleteConfirm.firstName} {deleteConfirm.lastName}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm.id)}
                                className="btn bg-red-500 text-white hover:bg-red-600"
                            >
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
