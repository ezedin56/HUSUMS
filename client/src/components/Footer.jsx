import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '2rem 0',
            marginTop: 'auto',
            position: 'relative',
            zIndex: 10
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem'
            }}>
                {/* Brand & Copyright */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '1.1rem'
                    }}>
                        <span style={{ color: '#22c55e' }}>⚡</span> HUSUMS
                    </div>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.85rem',
                        margin: 0
                    }}>
                        &copy; {new Date().getFullYear()} All Rights Reserved
                    </p>
                </div>

                {/* Links */}
                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    fontSize: '0.9rem'
                }}>
                    <a href="#" className="footer-link">Privacy Policy</a>
                    <a href="#" className="footer-link">Terms of Service</a>
                    <a href="#" className="footer-link">Support</a>
                </div>
            </div>

            <style>{`
                .footer-link {
                    color: rgba(255, 255, 255, 0.6);
                    text-decoration: none;
                    transition: all 0.3s ease;
                    position: relative;
                }
                .footer-link:hover {
                    color: #22c55e;
                }
                .footer-link::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 1px;
                    bottom: -2px;
                    left: 0;
                    background-color: #22c55e;
                    transition: width 0.3s ease;
                }
                .footer-link:hover::after {
                    width: 100%;
                }
                @media (max-width: 768px) {
                    .container {
                        flex-direction: column;
                        text-align: center;
                    }
                    .footer-links {
                        gap: 1.5rem;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
