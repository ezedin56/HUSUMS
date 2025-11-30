import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--secondary)',
            color: 'var(--text-muted)',
            padding: '1.5rem',
            textAlign: 'center',
            marginTop: 'auto',
            borderTop: '1px solid var(--border-color)',
            backdropFilter: 'var(--backdrop-blur)'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>&copy; {new Date().getFullYear()} Haramaya University Student Union Management System</p>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                    <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', margin: '0 0.5rem' }}>Privacy Policy</a>
                    |
                    <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', margin: '0 0.5rem' }}>Terms of Service</a>
                    |
                    <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', margin: '0 0.5rem' }}>Contact Support</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
