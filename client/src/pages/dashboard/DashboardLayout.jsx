import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Vote,
    Inbox,
    LogOut,
    ChevronLeft,
    ChevronRight,
    UserCircle,
    CheckSquare,
    Calendar,
    BookOpen,
    HelpCircle,
    Settings,
    Bell
} from 'lucide-react';
import './memberDashboard.css';
import Footer from '../../components/Footer';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }

        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [navigate, user]);

    if (!user) return (
        <div className="dashboard-loading">
            <div className="holo-loader" />
            <p>Initializing dashboard...</p>
        </div>
    );

    const navItems = {
        president: [
            { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Command Center' },
            { path: '/dashboard/president/members', icon: <Users size={20} />, label: 'Members' },
            { path: '/dashboard/president/elections', icon: <Vote size={20} />, label: 'Elections' },
            { path: '/dashboard/president/events', icon: <Calendar size={20} />, label: 'Events' },
            { path: '/dashboard/president/inbox', icon: <Inbox size={20} />, label: 'Inbox' },
            { path: '/dashboard/president/system', icon: <Settings size={20} />, label: 'System' },
        ],
        secretary: [
            { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Command Center' },
            { path: '/dashboard/secretary/members', icon: <Users size={20} />, label: 'Members' },
            { path: '/dashboard/secretary/records', icon: <Inbox size={20} />, label: 'Records' },
            { path: '/dashboard/secretary/attendance', icon: <CheckSquare size={20} />, label: 'Attendance' },
            { path: '/dashboard/secretary/elections', icon: <Vote size={20} />, label: 'Elections' },
        ],
        member: [
            { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Command Center' },
            { path: '/dashboard/member/profile', icon: <UserCircle size={20} />, label: 'Holographic ID' },
            { path: '/dashboard/member/elections', icon: <Vote size={20} />, label: 'Election' },
            { path: '/dashboard/member/support', icon: <HelpCircle size={20} />, label: 'Support' },
        ],
    };

    const currentNavItems = navItems[user.role === 'vp' ? 'president' : user.role] || navItems.member;

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard-shell">
            <div className="dashboard-stars" />

            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
                {/* Logo Header */}
                <div className="sidebar-header">
                    {isSidebarOpen && (
                        <div className="sidebar-logo">
                            <span className="logo-icon">⚡</span>
                            <span className="logo-text">HUSUMS</span>
                        </div>
                    )}
                    <button
                        className="sidebar-toggle"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                {/* User Profile */}
                <div className="sidebar-profile">
                    <div className="profile-avatar">
                        {user.profilePicture ? (
                            <img
                                src={`http://localhost:5000${user.profilePicture}`}
                                alt={user.firstName}
                            />
                        ) : (
                            <span>{user.firstName?.[0] || 'U'}</span>
                        )}
                        <div className="avatar-status online" />
                    </div>
                    {isSidebarOpen && (
                        <div className="profile-info">
                            <p className="profile-name">{user.firstName} {user.lastName}</p>
                            <p className="profile-role">{user.role}</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {currentNavItems.map((item, index) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                                style={{ '--nav-delay': `${index * 0.05}s` }}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {isSidebarOpen && <span className="nav-label">{item.label}</span>}
                                {!isSidebarOpen && (
                                    <span className="nav-tooltip">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Top Bar */}
                <header className="dashboard-topbar">
                    <div className="topbar-left">
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                        <div className="breadcrumb">
                            <span className="breadcrumb-role">{user.role}</span>
                            <span className="breadcrumb-separator">/</span>
                            <span className="breadcrumb-page">
                                {currentNavItems.find(item =>
                                    item.path === location.pathname ||
                                    (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                                )?.label || 'Dashboard'}
                            </span>
                        </div>
                    </div>
                    <div className="topbar-right">
                        <button className="topbar-btn notification">
                            <Bell size={20} />
                            <span className="notification-dot" />
                        </button>
                        <div className="topbar-time">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="dashboard-content">
                    <Outlet />
                </div>
                <Footer />
            </main>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="mobile-menu" onClick={e => e.stopPropagation()}>
                        <div className="mobile-menu-header">
                            <span className="logo-icon">⚡</span>
                            <span className="logo-text">HUSUMS</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}>×</button>
                        </div>
                        <nav className="mobile-nav">
                            {currentNavItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                        <button className="mobile-logout" onClick={handleLogout}>
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;
