import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import './Elections.css';
import {
    Vote,
    Plus,
    UserPlus,
    Calendar,
    Clock,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

const Elections = () => {
    const [elections, setElections] = useState([]);
    const [liveResults, setLiveResults] = useState(null);
    const [view, setView] = useState('manage'); // 'manage', 'live'
    const [formData, setFormData] = useState({ title: '', description: '', positions: '', startDate: '', endDate: '' });
    const [showCandidateModal, setShowCandidateModal] = useState(false);
    const [selectedElection, setSelectedElection] = useState(null);
    const [candidateData, setCandidateData] = useState({ userId: '', position: 'President', manifesto: '', description: '', photo: null });
    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');

    useEffect(() => {
        fetchElections();
        fetchUsers();
    }, []);

    useEffect(() => {
        let interval;
        if (view === 'live') {
            fetchLiveResults();
            interval = setInterval(fetchLiveResults, 5000); // Poll every 5 seconds
        }
        return () => clearInterval(interval);
    }, [view]);

    const fetchElections = async () => {
        try {
            const data = await api.get('/president/elections');
            console.log('Fetched elections:', data);
            setElections(data);
        } catch (error) {
            console.error('Error fetching elections:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/president/members');
            setUsers(res);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchLiveResults = async () => {
        try {
            const res = await api.get('/president/elections/live');
            setLiveResults(res); // api.get already unwraps the response
        } catch (error) {
            console.error('Error fetching live results:', error);
        }
    };

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/president/elections', {
                ...formData,
                positions: formData.positions.split(',').map(p => p.trim()).filter(p => p)
            });
            setSuccessMessage('Election created successfully!');
            setElections([res.data, ...elections]);
            setFormData({ title: '', description: '', positions: '', startDate: '', endDate: '' });
        } catch (error) {
            alert('Error creating election: ' + error.message);
        }
    };

    const [showResultsModal, setShowResultsModal] = useState(false);
    const [resultsData, setResultsData] = useState(null);

    const handleViewResults = async (election) => {
        try {
            const electionId = election._id || election.id;
            if (!electionId || electionId === 'undefined') {
                console.error('Invalid election object:', election);
                throw new Error('Invalid election ID (undefined)');
            }

            const res = await api.get(`/president/results/${electionId}`);

            // Process the results to match UI expectations
            const processedWinners = {};
            const positions = {};

            if (res.results && Array.isArray(res.results)) {
                res.results.forEach(candidate => {
                    if (!positions[candidate.position]) {
                        positions[candidate.position] = [];
                    }
                    positions[candidate.position].push(candidate);
                });

                Object.keys(positions).forEach(position => {
                    const candidates = positions[position];
                    candidates.sort((a, b) => b.voteCount - a.voteCount);

                    if (candidates.length > 0) {
                        processedWinners[position] = {
                            name: candidates[0].name,
                            photo: candidates[0].photo,
                            voteCount: candidates[0].voteCount
                        };
                    }
                });
            }

            setResultsData({
                totalVotes: res.totalVotes,
                winners: processedWinners
            });

            setShowResultsModal(true);
        } catch (error) {
            console.error('Error fetching results:', error);
            alert('Error fetching results: ' + error.message);
        }
    };

    const handleOpenElection = async (id) => {
        if (!window.confirm('Are you sure you want to open this election? Voting will begin immediately.')) return;
        try {
            await api.patch(`/president/elections/${id}/open`);
            setSuccessMessage('Election opened successfully!');
            fetchElections();
        } catch (error) {
            alert('Error opening election: ' + error.message);
        }
    };

    const handleCloseElection = async (id) => {
        if (!window.confirm('Are you sure you want to close this election? Voting will stop immediately.')) return;
        try {
            await api.patch(`/president/elections/${id}/close`);
            setSuccessMessage('Election closed successfully!');
            fetchElections();
        } catch (error) {
            alert('Error closing election: ' + error.message);
        }
    };

    const handleDeleteElection = async (id) => {
        if (!window.confirm('Are you sure you want to delete this election? This action cannot be undone and will delete all associated candidates and votes.')) return;
        try {
            await api.delete(`/president/elections/${id}`);
            setSuccessMessage('Election deleted successfully!');
            fetchElections();
        } catch (error) {
            alert('Error deleting election: ' + error.message);
        }
    };


    const handleAddCandidate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userId', candidateData.userId);
        formData.append('position', candidateData.position);
        formData.append('manifesto', candidateData.manifesto);
        formData.append('description', candidateData.description);
        if (candidateData.photo) {
            formData.append('photo', candidateData.photo);
        }

        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const res = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}/api/president/elections/${selectedElection._id}/candidates`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) throw new Error(await res.text());

            alert('Candidate added successfully');
            setShowCandidateModal(false);
            setCandidateData({ userId: '', position: 'President', manifesto: '', description: '', photo: null });
            fetchElections();
        } catch (error) {
            alert('Error adding candidate: ' + error.message);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="space-y-6 animate-fade-in">
            {successMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2"
                    role="alert"
                >
                    <CheckCircle size={20} />
                    <span className="block sm:inline">{successMessage}</span>
                </motion.div>
            )}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Vote className="text-[var(--primary)]" />
                    Election Control Center
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('manage')}
                        className={`btn ${view === 'manage' ? 'btn-primary' : 'bg-[var(--bg-card)]'}`}
                    >
                        Manage Elections
                    </button>
                    <button
                        onClick={() => setView('live')}
                        className={`btn ${view === 'live' ? 'btn-primary' : 'bg-[var(--bg-card)]'} flex items-center gap-2`}
                    >
                        <TrendingUp size={18} />
                        Live Monitor
                    </button>
                </div>
            </div>

            {
                view === 'live' ? (
                    <div className="space-y-6">
                        {!liveResults?.active ? (
                            <div className="card text-center py-12">
                                <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
                                <h3 className="text-xl font-bold">No Active Election</h3>
                                <p className="text-[var(--text-secondary)]">Start an election to see live results.</p>
                            </div>
                        ) : (
                            <>
                                <div className={`card ${liveResults.election.status === 'completed' ? 'bg-gradient-to-r from-gray-700 to-gray-900' : 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]'} text-white`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-2xl font-bold">{liveResults.election.title}</h3>
                                            <p className="opacity-90">
                                                {liveResults.election.status === 'ongoing' ? 'Live Voting in Progress' : 'Election Results'}
                                            </p>
                                        </div>
                                        {liveResults.election.status === 'ongoing' ? (
                                            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full animate-pulse">
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <span className="font-bold text-sm">LIVE</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                                <CheckCircle size={16} />
                                                <span className="font-bold text-sm">COMPLETED</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="card"
                                    >
                                        <h3 className="font-bold mb-4">Vote Distribution</h3>
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={liveResults.results} layout="vertical">
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis type="number" />
                                                    <YAxis dataKey="name" type="category" width={100} />
                                                    <Tooltip />
                                                    <Bar dataKey="votes" fill="var(--primary)">
                                                        {liveResults.results.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </motion.div>

                                    <div className="space-y-6">
                                        {Object.entries(
                                            liveResults.results.reduce((groups, candidate) => {
                                                const position = candidate.position || 'Unknown';
                                                if (!groups[position]) groups[position] = [];
                                                groups[position].push(candidate);
                                                return groups;
                                            }, {})
                                        ).map(([position, candidates]) => {
                                            const sortedCandidates = candidates.sort((a, b) => b.votes - a.votes);
                                            const totalVotesForPosition = sortedCandidates.reduce((sum, c) => sum + c.votes, 0);

                                            return (
                                                <div key={position} className="space-y-3">
                                                    <h4 className="font-bold text-lg text-gray-800 border-b-2 border-[var(--primary)] pb-2">
                                                        {position}
                                                    </h4>
                                                    {sortedCandidates.map((candidate, index) => {
                                                        const percentage = totalVotesForPosition > 0
                                                            ? ((candidate.votes / totalVotesForPosition) * 100).toFixed(1)
                                                            : 0;
                                                        const isWinner = index === 0;

                                                        return (
                                                            <motion.div
                                                                key={candidate.id}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className={`card flex items-center gap-4 ${isWinner ? 'border-2 border-green-500' : 'border-2 border-gray-300'}`}
                                                            >
                                                                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                                                                    {candidate.photoUrl ? (
                                                                        <img src={`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}${candidate.photoUrl}`} alt={candidate.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-xl">
                                                                            {candidate.name[0]}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex justify-between items-center mb-1">
                                                                        <div>
                                                                            <h4 className="font-bold text-lg">{candidate.name}</h4>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <span className="text-2xl font-bold text-[var(--primary)]">{percentage}%</span>
                                                                            <p className="text-xs text-gray-500">{candidate.votes} votes</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                                                        <div
                                                                            className={`h-3 rounded-full transition-all duration-1000 ${isWinner ? 'bg-green-500' : 'bg-red-400'}`}
                                                                            style={{ width: `${percentage}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <div className="mt-2 flex items-center gap-2">
                                                                        {isWinner ? (
                                                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center gap-1">
                                                                                <CheckCircle size={14} /> WINNER
                                                                            </span>
                                                                        ) : (
                                                                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                                                                                LOST
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="card border-t-4 border-[var(--primary)]">
                                <h3 className="font-bold mb-4">Create Election</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Title</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Description</label>
                                        <textarea
                                            className="input"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="2"
                                            placeholder="Brief description of the election"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Positions (comma-separated)</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.positions}
                                            onChange={(e) => setFormData({ ...formData, positions: e.target.value })}
                                            placeholder="e.g., President, Vice President, Secretary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Start Date</label>
                                        <input
                                            type="date"
                                            className="input"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">End Date</label>
                                        <input
                                            type="date"
                                            className="input"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
                                        <Plus size={18} /> Create Election
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-bold text-lg">Active Elections</h3>
                            {elections.filter(e => e.status !== 'completed').length === 0 ? (
                                <p className="text-[var(--text-secondary)]">No active elections found.</p>
                            ) : (
                                elections.filter(e => e.status !== 'completed').map((election, index) => (
                                    <motion.div
                                        key={election.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="card relative overflow-hidden"
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${election.status === 'ongoing' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <div className="flex justify-between items-start pl-4">
                                            <div>
                                                <h4 className="font-bold text-lg">{election.title}</h4>
                                                <div className="flex gap-4 text-sm text-[var(--text-secondary)] mt-1">
                                                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1"><UserPlus size={14} /> {election.Candidates?.length || 0} Candidates</span>
                                                </div>

                                                <div className="flex gap-3 mt-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedElection(election);
                                                            setShowCandidateModal(true);
                                                        }}
                                                        className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
                                                    >
                                                        <UserPlus size={14} /> Add Candidate
                                                    </button>

                                                    {election.status === 'upcoming' && (
                                                        <button
                                                            onClick={() => handleOpenElection(election.id || election._id)}
                                                            className="text-sm text-green-600 hover:underline flex items-center gap-1"
                                                        >
                                                            <CheckCircle size={14} /> Open Election
                                                        </button>
                                                    )}

                                                    {election.status === 'ongoing' && (
                                                        <button
                                                            onClick={() => handleCloseElection(election.id || election._id)}
                                                            className="text-sm text-red-600 hover:underline flex items-center gap-1"
                                                        >
                                                            <AlertTriangle size={14} /> Close Election
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        <div className="space-y-4 mt-8">
                            <h3 className="font-bold text-lg">Completed Elections</h3>
                            {elections.filter(e => e.status === 'completed').length === 0 ? (
                                <p className="text-[var(--text-secondary)]">No completed elections found.</p>
                            ) : (
                                elections.filter(e => e.status === 'completed').map((election, index) => (
                                    <motion.div
                                        key={election.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="card relative overflow-hidden bg-gray-50"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-500"></div>
                                        <div className="flex justify-between items-start pl-4">
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-700">{election.title}</h4>
                                                <div className="flex gap-4 text-sm text-[var(--text-secondary)] mt-1">
                                                    <span className="flex items-center gap-1"><Calendar size={14} /> Ended {new Date(election.endDate).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1"><UserPlus size={14} /> {election.Candidates?.length || 0} Candidates</span>
                                                </div>

                                                <div className="flex gap-3 mt-2">
                                                    <button
                                                        onClick={() => handleViewResults(election)}
                                                        className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
                                                    >
                                                        <TrendingUp size={14} /> View Results
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteElection(election.id || election._id)}
                                                        className="text-sm text-red-600 hover:underline flex items-center gap-1"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                                                <CheckCircle size={12} /> COMPLETED
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                )
            }

            {/* Candidate Modal */}
            <AnimatePresence>
                {showCandidateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            <h3 className="font-bold text-xl mb-4">Add Candidate to {selectedElection?.title}</h3>
                            <form onSubmit={handleAddCandidate} className="space-y-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Search & Select User</label>
                                    <input
                                        type="text"
                                        className="input mb-2"
                                        placeholder="Search by name or student ID..."
                                        value={userSearch}
                                        onChange={e => setUserSearch(e.target.value)}
                                    />
                                    <select
                                        className="input"
                                        value={candidateData.userId}
                                        onChange={e => setCandidateData({ ...candidateData, userId: e.target.value })}
                                        required
                                        size="5"
                                        style={{ minHeight: '120px' }}
                                    >
                                        <option value="">Select a user...</option>
                                        {users
                                            .filter(user => {
                                                const searchLower = userSearch.toLowerCase();
                                                return (
                                                    user.firstName?.toLowerCase().includes(searchLower) ||
                                                    user.lastName?.toLowerCase().includes(searchLower) ||
                                                    user.studentId?.toLowerCase().includes(searchLower)
                                                );
                                            })
                                            .map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.firstName} {user.lastName} ({user.studentId}) - {user.department || 'No Dept'}
                                                </option>
                                            ))}
                                    </select>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                                        {users.length} total users available
                                    </p>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Position</label>
                                    <select
                                        className="input"
                                        value={candidateData.position}
                                        onChange={e => setCandidateData({ ...candidateData, position: e.target.value })}
                                    >
                                        <option value="President">President</option>
                                        <option value="Vice President">Vice President</option>
                                        <option value="Secretary">Secretary</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Manifesto</label>
                                    <textarea
                                        className="input"
                                        value={candidateData.manifesto}
                                        onChange={e => setCandidateData({ ...candidateData, manifesto: e.target.value })}
                                        rows="3"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Description</label>
                                    <textarea
                                        className="input"
                                        value={candidateData.description}
                                        onChange={e => setCandidateData({ ...candidateData, description: e.target.value })}
                                        rows="3"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Photo</label>
                                    <input
                                        type="file"
                                        className="input"
                                        onChange={e => setCandidateData({ ...candidateData, photo: e.target.files[0] })}
                                        accept="image/*"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <button
                                        type="button"
                                        className="btn bg-gray-200 text-gray-700"
                                        onClick={() => setShowCandidateModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">Add Candidate</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Modal */}
            <AnimatePresence>
                {showResultsModal && resultsData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white relative"
                            style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                                border: '4px solid #FFD700' // Gold border
                            }}
                        >
                            <button
                                onClick={() => setShowResultsModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <Plus size={24} className="rotate-45" />
                            </button>

                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    className="text-6xl mb-4"
                                >
                                    🎓
                                </motion.div>
                                <h2 className="text-3xl font-bold text-[var(--primary)] mb-2">Election Results</h2>
                                <p className="text-xl text-gray-600">
                                    Total Participations: <span className="font-bold text-black">{resultsData.totalVotes}</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                {Object.entries(resultsData.winners).map(([position, winner], index) => (
                                    <motion.div
                                        key={position}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-[var(--primary)]"
                                    >
                                        <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wider mb-4">{position}</h3>
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#FFD700] shadow-md">
                                                {winner.photo ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}${winner.photo}`}
                                                        alt={winner.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
                                                        {winner.name[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-2xl font-bold">{winner.name}</h4>
                                                    <span className="text-2xl">🎉</span>
                                                </div>
                                                <p className="text-gray-600">
                                                    Received <span className="font-bold text-[var(--primary)]">{winner.voteCount}</span> votes
                                                </p>
                                                <p className="text-sm text-gray-500 mt-2 italic">
                                                    "Congratulations to {winner.name} for winning the position of {position}!"
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => setShowResultsModal(false)}
                                    className="btn btn-primary px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
                                >
                                    Close Results
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default Elections;
