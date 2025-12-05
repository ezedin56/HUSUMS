import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye } from 'lucide-react';
import loginBg from '../../assets/images/login-bg.jpg';

const Login = () => {
    const [formData, setFormData] = useState({ studentId: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));

            if (res.data.role === 'publicvote_admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert(error.response?.data?.message || 'Login failed');
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

            {/* Centered Login Card */}
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
                {/* Header Section */}
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
                    }}>HUSUMS</h1>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#fff',
                        margin: '0 0 8px 0'
                    }}>Welcome Back</h2>
                    <p style={{
                        margin: 0,
                        color: '#fff',
                        fontSize: '0.95rem'
                    }}>Sign in to continue</p>
                </div>

                <div style={{ width: '100%' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Student ID Input */}
                        <div style={{
                            position: 'relative',
                            marginBottom: '24px'
                        }}>
                            <input
                                type="text"
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                required
                                placeholder="Student ID"
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
                            <div style={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#999',
                                pointerEvents: 'none'
                            }}>
                                <User size={20} />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div style={{
                            position: 'relative',
                            marginBottom: '24px'
                        }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="Password"
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
                            <div
                                style={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#999',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Eye size={20} /> : <Lock size={20} />}
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px',
                            fontSize: '0.9rem',
                            color: '#fff'
                        }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
                                <input
                                    type="checkbox"
                                    style={{
                                        marginRight: '8px',
                                        accentColor: '#00cc00',
                                        width: '16px',
                                        height: '16px',
                                        cursor: 'pointer'
                                    }}
                                />
                                Remember me
                            </label>
                            <Link to="/forgot-password" style={{
                                color: '#00ff00',
                                textDecoration: 'none',
                                transition: 'all 0.3s'
                            }}
                                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                height: '48px',
                                background: 'linear-gradient(135deg, #00cc00, #00ff00)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 12px rgba(0, 204, 0, 0.2)',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 1px 4px rgba(0, 0, 0, 0.9), 1px 1px 2px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1)'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(0, 204, 0, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(0, 204, 0, 0.2)';
                            }}
                        >
                            LOGIN
                        </button>

                        {/* Back to Home Link */}
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Link
                                to="/"
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
                                ← Back to Home
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
