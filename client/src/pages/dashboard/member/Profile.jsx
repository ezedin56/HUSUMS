import { useState, useEffect, useMemo } from 'react';
import { api } from '../../../utils/api';
import '../memberDashboard.css';

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
        password: '',
        email: ''
    });
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setFormData({
                firstName: res.firstName || '',
                middleName: res.middleName || '',
                lastName: res.lastName || '',
                bio: res.bio || '',
                major: res.major || '',
                academicYear: res.academicYear || '',
                phoneNumber: res.phoneNumber || '',
                region: res.region || '',
                zone: res.zone || '',
                woreda: res.woreda || '',
                city: res.city || '',
                password: '',
                email: res.email || ''
            });
            if (res.profilePicture) {
                setPreview(`http://localhost:5000${res.profilePicture}`);
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
            setSaving(true);
            const res = await api.upload('/users/profile', data, 'PUT');
            setMessage(res.message);
            // Update local storage user data if needed
            const storedUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...storedUser, ...res.user }));
        } catch (error) {
            setMessage('Error updating profile');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const fullName = useMemo(() => {
        return [formData.firstName, formData.middleName, formData.lastName]
            .filter(Boolean)
            .join(' ');
    }, [formData.firstName, formData.middleName, formData.lastName]);

    const academicYearLabel = useMemo(() => {
        const map = {
            1: '1st Year',
            2: '2nd Year',
            3: '3rd Year',
            4: '4th Year',
            5: '5th Year'
        };
        return map[formData.academicYear] || 'Set your year';
    }, [formData.academicYear]);

    const profileCompletion = useMemo(() => {
        const keys = ['firstName', 'lastName', 'major', 'phoneNumber', 'region', 'city', 'bio'];
        const filled = keys.filter(key => formData[key]);
        return Math.min(100, Math.round((filled.length / keys.length) * 100)) || 0;
    }, [formData]);

    const locationChip = useMemo(() => {
        return [formData.city, formData.zone, formData.region].filter(Boolean).join(', ');
    }, [formData.city, formData.zone, formData.region]);

    if (loading) {
        return (
            <div className="profile-shell">
                <p>Aligning member identity...</p>
            </div>
        );
    }

    const renderInput = (name, label, props = {}) => {
        const { type = 'text', ...rest } = props;
        return (
            <div>
                <label>{label}</label>
                <input
                    type={type}
                    name={name}
                    className="holo-input"
                    value={formData[name]}
                    onChange={handleChange}
                    {...rest}
                />
            </div>
        );
    };

    return (
        <div className="profile-shell">
            <div className="profile-grid">
                <div className="holo-id-card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <div className="holo-avatar">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                                />
                            ) : (
                                <span>{fullName ? fullName.charAt(0) : 'ID'}</span>
                            )}
                        </div>
                        <label className="upload-chip">
                            Upload Photo
                            <input type="file" hidden onChange={handlePhotoChange} accept="image/*" />
                        </label>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <p style={{ letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0, color: 'rgba(255,255,255,0.55)' }}>
                                Member DNA
                            </p>
                            <h2 style={{ margin: '0.35rem 0 0', fontSize: '2rem' }}>{fullName || 'Complete Your Profile'}</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                            <div style={{ padding: '0.75rem', borderRadius: '18px', background: 'rgba(255,255,255,0.04)' }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em' }}>Academic Year</p>
                                <strong>{academicYearLabel}</strong>
                            </div>
                            <div style={{ padding: '0.75rem', borderRadius: '18px', background: 'rgba(255,255,255,0.04)' }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em' }}>Major</p>
                                <strong>{formData.major || 'Declare your track'}</strong>
                            </div>
                            <div style={{ padding: '0.75rem', borderRadius: '18px', background: 'rgba(255,255,255,0.04)' }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em' }}>Location</p>
                                <strong>{locationChip || 'Update address'}</strong>
                            </div>
                        </div>
                        <div>
                            <div className="holo-progress" style={{ '--value': `${profileCompletion}%` }}>
                                <span />
                            </div>
                            <small style={{ color: 'rgba(255,255,255,0.6)' }}>Profile completeness {profileCompletion}%</small>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                            {formData.bio || 'Share a short bio so teammates learn your strengths and passions.'}
                        </p>
                    </div>
                </div>

                <div className="achievement-grid">
                    <div className="achievement-card primary">
                        <p style={{ letterSpacing: '0.25em', textTransform: 'uppercase', fontSize: '0.8rem', color: 'rgba(0,0,0,0.6)' }}>Academic Focus</p>
                        <h3 style={{ margin: '0.5rem 0' }}>{formData.major || 'Add Major'}</h3>
                        <small>{academicYearLabel}</small>
                    </div>
                    <div className="achievement-card">
                        <p style={{ letterSpacing: '0.25em', textTransform: 'uppercase', fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>Pulse</p>
                        <h3 style={{ margin: '0.5rem 0' }}>{profileCompletion}%</h3>
                        <small>Completion rate</small>
                    </div>
                    <div className="achievement-card">
                        <p style={{ letterSpacing: '0.25em', textTransform: 'uppercase', fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>Contact</p>
                        <h3 style={{ margin: '0.5rem 0' }}>{formData.phoneNumber || 'Add phone'}</h3>
                        <small>{formData.city || 'City TBD'}</small>
                    </div>
                </div>
            </div>

            {message && <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>{message}</div>}

            <form onSubmit={handleSubmit} className="profile-form">
                <fieldset className="holo-fieldset">
                    <legend>Identity</legend>
                    <div className="holo-form-grid">
                        {renderInput('firstName', 'First Name')}
                        {renderInput('middleName', 'Middle Name')}
                        {renderInput('lastName', 'Last Name')}
                        {renderInput('email', 'Email Address', { type: 'email', placeholder: 'Required for password reset' })}
                        {renderInput('phoneNumber', 'Phone Number')}
                    </div>
                </fieldset>

                <fieldset className="holo-fieldset">
                    <legend>Academic track</legend>
                    <div className="holo-form-grid">
                        {renderInput('major', 'Major', { placeholder: 'e.g. Software Engineering' })}
                        <div>
                            <label>Academic Year</label>
                            <select
                                name="academicYear"
                                className="holo-input"
                                value={formData.academicYear}
                                onChange={handleChange}
                            >
                                <option value="">Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                                <option value="5">5th Year</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                className="holo-input"
                                rows="4"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="holo-fieldset">
                    <legend>Address grid</legend>
                    <div className="holo-form-grid">
                        {renderInput('region', 'Region')}
                        {renderInput('zone', 'Zone')}
                        {renderInput('woreda', 'Woreda')}
                        {renderInput('city', 'City')}
                    </div>
                </fieldset>

                <fieldset className="holo-fieldset">
                    <legend>Security</legend>
                    <div className="holo-form-grid">
                        <div>
                            <label>New Password</label>
                            <input
                                type="password"
                                name="password"
                                className="holo-input"
                                value={formData.password || ''}
                                onChange={handleChange}
                                placeholder="Leave empty to keep current"
                            />
                        </div>
                    </div>
                </fieldset>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
