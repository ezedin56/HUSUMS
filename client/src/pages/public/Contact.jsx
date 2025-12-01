import { useState } from 'react';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        senderName: '',
        subject: '',
        content: '',
        recipientRole: 'president'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/public/problems', formData);
            alert('Problem submitted successfully!');
            setFormData({ senderName: '', subject: '', content: '', recipientRole: 'president' });
        } catch (error) {
            console.error(error);
            alert('Error submitting problem');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Report a Problem</h1>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.senderName}
                                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Department/Recipient</label>
                        <select
                            className="input"
                            value={formData.recipientRole}
                            onChange={(e) => setFormData({ ...formData, recipientRole: e.target.value })}
                        >
                            <option value="president">President's Office</option>
                            <option value="academic">Academic Affairs</option>
                            <option value="discipline">Discipline Committee</option>
                            <option value="service">Service & Facilities</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Subject</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                        <textarea
                            className="input"
                            rows="5"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Submit Report
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
