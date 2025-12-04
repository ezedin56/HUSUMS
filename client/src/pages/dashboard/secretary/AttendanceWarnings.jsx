import { useState, useEffect } from 'react';
import { AlertTriangle, User, Calendar, Mail } from 'lucide-react';
import { api } from '../../../utils/api';
import { useToast } from '../../../components/Toast';

const AttendanceWarnings = () => {
    const [warnings, setWarnings] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchWarnings();
    }, []);

    const fetchWarnings = async () => {
        try {
            setLoading(true);
            const res = await api.get('/attendance/warnings');
            setWarnings(res);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching warnings:', error);
            toast.error('Failed to load attendance warnings.');
            setLoading(false);
        }
    };

    const handleSendWarning = async (userId) => {
        try {
            // In a real app, this would trigger an email/notification
            toast.success('Warning notification sent to member.');
        } catch (error) {
            toast.error('Failed to send warning.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-start gap-4">
                <div className="p-3 bg-red-500/20 rounded-lg text-red-500">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Attendance Risk Monitor</h3>
                    <p className="text-gray-300">
                        Members listed below have missed 3 or more consecutive attendance sessions.
                        Immediate action may be required.
                    </p>
                </div>
            </div>

            {warnings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {warnings.map((warning) => (
                        <div key={warning.userId} className="bg-white/5 border border-red-500/30 rounded-xl p-5 hover:bg-white/10 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                                        {warning.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{warning.name}</h4>
                                        <p className="text-sm text-gray-400">{warning.studentId}</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded border border-red-500/30">
                                    AT RISK
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="text-sm text-gray-300">
                                    <p className="mb-2 font-medium text-red-400">Missed Sessions:</p>
                                    {warning.sessions.map((session, idx) => (
                                        <div key={idx} className="flex items-center gap-2 mb-1">
                                            <Calendar size={12} className="text-gray-500" />
                                            <span>{new Date(session.date).toLocaleDateString()} - {session.title}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500">Department: {warning.department}</p>
                            </div>

                            <button
                                onClick={() => handleSendWarning(warning.userId)}
                                className="w-full py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 font-medium"
                            >
                                <Mail size={16} />
                                Send Warning Notice
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 text-green-500">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No At-Risk Members</h3>
                    <p className="text-gray-400">Great news! No members have missed 3 consecutive sessions recently.</p>
                </div>
            )}
        </div>
    );
};

export default AttendanceWarnings;
