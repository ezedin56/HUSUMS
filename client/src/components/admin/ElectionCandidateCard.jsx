import React, { memo } from 'react';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPhotoUrl } from '../../utils/imageUrl';

const ElectionCandidateCard = memo(({ candidate }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
        >
            <div className="flex items-start gap-4">
                {/* Candidate Photo */}
                <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden border-2 border-white/10 flex-shrink-0">
                    {candidate.photoUrl || candidate.photo ? (
                        <img
                            src={getPhotoUrl(candidate.photoUrl || candidate.photo)}
                            alt={`${candidate.User?.firstName} ${candidate.User?.lastName}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <User size={32} className="text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Candidate Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">
                        {candidate.User?.firstName} {candidate.User?.lastName}
                    </h4>
                    <p className="text-sm text-green-400 font-medium">{candidate.position}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {candidate.description}
                    </p>

                    {/* Vote Count */}
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-400">
                            {candidate.voteCount || 0} votes
                        </span>
                    </div>
                </div>
            </div>

            {/* Manifesto */}
            {candidate.manifesto && (
                <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Manifesto:</p>
                    <p className="text-xs text-gray-400 line-clamp-3">
                        {candidate.manifesto}
                    </p>
                </div>
            )}
        </motion.div>
    );
});

export default ElectionCandidateCard;
