import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

const AdminFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 py-8"
            style={{
                background: 'rgba(10, 14, 39, 0.6)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(0, 255, 85, 0.1)',
                boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
            }}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div style={{
                                width: '35px',
                                height: '35px',
                                background: 'linear-gradient(135deg, #00ff55, #00d9ff)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                color: '#0a0e27',
                                boxShadow: '0 0 15px rgba(0, 255, 85, 0.4)'
                            }}>
                                H
                            </div>
                            <span style={{
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                background: 'linear-gradient(135deg, #00ff55, #00d9ff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                HUSUMS
                            </span>
                        </div>
                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                            Modern election management system for university student unions.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            color: '#00ff55'
                        }}>
                            Quick Links
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {['Dashboard', 'Elections', 'Candidates', 'Results'].map((link) => (
                                <li key={link} style={{ marginBottom: '0.5rem' }}>
                                    <a
                                        href={`/admin/${link.toLowerCase()}`}
                                        style={{
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            transition: 'color 0.3s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#00ff55'}
                                        onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            color: '#00d9ff'
                        }}>
                            Connect
                        </h3>
                        <div className="flex gap-3">
                            {[
                                { icon: Github, color: '#00ff55' },
                                { icon: Twitter, color: '#00d9ff' },
                                { icon: Mail, color: '#a855f7' }
                            ].map((item, index) => (
                                <motion.a
                                    key={index}
                                    href="#"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: `rgba(${item.color === '#00ff55' ? '0, 255, 85' : item.color === '#00d9ff' ? '0, 217, 255' : '168, 85, 247'}, 0.1)`,
                                        border: `1px solid rgba(${item.color === '#00ff55' ? '0, 255, 85' : item.color === '#00d9ff' ? '0, 217, 255' : '168, 85, 247'}, 0.3)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = `0 0 20px ${item.color}40`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <item.icon size={20} style={{ color: item.color }} />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
                    style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem', margin: 0 }}>
                        © {currentYear} HUSUMS. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>
                        <span>Made with</span>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <Heart size={16} style={{ color: '#ff0055', fill: '#ff0055' }} />
                        </motion.div>
                        <span>for better elections</span>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

export default AdminFooter;
