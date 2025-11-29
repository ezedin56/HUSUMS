import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, Search, Filter, Download, User, Clock, AlertTriangle, CheckSquare, FileText } from 'lucide-react';
import { api } from '../../../utils/api';

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Confirmation Modal State
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    useEffect(() => {
        fetchAttendance();
    }, [selectedDate]);

    const fetchAttendance = async () => {
        try {
            const res = await api.get(`/attendance/daily?date=${selectedDate}`);
            setAttendanceData(res);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching attendance:', error);
            setLoading(false);
        }
    };

    const initiateMarkAttendance = (userId, status) => {
        const today = new Date().toISOString().split('T')[0];
        if (selectedDate < today) {
            setPendingAction({ userId, status });
            setShowConfirmModal(true);
        } else {
            handleMarkAttendance(userId, status);
        }
    };

    const handleMarkAttendance = async (userId, status) => {
        try {
            await api.post('/attendance/mark', {
                userId,
                status,
                date: selectedDate
            });
            // Optimistic update
            setAttendanceData(prev => prev.map(item => 
                item._id === userId ? { 
                    ...item, 
                    status, 
                    checkInTime: ['present', 'late', 'permission'].includes(status) ? new Date().toLocaleTimeString('en-US', { hour12: false }) : null 
                } : item
            ));
            setShowConfirmModal(false);
            setPendingAction(null);
        } catch (error) {
            console.error('Error marking attendance:', error);
            alert('Failed to mark attendance');
        }
    };

    const exportAttendance = () => {
        const headers = ['Student ID', 'Name', 'Department', 'Status', 'Check In Time', 'Date'];
        const csvContent = [
            headers.join(','),
            ...filteredData.map(row => [
                row.studentId,
                `${row.firstName} ${row.lastName}`,
                row.department || 'N/A',
                row.status,
                row.checkInTime || '-',
                selectedDate
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_${selectedDate}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const filteredData = attendanceData.filter(record => {
        const matchesSearch = (record.firstName + ' ' + record.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                            record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || record.status === filter;
        const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter;
        return matchesSearch && matchesFilter && matchesDepartment;
    });

    const stats = {
        present: attendanceData.filter(r => r.status === 'present').length,
        absent: attendanceData.filter(r => r.status === 'absent').length,
        permission: attendanceData.filter(r => r.status === 'permission').length,
    };

    // Get unique departments
    const departments = [...new Set(attendanceData.map(item => item.department).filter(Boolean))];

    return (
        <div className="relative min-h-screen p-6 overflow-hidden">
            {/* Animated Background */}
            <motion.div
                className="absolute inset-0 -z-10 opacity-20"
                animate={{
                    background: [
                        "radial-gradient(circle at 0% 0%, #6366f1 0%, transparent 50%)",
                        "radial-gradient(circle at 100% 100%, #ec4899 0%, transparent 50%)",
                        "radial-gradient(circle at 0% 100%, #3b82f6 0%, transparent 50%)",
                        "radial-gradient(circle at 100% 0%, #8b5cf6 0%, transparent 50%)",
                    ]
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                    Attendance Management
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Mark and monitor member attendance.
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { title: 'Present', value: stats.present, icon: <CheckCircle className="text-green-500" />, color: 'bg-green-500/10 border-green-500/20' },
                    { title: 'Absent', value: stats.absent, icon: <XCircle className="text-red-500" />, color: 'bg-red-500/10 border-red-500/20' },
                    { title: 'Permission', value: stats.permission, icon: <AlertTriangle className="text-yellow-500" />, color: 'bg-yellow-500/10 border-yellow-500/20' },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-2xl border backdrop-blur-sm ${stat.color}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                                <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-white/50 dark:bg-black/20">
                                {stat.icon}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col lg:flex-row gap-4 mb-6 justify-between items-center bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl backdrop-blur-md border border-gray-200 dark:border-gray-700"
            >
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search members..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-3 items-center justify-end w-full lg:w-auto">
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none"
                    />
                    <select 
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none"
                    >
                        <option value="all">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="permission">Permission</option>
                        <option value="not_marked">Not Marked</option>
                    </select>
                    <button
                        onClick={exportAttendance}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </motion.div>

            {/* Attendance List */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Member</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Department</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Check In Time</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading attendance data...</td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No members found</td>
                                </tr>
                            ) : (
                                filteredData.map((record) => (
                                    <motion.tr
                                        key={record._id}
                                        variants={itemVariants}
                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {record.firstName?.[0] || <User size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {record.firstName} {record.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{record.studentId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {record.department || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                                                ${record.status === 'present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                record.status === 'permission' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                record.status === 'absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                {record.status === 'present' && <CheckCircle size={12} />}
                                                {record.status === 'permission' && <AlertTriangle size={12} />}
                                                {record.status === 'absent' && <XCircle size={12} />}
                                                {record.status === 'not_marked' ? 'Not Marked' : record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {record.checkInTime || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => initiateMarkAttendance(record._id, 'present')}
                                                    className={`p-2 rounded-lg transition-colors ${record.status === 'present' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-600 dark:bg-gray-700 dark:hover:bg-green-900/30'}`}
                                                    title="Mark Present"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => initiateMarkAttendance(record._id, 'permission')}
                                                    className={`p-2 rounded-lg transition-colors ${record.status === 'permission' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-yellow-100 hover:text-yellow-600 dark:bg-gray-700 dark:hover:bg-yellow-900/30'}`}
                                                    title="Mark Permission"
                                                >
                                                    <AlertTriangle size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => initiateMarkAttendance(record._id, 'absent')}
                                                    className={`p-2 rounded-lg transition-colors ${record.status === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:bg-gray-700 dark:hover:bg-red-900/30'}`}
                                                    title="Mark Absent"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center gap-3 text-yellow-500 mb-4">
                                <AlertTriangle size={24} />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Past Attendance</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                You are about to modify attendance for a past date ({selectedDate}). Are you sure you want to continue?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowConfirmModal(false);
                                        setPendingAction(null);
                                    }}
                                    className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleMarkAttendance(pendingAction.userId, pendingAction.status)}
                                    className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                                >
                                    Confirm Update
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Attendance;
