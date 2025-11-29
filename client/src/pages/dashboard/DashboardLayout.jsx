import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
    LayoutDashboard,
    Users,
    Radio,
    Calendar,
    Vote,
    BarChart3,
    Building2,
    Inbox,
    Settings,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    Cloud,
    Leaf,
    Zap,
    ChevronLeft,
    ChevronRight,
    UserCircle,
    CheckSquare,
    MessageSquare,
    BookOpen,
    HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }

        const handleResize = () => {
            if (window.innerWidth < 768) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [navigate, user]);

    if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    const themes = [
        { name: 'default', icon: <Sun size={18} />, label: 'Default' },
        { name: 'dark', icon: <Moon size={18} />, label: 'Dark' },
        { name: 'sunrise', icon: <Sun size={18} color="orange" />, label: 'Sunrise' },
        { name: 'ocean', icon: <Cloud size={18} color="blue" />, label: 'Ocean' },
        { name: 'nature', icon: <Leaf size={18} color="green" />, label: 'Nature' },
        { name: 'neon', icon: <Zap size={18} color="magenta" />, label: 'Neon' },
    ];

    const navItems = {
        president: [
            { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
            { path: '/dashboard/president/members', icon: <Users size={20} />, label: 'Members' },
            { path: '/dashboard/president/elections', icon: <Vote size={20} />, label: 'Elections' },
            { path: '/dashboard/president/inbox', icon: <Inbox size={20} />, label: 'Inbox' },
        ],
        secretary: [
            { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
            { path: '/dashboard/secretary/members', icon: <Users size={20} />, label: 'Members' },
            { path: '/dashboard/secretary/records', icon: <Inbox size={20} />, label: 'Records' },
        ],
        member: [
            { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
            { path: '/dashboard/member/profile', icon: <UserCircle size={20} />, label: 'Profile' },
            { path: '/dashboard/member/vote', icon: <Vote size={20} />, label: 'Vote' },
        ],
        // Add other roles as needed
    };

    const currentNavItems = navItems[user.role === 'vp' ? 'president' : user.role] || navItems.member;

    return (
        <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors duration-300">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="bg-[var(--card-bg)] border-r border-[var(--border-color)] flex flex-col z-20 shadow-xl"
            >
                {/* Header */}
                <div className="p-4 flex items-center justify-between h-16 border-b border-[var(--border-color)]">
                    <AnimatePresence mode='wait'>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="font-bold text-xl tracking-tight text-[var(--primary)]"
                            >
                                HUSUMS
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                {/* User Profile */}
                <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-3">
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold overflow-hidden cursor-pointer" onClick={() => document.getElementById('profilePictureInput').click()}>
                            {user.profilePicture ? (
                                <img
                                    src={`http://localhost:5000${user.profilePicture}`}
                                    alt={user.firstName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{user.firstName[0]}</span>
                            )}
                        </div>
                        <input
                            id="profilePictureInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const formData = new FormData();
                                    formData.append('profilePicture', file);
                                    try {
                                        const token = JSON.parse(localStorage.getItem('user')).token;
                                        const res = await fetch('http://localhost:5000/api/auth/profile-picture', {
                                            method: 'PUT',
                                            headers: { 'Authorization': `Bearer ${token}` },
                                            body: formData
                                        });
                                        if (res.ok) {
                                            const data = await res.json();
                                            const updatedUser = { ...user, profilePicture: data.profilePicture };
                                            setUser(updatedUser);
                                            localStorage.setItem('user', JSON.stringify(updatedUser));
                                            alert('Profile picture updated successfully!');
                                        }
                                    } catch (error) {
                                        alert('Failed to upload profile picture');
                                    }
                                }
                            }}
                        />
                    </div>
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="overflow-hidden whitespace-nowrap"
                            >
                                <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                                <p className="text-xs text-[var(--text-secondary)] capitalize">{user.role}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {currentNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-[var(--primary)] text-white shadow-md'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary)]'
                                    }`}
                            >
                                <div className="shrink-0">{item.icon}</div>
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="whitespace-nowrap font-medium"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {!isSidebarOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-[var(--border-color)] space-y-2">
                    {/* Theme Switcher */}
                    <div className="relative group">
                        <button className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors ${!isSidebarOpen && 'justify-center'}`}>
                            <Sun size={20} />
                            {isSidebarOpen && <span>Theme</span>}
                        </button>

                        {/* Theme Dropdown */}
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-xl p-2 hidden group-hover:block z-50">
                            {themes.map(t => (
                                <button
                                    key={t.name}
                                    onClick={() => toggleTheme(t.name)}
                                    className={`w-full flex items-center gap-2 p-2 rounded hover:bg-[var(--bg-secondary)] text-sm ${theme === t.name ? 'text-[var(--primary)] font-bold' : ''}`}
                                >
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[var(--bg-secondary)] relative">
                <div className="p-6 max-w-7xl mx-auto min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
