import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    HUSUMS
                </Link>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link to="/" style={{ color: 'var(--text-main)' }}>Home</Link>
                    <Link to="/about" style={{ color: 'var(--text-main)' }}>About</Link>
                    <Link to="/login" className="btn btn-primary">Login</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
