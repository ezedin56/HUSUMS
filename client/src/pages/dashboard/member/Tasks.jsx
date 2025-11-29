import { useState, useEffect } from 'react';
import axios from 'axios';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [reportFile, setReportFile] = useState(null);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/tasks/my-tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
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

        const formData = new FormData();
        formData.append('report', reportFile);

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/tasks/${selectedTask.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Report uploaded successfully');
            setSelectedTask(null);
            setReportFile(null);
            fetchTasks();
        } catch (error) {
            alert('Error uploading report');
            console.error(error);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed': return <span className="badge badge-success">Completed</span>;
            case 'in_progress': return <span className="badge badge-warning">In Progress</span>;
            default: return <span className="badge badge-secondary">Pending</span>;
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card animate-fade-up">
            <h2 style={{ marginBottom: '2rem' }}>My Tasks</h2>

            {tasks.length === 0 ? (
                <p>No tasks assigned yet.</p>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {tasks.map(task => (
                        <div key={task.id} style={{
                            border: '1px solid var(--border-color)',
                            padding: '1.5rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'var(--bg-body)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{task.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        Assigned by: {task.assigner?.firstName} {task.assigner?.lastName}
                                    </p>
                                </div>
                                {getStatusBadge(task.status)}
                            </div>

                            <p style={{ marginBottom: '1rem' }}>{task.description}</p>

                            {task.dueDate && (
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                            )}

                            {task.status !== 'completed' && (
                                <div>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                                    >
                                        {selectedTask?.id === task.id ? 'Cancel' : 'Submit Report'}
                                    </button>

                                    {selectedTask?.id === task.id && (
                                        <form onSubmit={handleFileUpload} style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <input
                                                type="file"
                                                onChange={e => setReportFile(e.target.files[0])}
                                                required
                                            />
                                            <button type="submit" className="btn btn-primary">Upload</button>
                                        </form>
                                    )}
                                </div>
                            )}

                            {task.reportUrl && (
                                <div style={{ marginTop: '1rem' }}>
                                    <a href={`http://localhost:5000${task.reportUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                                        View Submitted Report
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tasks;
