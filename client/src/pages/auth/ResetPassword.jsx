import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import loginBg from '../../assets/images/login-bg.jpg';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            setMessage(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            position: 'relative'
        }}>
            {/* Blurred Background Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${loginBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(1px)',
                zIndex: 0
            }} />

            {/* Centered Reset Password Card */}
            <div style={{
                width: '420px',
                padding: '40px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        margin: '0 0 8px 0',
                        background: 'linear-gradient(135deg, #00cc00, #00ff00)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.5px',
                        textShadow: '0 2px 10px rgba(0, 204, 0, 0.3)'
                    }}>Reset Password</h1>
                    <p style={{
                        margin: 0,
                        color: '#fff',
                        fontSize: '0.95rem'
                    }}>Enter your new password</p>
                </div>

                {/* Messages */}
                {message && (
                    <div style={{
                        padding: '12px',
                        marginBottom: '20px',
                        background: 'rgba(0, 204, 0, 0.2)',
                        border: '1px solid rgba(0, 204, 0, 0.4)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}

                {error && (
                    <div style={{
                        padding: '12px',
                        marginBottom: '20px',
                        background: 'rgba(255, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 0, 0, 0.4)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* New Password Input */}
                    <div style={{ marginBottom: '20px', position: 'relative' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="New Password"
                            style={{
                                width: '100%',
                                height: '48px',
                                padding: '0 48px 0 16px',
                                fontSize: '0.95rem',
                                border: '1px solid #16a34a',
                                borderRadius: '12px',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                boxSizing: 'border-box',
                                background: 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(10px)',
                                color: '#fff',
                                boxShadow: '0 0 10px rgba(22, 163, 74, 0.1)'
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = '0 0 20px rgba(22, 163, 74, 0.4), inset 0 0 10px rgba(22, 163, 74, 0.2)';
                                e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = '0 0 10px rgba(22, 163, 74, 0.1)';
                                e.target.style.background = 'rgba(0, 0, 0, 0.4)';
                            }}
                        />
                        {/* Eye Icon */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                color: '#999',
                                fontSize: '1.2rem'
                            }}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>

                    {/* Confirm Password Input */}
                    <div style={{ marginBottom: '24px', position: 'relative' }}>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm Password"
                            style={{
                                width: '100%',
                                height: '48px',
                                padding: '0 48px 0 16px',
                                fontSize: '0.95rem',
                                border: '1px solid #16a34a',
                                borderRadius: '12px',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                boxSizing: 'border-box',
                                background: 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(10px)',
                                color: '#fff',
                                boxShadow: '0 0 10px rgba(22, 163, 74, 0.1)'
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = '0 0 20px rgba(22, 163, 74, 0.4), inset 0 0 10px rgba(22, 163, 74, 0.2)';
                                e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = '0 0 10px rgba(22, 163, 74, 0.1)';
                                e.target.style.background = 'rgba(0, 0, 0, 0.4)';
                            }}
                        />
                        {/* Eye Icon */}
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                color: '#999',
                                fontSize: '1.2rem'
                            }}
                        >
                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>

                    {/* Reset Password Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            height: '48px',
                            background: loading ? 'rgba(0, 204, 0, 0.5)' : 'linear-gradient(135deg, #00cc00, #00ff00)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: '0 4px 12px rgba(0, 204, 0, 0.2)'
                        }}
                        onMouseOver={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(0, 204, 0, 0.3)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(0, 204, 0, 0.2)';
                            }
                        }}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>

                    {/* Back to Login Link */}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <a
                            onClick={() => navigate('/login')}
                            style={{
                                color: '#fff',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                        >
                            ← Back to Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
