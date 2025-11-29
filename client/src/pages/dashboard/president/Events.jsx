import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import {
    Calendar as CalendarIcon,
    Plus,
    Check,
    X,
    MapPin,
    Clock,
    Filter,
    MoreHorizontal
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({ title: '', date: '', time: '', venue: '', description: '' });
    const [view, setView] = useState('list'); // 'list', 'calendar', 'approval'
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/president/events');
            setEvents(res.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/president/events', formData);
            alert('Event created successfully');
            setEvents([...events, res.data]);
            setFormData({ title: '', date: '', time: '', venue: '', description: '' });
            setShowForm(false);
        } catch (error) {
            alert('Error creating event: ' + error.message);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await api.put(`/president/events/${id}/status`, { status });
            setEvents(events.map(e => e.id === id ? res.data : e));
        } catch {
            alert('Error updating status');
        }
    };

    const pendingEvents = events.filter(e => e.status === 'pending');
    const approvedEvents = events.filter(e => e.status === 'approved');

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <CalendarIcon className="text-[var(--primary)]" />
                    Event Management
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('list')}
                        className={`btn ${view === 'list' ? 'btn-primary' : 'bg-[var(--bg-card)]'}`}
                    >
                        List
                    </button>
                    <button
                        onClick={() => setView('approval')}
                        className={`btn relative ${view === 'approval' ? 'btn-primary' : 'bg-[var(--bg-card)]'}`}
                    >
                        Approval
                        {pendingEvents.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                                {pendingEvents.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn bg-green-600 text-white flex items-center gap-2"
                    >
                        <Plus size={18} />
                        New Event
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="card mb-6 border border-[var(--primary)]">
                            <h3 className="font-bold mb-4">Create New Event</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Title</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Venue</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.venue}
                                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Date</label>
                                        <input
                                            type="date"
                                            className="input"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Time</label>
                                        <input
                                            type="time"
                                            className="input"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Description</label>
                                    <textarea
                                        className="input"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="btn bg-gray-200 text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">Create Event</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {view === 'approval' ? (
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Pending Approval ({pendingEvents.length})</h3>
                    {pendingEvents.length === 0 ? (
                        <p className="text-[var(--text-secondary)]">No pending events.</p>
                    ) : (
                        pendingEvents.map(event => (
                            <motion.div
                                key={event.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-yellow-500"
                            >
                                <div>
                                    <h4 className="font-bold text-lg">{event.title}</h4>
                                    <div className="flex gap-4 text-sm text-[var(--text-secondary)] mt-1">
                                        <span className="flex items-center gap-1"><CalendarIcon size={14} /> {event.date}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {event.time}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {event.venue}</span>
                                    </div>
                                    <p className="mt-2 text-sm">{event.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleStatusUpdate(event.id, 'approved')}
                                        className="btn bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-2"
                                    >
                                        <Check size={18} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(event.id, 'rejected')}
                                        className="btn bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-2"
                                    >
                                        <X size={18} /> Reject
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-[var(--bg-secondary)] p-3 rounded-lg text-center min-w-[60px]">
                                    <div className="text-xs font-bold uppercase text-[var(--primary)]">
                                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                    </div>
                                    <div className="text-xl font-bold">
                                        {new Date(event.date).getDate()}
                                    </div>
                                </div>
                                <div className={`badge ${event.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                                    {event.status}
                                </div>
                            </div>
                            <h4 className="font-bold text-lg mb-2 line-clamp-1">{event.title}</h4>
                            <div className="space-y-2 text-sm text-[var(--text-secondary)] mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} /> {event.time}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} /> {event.venue}
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-[var(--border-color)]">
                                <span className="text-xs text-[var(--text-secondary)]">
                                    Created by ID: {event.createdBy}
                                </span>
                                <button className="p-2 hover:bg-[var(--bg-secondary)] rounded-full text-[var(--text-secondary)]">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
