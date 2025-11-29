import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import {
    Radio,
    Send,
    Save,
    FileText,
    AlertTriangle,
    Info,
    Megaphone,
    Calendar,
    CheckCircle
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const Broadcast = () => {
    const [formData, setFormData] = useState({
        subject: '',
        content: '',
        recipientRole: 'all',
        type: 'announcement'
    });
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/president/broadcast/templates');
            setTemplates(res.data);
        } catch (error) {
            console.error('Error fetching templates', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/president/broadcast', formData);
            alert('Broadcast sent successfully!');
            setFormData({ subject: '', content: '', recipientRole: 'all', type: 'announcement' });
        } catch (error) {
            alert('Failed to send broadcast: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const saveTemplate = async () => {
        const title = prompt('Enter template title:');
        if (!title) return;

        try {
            await api.post('/president/broadcast/templates', {
                title,
                ...formData
            });
            alert('Template saved!');
            fetchTemplates();
        } catch {
            alert('Failed to save template');
        }
    };

    const loadTemplate = (template) => {
        setFormData({
            subject: template.subject,
            content: template.content,
            type: template.type,
            recipientRole: 'all'
        });
        setShowTemplates(false);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'alert': return <AlertTriangle className="text-red-500" />;
            case 'notice': return <Info className="text-blue-500" />;
            case 'announcement': return <Megaphone className="text-green-500" />;
            case 'event': return <Calendar className="text-purple-500" />;
            default: return <Megaphone />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Radio className="text-[var(--primary)]" />
                    Broadcast Center
                </h2>
                <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="btn bg-[var(--bg-card)] flex items-center gap-2"
                >
                    <FileText size={18} />
                    Templates
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Message Type Selection */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['alert', 'notice', 'announcement', 'event'].map(type => (
                                    <div
                                        key={type}
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`cursor-pointer p-4 rounded-lg border flex flex-col items-center gap-2 transition-all
                                            ${formData.type === type
                                                ? 'border-[var(--primary)] bg-[var(--bg-secondary)] shadow-md transform scale-105'
                                                : 'border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'
                                            }`}
                                    >
                                        {getTypeIcon(type)}
                                        <span className="capitalize font-medium">{type}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 font-medium">Recipient Group</label>
                                    <select
                                        className="input"
                                        value={formData.recipientRole}
                                        onChange={(e) => setFormData({ ...formData, recipientRole: e.target.value })}
                                    >
                                        <option value="all">All Students</option>
                                        <option value="member">Union Members</option>
                                        <option value="executive">Executives Only</option>
                                        <option value="dept_head">Department Heads</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium">Subject</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        placeholder="Enter message subject..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">Message Content</label>
                                <textarea
                                    className="input min-h-[200px]"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    placeholder="Type your message here..."
                                ></textarea>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-[var(--border-color)]">
                                <button
                                    type="button"
                                    onClick={saveTemplate}
                                    className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    Save as Template
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary flex items-center gap-2"
                                >
                                    {loading ? 'Sending...' : (
                                        <>
                                            <Send size={18} />
                                            Send Broadcast
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>

                {/* Templates Sidebar / Preview */}
                <div className="space-y-6">
                    <AnimatePresence>
                        {showTemplates && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="card"
                            >
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <FileText size={20} />
                                    Saved Templates
                                </h3>
                                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                    {templates.length === 0 ? (
                                        <p className="text-[var(--text-secondary)] text-sm">No templates saved yet.</p>
                                    ) : (
                                        templates.map(t => (
                                            <div
                                                key={t.id}
                                                onClick={() => loadTemplate(t)}
                                                className="p-3 rounded border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors group"
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-medium">{t.title}</span>
                                                    {getTypeIcon(t.type)}
                                                </div>
                                                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{t.subject}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Preview Card */}
                    <div className="card bg-[var(--bg-secondary)] border-dashed border-2 border-[var(--border-color)]">
                        <h3 className="font-bold mb-4 text-[var(--text-secondary)] uppercase text-xs tracking-wider">Live Preview</h3>
                        <div className={`p-4 rounded-lg border-l-4 shadow-sm bg-white
                            ${formData.type === 'alert' ? 'border-red-500' :
                                formData.type === 'notice' ? 'border-blue-500' :
                                    formData.type === 'event' ? 'border-purple-500' : 'border-green-500'}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {getTypeIcon(formData.type)}
                                <span className={`text-xs font-bold uppercase tracking-wider
                                    ${formData.type === 'alert' ? 'text-red-500' :
                                        formData.type === 'notice' ? 'text-blue-500' :
                                            formData.type === 'event' ? 'text-purple-500' : 'text-green-500'}`}
                                >
                                    {formData.type}
                                </span>
                            </div>
                            <h4 className="font-bold text-lg mb-2">{formData.subject || 'Subject Preview'}</h4>
                            <p className="text-[var(--text-secondary)] text-sm whitespace-pre-wrap">
                                {formData.content || 'Message content preview...'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Broadcast;
