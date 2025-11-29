import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { ClipboardList, User, Calendar, Upload, FileCheck, Clock, CheckCircle, AlertCircle, ExternalLink, X } from 'lucide-react';
import '../memberDashboard.css';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [reportFile, setReportFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks/my-tasks');
            setTasks(res);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!reportFile || !selectedTask) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('report', reportFile);

        try {
            await api.upload(`/tasks/${selectedTask.id}`, formData, 'PUT');
            alert('Report uploaded successfully');
            setSelectedTask(null);
            setReportFile(null);
            fetchTasks();
        } catch (error) {
            alert('Error uploading report');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'completed':
                return { icon: <CheckCircle size={16} />, label: 'Completed', className: 'status-completed' };
            case 'in_progress':
                return { icon: <Clock size={16} />, label: 'In Progress', className: 'status-in-progress' };
            default:
                return { icon: <AlertCircle size={16} />, label: 'Pending', className: 'status-pending' };
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            default: return 'priority-low';
        }
    };

    const getDaysRemaining = (dueDate) => {
        if (!dueDate) return null;
        const now = new Date();
        const due = new Date(dueDate);
        const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        return diff;
    };

    if (loading) {
        return (
            <div className="member-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading Tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="member-page">
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">
                    <ClipboardList className="title-icon" />
                    My Tasks
                </h1>
                <p className="page-subtitle">Track and manage your assigned tasks</p>
            </div>

            {/* Stats Bar */}
            <div className="tasks-stats">
                <div className="stat-item">
                    <span className="stat-value">{tasks.length}</span>
                    <span className="stat-label">Total</span>
                </div>
                <div className="stat-item pending">
                    <span className="stat-value">{tasks.filter(t => t.status === 'pending').length}</span>
                    <span className="stat-label">Pending</span>
                </div>
                <div className="stat-item progress">
                    <span className="stat-value">{tasks.filter(t => t.status === 'in_progress').length}</span>
                    <span className="stat-label">In Progress</span>
                </div>
                <div className="stat-item completed">
                    <span className="stat-value">{tasks.filter(t => t.status === 'completed').length}</span>
                    <span className="stat-label">Completed</span>
                </div>
            </div>

            {/* Tasks List */}
            <div className="page-card">
                <div className="card-header">
                    <h3 className="card-title">
                        <ClipboardList size={20} />
                        All Tasks
                    </h3>
                </div>

                {tasks.length === 0 ? (
                    <div className="empty-state">
                        <ClipboardList size={48} className="empty-icon" />
                        <p>No tasks assigned yet</p>
                        <span className="empty-hint">Tasks assigned by leadership will appear here</span>
                    </div>
                ) : (
                    <div className="tasks-list">
                        {tasks.map(task => {
                            const status = getStatusInfo(task.status);
                            const daysRemaining = getDaysRemaining(task.dueDate);
                            
                            return (
                                <div key={task.id} className={`task-card ${status.className}`}>
                                    <div className="task-header">
                                        <div className="task-priority-bar" data-priority={task.priority || 'low'}></div>
                                        <div className="task-title-section">
                                            <h4 className="task-title">{task.title}</h4>
                                            <div className="task-meta">
                                                <span className="task-assigner">
                                                    <User size={14} />
                                                    {task.assigner?.firstName} {task.assigner?.lastName}
                                                </span>
                                                {task.dueDate && (
                                                    <span className={`task-due ${daysRemaining !== null && daysRemaining <= 2 ? 'urgent' : ''}`}>
                                                        <Calendar size={14} />
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                        {daysRemaining !== null && daysRemaining > 0 && (
                                                            <span className="days-left">({daysRemaining}d left)</span>
                                                        )}
                                                        {daysRemaining !== null && daysRemaining <= 0 && (
                                                            <span className="overdue">Overdue</span>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`task-status ${status.className}`}>
                                            {status.icon}
                                            {status.label}
                                        </span>
                                    </div>

                                    <p className="task-description">{task.description}</p>

                                    <div className="task-actions">
                                        {task.status !== 'completed' && (
                                            <button
                                                className={`upload-btn ${selectedTask?.id === task.id ? 'active' : ''}`}
                                                onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                                            >
                                                {selectedTask?.id === task.id ? (
                                                    <>
                                                        <X size={16} />
                                                        Cancel
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload size={16} />
                                                        Submit Report
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {task.reportUrl && (
                                            <a
                                                href={`http://localhost:5000${task.reportUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="view-report-btn"
                                            >
                                                <FileCheck size={16} />
                                                View Report
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>

                                    {/* Upload Form */}
                                    {selectedTask?.id === task.id && (
                                        <form onSubmit={handleFileUpload} className="upload-form">
                                            <div className="file-input-wrapper">
                                                <input
                                                    type="file"
                                                    id={`file-${task.id}`}
                                                    onChange={e => setReportFile(e.target.files[0])}
                                                    required
                                                />
                                                <label htmlFor={`file-${task.id}`} className="file-label">
                                                    <Upload size={18} />
                                                    <span>{reportFile ? reportFile.name : 'Choose File'}</span>
                                                </label>
                                            </div>
                                            <button 
                                                type="submit" 
                                                className="confirm-upload-btn"
                                                disabled={!reportFile || uploading}
                                            >
                                                {uploading ? (
                                                    <>
                                                        <div className="btn-spinner"></div>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle size={16} />
                                                        Upload
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;
