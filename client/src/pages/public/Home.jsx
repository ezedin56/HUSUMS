import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GridBackground from '../../components/GridBackground';

const Home = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const sections = [
        { id: 'home', label: 'Home' },
        { id: 'features', label: 'Features' },
        { id: 'about', label: 'About' },
        { id: 'feedback', label: 'Feedback' },
        { id: 'contact', label: 'Contact' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            color: 'white',
            position: 'relative',
            overflowX: 'hidden',
            fontFamily: "'Inter', sans-serif" // Assuming Inter or system font
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

                {/* Desktop Navigation */}
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

                <div className="desktop-nav animate-slide-left" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    {sections.map(section => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
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
                right: mobileMenuOpen ? 0 : '-100%',
                width: '70%',
                maxWidth: '300px',
                height: '100vh',
                background: 'rgba(0, 20, 10, 0.95)',
                backdropFilter: 'blur(20px)',
                zIndex: 999,
                transition: 'right 0.3s ease',
                padding: '5rem 2rem 2rem',
                borderLeft: '1px solid rgba(0, 255, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
            }}>
                {sections.map(section => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                            textDecoration: 'none',
                            color: 'rgba(255,255,255,0.8)',
                            fontWeight: '500',
                            fontSize: '1.1rem',
                            transition: 'all 0.3s',
                            padding: '0.5rem 0',
                            borderBottom: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        {section.label}
                    </a>
                ))}
                <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        padding: '0.8rem 1.5rem',
                        borderRadius: '50px',
                        background: 'rgba(0, 255, 0, 0.1)',
                        border: '1px solid rgba(0, 255, 0, 0.4)',
                        color: '#00ff00',
                        fontWeight: '600',
                        textAlign: 'center',
                        textDecoration: 'none',
                        marginTop: '1rem'
                    }}
                >Login</Link>
            </div>

            {/* Mobile Menu Backdrop */}
            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 998
                    }}
                />
            )}


            {/* Hero Section */}
            <section id="home" style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                textAlign: 'center',
                paddingTop: '80px',
                paddingBottom: '2rem'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '1000px' }}>
                    <div style={{
                        background: 'rgba(5, 20, 10, 0.3)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '30px',
                        padding: '4rem',
                        border: '1px solid rgba(0, 255, 0, 0.15)',
                        boxShadow: '0 0 80px rgba(0, 255, 0, 0.05), inset 0 0 30px rgba(0, 255, 0, 0.02)'
                    }}>
                        <h1 className="animate-fade-up" style={{
                            fontSize: '4.5rem',
                            marginBottom: '1.5rem',
                            fontWeight: '800',
                            lineHeight: '1.1',
                            letterSpacing: '-1px'
                        }}>
                            <span style={{ color: 'white', textShadow: '0 0 30px rgba(255,255,255,0.2)' }}>Your Voice,</span> <br />
                            <span style={{
                                background: 'linear-gradient(135deg, #00ff00 0%, #00aa00 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 20px rgba(0,255,0,0.4))'
                            }}>Our Mission</span>
                        </h1>
                        <p className="animate-fade-up delay-200" style={{
                            fontSize: '1.25rem',
                            marginBottom: '3rem',
                            maxWidth: '700px',
                            margin: '0 auto 3rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: '1.6'
                        }}>
                            Empowering Haramaya University students through unity, leadership, and service.
                        </p>

                        <div className="animate-fade-up delay-400" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/vote" className="btn" style={{
                                padding: '1rem 3rem',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                borderRadius: '50px',
                                background: 'linear-gradient(90deg, #00ff00, #00cc00)',
                                color: 'white',
                                border: 'none',
                                boxShadow: '0 0 30px rgba(0, 255, 0, 0.4)',
                                transition: 'all 0.3s ease',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}
                                onMouseOver={e => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 0 50px rgba(0, 255, 0, 0.6)';
                                }}
                                onMouseOut={e => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.4)';
                                }}
                            >
                                Vote Now
                            </Link>
                            <Link to="/login" className="btn" style={{
                                padding: '1rem 3rem',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                borderRadius: '50px',
                                background: 'rgba(0, 170, 255, 0.1)',
                                border: '1px solid rgba(0, 170, 255, 0.5)',
                                color: 'white',
                                boxShadow: '0 0 30px rgba(0, 170, 255, 0.2)',
                                transition: 'all 0.3s ease',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}
                                onMouseOver={e => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.background = 'rgba(0, 170, 255, 0.2)';
                                    e.target.style.boxShadow = '0 0 50px rgba(0, 170, 255, 0.5)';
                                }}
                                onMouseOut={e => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.background = 'rgba(0, 170, 255, 0.1)';
                                    e.target.style.boxShadow = '0 0 30px rgba(0, 170, 255, 0.2)';
                                }}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>

                    {/* Futuristic Stats */}
                    <div className="animate-fade-up delay-500" style={{
                        marginTop: '5rem',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap'
                    }}>
                        {[
                            { label: 'Students', value: '30k+', color: '#00ff00' },
                            { label: 'Colleges', value: '12', color: '#00aaff' },
                            { label: 'Clubs', value: '50+', color: '#ff00ff' }
                        ].map((stat, index) => (
                            <div key={index} style={{
                                flex: '1',
                                minWidth: '200px',
                                maxWidth: '280px',
                                textAlign: 'center',
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)',
                                padding: '2rem',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                                transition: 'transform 0.3s ease'
                            }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    fontSize: '3rem',
                                    fontWeight: '800',
                                    color: 'white',
                                    marginBottom: '0.5rem',
                                    textShadow: `0 0 20px ${stat.color}80`
                                }}>{stat.value}</div>
                                <div style={{
                                    fontSize: '0.9rem',
                                    color: 'rgba(255,255,255,0.6)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    fontWeight: '600'
                                }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container" style={{ padding: '8rem 2rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                    background: 'rgba(0, 20, 10, 0.4)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: '40px',
                    padding: '4rem',
                    border: '1px solid rgba(0, 255, 0, 0.1)'
                }}>
                    <h2 className="animate-fade-up" style={{
                        textAlign: 'center',
                        marginBottom: '4rem',
                        color: 'white',
                        fontSize: '2.5rem',
                        fontWeight: '700'
                    }}>What You Can Do</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                        {[
                            { title: 'Vote Online', icon: '🗳️', desc: 'Secure blockchain-enabled voting system.' },
                            { title: 'Track Events', icon: '📅', desc: 'Real-time updates on campus activities.' },
                            { title: 'Submit Issues', icon: '📢', desc: 'Direct channel to student representatives.' },
                            { title: 'Access Resources', icon: '📚', desc: 'Digital library and academic tools.' }
                        ].map((feature, index) => (
                            <div key={index} className="animate-fade-up" style={{
                                padding: '2.5rem',
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                cursor: 'default'
                            }}
                                onMouseOver={e => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.border = '1px solid rgba(0, 255, 0, 0.3)';
                                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 255, 0, 0.1)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>{feature.icon}</div>
                                <h3 style={{ marginBottom: '1rem', color: 'white', fontSize: '1.4rem' }}>{feature.title}</h3>
                                <p style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.6' }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" style={{ padding: '8rem 0', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
                        <div className="animate-slide-right" style={{
                            padding: '3.5rem',
                            background: 'rgba(0, 20, 10, 0.4)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '30px',
                            border: '1px solid rgba(0, 255, 0, 0.15)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#00ff00', boxShadow: '0 0 20px #00ff00' }}></div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                🎯 Our Mission
                            </h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)' }}>
                                To empower the student body of Haramaya University by providing a transparent, efficient, and inclusive platform for representation, engagement, and service delivery.
                            </p>
                        </div>
                        <div className="animate-slide-left" style={{
                            padding: '3.5rem',
                            background: 'rgba(0, 20, 10, 0.4)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '30px',
                            border: '1px solid rgba(0, 255, 0, 0.15)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#00aaff', boxShadow: '0 0 20px #00aaff' }}></div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                👁️ Our Vision
                            </h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)' }}>
                                To create a vibrant, digitally connected campus community where every student's voice is heard, valued, and acted upon through innovation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feedback Section */}
            <section id="feedback" className="container" style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    background: 'rgba(5, 20, 10, 0.5)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '30px',
                    padding: '4rem',
                    border: '1px solid rgba(0, 255, 0, 0.2)',
                    boxShadow: '0 20px 80px rgba(0, 0, 0, 0.4)'
                }}>
                    <h2 className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '1rem', color: 'white', fontSize: '2.2rem' }}>We Value Your Feedback</h2>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginBottom: '3rem' }}>
                        Help us improve your student experience.
                    </p>

                    <form style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.8rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Name</label>
                                <input type="text" placeholder="John Doe" style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'border 0.3s'
                                }}
                                    onFocus={e => e.target.style.border = '1px solid #00ff00'}
                                    onBlur={e => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.8rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
                                <input type="email" placeholder="john@example.com" style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'border 0.3s'
                                }}
                                    onFocus={e => e.target.style.border = '1px solid #00ff00'}
                                    onBlur={e => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.8rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Message</label>
                            <textarea rows="5" placeholder="Share your thoughts..." style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none',
                                resize: 'vertical',
                                transition: 'border 0.3s'
                            }}
                                onFocus={e => e.target.style.border = '1px solid #00ff00'}
                                onBlur={e => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'}
                            ></textarea>
                        </div>
                        <button type="button" className="btn" style={{
                            padding: '1.2rem 2rem',
                            background: 'linear-gradient(90deg, #00ff00, #00cc00)',
                            color: 'black',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            marginTop: '1rem',
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
                            Submit Feedback
                        </button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" style={{
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(20px)',
                color: 'white',
                padding: '5rem 0 2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
                        <div>
                            <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>HUSUMS</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>Serving the student body with dedication, transparency, and innovation.</p>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem', color: '#00ff00', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Links</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {['Home', 'About', 'Features', 'Contact'].map(link => (
                                    <li key={link} style={{ marginBottom: '0.8rem' }}>
                                        <a href={`#${link.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.3s' }}
                                            onMouseOver={e => e.target.style.color = '#00ff00'}
                                            onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                                        >{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem', color: '#00ff00', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</h4>
                            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>Campus Main Building</p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>info@hu.edu.et</p>
                            <p style={{ color: 'rgba(255,255,255,0.7)' }}>+251 123 456 789</p>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem', color: '#00ff00', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Newsletter</h4>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="email" placeholder="Your email" style={{
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    outline: 'none'
                                }} />
                                <button className="btn" style={{
                                    padding: '0.8rem 1.2rem',
                                    background: '#00ff00',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}>Join</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                        &copy; 2025 Haramaya University Student Union. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
