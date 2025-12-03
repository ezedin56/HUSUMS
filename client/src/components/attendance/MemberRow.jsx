import { useState } from 'react';
import { Check, X, Clock, AlertTriangle, MessageSquare, Save } from 'lucide-react';

const MemberRow = ({ member, record, onMark, disabled, isSelected, onSelect }) => {
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [note, setNote] = useState(record?.notes || '');

    const handleNoteSave = () => {
        onMark(member._id, record?.status || 'present', note);
        setShowNoteInput(false);
    };

    const statusColors = {
        present: 'bg-green-500/20 text-green-400 border-green-500/50',
        absent: 'bg-red-500/20 text-red-400 border-red-500/50',
        late: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
        excused: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
        not_marked: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    };

    return (
        <div className={`bg-white/5 border ${isSelected ? 'border-green-500/50 bg-green-500/5' : 'border-white/10'} rounded-lg p-4 mb-2 hover:bg-white/10 transition-all`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={isSelected || false}
                            onChange={(e) => onSelect(member._id, e.target.checked)}
                            className="w-5 h-5 rounded border-gray-500 text-green-500 focus:ring-green-500 bg-gray-700 cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                            {member.firstName[0]}{member.lastName[0]}
                        </div>
                        <div>
                            <h4 className="text-white font-medium">{member.firstName} {member.lastName}</h4>
                            <p className="text-sm text-gray-400">{member.studentId} • {member.department}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onMark(member._id, 'present')}
                        disabled={disabled}
                        className={`p-2 rounded-lg transition-all ${record?.status === 'present'
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                            : 'bg-white/5 text-gray-400 hover:bg-green-500/20 hover:text-green-400'
                            }`}
                        title="Present"
                    >
                        <Check size={20} />
                    </button>
                    <button
                        onClick={() => onMark(member._id, 'absent')}
                        disabled={disabled}
                        className={`p-2 rounded-lg transition-all ${record?.status === 'absent'
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                            : 'bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400'
                            }`}
                        title="Absent"
                    >
                        <X size={20} />
                    </button>
                    <button
                        onClick={() => onMark(member._id, 'late')}
                        disabled={disabled}
                        className={`p-2 rounded-lg transition-all ${record?.status === 'late'
                            ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'
                            : 'bg-white/5 text-gray-400 hover:bg-yellow-500/20 hover:text-yellow-400'
                            }`}
                        title="Late"
                    >
                        <Clock size={20} />
                    </button>
                    <button
                        onClick={() => onMark(member._id, 'excused')}
                        disabled={disabled}
                        className={`p-2 rounded-lg transition-all ${record?.status === 'excused'
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                            : 'bg-white/5 text-gray-400 hover:bg-purple-500/20 hover:text-purple-400'
                            }`}
                        title="Excused"
                    >
                        <AlertTriangle size={20} />
                    </button>

                    <div className="w-px h-8 bg-white/10 mx-2" />

                    <button
                        onClick={() => setShowNoteInput(!showNoteInput)}
                        className={`p-2 rounded-lg transition-all ${record?.notes
                            ? 'text-blue-400 bg-blue-500/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                        title="Add Note"
                    >
                        <MessageSquare size={20} />
                    </button>
                </div>
            </div>

            {showNoteInput && (
                <div className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note..."
                        className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                    />
                    <button
                        onClick={handleNoteSave}
                        className="bg-green-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                        <Save size={16} />
                        Save
                    </button>
                </div>
            )}

            {record?.notes && !showNoteInput && (
                <p className="mt-2 text-sm text-gray-400 italic border-l-2 border-blue-500/50 pl-3">
                    "{record.notes}"
                </p>
            )}
        </div>
    );
};

export default MemberRow;
