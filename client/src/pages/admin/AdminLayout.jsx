import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Vote,
    LogOut,
    BarChart3
} from 'lucide-react';
import AdminFooter from '../../components/admin/AdminFooter';

const AdminLayout = () => {
    const navigate = useNavigate();

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

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: 'white' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                background: 'rgba(30, 41, 59, 0.5)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column'
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
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                    <Outlet />
                </div>
                <AdminFooter />
            </main>
        </div>
    );
};

export default AdminLayout;
