import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    Download,
    BarChart2,
    PieChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell
} from 'recharts';

const MemberManagement = () => {
    const [members, setMembers] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: '', department: '', search: '' });
    const [view, setView] = useState('list'); // 'list' or 'analytics'

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const params = new URLSearchParams();
            if (filter.status) params.append('status', filter.status);
            if (filter.department) params.append('department', filter.department);
            if (filter.search) params.append('search', filter.search);

            const [resMembers, resAnalytics] = await Promise.all([
                axios.get(`http://localhost:5000/api/president/members?${params.toString()}`, { headers }),
                axios.get('http://localhost:5000/api/president/analytics/members', { headers })
            ]);

            setMembers(resMembers.data);
            setAnalytics(resAnalytics.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/president/members/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData(); // Refresh data
        } catch (error) {
            alert('Error updating status');
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Users className="text-[var(--primary)]" />
                    Member Management
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('list')}
                        className={`btn ${view === 'list' ? 'btn-primary' : 'bg-[var(--bg-card)]'}`}
                    >
                        List View
                    </button>
                    <button
                        onClick={() => setView('analytics')}
                        className={`btn ${view === 'analytics' ? 'btn-primary' : 'bg-[var(--bg-card)]'}`}
                    >
                        Analytics
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card flex items-center justify-between"
                >
                    <div>
                        <p className="text-[var(--text-secondary)]">Total Members</p>
                        <h3 className="text-4xl font-bold">{analytics?.totalMembers}</h3>
                    </div>
                    <Users size={40} className="text-[var(--primary)] opacity-50" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card flex items-center justify-between"
                >
                    <div>
                        <p className="text-[var(--text-secondary)]">Active Members</p>
                        <h3 className="text-4xl font-bold text-green-500">{analytics?.activeMembers}</h3>
                    </div>
                    <CheckCircle size={40} className="text-green-500 opacity-50" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card flex items-center justify-between"
                >
                    <div>
                        <p className="text-[var(--text-secondary)]">Pending Approval</p>
                        <h3 className="text-4xl font-bold text-yellow-500">{analytics?.pendingMembers}</h3>
                    </div>
                    <Filter size={40} className="text-yellow-500 opacity-50" />
                </motion.div>
            </div>

            {view === 'list' ? (
                <div className="card">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
                            <input
                                type="text"
                                placeholder="Search members..."
                                className="input pl-10 mb-0"
                                value={filter.search}
                                onChange={e => setFilter({ ...filter, search: e.target.value })}
                            />
                        </div>
                        <select
                            className="input md:w-48 mb-0"
                            value={filter.department}
                            onChange={e => setFilter({ ...filter, department: e.target.value })}
                        >
                            <option value="">All Departments</option>
                            {analytics?.departmentDistribution.map(d => (
                                <option key={d.department} value={d.department}>{d.department}</option>
                            ))}
                        </select>
                        <select
                            className="input md:w-48 mb-0"
                            value={filter.status}
                            onChange={e => setFilter({ ...filter, status: e.target.value })}
                        >
                            <option value="">All Status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left border-b border-[var(--border-color)]">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Department</th>
                                    <th className="p-4">Year</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member, index) => (
                                    <motion.tr
                                        key={member.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors"
                                    >
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs">
                                                {member.firstName[0]}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{member.firstName} {member.lastName}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">{member.studentId}</td>
                                        <td className="p-4">{member.department}</td>
                                        <td className="p-4">{member.academicYear}</td>
                                        <td className="p-4">
                                            <span className={`badge ${member.isApproved ? 'badge-success' : 'badge-warning'}`}>
                                                {member.isApproved ? 'Active' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            {!member.isApproved && (
                                                <button
                                                    onClick={() => handleStatusUpdate(member.id, 'approved')}
                                                    className="p-2 text-green-500 hover:bg-green-50 rounded"
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleStatusUpdate(member.id, 'rejected')}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                                                title="Reject/Remove"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card"
                    >
                        <h3 className="text-xl font-bold mb-4">Department Distribution</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={analytics?.departmentDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {analytics?.departmentDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="card"
                    >
                        <h3 className="text-xl font-bold mb-4">Academic Year Distribution</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics?.yearDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="academicYear" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="var(--primary)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default MemberManagement;
