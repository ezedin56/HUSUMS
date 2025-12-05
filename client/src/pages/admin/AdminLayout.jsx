import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Vote,
    LogOut,
    BarChart3,
    Menu,
    X
} from 'lucide-react';
import AdminFooter from '../../components/admin/AdminFooter';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/elections', icon: <Vote size={20} />, label: 'Elections' },
        { path: '/admin/candidates', icon: <Users size={20} />, label: 'Candidates' },
        { path: '/admin/results', icon: <BarChart3 size={20} />, label: 'Results' },
    ];

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
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: 'white', position: 'relative' }}>
            <style>{`
                @media (min-width: 1024px) {
                    .admin-mobile-header { display: none !important; }
                    .desktop-sidebar { 
                        display: flex !important; 
                        transform: none !important;
                        padding-top: 2rem !important;
                    }
                }
                @media (max-width: 1023px) {
                    .desktop-sidebar { 
                        /* Ensure sidebar is visible for transition but positioned off-screen */
                        display: flex !important;
                        padding-top: 90px !important; /* Space for header */
                    }
                }
            `}</style>

            {/* Mobile Header with Hamburger */}
            <div className="admin-mobile-header" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '70px',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                    }}>
                        H
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>HUSUMS Admin</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{
                        background: isMobileMenuOpen ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${isMobileMenuOpen ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                        color: isMobileMenuOpen ? '#22c55e' : '#ffffff',
                        cursor: 'pointer',
                        padding: '0.6rem',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                        zIndex: 1001
                    }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 998
                    }}
                />
            )}

            {/* Sidebar - Desktop (always visible) and Mobile (slide-out) */}
            <aside className="desktop-sidebar" style={{
                width: '250px',
                background: 'rgba(30, 41, 59, 0.95)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 999,
                transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflowY: 'auto'
            }}>
                <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                    }}>
                        H
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>HUSUMS Admin</span>
                </div>

                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {navItems.map((item) => (
                            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                                <NavLink
                                    to={item.path}
                                    style={({ isActive }) => ({
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        color: isActive ? 'white' : 'rgba(255, 255, 255, 0.6)',
                                        background: isActive ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                                        border: isActive ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid transparent',
                                        transition: 'all 0.3s'
                                    })}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '10px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        marginTop: 'auto',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                padding: '1rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 0,
                paddingTop: '90px' // Space for mobile header
            }} className="admin-main-content">
                <style>{`
                    @media (min-width: 1024px) {
                        .admin-main-content {
                            margin-left: 250px !important;
                            padding-top: 2rem !important;
                        }
                    }
                `}</style>
                <div style={{ flex: 1 }}>
                    <Outlet />
                </div>
                <AdminFooter />
            </main>
        </div>
    );
};

export default AdminLayout;
