import React, { memo } from 'react';
import ResultCandidateRow from './ResultCandidateRow';

const ResultCard = memo(({ position, candidates }) => {
    const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
    const winnerVotes = sortedCandidates[0]?.voteCount || 0;

    return (
        <div className="card bg-white/5 border border-white/10 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">{position}</h3>
            <div className="space-y-4">
                {sortedCandidates.map((candidate) => {
                    const isWinner = candidate.voteCount === winnerVotes && winnerVotes > 0;
                    const isLoser = !isWinner && sortedCandidates.length > 1;

                    return (
                        <ResultCandidateRow
                            key={candidate._id}
                            candidate={candidate}
                            isWinner={isWinner}
                            isLoser={isLoser}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default ResultCard;
