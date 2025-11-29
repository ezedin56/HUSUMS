import { useState } from 'react';
import { api } from '../../../utils/api';

const ActionPlan = () => {
    const [file, setFile] = useState(null);
    const [scheduleData, setScheduleData] = useState({ title: '', date: '', description: '' });

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Note: Our api utility handles JSON. For FormData, we need to use fetch directly or modify api utility.
            // Let's use fetch directly here for simplicity as we need to omit Content-Type header to let browser set boundary.
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch('http://localhost:5000/api/departments/action-plan', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            alert(data.message);
            setFile(null);
        } catch (error) {
            alert('Error uploading file: ' + error.message);
        }
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/departments/schedule', scheduleData);
            alert('Schedule created successfully');
            setScheduleData({ title: '', date: '', description: '' });
        } catch (error) {
            alert('Error creating schedule: ' + error.message);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Department Management</h2>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Upload Annual Action Plan</h3>
                <form onSubmit={handleUpload} style={{ marginTop: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="file"
                            className="input"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Upload Plan</button>
                </form>
            </div>

            <div className="card">
                <h3>Create Department Schedule</h3>
                <form onSubmit={handleScheduleSubmit} style={{ marginTop: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Event Title</label>
                        <input
                            type="text"
                            className="input"
                            value={scheduleData.title}
                            onChange={(e) => setScheduleData({ ...scheduleData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Date</label>
                        <input
                            type="date"
                            className="input"
                            value={scheduleData.date}
                            onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                        <textarea
                            className="input"
                            rows="3"
                            value={scheduleData.description}
                            onChange={(e) => setScheduleData({ ...scheduleData, description: e.target.value })}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Publish Schedule</button>
                </form>
            </div>
        </div>
    );
};

export default ActionPlan;
