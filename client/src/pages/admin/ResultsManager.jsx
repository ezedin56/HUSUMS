import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import {
    Eye,
    EyeOff,
    Trash2
} from 'lucide-react';
import ResultCard from '../../components/admin/ResultCard';

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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Results Management</h1>
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
                </div>
            </div>

            {selectedElection && (
                <div className="card bg-white/5 border border-white/10 p-6 rounded-xl mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left w-full sm:w-auto">
                        <h2 className="text-xl font-bold mb-1">{selectedElection.title}</h2>
                        <p className="text-gray-400">
                            Status: <span className="text-white font-bold">{selectedElection.status.toUpperCase()}</span>
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            onClick={toggleAnnounce}
                            className={`btn flex items-center justify-center gap-2 w-full sm:w-auto ${selectedElection.resultsAnnounced
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
                                className="btn bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center gap-2 w-full sm:w-auto"
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
                        }, {})).map(([position, candidates]) => (
                            <ResultCard
                                key={position}
                                position={position}
                                candidates={candidates}
                            />
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
