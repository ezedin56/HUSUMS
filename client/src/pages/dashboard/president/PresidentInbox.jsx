import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import {
    Inbox as InboxIcon,
    Filter,
    CheckCircle,
    Clock,
    AlertTriangle,
    MessageSquare,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PresidentInbox = () => {
    const [problems, setProblems] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [filter, setFilter] = useState({ category: '', status: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProblems();
    }, [filter]);

    const fetchProblems = async () => {
        try {
            const params = new URLSearchParams();
            if (filter.category) params.append('category', filter.category);
            if (filter.status) params.append('status', filter.status);

            const res = await api.get(`/president/inbox?${params.toString()}`);
            setProblems(res.data);
        } catch (error) {
            console.error('Error fetching problems:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status, resolution = '') => {
        try {
            const res = await api.put(`/president/inbox/${id}/status`, { status, resolution });
            setProblems(problems.map(p => p.id === id ? res.data : p));
            setSelectedProblem(null);
        } catch (error) {
            alert('Error updating status');
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'technical': return 'text-blue-600 bg-blue-100';
            case 'academic': return 'text-purple-600 bg-purple-100';
            case 'administrative': return 'text-orange-600 bg-orange-100';
            case 'facilities': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'resolved': return <CheckCircle className="text-green-500" />;
            case 'in-progress': return <Clock className="text-yellow-500" />;
            default: return <AlertTriangle className="text-red-500" />;
        }
    };

    const stats = {
        total: problems.length,
        pending: problems.filter(p => p.status === 'pending').length,
        inProgress: problems.filter(p => p.status === 'in-progress').length,
        resolved: problems.filter(p => p.status === 'resolved').length
    };

    if (loading) return <div className="flex items-center justify-center h-64">Loading inbox...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <InboxIcon className="text-[var(--primary)]" />
                    Executive Inbox
                </h2>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="text-3xl font-bold mb-1">{stats.total}</div>
                    <div className="text-sm opacity-90">Total Reports</div>
                </div>
                <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <div className="text-3xl font-bold mb-1">{stats.pending}</div>
                    <div className="text-sm opacity-90">Pending</div>
                </div>
                <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                    <div className="text-3xl font-bold mb-1">{stats.inProgress}</div>
                    <div className="text-sm opacity-90">In Progress</div>
                </div>
                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="text-3xl font-bold mb-1">{stats.resolved}</div>
                    <div className="text-sm opacity-90">Resolved</div>
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="flex gap-4 items-center">
                    <Filter size={20} className="text-[var(--text-secondary)]" />
                    <select
                        className="input flex-1"
                        value={filter.category}
                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    >
                        <option value="">All Categories</option>
                        <option value="technical">Technical</option>
                        <option value="academic">Academic</option>
                        <option value="administrative">Administrative</option>
                        <option value="facilities">Facilities</option>
                        <option value="other">Other</option>
                    </select>
                    <select
                        className="input flex-1"
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {/* Problem List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {problems.length === 0 ? (
                        <p className="text-[var(--text-secondary)]">No problem reports found.</p>
                    ) : (
                        problems.map((problem, index) => (
                            <motion.div
                                key={problem.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedProblem(problem)}
                                className={`card cursor-pointer transition-all hover:shadow-lg ${selectedProblem?.id === problem.id ? 'ring-2 ring-[var(--primary)]' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(problem.status)}
                                        <h3 className="font-bold">{problem.title}</h3>
                                    </div>
                                    <span className={`badge ${getCategoryColor(problem.category)}`}>
                                        {problem.category}
                                    </span>
                                </div>

                                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                                    {problem.description}
                                </p>

                                <div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
                                    <div className="flex items-center gap-1">
                                        <User size={14} />
                                        {problem.User ? `${problem.User.firstName} ${problem.User.lastName}` : 'Anonymous'}
                                    </div>
                                    <div>{new Date(problem.createdAt).toLocaleDateString()}</div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Problem Detail */}
                <AnimatePresence>
                    {selectedProblem && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="card sticky top-6"
                        >
                            <h3 className="font-bold text-xl mb-4">{selectedProblem.title}</h3>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Category:</span>
                                    <span className={`ml-2 badge ${getCategoryColor(selectedProblem.category)}`}>
                                        {selectedProblem.category}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Status:</span>
                                    <span className="ml-2 badge">
                                        {selectedProblem.status}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Submitted by:</span>
                                    <span className="ml-2">
                                        {selectedProblem.User
                                            ? `${selectedProblem.User.firstName} ${selectedProblem.User.lastName} (${selectedProblem.User.studentId})`
                                            : 'Anonymous'
                                        }
                                    </span>
                                </div>

                                <div>
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Date:</span>
                                    <span className="ml-2">{new Date(selectedProblem.createdAt).toLocaleString()}</span>
                                </div>

                                <div>
                                    <span className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Description:</span>
                                    <p className="text-sm bg-[var(--bg-secondary)] p-3 rounded">
                                        {selectedProblem.description}
                                    </p>
                                </div>

                                {selectedProblem.resolution && (
                                    <div>
                                        <span className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Resolution:</span>
                                        <p className="text-sm bg-green-50 p-3 rounded border border-green-200">
                                            {selectedProblem.resolution}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {selectedProblem.status !== 'resolved' && (
                                <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedProblem.id, 'in-progress')}
                                        className="btn bg-yellow-100 text-yellow-700 hover:bg-yellow-200 w-full"
                                    >
                                        Mark as In Progress
                                    </button>
                                    <button
                                        onClick={() => {
                                            const resolution = prompt('Enter resolution notes:');
                                            if (resolution) {
                                                handleStatusUpdate(selectedProblem.id, 'resolved', resolution);
                                            }
                                        }}
                                        className="btn bg-green-100 text-green-700 hover:bg-green-200 w-full"
                                    >
                                        Mark as Resolved
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PresidentInbox;
