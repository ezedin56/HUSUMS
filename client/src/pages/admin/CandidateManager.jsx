import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import {
    Plus,
    Search,
    Upload,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CandidateCard from '../../components/admin/CandidateCard';

const CandidateManager = () => {
    const [elections, setElections] = useState([]);
    const [selectedElectionId, setSelectedElectionId] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [userSearch, setUserSearch] = useState('');
    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        platform: false,
        contact: false,
        location: false,
        background: false
    });

    const [formData, setFormData] = useState({
        userId: '',
        position: '',
        manifesto: '',
        description: '',
        slogan: '',
        photo: null,
        platform: ['', '', ''],
        phone: '',
        email: '',
        region: '',
        zone: '',
        woreda: '',
        city: '',
        background: '',
        education: [''],
        experience: [''],
        achievements: ['']
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

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const updateArrayField = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeArrayItem = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray });
    };

    const handleAddCandidate = async (e) => {
        e.preventDefault();

        if (!formData.userId) {
            alert('Please select a user');
            return;
        }

        const data = new FormData();
        data.append('userId', formData.userId);
        data.append('position', formData.position);
        data.append('manifesto', formData.manifesto);
        data.append('description', formData.description);
        data.append('slogan', formData.slogan);

        // Add array fields as JSON strings
        data.append('platform', JSON.stringify(formData.platform.filter(p => p.trim())));
        data.append('education', JSON.stringify(formData.education.filter(e => e.trim())));
        data.append('experience', JSON.stringify(formData.experience.filter(e => e.trim())));
        data.append('achievements', JSON.stringify(formData.achievements.filter(a => a.trim())));

        // Add contact and location fields
        data.append('phone', formData.phone);
        data.append('email', formData.email);
        data.append('region', formData.region);
        data.append('zone', formData.zone);
        data.append('woreda', formData.woreda);
        data.append('city', formData.city);
        data.append('background', formData.background);

        if (formData.photo) {
            data.append('photo', formData.photo);
        }

        try {
            await api.upload(`/president/elections/${selectedElectionId}/candidates`, data);

            alert('Candidate added successfully');
            setShowAddModal(false);
            resetForm();
            fetchElections();
        } catch (error) {
            alert('Error adding candidate: ' + error.message);
        }
    };

    const handleDeleteCandidate = async (candidateId) => {
        if (!window.confirm('Are you sure you want to delete this candidate?')) {
            return;
        }

        try {
            await api.delete(`/president/candidates/${candidateId}`);
            alert('Candidate deleted successfully');
            fetchElections();
        } catch (error) {
            alert('Error deleting candidate: ' + error.message);
        }
    };

    const handleEditCandidate = (candidate) => {
        setEditingCandidate(candidate);
        setFormData({
            userId: candidate.userId ? candidate.userId._id : '',
            position: candidate.position,
            manifesto: candidate.manifesto || '',
            description: candidate.description || '',
            slogan: candidate.slogan || '',
            photo: null,
            platform: candidate.platform && candidate.platform.length > 0 ? candidate.platform : ['', '', ''],
            phone: candidate.phone || '',
            email: candidate.email || '',
            region: candidate.region || '',
            zone: candidate.zone || '',
            woreda: candidate.woreda || '',
            city: candidate.city || '',
            background: candidate.background || '',
            education: candidate.education && candidate.education.length > 0 ? candidate.education : [''],
            experience: candidate.experience && candidate.experience.length > 0 ? candidate.experience : [''],
            achievements: candidate.achievements && candidate.achievements.length > 0 ? candidate.achievements : ['']
        });
        setShowEditModal(true);
    };

    const handleUpdateCandidate = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('position', formData.position);
        data.append('manifesto', formData.manifesto);
        data.append('description', formData.description);
        data.append('slogan', formData.slogan);

        // Add array fields as JSON strings
        data.append('platform', JSON.stringify(formData.platform.filter(p => p.trim())));
        data.append('education', JSON.stringify(formData.education.filter(e => e.trim())));
        data.append('experience', JSON.stringify(formData.experience.filter(e => e.trim())));
        data.append('achievements', JSON.stringify(formData.achievements.filter(a => a.trim())));

        // Add contact and location fields
        data.append('phone', formData.phone);
        data.append('email', formData.email);
        data.append('region', formData.region);
        data.append('zone', formData.zone);
        data.append('woreda', formData.woreda);
        data.append('city', formData.city);
        data.append('background', formData.background);

        if (formData.photo) {
            data.append('photo', formData.photo);
        }

        try {
            await api.upload(`/president/candidates/${editingCandidate.id}`, data, 'PUT');
            alert('Candidate updated successfully');
            setShowEditModal(false);
            setEditingCandidate(null);
            resetForm();
            fetchElections();
        } catch (error) {
            alert('Error updating candidate: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            userId: '',
            position: '',
            manifesto: '',
            description: '',
            slogan: '',
            photo: null,
            platform: ['', '', ''],
            phone: '',
            email: '',
            region: '',
            zone: '',
            woreda: '',
            city: '',
            background: '',
            education: [''],
            experience: [''],
            achievements: ['']
        });
        setUserSearch('');
    };

    const selectedElection = elections.find(e => e._id === selectedElectionId);

    const renderForm = (isEdit = false) => (
        <form onSubmit={isEdit ? handleUpdateCandidate : handleAddCandidate} className="space-y-4">
            {/* Basic Information Section */}
            <div className="border border-white/10 rounded-lg overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleSection('basic')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <span className="font-semibold">Basic Information</span>
                    {expandedSections.basic ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.basic && (
                    <div className="p-4 space-y-4">
                        {!isEdit && (
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
                                    <option value="">-- Select a User --</option>
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
                        )}

                        {isEdit && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Candidate</label>
                                <div className="input w-full bg-black/20 border-white/10 opacity-50">
                                    {editingCandidate?.User?.firstName} {editingCandidate?.User?.lastName}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">Position</label>
                            <select
                                className="input w-full bg-black/20 border-white/10"
                                value={formData.position}
                                onChange={e => setFormData({ ...formData, position: e.target.value })}
                                required
                            >
                                <option value="">Select Position</option>
                                <option value="President">President</option>
                                <option value="Vice President">Vice President</option>
                                <option value="Secretary">Secretary</option>
                                {selectedElection?.positions
                                    ?.filter(pos => !['President', 'Vice President', 'Secretary'].includes(pos))
                                    .map(pos => (
                                        <option key={pos} value={pos}>{pos}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Slogan</label>
                            <input
                                type="text"
                                className="input w-full bg-black/20 border-white/10"
                                value={formData.slogan}
                                onChange={e => setFormData({ ...formData, slogan: e.target.value })}
                                placeholder="Campaign slogan..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                className="input w-full bg-black/20 border-white/10"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                                required
                                placeholder="Brief description..."
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
                                placeholder="Full manifesto..."
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
                    </div>
                )}
            </div>

            {/* Platform Points Section */}
            <div className="border border-white/10 rounded-lg overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleSection('platform')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <span className="font-semibold">Platform Points</span>
                    {expandedSections.platform ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.platform && (
                    <div className="p-4 space-y-2">
                        {formData.platform.map((point, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    className="input flex-1 bg-black/20 border-white/10"
                                    value={point}
                                    onChange={e => updateArrayField('platform', index, e.target.value)}
                                    placeholder={`Platform point ${index + 1}...`}
                                />
                                {formData.platform.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('platform', index)}
                                        className="btn bg-red-500/20 hover:bg-red-500/30 text-red-400"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('platform')}
                            className="btn bg-white/10 hover:bg-white/20 w-full"
                        >
                            + Add Platform Point
                        </button>
                    </div>
                )}
            </div>

            {/* Contact Information Section */}
            <div className="border border-white/10 rounded-lg overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleSection('contact')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <span className="font-semibold">Contact Information</span>
                    {expandedSections.contact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.contact && (
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input
                                type="tel"
                                className="input w-full bg-black/20 border-white/10"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+251 XXX XXX XXX"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                className="input w-full bg-black/20 border-white/10"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@example.com"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Location Information Section */}
            <div className="border border-white/10 rounded-lg overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleSection('location')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <span className="font-semibold">Location Information</span>
                    {expandedSections.location ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.location && (
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Region</label>
                            <input
                                type="text"
                                className="input w-full bg-black/20 border-white/10"
                                value={formData.region}
                                onChange={e => setFormData({ ...formData, region: e.target.value })}
                                placeholder="Region"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Zone</label>
                            <input
                                type="text"
                                className="input w-full bg-black/20 border-white/10"
                                value={formData.zone}
                                onChange={e => setFormData({ ...formData, zone: e.target.value })}
                                placeholder="Zone"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Woreda</label>
                            <input
                                type="text"
                                className="input w-full bg-black/20 border-white/10"
                                value={formData.woreda}
                                onChange={e => setFormData({ ...formData, woreda: e.target.value })}
                                placeholder="Woreda"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">City</label>
                            <input
                                type="text"
                                className="input w-full bg-black/20 border-white/10"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                placeholder="City"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Background & Qualifications Section */}
            <div className="border border-white/10 rounded-lg overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleSection('background')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <span className="font-semibold">Background & Qualifications</span>
                    {expandedSections.background ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.background && (
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Background</label>
                            <textarea
                                className="input w-full bg-black/20 border-white/10"
                                value={formData.background}
                                onChange={e => setFormData({ ...formData, background: e.target.value })}
                                rows={3}
                                placeholder="Brief background..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Education</label>
                            {formData.education.map((edu, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        className="input flex-1 bg-black/20 border-white/10"
                                        value={edu}
                                        onChange={e => updateArrayField('education', index, e.target.value)}
                                        placeholder="Education entry..."
                                    />
                                    {formData.education.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('education', index)}
                                            className="btn bg-red-500/20 hover:bg-red-500/30 text-red-400"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('education')}
                                className="btn bg-white/10 hover:bg-white/20 w-full"
                            >
                                + Add Education
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Experience</label>
                            {formData.experience.map((exp, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        className="input flex-1 bg-black/20 border-white/10"
                                        value={exp}
                                        onChange={e => updateArrayField('experience', index, e.target.value)}
                                        placeholder="Experience entry..."
                                    />
                                    {formData.experience.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('experience', index)}
                                            className="btn bg-red-500/20 hover:bg-red-500/30 text-red-400"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('experience')}
                                className="btn bg-white/10 hover:bg-white/20 w-full"
                            >
                                + Add Experience
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Achievements</label>
                            {formData.achievements.map((achievement, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        className="input flex-1 bg-black/20 border-white/10"
                                        value={achievement}
                                        onChange={e => updateArrayField('achievements', index, e.target.value)}
                                        placeholder="Achievement..."
                                    />
                                    {formData.achievements.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('achievements', index)}
                                            className="btn bg-red-500/20 hover:bg-red-500/30 text-red-400"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('achievements')}
                                className="btn bg-white/10 hover:bg-white/20 w-full"
                            >
                                + Add Achievement
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={() => {
                        if (isEdit) {
                            setShowEditModal(false);
                            setEditingCandidate(null);
                        } else {
                            setShowAddModal(false);
                        }
                        resetForm();
                    }}
                    className="btn bg-white/10 hover:bg-white/20"
                >
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    {isEdit ? 'Update Candidate' : 'Add Candidate'}
                </button>
            </div>
        </form>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Candidate Management</h1>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <select
                        className="input bg-black/20 border-white/10 min-w-[200px] w-full sm:w-auto"
                        value={selectedElectionId}
                        onChange={(e) => setSelectedElectionId(e.target.value)}
                    >
                        {elections.map(e => (
                            <option key={e._id} value={e._id}>{e.title}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
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
                            <CandidateCard
                                key={candidate.id}
                                candidate={candidate}
                                onEdit={handleEditCandidate}
                                onDelete={handleDeleteCandidate}
                            />
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
                            className="bg-[#1e293b] p-6 rounded-xl w-full max-w-3xl border border-white/10 max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-xl font-bold mb-4">Add Candidate to {selectedElection?.title}</h2>
                            {renderForm(false)}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Candidate Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1e293b] p-6 rounded-xl w-full max-w-3xl border border-white/10 max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-xl font-bold mb-4">Edit Candidate</h2>
                            {renderForm(true)}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CandidateManager;
