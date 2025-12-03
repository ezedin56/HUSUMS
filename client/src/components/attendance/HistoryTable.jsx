import { Download, Trash2, Eye } from 'lucide-react';

const HistoryTable = ({ sessions, onView, onDelete, onExport }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Session</th>
                        <th className="p-4 font-medium">Time</th>
                        <th className="p-4 font-medium">Stats</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((session) => (
                        <tr key={session._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white">
                                {new Date(session.date).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                                <div className="font-medium text-white">{session.title}</div>
                                <div className="text-xs text-gray-500">Created by {session.createdBy?.firstName}</div>
                            </td>
                            <td className="p-4 text-gray-300 font-mono text-sm">
                                {session.startTime} - {session.endTime}
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-green-400" title="Present">{session.presentCount}</span>
                                    <span className="text-gray-600">/</span>
                                    <span className="text-red-400" title="Absent">{session.absentCount}</span>
                                    <span className="text-gray-600">/</span>
                                    <span className="text-yellow-400" title="Late">{session.lateCount}</span>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${session.status === 'active'
                                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                    }`}>
                                    {session.status.toUpperCase()}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onView(session)}
                                        className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => onExport(session)}
                                        className="p-2 hover:bg-white/10 rounded-lg text-green-400 transition-colors"
                                        title="Export Excel"
                                    >
                                        <Download size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(session._id)}
                                        className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryTable;
