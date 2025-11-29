import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        bio: '',
        major: '',
        academicYear: '',
        phoneNumber: '',
        region: '',
        zone: '',
        woreda: '',
        city: '',
        password: ''
    });
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({
                firstName: res.data.firstName || '',
                middleName: res.data.middleName || '',
                lastName: res.data.lastName || '',
                bio: res.data.bio || '',
                major: res.data.major || '',
                academicYear: res.data.academicYear || '',
                phoneNumber: res.data.phoneNumber || '',
                region: res.data.region || '',
                zone: res.data.zone || '',
                woreda: res.data.woreda || '',
                city: res.data.city || '',
                password: ''
            });
            if (res.data.profilePicture) {
                setPreview(`http://localhost:5000${res.data.profilePicture}`);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (photo) {
            data.append('profilePicture', photo);
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5000/api/users/profile', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(res.data.message);
            // setUser(res.data.user); // Removed as setUser is not defined
            // Update local storage user data if needed
            const storedUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...storedUser, ...res.data.user }));
        } catch (error) {
            setMessage('Error updating profile');
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card animate-fade-up">
            <h2 style={{ marginBottom: '2rem' }}>My Profile</h2>
            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Left Column: Photo & Bio */}
                <div>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '150px', height: '150px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            margin: '0 auto 1rem',
                            backgroundColor: '#f3f4f6',
                            border: '4px solid var(--primary)'
                        }}>
                            {preview ? (
                                <img src={preview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>No Photo</div>
                            )}
                        </div>
                        <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                            Upload Photo
                            <input type="file" hidden onChange={handlePhotoChange} accept="image/*" />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            name="bio"
                            className="input"
                            rows="5"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                </div>

                {/* Right Column: Personal Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" className="input" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Middle Name</label>
                        <input type="text" name="middleName" className="input" value={formData.middleName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" className="input" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" name="phoneNumber" className="input" value={formData.phoneNumber} onChange={handleChange} />
                    </div>

                    <h3 style={{ gridColumn: '1 / -1', marginTop: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Academic Info</h3>

                    <div className="form-group">
                        <label>Major</label>
                        <input type="text" name="major" className="input" value={formData.major} onChange={handleChange} placeholder="e.g. Software Engineering" />
                    </div>
                    <div className="form-group">
                        <label>Academic Year</label>
                        <select name="academicYear" className="input" value={formData.academicYear} onChange={handleChange}>
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                            <option value="5">5th Year</option>
                        </select>
                    </div>

                    <h3 style={{ gridColumn: '1 / -1', marginTop: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Address</h3>

                    <div className="form-group">
                        <label>Region</label>
                        <input type="text" name="region" className="input" value={formData.region} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Zone</label>
                        <input type="text" name="zone" className="input" value={formData.zone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Woreda</label>
                        <input type="text" name="woreda" className="input" value={formData.woreda} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input type="text" name="city" className="input" value={formData.city} onChange={handleChange} />
                    </div>

                    <h3 style={{ gridColumn: '1 / -1', marginTop: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Change Password</h3>

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input"
                            value={formData.password || ''}
                            onChange={handleChange}
                            placeholder="Leave empty to keep current"
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;
