import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import {
    BarChart3,
    Megaphone,
    Eye,
    EyeOff,
    Trophy
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
                setSelectedElectionId(data[0].id);
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

    const selectedElection = elections.find(e => e.id === selectedElectionId);

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
                            <option key={e.id} value={e.id}>{e.title}</option>
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
                    <button
                        onClick={toggleAnnounce}
                        className={`btn flex items-center gap-2 ${selectedElection.resultsAnnounced
                                ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                                : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                    >
                        {selectedElection.resultsAnnounced ? <EyeOff size={20} /> : <Eye size={20} />}
                        {selectedElection.resultsAnnounced ? 'Hide Results from Public' : 'Announce Results to Public'}
                    </button>
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
                        {results.results && results.results.reduce((acc, curr) => {
                            if (!acc[curr.position]) acc[curr.position] = [];
                            acc[curr.position].push(curr);
                            return acc;
                        }, {}).map((group, position) => (
                            // Note: The reduce above returns an object, not an array, so map won't work directly on it.
                            // I need to iterate over Object.entries
                            null
                        ))}

                        {Object.entries(results.results.reduce((acc, curr) => {
                            if (!acc[curr.position]) acc[curr.position] = [];
                            acc[curr.position].push(curr);
                            return acc;
                        }, {})).map(([position, candidates]) => (
                            <div key={position} className="card bg-white/5 border border-white/10 p-6 rounded-xl">
                                <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">{position}</h3>
                                <div className="space-y-4">
                                    {candidates.map((candidate, index) => (
                                        <div key={candidate._id} className="flex items-center gap-4">
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
                                                    <span className="font-bold">{candidate.name}</span>
                                                    <span className="font-bold text-[var(--primary)]">{candidate.voteCount} votes ({candidate.percentage}%)</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-[var(--primary)] h-2 rounded-full transition-all duration-1000"
                                                        style={{ width: `${candidate.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            {index === 0 && (
                                                <Trophy className="text-yellow-500" size={24} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
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
