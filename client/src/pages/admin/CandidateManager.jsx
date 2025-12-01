import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import {
    Plus,
    User,
    Search,
    Trash2,
    Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CandidateManager = () => {
    const [elections, setElections] = useState([]);
    const [selectedElectionId, setSelectedElectionId] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [userSearch, setUserSearch] = useState('');

    const [formData, setFormData] = useState({
        userId: '',
        position: '',
        manifesto: '',
        description: '',
        photo: null
    });

    useEffect(() => {
        fetchElections();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedElectionId) {
            const election = elections.find(e => e._id === selectedElectionId);
            if (election && election.Candidates) {
                setCandidates(election.Candidates);
            }
        } else {
            setCandidates([]);
        }
    }, [selectedElectionId, elections]);

    const fetchElections = async () => {
        try {
            const data = await api.get('/president/elections');
            if (Array.isArray(data)) {
                setElections(data);
                if (data.length > 0 && !selectedElectionId) {
                    setSelectedElectionId(data[0]._id);
                }
            } else {
                console.error('Received non-array data for elections:', data);
                setElections([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching elections:', error);
            setElections([]);
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await api.get('/president/members');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAddCandidate = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('userId', formData.userId);
        data.append('position', formData.position);
        data.append('manifesto', formData.manifesto);
        data.append('description', formData.description);
        if (formData.photo) {
            data.append('photo', formData.photo);
        }

        try {
            await api.upload(`/president/elections/${selectedElectionId}/candidates`, data);

            alert('Candidate added successfully');
            setShowAddModal(false);
            setFormData({ userId: '', position: '', manifesto: '', description: '', photo: null });
            fetchElections(); // Refresh to get updated candidates
        } catch (error) {
            alert('Error adding candidate: ' + error.message);
        }
    };

    const selectedElection = elections.find(e => e._id === selectedElectionId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Candidate Management</h1>
                <div className="flex gap-4">
                    <select
                        className="input bg-black/20 border-white/10 min-w-[200px]"
                        value={selectedElectionId}
                        onChange={(e) => setSelectedElectionId(e.target.value)}
                    >
                        {elections.map(e => (
                            <option key={e._id} value={e._id}>{e.title}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn btn-primary flex items-center gap-2"
                        disabled={!selectedElectionId}
                    >
                        <Plus size={20} /> Add Candidate
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No candidates found for this election.
                        </div>
                    ) : (
                        candidates.map(candidate => (
                            <motion.div
                                key={candidate.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col items-center text-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-gray-700 mb-4 overflow-hidden border-4 border-white/10">
                                    {candidate.photoUrl ? (
                                        <img
                                            src={`http://localhost:5000${candidate.photoUrl}`}
                                            alt="Candidate"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User size={40} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mb-1">
                                    {candidate.User?.firstName} {candidate.User?.lastName}
                                </h3>
                                <p className="text-[var(--primary)] font-medium mb-4">{candidate.position}</p>
                                <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                                    {candidate.description}
                                </p>
                                {/* <button className="mt-auto btn btn-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 w-full flex items-center justify-center gap-2">
                                    <Trash2 size={16} /> Remove
                                </button> */}
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* Add Candidate Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1e293b] p-6 rounded-xl w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-xl font-bold mb-4">Add Candidate to {selectedElection?.title}</h2>
                            <form onSubmit={handleAddCandidate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Select User</label>
                                    <input
                                        type="text"
                                        className="input w-full bg-black/20 border-white/10 mb-2"
                                        placeholder="Search user..."
                                        value={userSearch}
                                        onChange={e => setUserSearch(e.target.value)}
                                    />
                                    <select
                                        className="input w-full bg-black/20 border-white/10"
                                        value={formData.userId}
                                        onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                        required
                                        size={5}
                                    >
                                        {users
                                            .filter(u =>
                                                u.firstName.toLowerCase().includes(userSearch.toLowerCase()) ||
                                                u.lastName.toLowerCase().includes(userSearch.toLowerCase()) ||
                                                u.studentId.includes(userSearch)
                                            )
                                            .map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.firstName} {user.lastName} ({user.studentId})
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Position</label>
                                    <select
                                        className="input w-full bg-black/20 border-white/10"
                                        value={formData.position}
                                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Position</option>
                                        {selectedElection?.positions.map(pos => (
                                            <option key={pos} value={pos}>{pos}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        className="input w-full bg-black/20 border-white/10"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        rows={2}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Manifesto</label>
                                    <textarea
                                        className="input w-full bg-black/20 border-white/10"
                                        value={formData.manifesto}
                                        onChange={e => setFormData({ ...formData, manifesto: e.target.value })}
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Photo (Optional)</label>
                                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-[var(--primary)] transition-colors relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={e => setFormData({ ...formData, photo: e.target.files[0] })}
                                            accept="image/*"
                                        />
                                        <Upload className="mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm text-gray-400">
                                            {formData.photo ? formData.photo.name : 'Click or drag to upload photo'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="btn bg-white/10 hover:bg-white/20"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Add Candidate
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CandidateManager;
