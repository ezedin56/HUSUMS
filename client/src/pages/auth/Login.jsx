import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GridBackground from '../../components/GridBackground';

const Login = () => {
    const [formData, setFormData] = useState({ studentId: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));

            // Redirect based on role
            if (res.data.role === 'publicvote_admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login Error:', error);
            if (error.response && error.response.data) {
                console.log('Error Response Data:', JSON.stringify(error.response.data, null, 2));
            }
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            position: 'relative',
            color: 'white',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Grid Background */}
            <GridBackground />

            {/* Overlay Gradient */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.05) 0%, rgba(0, 0, 0, 0.6) 100%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Login Card */}
            <div className="animate-fade-up" style={{
                width: '100%',
                maxWidth: '480px',
                padding: '3.5rem 3rem',
                background: 'rgba(0, 20, 10, 0.4)',
                backdropFilter: 'blur(20px)',
                borderRadius: '30px',
                border: '1px solid rgba(0, 255, 0, 0.2)',
                boxShadow: '0 20px 80px rgba(0, 0, 0, 0.4), 0 0 80px rgba(0, 255, 0, 0.05)',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Decorative Green Bar */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: '#00ff00',
                    boxShadow: '0 0 20px #00ff00',
                    borderTopLeftRadius: '30px',
                    borderBottomLeftRadius: '30px'
                }} />

                {/* Title */}
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '0.5rem',
                    fontSize: '2.8rem',
                    fontWeight: '800',
                    background: 'linear-gradient(to right, #fff, #00ff00)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 20px rgba(0,255,0,0.3))',
                    letterSpacing: '-1px'
                }}>Login</h2>

                <p style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '3rem',
                    fontSize: '0.95rem'
                }}>Welcome back to HUSUMS</p>

                <form onSubmit={handleSubmit}>
                    {/* Student ID Field */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontWeight: '600'
                        }}>Student ID</label>
                        <input
                            type="text"
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            required
                            placeholder="Enter your ID"
                            style={{
                                width: '100%',
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                background: 'rgba(0, 0, 0, 0.3)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#00ff00';
                                e.target.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontWeight: '600'
                        }}>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                background: 'rgba(0, 0, 0, 0.3)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#00ff00';
                                e.target.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '1.2rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(90deg, #00ff00, #00cc00)',
                            color: 'black',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 0 30px rgba(0, 255, 0, 0.4)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 0 50px rgba(0, 255, 0, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.4)';
                        }}
                    >
                        Sign In
                    </button>
                </form>

                {/* Additional Link */}
                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.9rem'
                }}>
                    Don't have an account? <a href="/register" style={{
                        color: '#00ff00',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'all 0.3s'
                    }}
                        onMouseOver={(e) => e.target.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.8)'}
                        onMouseOut={(e) => e.target.style.textShadow = 'none'}
                    >Register here</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
