import React, { memo } from 'react';
import { User, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CandidateCard = memo(({ candidate, onEdit, onDelete }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col items-center text-center"
        >
            <div className="w-24 h-24 rounded-full bg-gray-700 mb-4 overflow-hidden border-4 border-white/10">
                {candidate.photoUrl ? (
                    <img
                        src={candidate.photoUrl.startsWith('data:') ? candidate.photoUrl : `http://localhost:5000${candidate.photoUrl}`}
                        alt="Candidate"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <User size={40} className="text-gray-400" />
                    </div>
                )}
            </div>
            <h3 className="text-xl font-bold mb-1">
                {candidate.User?.firstName} {candidate.User?.lastName}
            </h3>
            <p className="text-[var(--primary)] font-medium mb-4">{candidate.position}</p>
            <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                {candidate.description}
            </p>
            <div className="mt-auto w-full flex gap-2">
                <button
                    onClick={() => onEdit(candidate)}
                    className="flex-1 btn btn-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex items-center justify-center gap-2"
                >
                    <Edit size={16} /> Edit
                </button>
                <button
                    onClick={() => onDelete(candidate.id)}
                    className="flex-1 btn btn-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center gap-2"
                >
                    <Trash2 size={16} /> Remove
                </button>
            </div>
        </motion.div>
    );
});

export default CandidateCard;
