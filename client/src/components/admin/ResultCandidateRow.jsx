import React, { memo } from 'react';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { getPhotoUrl } from '../../utils/imageUrl';

const ResultCandidateRow = memo(({ candidate, isWinner, isLoser }) => {
    return (
        <div className={`flex items-center gap-4 p-4 rounded-lg ${isWinner ? 'bg-green-500/10 border border-green-500/30' : isLoser ? 'bg-red-500/10 border border-red-500/30' : 'bg-white/5'}`}>
            <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                {candidate.photo ? (
                    <img src={getPhotoUrl(candidate.photo)} alt={candidate.name} className="w-full h-full object-cover" />
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
});

export default ResultCandidateRow;
