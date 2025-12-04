import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, Calendar, Users, BarChart2, ChevronRight, Trophy, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../../utils/api';

const Elections = () => {
    const [activeElections, setActiveElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedElection, setSelectedElection] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [voteSuccess, setVoteSuccess] = useState(false);

    useEffect(() => {
        fetchElections();
    }, []);

    const fetchElections = async () => {
        try {
            const res = await api.get('/elections/active');
            // Check vote status for each election
            const electionsWithStatus = await Promise.all(res.map(async (election) => {
                try {
                    const status = await api.get(`/vote/status/${election._id}`);
                    return {
                        ...election,
                        hasVoted: status.hasVoted,
                        votedPositions: status.votedPositions || []
                    };
                } catch (err) {
                    return { ...election, hasVoted: false, votedPositions: [] };
                }
            }));
            setActiveElections(electionsWithStatus);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching elections:', error);
            setLoading(false);
        }
    };

    const handleVoteClick = async (election) => {
        // Allow entry if not all positions are voted (logic can be refined if we know total positions, 
        // but for now we allow entry unless explicitly blocked by backend or UI logic)
        setSelectedElection(election);
        try {
            const res = await api.get(`/candidates/${election._id}`);
            setCandidates(res);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    };

    const handleSubmitVote = async () => {
        if (!selectedCandidate) return;
        setSubmitting(true);
        try {
            await api.post('/vote', {
                electionId: selectedElection._id,
                candidateId: selectedCandidate._id
            });
            setVoteSuccess(true);

            // Update local state to reflect the new vote immediately
            const updatedVotedPositions = [...(selectedElection.votedPositions || []), selectedCandidate.position];
            setSelectedElection(prev => ({
                ...prev,
                votedPositions: updatedVotedPositions
            }));

            setTimeout(() => {
                setVoteSuccess(false);
                setSelectedCandidate(null);
                // Don't close the election view immediately, let them vote for others
                // But refresh the election list in background
                fetchElections();
            }, 2000);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit vote');
        } finally {
            setSubmitting(false);
        }
    };

    // Helper to check if all positions in the current candidate list are voted
    const allPositionsVoted = selectedElection && candidates.length > 0 &&
        [...new Set(candidates.map(c => c.position))].every(pos => selectedElection.votedPositions?.includes(pos));

    return (
        <div className="relative min-h-screen p-6 overflow-hidden">
            {/* Animated Background */}
            <motion.div
                className="absolute inset-0 -z-10 opacity-20"
                animate={{
                    background: [
                        "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
                        "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
                        "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)",
                    ]
                }}
                transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
            />

            <div className="flex justify-between items-center mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
                        Election System
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Participate in active elections and view results.
                    </p>
                </motion.div>
            </div>

            {/* Active Elections Grid */}
            {!selectedElection ? (
                <>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Clock className="text-blue-500" />
                        Active Elections
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {loading ? (
                            <div className="col-span-full text-center py-12 text-gray-500">Loading elections...</div>
                        ) : activeElections.length === 0 ? (
                            <div className="col-span-full text-center py-12 bg-white/40 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                <Vote size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">No active elections</p>
                            </div>
                        ) : (
                            activeElections.map((election, index) => (
                                <motion.div
                                    key={election._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                                >
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                            Live
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 pr-16">{election.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                                        {election.description}
                                    </p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                            <Calendar size={16} className="text-blue-500" />
                                            <span>Ends: {new Date(election.endDate).toLocaleDateString()}</span>
                                        </div>
                                        {election.votedPositions && election.votedPositions.length > 0 && (
                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                <CheckCircle size={16} className="text-green-500" />
                                                <span>Voted for: {election.votedPositions.join(', ')}</span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleVoteClick(election)}
                                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all transform active:scale-95
                                            bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50`}
                                    >
                                        {election.hasVoted ? 'Continue Voting' : 'Vote Now'}
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <button
                        onClick={() => setSelectedElection(null)}
                        className="mb-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-2"
                    >
                        <ChevronRight className="rotate-180" size={20} />
                        Back to Elections
                    </button>

                    {voteSuccess ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl border border-green-200 dark:border-green-900"
                        >
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={40} className="text-green-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Vote Submitted!</h2>
                            <p className="text-gray-500 dark:text-gray-400">Your vote has been recorded.</p>
                        </motion.div>
                    ) : (
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
                            <h2 className="text-2xl font-bold mb-2">{selectedElection.title}</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">Select your preferred candidate below.</p>

                            {allPositionsVoted && (
                                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl flex items-center gap-3">
                                    <CheckCircle size={24} />
                                    <span>You have voted for all available positions in this election.</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {candidates.map((candidate) => {
                                    const isVotedPosition = selectedElection.votedPositions?.includes(candidate.position);
                                    const isSelected = selectedCandidate?._id === candidate._id;

                                    return (
                                        <motion.div
                                            key={candidate._id}
                                            whileHover={!isVotedPosition ? { scale: 1.02 } : {}}
                                            whileTap={!isVotedPosition ? { scale: 0.98 } : {}}
                                            onClick={() => !isVotedPosition && setSelectedCandidate(candidate)}
                                            className={`relative p-6 rounded-2xl border-2 transition-all
                                                ${isVotedPosition
                                                    ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                                                    : 'cursor-pointer'
                                                }
                                                ${isSelected
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : !isVotedPosition && 'border-transparent bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {isVotedPosition && (
                                                <div className="absolute top-4 right-4 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-bold text-gray-500">
                                                    VOTED
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                                                    {candidate.user?.firstName?.[0]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-lg">{candidate.user?.firstName} {candidate.user?.lastName}</h3>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                            {candidate.position}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{candidate.manifesto || 'No manifesto provided'}</p>
                                                </div>
                                                {isSelected && (
                                                    <CheckCircle className="ml-auto text-blue-500" size={24} />
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleSubmitVote}
                                    disabled={!selectedCandidate || submitting}
                                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all
                                        ${!selectedCandidate || submitting
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30'
                                        }`}
                                >
                                    {submitting ? 'Submitting...' : 'Confirm Vote'}
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Elections;
