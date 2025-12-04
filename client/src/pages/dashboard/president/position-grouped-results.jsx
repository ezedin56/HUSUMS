// Position-grouped results display for Live Monitor
// Replace lines 227-282 in Elections.jsx

<div className="space-y-6">
    {/* Group candidates by position */}
    {Object.entries(
        liveResults.results.reduce((groups, candidate) => {
            const position = candidate.position || 'Unknown';
            if (!groups[position]) groups[position] = [];
            groups[position].push(candidate);
            return groups;
        }, {})
    ).map(([position, candidates]) => {
        // Sort candidates within this position by votes
        const sortedCandidates = candidates.sort((a, b) => b.votes - a.votes);
        const totalVotesForPosition = sortedCandidates.reduce((sum, c) => sum + c.votes, 0);

        return (
            <div key={position} className="space-y-3">
                {/* Position Header */}
                <h4 className="font-bold text-lg text-gray-800 border-b-2 border-[var(--primary)] pb-2">
                    {position}
                </h4>

                {/* Candidates for this position */}
                {sortedCandidates.map((candidate, index) => {
                    const percentage = totalVotesForPosition > 0
                        ? ((candidate.votes / totalVotesForPosition) * 100).toFixed(1)
                        : 0;
                    const isWinner = index === 0; // Winner is first in sorted list

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
                                    <img src={`http://localhost:5000${candidate.photoUrl}`} alt={candidate.name} className="w-full h-full object-cover" />
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
