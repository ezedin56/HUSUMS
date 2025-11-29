import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import {
    Settings,
    Users,
    Shield,
    Activity,
    Archive as ArchiveIcon,
    Search,
    Plus,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

const SystemAdmin = () => {
    const [view, setView] = useState('audit'); // 'audit', 'users', 'archives'
    const [auditLogs, setAuditLogs] = useState([]);
    const [archives, setArchives] = useState([]);
    const [archiveForm, setArchiveForm] = useState({
        title: '',
        description: '',
        category: 'document',
        year: new Date().getFullYear(),
        fileUrl: '',
        metadata: {}
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (view === 'audit') fetchAuditLogs();
        if (view === 'archives') fetchArchives();
    }, [view]);

    const fetchAuditLogs = async () => {
        try {
            const res = await api.get('/president/system/audit-logs?limit=100');
            setAuditLogs(res.data);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchArchives = async () => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);

            const res = await api.get(`/president/archives?${params.toString()}`);
            setArchives(res.data);
        } catch (error) {
            console.error('Error fetching archives:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateArchive = async (e) => {
        e.preventDefault();
        try {
            await api.post('/president/archives', archiveForm);
            alert('Archive created successfully!');
            setArchiveForm({
                title: '',
                description: '',
                category: 'document',
                year: new Date().getFullYear(),
                fileUrl: '',
                metadata: {}
            });
            fetchArchives();
        } catch (error) {
            alert('Error creating archive');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Settings className="text-[var(--primary)]" />
                    System Administration
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('audit')}
                        className={`btn ${view === 'audit' ? 'btn-primary' : 'bg-[var(--bg-card)]'} flex items-center gap-2`}
                    >
                        <Activity size={18} />
                        Audit Logs
                    </button>
                    <button
                        onClick={() => setView('archives')}
                        className={`btn ${view === 'archives' ? 'btn-primary' : 'bg-[var(--bg-card)]'} flex items-center gap-2`}
                    >
                        <ArchiveIcon size={18} />
                        Archives
                    </button>
                </div>
            </div>

            {view === 'audit' && (
                <div className="card">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <Activity size={20} />
                        System Audit Logs
                    </h3>

                    {loading ? (
                        <p>Loading audit logs...</p>
                    ) : auditLogs.length === 0 ? (
                        <p className="text-[var(--text-secondary)]">No audit logs found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[var(--border-color)]">
                                        <th className="text-left p-3">Timestamp</th>
                                        <th className="text-left p-3">User</th>
                                        <th className="text-left p-3">Action</th>
                                        <th className="text-left p-3">Entity</th>
                                        <th className="text-left p-3">IP Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {auditLogs.map((log, index) => (
                                        <motion.tr
                                            key={log.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"
                                        >
                                            <td className="p-3 text-sm">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td className="p-3">
                                                {log.User ? `${log.User.firstName} ${log.User.lastName}` : 'System'}
                                            </td>
                                            <td className="p-3">
                                                <span className="badge badge-secondary">{log.action}</span>
                                            </td>
                                            <td className="p-3 text-sm">
                                                {log.entityType} #{log.entityId}
                                            </td>
                                            <td className="p-3 text-sm text-[var(--text-secondary)]">
                                                {log.ipAddress || 'N/A'}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {view === 'archives' && (
                <div className="space-y-6">
                    {/* Create Archive Form */}
                    <div className="card">
                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                            <Plus size={20} />
                            Create Archive Entry
                        </h3>
                        <form onSubmit={handleCreateArchive} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Title</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={archiveForm.title}
                                        onChange={(e) => setArchiveForm({ ...archiveForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Category</label>
                                    <select
                                        className="input"
                                        value={archiveForm.category}
                                        onChange={(e) => setArchiveForm({ ...archiveForm, category: e.target.value })}
                                    >
                                        <option value="event">Event</option>
                                        <option value="election">Election</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="document">Document</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Year</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={archiveForm.year}
                                        onChange={(e) => setArchiveForm({ ...archiveForm, year: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">File URL (optional)</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={archiveForm.fileUrl}
                                        onChange={(e) => setArchiveForm({ ...archiveForm, fileUrl: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Description</label>
                                <textarea
                                    className="input"
                                    rows="3"
                                    value={archiveForm.description}
                                    onChange={(e) => setArchiveForm({ ...archiveForm, description: e.target.value })}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Create Archive</button>
                        </form>
                    </div>

                    {/* Search Archives */}
                    <div className="card">
                        <div className="flex gap-4 items-center mb-4">
                            <Search size={20} className="text-[var(--text-secondary)]" />
                            <input
                                type="text"
                                className="input flex-1"
                                placeholder="Search archives..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && fetchArchives()}
                            />
                            <button onClick={fetchArchives} className="btn btn-primary">Search</button>
                        </div>
                    </div>

                    {/* Archives List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {archives.map((archive, index) => (
                            <motion.div
                                key={archive.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <FileText className="text-[var(--primary)]" size={24} />
                                    <span className="badge badge-secondary">{archive.category}</span>
                                </div>
                                <h4 className="font-bold text-lg mb-2">{archive.title}</h4>
                                <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                                    {archive.description}
                                </p>
                                <div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
                                    <span>Year: {archive.year}</span>
                                    <span>{new Date(archive.createdAt).toLocaleDateString()}</span>
                                </div>
                                {archive.fileUrl && (
                                    <a
                                        href={archive.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 btn btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200 w-full"
                                    >
                                        View File
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemAdmin;
