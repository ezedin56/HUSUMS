import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import GridBackground from '../../components/GridBackground';

const Login = () => {
    const [formData, setFormData] = useState({ studentId: '', password: '' });
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            color: 'white',
            position: 'relative',
            overflowX: 'hidden',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Grid Background */}
            <GridBackground />

            {/* Overlay Gradient for depth */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.05) 0%, rgba(0, 0, 0, 0.6) 100%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Animated Navigation Bar */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: scrolled ? '1rem 2rem' : '1.5rem 2rem',
                background: scrolled ? 'rgba(0, 20, 10, 0.6)' : 'rgba(0, 0, 0, 0.1)',
                boxShadow: scrolled ? '0 4px 30px rgba(0, 255, 0, 0.1)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0, 255, 0, 0.1)'
            }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div className="animate-slide-right" style={{
                        fontSize: '1.8rem',
                        fontWeight: '800',
                        letterSpacing: '-0.5px',
                        background: 'linear-gradient(to right, #fff, #00ff00)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 10px rgba(0,255,0,0.3))'
                    }}>
                        HUSUMS
                    </div>
                </Link>

                <div className="desktop-nav animate-slide-left" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    <style>{`
                        @media (max-width: 768px) {
                            .desktop-nav { display: none !important; }
                            .mobile-menu-btn { display: flex !important; }
                        }
                        @media (min-width: 769px) {
                            .desktop-nav { display: flex !important; }
                            .mobile-menu-btn { display: none !important; }
                        }
                    `}</style>
                    {[
                        { id: 'home', label: 'Home' },
                        { id: 'features', label: 'Features' },
                        { id: 'about', label: 'About' },
                        { id: 'feedback', label: 'Feedback' },
                        { id: 'contact', label: 'Contact' }
                    ].map(section => (
                        <a
                            key={section.id}
                            href={`/#${section.id}`}
                            style={{
                                textDecoration: 'none',
                                color: 'rgba(255,255,255,0.8)',
                                fontWeight: '500',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s',
                                position: 'relative'
                            }}
                            className="nav-link hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]"
                        >
                            {section.label}
                        </a>
                    ))}
                    <Link to="/login" className="btn" style={{
                        padding: '0.6rem 1.8rem',
                        borderRadius: '50px',
                        background: 'rgba(0, 255, 0, 0.1)',
                        border: '1px solid rgba(0, 255, 0, 0.4)',
                        color: '#00ff00',
                        fontWeight: '600',
                        backdropFilter: 'blur(5px)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 15px rgba(0, 255, 0, 0.1)'
                    }}
                        onMouseOver={e => {
                            e.target.style.background = 'rgba(0, 255, 0, 0.2)';
                            e.target.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.4)';
                        }}
                        onMouseOut={e => {
                            e.target.style.background = 'rgba(0, 255, 0, 0.1)';
                            e.target.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.1)';
                        }}
                    >Login</Link>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{
                        display: 'none',
                        flexDirection: 'column',
                        gap: '5px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        zIndex: 1001
                    }}
                >
                    <span style={{
                        width: '25px',
                        height: '2px',
                        background: '#00ff00',
                        transition: 'all 0.3s',
                        transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none'
                    }}></span>
                    <span style={{
                        width: '25px',
                        height: '2px',
                        background: '#00ff00',
                        transition: 'all 0.3s',
                        opacity: mobileMenuOpen ? 0 : 1
                    }}></span>
                    <span style={{
                        width: '25px',
                        height: '2px',
                        background: '#00ff00',
                        transition: 'all 0.3s',
                        transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none'
                    }}></span>
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(20px)',
                zIndex: 999,
                display: mobileMenuOpen ? 'flex' : 'none',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem',
                transition: 'all 0.3s'
            }}>
                {[
                    { id: 'home', label: 'Home' },
                    { id: 'features', label: 'Features' },
                    { id: 'about', label: 'About' },
                    { id: 'feedback', label: 'Feedback' },
                    { id: 'contact', label: 'Contact' }
                ].map(section => (
                    <a
                        key={section.id}
                        href={`/#${section.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                            textDecoration: 'none',
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            transition: 'all 0.3s'
                        }}
                    >
                        {section.label}
                    </a>
                ))}
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{
                    padding: '1rem 3rem',
                    borderRadius: '50px',
                    background: '#00ff00',
                    color: 'black',
                    fontWeight: '700',
                    textDecoration: 'none',
                    fontSize: '1.2rem'
                }}>Login</Link>
            </div>

            <div className="card animate-fade-up" style={{
                width: '100%',
                maxWidth: '420px',
                padding: '3rem 2.5rem',
                background: 'rgba(5, 20, 10, 0.3)',
                backdropFilter: 'blur(20px)',
                borderRadius: '30px',
                border: '1px solid rgba(0, 255, 0, 0.15)',
                boxShadow: '0 0 80px rgba(0, 255, 0, 0.05), inset 0 0 30px rgba(0, 255, 0, 0.02)',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        letterSpacing: '-0.5px',
                        background: 'linear-gradient(to right, #fff, #00ff00)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 10px rgba(0,255,0,0.3))',
                        marginBottom: '1rem',
                        display: 'inline-block'
                    }}>
                        HUSUMS
                    </div>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: 'white'
                    }}>Welcome Back</h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.5rem' }}>Sign in to continue</p>
                </div>

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
                            marginLeft: '1rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>Student ID</label>
                        <input
                            type="text"
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            required
                            placeholder="Enter your ID"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.3s'
                            }}
                            onFocus={(e) => {
                                e.target.style.border = '1px solid #00ff00';
                                e.target.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.8rem',
                            marginLeft: '1rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.3s'
                            }}
                            onFocus={(e) => {
                                e.target.style.border = '1px solid #00ff00';
                                e.target.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'linear-gradient(90deg, #00ff00, #00cc00)',
                            color: 'black',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)'
                        }}
                        onMouseOver={e => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 0 40px rgba(0, 255, 0, 0.5)';
                        }}
                        onMouseOut={e => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.3)';
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
