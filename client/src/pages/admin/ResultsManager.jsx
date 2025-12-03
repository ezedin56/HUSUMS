import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import {
    BarChart3,
    Megaphone,
    Eye,
    EyeOff,
    Trophy,
    Trash2,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const ResultsManager = () => {
    const [elections, setElections] = useState([]);
    const [selectedElectionId, setSelectedElectionId] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchElections();
    }, []);

    useEffect(() => {
        if (selectedElectionId) {
            fetchResults(selectedElectionId);
            const interval = setInterval(() => fetchResults(selectedElectionId), 5000);
            return () => clearInterval(interval);
        } else {
            setResults(null);
        }
    }, [selectedElectionId]);

    const fetchElections = async () => {
        try {
            const data = await api.get('/president/elections');
            setElections(data);
            if (data.length > 0 && !selectedElectionId) {
                setSelectedElectionId(data[0]._id);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching elections:', error);
            setLoading(false);
        }
    };

    const fetchResults = async (id) => {
        try {
            const data = await api.get(`/president/results/${id}`);
            setResults(data);
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    const toggleAnnounce = async () => {
        try {
            await api.patch(`/president/elections/${selectedElectionId}/announce`);
            fetchElections(); // Refresh to update the announced status in the list
            alert('Visibility updated successfully');
        } catch (error) {
            alert('Error updating visibility: ' + error.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this election? This will delete all candidates and votes permanently.')) {
            return;
        }

        try {
            await api.delete(`/president/elections/${selectedElectionId}`);
            alert('Election deleted successfully');
            setSelectedElectionId('');
            fetchElections();
        } catch (error) {
            alert('Error deleting election: ' + error.message);
        }
    };

    const selectedElection = elections.find(e => e._id === selectedElectionId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Results Management</h1>
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
                </div>
            </div>

            {selectedElection && (
                <div className="card bg-white/5 border border-white/10 p-6 rounded-xl mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold mb-1">{selectedElection.title}</h2>
                        <p className="text-gray-400">
                            Status: <span className="text-white font-bold">{selectedElection.status.toUpperCase()}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={toggleAnnounce}
                            className={`btn flex items-center gap-2 ${selectedElection.resultsAnnounced
                                ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                                : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                        >
                            {selectedElection.resultsAnnounced ? <EyeOff size={20} /> : <Eye size={20} />}
                            {selectedElection.resultsAnnounced ? 'Hide Results' : 'Announce Results'}
                        </button>
                        {(selectedElection.status === 'completed' || selectedElection.resultsAnnounced) && (
                            <button
                                onClick={handleDelete}
                                className="btn bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center gap-2"
                            >
                                <Trash2 size={20} />
                                Delete Election
                            </button>
                        )}
                    </div>
                </div>
            )}

            {results ? (
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card bg-blue-500/10 border border-blue-500/20 p-6 rounded-xl text-center">
                            <h3 className="text-gray-400 mb-2">Total Votes</h3>
                            <p className="text-4xl font-bold text-blue-400">{results.totalVotes}</p>
                        </div>
                        {/* Add more summary cards if needed */}
                    </div>

                    <div className="space-y-6">
                        {Object.entries(results.results.reduce((acc, curr) => {
                            if (!acc[curr.position]) acc[curr.position] = [];
                            acc[curr.position].push(curr);
                            return acc;
                        }, {})).map(([position, candidates]) => {
                            // Sort candidates by vote count to determine winner
                            const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
                            const winnerVotes = sortedCandidates[0]?.voteCount || 0;

                            return (
                                <div key={position} className="card bg-white/5 border border-white/10 p-6 rounded-xl">
                                    <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">{position}</h3>
                                    <div className="space-y-4">
                                        {sortedCandidates.map((candidate, index) => {
                                            const isWinner = candidate.voteCount === winnerVotes && winnerVotes > 0;
                                            const isLoser = !isWinner && sortedCandidates.length > 1;

                                            return (
                                                <div key={candidate._id} className={`flex items-center gap-4 p-4 rounded-lg ${isWinner ? 'bg-green-500/10 border border-green-500/30' : isLoser ? 'bg-red-500/10 border border-red-500/30' : 'bg-white/5'}`}>
                                                    <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                                                        {candidate.photo ? (
                                                            <img src={`http://localhost:5000${candidate.photo}`} alt={candidate.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                                                {candidate.name[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between mb-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold">{candidate.name}</span>
                                                                {isWinner && (
                                                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                                                                        <CheckCircle size={12} /> WINNER
                                                                    </span>
                                                                )}
                                                                {isLoser && (
                                                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold flex items-center gap-1">
                                                                        <XCircle size={12} /> LOST
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="font-bold text-[var(--primary)]">{candidate.voteCount} votes ({candidate.percentage}%)</span>
                                                        </div>
                                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full transition-all duration-1000 ${isWinner ? 'bg-green-500' : isLoser ? 'bg-red-500' : 'bg-[var(--primary)]'}`}
                                                                style={{ width: `${candidate.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    {isWinner && (
                                                        <Trophy className="text-yellow-500" size={24} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    Loading results...
                </div>
            )}
        </div>
    );
};

export default ResultsManager;
