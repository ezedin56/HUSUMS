import { Calendar, Clock, Users, ChevronRight } from 'lucide-react';

const SessionCard = ({ session, onClick, isActive }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'closed': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    return (
        <div
            onClick={onClick}
            className={`
                relative overflow-hidden rounded-xl border p-4 cursor-pointer transition-all hover:scale-[1.02]
                ${isActive
                    ? 'bg-white/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }
            `}
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">{session.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={14} />
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(session.status)}`}>
                    {session.status.toUpperCase()}
                </span>
            </div>

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-gray-300">
                        <Clock size={14} />
                        <span>{session.startTime} - {session.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-300">
                        <Users size={14} />
                        <span>{session.presentCount}/{session.totalMembers} Present</span>
                    </div>
                </div>
                <ChevronRight className="text-gray-500" size={16} />
            </div>
        </div>
    );
};

export default SessionCard;
