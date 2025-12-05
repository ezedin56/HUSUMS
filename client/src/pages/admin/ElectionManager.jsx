import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import {
    Plus,
    Calendar,
    Megaphone,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronUp,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GridBackground from '../../components/GridBackground';
import ElectionCandidateCard from '../../components/admin/ElectionCandidateCard';

const ElectionManager = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [expandedElections, setExpandedElections] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        positions: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchElections();
    }, []);

    const fetchElections = async () => {
        try {
            const data = await api.get('/president/elections');
            if (Array.isArray(data)) {
                setElections(data);
            } else {
                console.error('Received non-array data for elections:', data);
                setElections([]);
                // Optional: set an error state to show in UI
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching elections:', error);
            setElections([]);
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/president/elections', {
                ...formData,
                positions: formData.positions.split(',').map(p => p.trim()).filter(p => p)
            });
            alert('Election created successfully');
            // api.post returns the data directly, not an object with a data property
            setElections([res, ...elections]);
            setShowCreateModal(false);
            setFormData({ title: '', description: '', positions: '', startDate: '', endDate: '' });
            fetchElections(); // Refresh to get full data
        } catch (error) {
            alert('Error creating election: ' + error.message);
        }
    };

    const toggleStatus = async (election) => {
        const action = election.isOpen ? 'close' : 'open';
        if (!window.confirm(`Are you sure you want to ${action} this election?`)) return;

        try {
            await api.patch(`/president/elections/${election._id}/${action}`);
            fetchElections();
        } catch (error) {
            alert(`Error ${action}ing election: ` + error.message);
        }
    };

    const toggleAnnounce = async (election) => {
        try {
            await api.patch(`/president/elections/${election._id}/announce`);
            fetchElections();
        } catch (error) {
            alert('Error toggling announcement: ' + error.message);
        }
    };

    const toggleExpand = (electionId) => {
        setExpandedElections(prev => ({
            ...prev,
            [electionId]: !prev[electionId]
        }));
    };

    const handleDeleteElection = async (electionId) => {
        if (!window.confirm('Are you sure you want to delete this election? This will delete all candidates and votes permanently.')) {
            return;
        }

        try {
            await api.delete(`/president/elections/${electionId}`);
            alert('Election deleted successfully');
            fetchElections();
        } catch (error) {
            alert('Error deleting election: ' + error.message);
        }
    };

    return (
        <div className="space-y-6 relative min-h-screen">
            <GridBackground />
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.05) 0%, rgba(0, 0, 0, 0) 70%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <div className="relative z-10 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 rounded-2xl" style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(0, 255, 85, 0.2)',
                    boxShadow: '0 0 30px rgba(0, 255, 85, 0.1)'
                }}>
                    <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left" style={{
                        background: 'linear-gradient(135deg, #fff, #00ff55)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Election Management</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                        style={{
                            background: 'linear-gradient(135deg, #00ff55, #00d9ff)',
                            border: 'none',
                            color: '#0a0e27',
                            fontWeight: 'bold',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            boxShadow: '0 0 20px rgba(0, 255, 85, 0.3)'
                        }}
                    >
                        <Plus size={20} /> Create Election
                    </button>
                </div>

                {loading ? (
                    <p>Loading elections...</p>
                ) : (
                    <div className="grid gap-6">
                        {elections.map(election => (
                            <motion.div
                                key={election._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -4 }}
                                className="card rounded-2xl overflow-hidden"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    backdropFilter: 'blur(30px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                                }}
                            >
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                                                <h2 className="text-lg sm:text-xl font-bold">{election.title}</h2>
                                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${election.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                                                    election.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {election.status.toUpperCase()}
                                                </span>
                                                {election.resultsAnnounced && (
                                                    <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 flex items-center gap-1">
                                                        <Megaphone size={12} /> <span className="hidden sm:inline">RESULTS PUBLIC</span><span className="sm:hidden">PUBLIC</span>
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-400 mb-4 text-sm sm:text-base">{election.description}</p>
                                            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 flex-wrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    <span>
                                                        {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div>
                                                    {election.positions.length} Positions
                                                </div>
                                                <div>
                                                    {election.Candidates?.length || 0} Candidates
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto sm:ml-4 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                                            {election.status !== 'completed' && (
                                                <button
                                                    onClick={() => toggleStatus(election)}
                                                    className={`btn btn-sm flex-1 sm:flex-none whitespace-nowrap ${election.isOpen ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                                                >
                                                    {election.isOpen ? 'Close' : 'Open'} <span className="hidden sm:inline">Election</span>
                                                </button>
                                            )}

                                            <button
                                                onClick={() => toggleAnnounce(election)}
                                                className={`btn btn-sm flex-1 sm:flex-none whitespace-nowrap flex items-center justify-center gap-2 ${election.resultsAnnounced
                                                    ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                                                    : 'bg-gray-700 hover:bg-gray-600'
                                                    }`}
                                            >
                                                {election.resultsAnnounced ? <EyeOff size={16} /> : <Eye size={16} />}
                                                {election.resultsAnnounced ? 'Hide' : 'Announce'} <span className="hidden sm:inline">Results</span>
                                            </button>

                                            <button
                                                onClick={() => toggleExpand(election._id)}
                                                className="btn btn-sm flex-1 sm:flex-none whitespace-nowrap bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex items-center justify-center gap-2"
                                            >
                                                {expandedElections[election._id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                {expandedElections[election._id] ? 'Hide' : 'View'} <span className="hidden sm:inline">Candidates</span>
                                            </button>

                                            {election.status === 'completed' && (
                                                <button
                                                    onClick={() => handleDeleteElection(election._id)}
                                                    className="btn btn-sm flex-1 sm:flex-none whitespace-nowrap bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expandable Candidates Section */}
                                <AnimatePresence>
                                    {expandedElections[election._id] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="border-t border-white/10 bg-black/20"
                                        >
                                            <div className="p-6">
                                                <h3 className="text-lg font-bold mb-4">Candidates</h3>
                                                {election.Candidates && election.Candidates.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {election.Candidates.map(candidate => (
                                                            <ElectionCandidateCard
                                                                key={candidate.id}
                                                                candidate={candidate}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-center py-8">No candidates registered for this election yet.</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Create Modal */}
                <AnimatePresence>
                    {showCreateModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-[#1e293b] p-6 rounded-xl w-full max-w-lg border border-white/10"
                            >
                                <h2 className="text-xl font-bold mb-4">Create New Election</h2>
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            type="text"
                                            className="input w-full bg-black/20 border-white/10"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea
                                            className="input w-full bg-black/20 border-white/10"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Positions (comma separated)</label>
                                        <input
                                            type="text"
                                            className="input w-full bg-black/20 border-white/10"
                                            value={formData.positions}
                                            onChange={e => setFormData({ ...formData, positions: e.target.value })}
                                            placeholder="President, Vice President, Secretary"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                className="input w-full bg-black/20 border-white/10"
                                                value={formData.startDate}
                                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">End Date</label>
                                            <input
                                                type="date"
                                                className="input w-full bg-black/20 border-white/10"
                                                value={formData.endDate}
                                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className="btn bg-white/10 hover:bg-white/20"
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Create Election
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ElectionManager;
