import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Vote,
    Inbox,
    CheckSquare,
    Calendar,
    UserCircle,
    HelpCircle,
    Settings
} from 'lucide-react';
import './memberDashboard.css';
import Footer from '../../components/Footer';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
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
        <div className="member-dashboard-shell" style={{
            display: 'block',
            background: 'linear-gradient(135deg, #000E08 0%, #032718 100%)',
            minHeight: '100vh',
            overflowX: 'hidden',
            width: '100%',
            maxWidth: '100vw',
            position: 'relative'
        }}>
            {/* Atmospheric Blur Background */}
            <div style={{
                position: 'fixed',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: `
                    radial-gradient(circle at 15% 20%, rgba(63, 255, 134, 0.08) 0%, transparent 40%),
                    radial-gradient(circle at 85% 80%, rgba(89, 245, 227, 0.06) 0%, transparent 40%),
                    radial-gradient(circle at 50% 50%, rgba(63, 255, 134, 0.03) 0%, transparent 60%)
                `,
                filter: 'blur(60px)',
                animation: 'atmosphericDrift 30s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Parallax Depth Layer */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: `
                    radial-gradient(circle at 30% 40%, rgba(63, 255, 134, 0.04) 0%, transparent 50%),
                    radial-gradient(circle at 70% 60%, rgba(89, 245, 227, 0.03) 0%, transparent 50%)
                `,
                filter: 'blur(40px)',
                animation: 'parallaxFloat 20s ease-in-out infinite reverse',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <style>{`
                @keyframes atmosphericDrift {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
                    50% { transform: translate(2%, 3%) scale(1.05); opacity: 1; }
                }
                @keyframes parallaxFloat {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-20px) scale(1.02); }
                }
            `}</style>

            {/* Top Navigation Bar */}
            <ResponsiveNavbar
                user={user}
                navItems={currentNavItems}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="dashboard-main" style={{
                marginLeft: 0,
                paddingTop: '80px',
                width: '100%',
                maxWidth: '100%',
                position: 'relative',
                zIndex: 10,
                overflowX: 'hidden'
            }}>
                {/* Content Area */}
                <div className="dashboard-content" style={{
                    padding: '2rem',
                    maxWidth: '100%',
                    overflowX: 'hidden'
                }}>
                    <Outlet />
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default DashboardLayout;
