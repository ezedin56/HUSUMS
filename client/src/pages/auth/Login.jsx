import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye } from 'lucide-react';

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
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Overlay Gradient for depth - lighter to show background */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '3rem 2.5rem',
                background: 'rgba(255, 255, 255, 0.12)', // Transparent glassmorphism
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 10
            }}>
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '2rem', width: '100%' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: '0 0 0.5rem 0',
                        letterSpacing: '-0.5px'
                    }}>HUSUMS</h1>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#222',
                        margin: '0 0 0.5rem 0'
                    }}>Welcome Back</h2>
                    <p style={{
                        fontSize: '0.95rem',
                        color: '#666',
                        margin: 0
                    }}>Sign in to continue</p>
                </div>

                <div style={{ width: '100%' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Student ID Input */}
                        <div style={{
                            position: 'relative',
                            marginBottom: '1.2rem'
                        }}>
                            <input
                                type="text"
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                required
                                placeholder="Student ID"
                                style={{
                                    width: '100%',
                                    padding: '1rem 3rem 1rem 1.2rem',
                                    background: 'rgba(255, 255, 255, 0.12)',
                                    border: '1px solid rgba(255, 255, 255, 0.25)',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    color: '#fff',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                right: '1.2rem',
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
                            marginBottom: '1.5rem'
                        }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="Password"
                                style={{
                                    width: '100%',
                                    padding: '1rem 3rem 1rem 1.2rem',
                                    background: 'rgba(255, 255, 255, 0.12)',
                                    border: '1px solid rgba(255, 255, 255, 0.25)',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    color: '#fff',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    right: '1.2rem',
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
                            marginBottom: '2rem',
                            fontSize: '0.9rem',
                            color: 'white'
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
                                color: 'white',
                                textDecoration: 'none',
                                opacity: 0.8,
                                transition: 'opacity 0.2s'
                            }}
                                onMouseOver={(e) => e.target.style.opacity = 1}
                                onMouseOut={(e) => e.target.style.opacity = 0.8}
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                letterSpacing: '0.5px',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                            }}
                            onMouseOver={e => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.4)';
                            }}
                            onMouseOut={e => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
                            }}
                        >
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
