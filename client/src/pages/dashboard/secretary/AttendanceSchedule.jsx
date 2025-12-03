import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../../../utils/api';
import { useToast, ToastContainer } from '../../../components/Toast';

const AttendanceSchedule = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [schedule, setSchedule] = useState({
        days: [],
        defaultStartTime: '09:00',
        defaultEndTime: '10:00'
    });
    const toast = useToast();

    const daysOfWeek = [
        { id: 'monday', label: 'Monday' },
        { id: 'tuesday', label: 'Tuesday' },
        { id: 'wednesday', label: 'Wednesday' },
        { id: 'thursday', label: 'Thursday' },
        { id: 'friday', label: 'Friday' },
        { id: 'saturday', label: 'Saturday' },
        { id: 'sunday', label: 'Sunday' }
    ];

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const res = await api.get('/attendance/schedule');
            if (res) {
                setSchedule({
                    days: res.days || [],
                    defaultStartTime: res.defaultStartTime || '09:00',
                    defaultEndTime: res.defaultEndTime || '10:00'
                });
            }
            setLoading(false);
        } catch (error) {
            // Ignore 404 (no schedule yet)
            if (error.status !== 404) {
                console.error('Error fetching schedule:', error);
                toast.error('Failed to load schedule settings.');
            }
            setLoading(false);
        }
    };

    const handleDayToggle = (dayId) => {
        setSchedule(prev => {
            const days = prev.days.includes(dayId)
                ? prev.days.filter(d => d !== dayId)
                : [...prev.days, dayId];

            if (days.length > 3) {
                toast.warning('You can only select up to 3 days per week.');
                return prev;
            }

            return { ...prev, days };
        });
    };

    const handleSave = async () => {
        if (schedule.days.length === 0) {
            toast.error('Please select at least one day.');
            return;
        }

        setSaving(true);
        try {
            await api.post('/attendance/schedule', schedule);
            toast.success('Schedule saved successfully!');
        } catch (error) {
            console.error('Error saving schedule:', error);
            toast.error(error.message || 'Failed to save schedule.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                    <Calendar size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Weekly Schedule</h2>
                    <p className="text-sm text-gray-400">Configure attendance days and times (Max 3 days/week)</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Days Selection */}
                <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">Select Days</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {daysOfWeek.map(day => (
                            <button
                                key={day.id}
                                onClick={() => handleDayToggle(day.id)}
                                className={`
                                    p-4 rounded-lg border text-left transition-all
                                    ${schedule.days.includes(day.id)
                                        ? 'bg-green-500/20 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{day.label}</span>
                                    {schedule.days.includes(day.id) && <CheckCircle size={16} />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Selection */}
                <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">Default Time Window</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <label className="block text-sm text-gray-400 mb-2">Start Time</label>
                            <div className="flex items-center gap-3">
                                <Clock className="text-gray-500" size={20} />
                                <input
                                    type="time"
                                    value={schedule.defaultStartTime}
                                    onChange={(e) => setSchedule({ ...schedule, defaultStartTime: e.target.value })}
                                    className="bg-transparent border-none text-white text-xl font-mono focus:ring-0 w-full"
                                />
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <label className="block text-sm text-gray-400 mb-2">End Time</label>
                            <div className="flex items-center gap-3">
                                <Clock className="text-gray-500" size={20} />
                                <input
                                    type="time"
                                    value={schedule.defaultEndTime}
                                    onChange={(e) => setSchedule({ ...schedule, defaultEndTime: e.target.value })}
                                    className="bg-transparent border-none text-white text-xl font-mono focus:ring-0 w-full"
                                />
                            </div>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                        <AlertCircle size={14} />
                        Sessions will automatically close at the end time.
                    </p>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-white/10">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full md:w-auto bg-green-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={20} />
                        )}
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceSchedule;
