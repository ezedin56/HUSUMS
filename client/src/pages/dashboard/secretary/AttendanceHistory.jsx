import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { useToast } from '../../../components/Toast';
import HistoryTable from '../../../components/attendance/HistoryTable';
import { Calendar, Filter, Trash2, AlertTriangle, X, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

const AttendanceHistory = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: 'all'
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessionRecords, setSessionRecords] = useState([]);
    const [loadingRecords, setLoadingRecords] = useState(false);
    const toast = useToast();

    useEffect(() => {
        fetchHistory();
    }, [filters]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);
            if (filters.status !== 'all') queryParams.append('status', filters.status);

            const res = await api.get(`/attendance/sessions?${queryParams.toString()}`);
            setSessions(res);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching history:', error);
            toast.error('Failed to load attendance history.');
            setLoading(false);
        }
    };

    const handleViewSession = async (session) => {
        setSelectedSession(session);
        setLoadingRecords(true);
        try {
            const records = await api.get(`/attendance/sessions/${session._id}/records`);
            setSessionRecords(records);
        } catch (error) {
            console.error('Error fetching session records:', error);
            toast.error('Failed to load session details.');
        } finally {
            setLoadingRecords(false);
        }
    };

    const handleDelete = async (sessionId) => {
        if (!window.confirm('Are you sure you want to delete this session and all its records?')) return;

        try {
            await api.delete(`/attendance/sessions/${sessionId}`);
            toast.success('Session deleted successfully');
            fetchHistory();
        } catch (error) {
            console.error('Error deleting session:', error);
            toast.error('Failed to delete session.');
        }
    };

    const handleCleanup = async () => {
        try {
            const res = await api.delete('/attendance/cleanup');
            toast.success(res.message);
            setShowDeleteConfirm(false);
            fetchHistory();
        } catch (error) {
            console.error('Error cleaning up:', error);
            toast.error('Failed to cleanup old records.');
        }
    };

    const handleExport = async (session) => {
        try {
            const startDate = new Date(session.date).toISOString().split('T')[0];
            const endDate = startDate;

            // Create a proper download link
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}/api/attendance/export?startDate=${startDate}&endDate=${endDate}`;

            // Create temporary link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance_${startDate}.csv`);
            link.style.display = 'none';

            // Add authorization header via fetch and blob
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            link.href = blobUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

            toast.success('Export completed');
        } catch (error) {
            console.error('Error exporting:', error);
            toast.error('Failed to export session.');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            present: 'text-green-400',
            absent: 'text-red-400',
            late: 'text-yellow-400',
            excused: 'text-purple-400',
            permission: 'text-blue-400'
        };
        return colors[status] || 'text-gray-400';
    };

    return (
        <div className="space-y-6">
            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50 min-w-[120px]"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                    <Trash2 size={16} />
                    Cleanup Old Records
                </button>
            </div>

            {/* History Table */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading history...</div>
                ) : sessions.length > 0 ? (
                    <HistoryTable
                        sessions={sessions}
                        onView={handleViewSession}
                        onDelete={(id) => handleDelete(id)}
                        onExport={handleExport}
                    />
                ) : (
                    <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
                        <Calendar size={48} className="opacity-20" />
                        <p>No attendance sessions found for the selected criteria.</p>
                    </div>
                )}
            </div>

            {/* Session Details Modal */}
            {selectedSession && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0a1f14] border border-white/10 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">{selectedSession.title}</h2>
                                <p className="text-gray-400 text-sm">
                                    {new Date(selectedSession.date).toLocaleDateString()} • {selectedSession.startTime} - {selectedSession.endTime}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedSession(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-4 gap-4 p-6 border-b border-white/10">
                            <div className="text-center">
                                <Users className="mx-auto mb-2 text-blue-400" size={24} />
                                <p className="text-2xl font-bold text-white">{selectedSession.totalMembers}</p>
                                <p className="text-xs text-gray-400">Total</p>
                            </div>
                            <div className="text-center">
                                <CheckCircle className="mx-auto mb-2 text-green-400" size={24} />
                                <p className="text-2xl font-bold text-green-400">{selectedSession.presentCount}</p>
                                <p className="text-xs text-gray-400">Present</p>
                            </div>
                            <div className="text-center">
                                <XCircle className="mx-auto mb-2 text-red-400" size={24} />
                                <p className="text-2xl font-bold text-red-400">{selectedSession.absentCount}</p>
                                <p className="text-xs text-gray-400">Absent</p>
                            </div>
                            <div className="text-center">
                                <Clock className="mx-auto mb-2 text-yellow-400" size={24} />
                                <p className="text-2xl font-bold text-yellow-400">{selectedSession.lateCount}</p>
                                <p className="text-xs text-gray-400">Late</p>
                            </div>
                        </div>

                        {/* Records List */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {loadingRecords ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {sessionRecords.map((record) => (
                                        <div key={record._id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                                                    {record.userId?.firstName?.[0]}{record.userId?.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">
                                                        {record.userId?.firstName} {record.userId?.lastName}
                                                    </h4>
                                                    <p className="text-sm text-gray-400">
                                                        {record.userId?.studentId} • {record.userId?.department}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {record.checkInTime && (
                                                    <span className="text-sm text-gray-400 font-mono">{record.checkInTime}</span>
                                                )}
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(record.status)}`}>
                                                    {record.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Cleanup Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0a1f14] border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center gap-3 text-red-400 mb-4">
                            <AlertTriangle size={24} />
                            <h3 className="text-xl font-bold">Cleanup Old Records</h3>
                        </div>
                        <p className="text-gray-300 mb-6">
                            This will permanently delete all attendance records older than 1 month. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 rounded-lg text-gray-400 hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCleanup}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium"
                            >
                                Confirm Cleanup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceHistory;

