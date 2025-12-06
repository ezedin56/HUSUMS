import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';

const ResponsiveNavbar = ({ user, navItems, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* Main Navigation Bar */}
            <nav className="responsive-navbar" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '70px',
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0, 255, 0, 0.15)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                padding: '0 1.5rem',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}>
                {/* Logo */}
                <div className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 1001 }}>
                    <img src="/logo.jpg" alt="HUSUMS Logo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        letterSpacing: '1px',
                        background: 'linear-gradient(135deg, #fff, #00ff00)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>HUSUMS</span>
                </div>

                {/* Desktop Navigation */}
                <div className="desktop-nav" style={{
                    display: 'none',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <style>{`
                        @media (min-width: 1024px) {
                            .desktop-nav { display: flex !important; }
                            .mobile-menu-btn { display: none !important; }
                        }
                        @media (max-width: 1023px) {
                            .navbar-actions { display: none !important; }
                        }
                    `}</style>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '10px',
                                    color: isActive ? '#00ff00' : 'rgba(255, 255, 255, 0.75)',
                                    background: isActive ? 'rgba(0, 255, 0, 0.12)' : 'transparent',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: isActive ? '1px solid rgba(0, 255, 0, 0.3)' : '1px solid transparent',
                                    boxShadow: isActive ? '0 0 20px rgba(0, 255, 0, 0.2)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        e.currentTarget.style.color = '#00ff00';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
                                    }
                                }}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side Actions (Desktop) */}
                <div className="navbar-actions" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem'
                }}>
                    <div className="user-profile" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem'
                    }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                color: '#ffffff',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>
                                {user.firstName} {user.lastName}
                            </div>
                            <div style={{
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {user.role}
                            </div>
                        </div>
                        <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.15), rgba(0, 200, 0, 0.1))',
                            border: '2px solid rgba(0, 255, 0, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)'
                        }}>
                            {user.profilePicture ? (
                                <img src={`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}${user.profilePicture}`} alt="Profile" style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }} />
                            ) : (
                                <User size={20} color="#00ff00" />
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        style={{
                            background: 'rgba(255, 50, 50, 0.12)',
                            border: '1px solid rgba(255, 50, 50, 0.4)',
                            color: '#ff4444',
                            padding: '0.6rem',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 0 15px rgba(255, 50, 50, 0.2)'
                        }}
                        title="Logout"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 50, 50, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 50, 50, 0.12)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <LogOut size={18} />
                    </button>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={toggleMobileMenu}
                    style={{
                        background: isMobileMenuOpen ? 'rgba(0, 255, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${isMobileMenuOpen ? 'rgba(0, 255, 0, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                        color: isMobileMenuOpen ? '#00ff00' : '#ffffff',
                        cursor: 'pointer',
                        padding: '0.6rem',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 1001,
                        boxShadow: isMobileMenuOpen ? '0 0 20px rgba(0, 255, 0, 0.3)' : 'none'
                    }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu - Dark Overlay */}
            {isMobileMenuOpen && (
                <div
                    onClick={toggleMobileMenu}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        zIndex: 998,
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                />
            )}

            {/* Mobile Menu - Slide-out Drawer */}
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '85%',
                maxWidth: '400px',
                background: 'linear-gradient(135deg, rgba(0, 10, 5, 0.98), rgba(0, 0, 0, 0.98))',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                borderLeft: '1px solid rgba(0, 255, 0, 0.2)',
                zIndex: 999,
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 1.5rem',
                overflowY: 'auto',
                transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.5)'
            }}>
                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>

                {/* Menu Header */}
                <div style={{
                    marginBottom: '2rem',
                    marginTop: '3rem',
                    animation: 'slideIn 0.4s ease-out 0.1s both'
                }}>
                    <h2 style={{
                        color: '#ffffff',
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #fff, #00ff00)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Navigation</h2>
                    <div style={{
                        width: '60px',
                        height: '3px',
                        background: 'linear-gradient(90deg, #00ff00, transparent)',
                        borderRadius: '2px'
                    }} />
                </div>

                {/* Navigation Items */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    marginBottom: '2rem'
                }}>
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '16px',
                                    color: isActive ? '#00ff00' : 'rgba(255, 255, 255, 0.85)',
                                    background: isActive ? 'rgba(0, 255, 0, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                                    textDecoration: 'none',
                                    fontSize: '1.05rem',
                                    fontWeight: '600',
                                    border: isActive ? '1px solid rgba(0, 255, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: isActive ? '0 4px 20px rgba(0, 255, 0, 0.2)' : 'none',
                                    animation: `slideIn 0.4s ease-out ${0.1 + index * 0.05}s both`
                                }}
                            >
                                <div style={{
                                    filter: isActive ? 'drop-shadow(0 0 8px rgba(0, 255, 0, 0.5))' : 'none'
                                }}>
                                    {item.icon}
                                </div>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    margin: '1rem 0',
                    animation: 'slideIn 0.4s ease-out 0.5s both'
                }} />

                {/* User Profile Section */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    background: 'rgba(0, 255, 0, 0.05)',
                    border: '1px solid rgba(0, 255, 0, 0.15)',
                    borderRadius: '16px',
                    marginBottom: '1rem',
                    animation: 'slideIn 0.4s ease-out 0.55s both'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 200, 0, 0.15))',
                        border: '2px solid rgba(0, 255, 0, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: '0 0 24px rgba(0, 255, 0, 0.3)'
                    }}>
                        {user.profilePicture ? (
                            <img src={`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}${user.profilePicture}`} alt="Profile" style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }} />
                        ) : (
                            <User size={24} color="#00ff00" />
                        )}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            color: '#ffffff',
                            fontWeight: '700',
                            fontSize: '1.05rem',
                            marginBottom: '0.25rem'
                        }}>
                            {user.firstName} {user.lastName}
                        </div>
                        <div style={{
                            color: 'rgba(0, 255, 0, 0.8)',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontWeight: '600'
                        }}>
                            {user.role}
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        borderRadius: '16px',
                        background: 'rgba(255, 50, 50, 0.12)',
                        border: '1px solid rgba(255, 50, 50, 0.4)',
                        color: '#ff4444',
                        fontSize: '1.05rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginTop: 'auto',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 16px rgba(255, 50, 50, 0.2)',
                        animation: 'slideIn 0.4s ease-out 0.6s both'
                    }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </>
    );
};

export default ResponsiveNavbar;
