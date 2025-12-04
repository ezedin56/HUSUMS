import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUniversity, FaVoteYea, FaCalendarAlt, FaUsers, FaBook,
    FaFacebook, FaTwitter, FaInstagram, FaTelegram, FaEnvelope, FaPhone, FaMapMarkerAlt,
    FaHandshake, FaBullhorn, FaGavel, FaUserTie, FaCode, FaGithub, FaLinkedin,
    FaScroll, FaChartBar, FaSearch, FaCheckCircle, FaBalanceScale, FaGraduationCap,
    FaChartLine, FaBullseye, FaLock, FaGlobe, FaClock, FaArrowRight
} from 'react-icons/fa';
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiTailwindcss } from 'react-icons/si';
import loginBg from '../../assets/images/login-bg.jpg';
import ezedinImg from '../../assets/images/ezedin_new.png';
import sultanImg from '../../assets/images/sultan.png';
import ConstitutionModal from '../../components/ConstitutionModal';
import VotersGuideModal from '../../components/VotersGuideModal';
import HowItWorksModal from '../../components/HowItWorksModal';

const Home = () => {
    const [scrolled, setScrolled] = useState(false);
    const darkMode = true;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDepartment, setActiveDepartment] = useState(0);
    const [constitutionModalOpen, setConstitutionModalOpen] = useState(false);
    const [votersGuideModalOpen, setVotersGuideModalOpen] = useState(false);
    const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
    const [howItWorksInitialTab, setHowItWorksInitialTab] = useState('eligibility');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Force dark mode always
        document.documentElement.classList.add('dark');
    }, []);

    const theme = {
        bg: '#0f172a',
        text: '#f1f5f9',
        primary: '#00ff00',
        secondary: '#00aaff',
        cardBg: 'rgba(30, 41, 59, 0.7)',
        navBg: 'rgba(15, 23, 42, 0.9)',
        border: 'rgba(255, 255, 255, 0.1)'
    };

    const sections = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'structure', label: 'Structure' },
        { id: 'elections', label: 'Elections' },
        { id: 'departments', label: 'Departments' },
        { id: 'events', label: 'Events' },
        { id: 'contact', label: 'Contact' }
    ];

    const objectives = [
        { icon: <FaVoteYea />, text: "Promote democratic culture" },
        { icon: <FaHandshake />, text: "Defend student rights" },
        { icon: <FaBook />, text: "Quality education advocacy" },
        { icon: <FaUsers />, text: "Foster unity & tolerance" },
        { icon: <FaGavel />, text: "Ensure good governance" },
        { icon: <FaUniversity />, text: "Participate in decisions" },
        { icon: <FaBullhorn />, text: "Information access" },
        { icon: <FaUserTie />, text: "Leadership development" },
        { icon: <FaHandshake />, text: "Community service" },
        { icon: <FaUniversity />, text: "University collaboration" }
    ];



    const departments = [
        { title: "Academic Affairs", content: "Responsible for all academic related issues, representing students in senate, and ensuring quality education." },
        { title: "Discipline & Security", content: "Maintains peace and security on campus, handles disciplinary cases, and promotes a safe environment." },
        { title: "Gender & HIV/AIDS", content: "Works on gender equality, supports female students, and raises awareness about HIV/AIDS." },
        { title: "Sports & Recreation", content: "Organizes sports tournaments, recreational activities, and manages sports facilities." },
        { title: "Food & Health", content: "Monitors cafeteria services, health center quality, and ensures student well-being." },
    ];

    const events = [
        {
            id: 1,
            title: "Annual General Meeting 2025",
            date: "Dec 15, 2025",
            time: "2:00 PM",
            location: "Main Auditorium",
            category: "Governance",
            description: "All students are invited to discuss the upcoming year's budget and strategic plan.",
            image: null
        },
        {
            id: 2,
            title: "Inter-Department Football Cup",
            date: "Jan 10, 2026",
            time: "4:00 PM",
            location: "University Stadium",
            category: "Sports",
            description: "Cheer for your department in the biggest sports event of the year!",
            image: null
        },
        {
            id: 3,
            title: "Tech Innovation Hackathon",
            date: "Feb 05, 2026",
            time: "9:00 AM",
            location: "IT Center",
            category: "Academic",
            description: "Showcase your coding skills and win amazing prizes.",
            image: null
        }
    ];

    return (
        <div style={{ background: theme.bg, color: theme.text, minHeight: '100vh', transition: 'background 0.3s, color 0.3s', fontFamily: "'Inter', sans-serif" }}>

            {/* Navigation */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                background: scrolled ? theme.navBg : 'transparent',
                backdropFilter: 'blur(10px)',
                padding: scrolled ? '1rem 2rem' : '1.5rem 2rem',
                borderBottom: scrolled ? `1px solid ${theme.border}` : 'none',
                transition: 'all 0.3s ease',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: theme.primary, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaUniversity /> HUSUMS
                </div>

                <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {sections.map(item => (
                        <a key={item.id} href={`#${item.id}`} style={{ color: theme.text, textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.2s' }} className="hover:text-green-400">
                            {item.label}
                        </a>
                    ))}

                    <Link to="/login" style={{
                        padding: '0.5rem 1.5rem', borderRadius: '50px', background: theme.primary, color: '#000', fontWeight: '700', textDecoration: 'none', transition: 'transform 0.2s'
                    }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>
                        Login
                    </Link>
                </div>


                {/* Mobile Menu Toggle */}
                <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: theme.text, fontSize: '1.5rem', cursor: 'pointer' }}>
                    {mobileMenuOpen ? '✕' : '☰'}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 999,
                                backdropFilter: 'blur(5px)'
                            }}
                        />
                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: '280px',
                                maxWidth: '80vw',
                                background: theme.cardBg,
                                backdropFilter: 'blur(20px)',
                                zIndex: 1001,
                                padding: '2rem 1.5rem',
                                boxShadow: '-5px 0 20px rgba(0,0,0,0.3)',
                                overflowY: 'auto'
                            }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'none',
                                    border: 'none',
                                    color: theme.text,
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    padding: '0.5rem'
                                }}
                            >
                                ✕
                            </button>

                            {/* Logo */}
                            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: theme.primary, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaUniversity /> HUSUMS
                            </div>

                            {/* Navigation Links */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                {sections.map(item => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{
                                            color: theme.text,
                                            textDecoration: 'none',
                                            fontWeight: '600',
                                            fontSize: '1.1rem',
                                            padding: '0.8rem 1rem',
                                            borderRadius: '10px',
                                            transition: 'all 0.2s',
                                            background: 'transparent'
                                        }}
                                        onMouseOver={e => e.target.style.background = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
                                        onMouseOut={e => e.target.style.background = 'transparent'}
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>

                            {/* Login Button */}
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '50px',
                                    background: theme.primary,
                                    color: '#000',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                Login
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>


            {/* Hero Section */}
            <section id="home" style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${loginBg})`,
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
                textAlign: 'center', padding: '0 1rem', position: 'relative'
            }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '800', color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
                        Haramaya University <br /> <span style={{ color: theme.primary }}>Students' Union</span>
                    </h1>
                    <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: '#e2e8f0', marginBottom: '2.5rem', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
                        Your Voice, Our Union – Established 2017
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/public-vote" style={{
                            padding: '1rem 2.5rem', borderRadius: '50px', background: 'linear-gradient(90deg, #00ff00, #00cc00)', color: '#FFFFFF', fontWeight: '900', textDecoration: 'none', fontSize: '1.3rem', transition: 'all 0.3s', boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)', border: 'none', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.5)', letterSpacing: '0.5px'
                        }} onMouseOver={e => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.6)' }} onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.4)' }}>
                            Vote Now
                        </Link>
                        <a href="#about" style={{
                            padding: '1rem 2.5rem', borderRadius: '50px', background: theme.primary, color: '#FFFFFF', fontWeight: '900', textDecoration: 'none', fontSize: '1.3rem', transition: 'all 0.3s', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.5)', letterSpacing: '0.5px'
                        }} onMouseOver={e => { e.target.style.transform = 'translateY(-3px)' }} onMouseOut={e => { e.target.style.transform = 'translateY(0)' }}>
                            Explore Our Union
                        </a>
                        <button onClick={() => setConstitutionModalOpen(true)} style={{
                            padding: '1rem 2.5rem', borderRadius: '50px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(5px)', fontWeight: '700', fontSize: '1.1rem', transition: 'all 0.2s', cursor: 'pointer'
                        }} onMouseOver={e => { e.target.style.background = 'rgba(255,255,255,0.2)'; e.target.style.transform = 'translateY(-3px)' }} onMouseOut={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.transform = 'translateY(0)' }}>
                            Read Constitution
                        </button>
                    </div>
                </motion.div>
            </section>



            {/* About Section */}
            <section id="about" style={{ padding: '6rem 2rem' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: theme.primary }}>About Our Union</h2>
                        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.8', color: darkMode ? '#cbd5e1' : '#475569' }}>
                            Established on 20/06/2017, the Haramaya University Students' Union is an autonomous body dedicated to representing the student body. We serve as the bridge between students and the university administration, ensuring your rights are protected and your voice is heard.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                        <motion.div whileHover={{ y: -10 }} style={{ padding: '2.5rem', background: theme.cardBg, borderRadius: '20px', border: `1px solid ${theme.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: theme.secondary, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaUsers /> Vision</h3>
                            <p style={{ lineHeight: '1.7' }}>To see a democratic, united, and vibrant student community that actively participates in the university's affairs and contributes to the nation's development.</p>
                        </motion.div>
                        <motion.div whileHover={{ y: -10 }} style={{ padding: '2.5rem', background: theme.cardBg, borderRadius: '20px', border: `1px solid ${theme.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: theme.primary, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaHandshake /> Mission</h3>
                            <p style={{ lineHeight: '1.7' }}>To protect student rights, promote their benefits, and create a conducive environment for teaching, learning, and research by fostering unity and tolerance.</p>
                        </motion.div>
                    </div>

                    <h3 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>Our Objectives</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {objectives.map((obj, idx) => (
                            <motion.div key={idx} whileHover={{ scale: 1.05 }} style={{
                                padding: '1.5rem', background: theme.cardBg, borderRadius: '15px', border: `1px solid ${theme.border}`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
                            }}>
                                <div style={{ fontSize: '2rem', color: theme.primary }}>{obj.icon}</div>
                                <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{obj.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Structure Section */}
            <section id="structure" style={{ padding: '6rem 2rem', background: darkMode ? 'rgba(255,255,255,0.02)' : '#f1f5f9' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '800', marginBottom: '4rem' }}>Union Structure</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: theme.secondary, borderBottom: `2px solid ${theme.secondary}`, paddingBottom: '0.5rem', display: 'inline-block' }}>Major Organs</h3>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {['General Assembly', 'Audit Commission', 'Executive Council', 'Election Commission', 'Student Council', 'Affairs'].map((item, i) => (
                                    <li key={i} style={{ padding: '1rem', background: theme.cardBg, borderRadius: '10px', borderLeft: `4px solid ${theme.secondary}`, fontWeight: '600' }}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: theme.primary, borderBottom: `2px solid ${theme.primary}`, paddingBottom: '0.5rem', display: 'inline-block' }}>Subsidiary Organs (Affairs)</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {['Academic Affairs', 'Admin & Finance', 'Discipline & Security', 'Women Affairs', 'Health & Food', 'Sports & Recreation', 'Charity & Development', 'Disability Affairs', 'Foreign Relations', 'Information & PR'].map((item, i) => (
                                    <div key={i} style={{ padding: '0.8rem', background: theme.cardBg, borderRadius: '8px', fontSize: '0.9rem' }}>{item}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Student Elections & Democracy Section */}
            <section id="elections" style={{ padding: '6rem 2rem', background: darkMode ? 'rgba(0, 255, 0, 0.02)' : '#f0fdf4' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <FaVoteYea /> STUDENT ELECTIONS
                        </h2>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: theme.secondary, marginBottom: '1rem' }}>Exercise Your Constitutional Right</h3>
                        <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: darkMode ? '#cbd5e1' : '#475569' }}>"Every student's voice matters in shaping our union's future"</p>
                    </div>

                    {/* 3 Main Parts Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>

                        {/* Part 1: About Our Elections */}
                        <motion.div whileHover={{ y: -5 }} style={{ background: theme.cardBg, padding: '2rem', borderRadius: '20px', border: `1px solid ${theme.border}`, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                            <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.text }}>
                                <FaScroll style={{ color: theme.primary }} /> ABOUT STUDENT ELECTIONS
                            </h4>
                            <p style={{ marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                Our elections are the heartbeat of student democracy at Haramaya University. Established under Articles 67-69 of our Constitution, these elections ensure every student has a voice.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><FaBook style={{ color: theme.secondary }} /> <strong>Constitutional Basis:</strong> Articles 67-69</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><FaCalendarAlt style={{ color: theme.secondary }} /> <strong>Frequency:</strong> Every 2 years</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><FaGavel style={{ color: theme.secondary }} /> <strong>Oversight:</strong> Independent Council</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><FaBalanceScale style={{ color: theme.secondary }} /> <strong>Principles:</strong> Free, Fair & Transparent</li>
                            </ul>
                            <div style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
                                <h5 style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Democratic Processes:</h5>
                                <ol style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                    <li>Union Executive Elections</li>
                                    <li>Department Rep Elections</li>
                                    <li>Special Referendums</li>
                                    <li>Senate Member Elections</li>
                                </ol>
                            </div>
                            <button style={{ marginTop: '1.5rem', background: 'none', border: `1px solid ${theme.primary}`, color: theme.primary, padding: '0.5rem 1rem', borderRadius: '50px', cursor: 'pointer', fontWeight: '600', width: '100%', transition: 'all 0.2s' }} className="hover:bg-green-500 hover:text-white">
                                READ ELECTION CONSTITUTION →
                            </button>
                        </motion.div>

                        {/* Part 2: Current Election Cycle */}
                        <motion.div whileHover={{ y: -5 }} style={{ background: theme.cardBg, padding: '2rem', borderRadius: '20px', border: `2px solid ${theme.primary}`, boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, background: theme.primary, color: '#000', padding: '0.3rem 1rem', borderBottomLeftRadius: '10px', fontWeight: '700', fontSize: '0.8rem' }}>ACTIVE</div>
                            <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.text }}>
                                <FaUniversity style={{ color: theme.primary }} /> CURRENT CYCLE
                            </h4>
                            <h5 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: theme.secondary }}>Union Executive Elections 2025</h5>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>Status:</span>
                                    <span style={{ color: theme.primary, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: theme.primary, display: 'inline-block' }}></span> Voting Period Active</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>Dates:</span>
                                    <span style={{ fontWeight: '600' }}>Nov 25 - Dec 5, 2025</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>Eligible Voters:</span>
                                    <span style={{ fontWeight: '600' }}>3,200 students</span>
                                </div>
                            </div>

                            <div style={{ background: darkMode ? 'rgba(0,0,0,0.2)' : '#f1f5f9', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                                <h6 style={{ fontWeight: '700', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaChartBar /> Participation Statistics</h6>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Votes</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: theme.primary }}>2,600</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Turnout</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: theme.secondary }}>78%</div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'red', display: 'inline-block' }}></span> Live: Last vote 15m ago
                                </div>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FaCheckCircle size={12} color={theme.primary} /> 5 Candidate Pairs</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FaCheckCircle size={12} color={theme.primary} /> Digital Platform</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FaCheckCircle size={12} color={theme.primary} /> 24/7 Access</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FaCheckCircle size={12} color={theme.primary} /> Real-time Results</li>
                            </ul>


                            <Link to="/public-vote" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', background: theme.primary, color: '#FFFFFF', padding: '0.8rem 1rem', borderRadius: '50px', fontWeight: '900', textDecoration: 'none', boxShadow: '0 5px 15px rgba(0,255,0,0.3)', transition: 'transform 0.2s', fontSize: '1.1rem', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.5)', letterSpacing: '0.5px' }} onMouseOver={e => e.target.style.transform = 'scale(1.02)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>
                                VOTE NOW →
                            </Link>
                        </motion.div>

                        {/* Part 3: Election Timeline */}
                        <motion.div whileHover={{ y: -5 }} style={{ background: theme.cardBg, padding: '2rem', borderRadius: '20px', border: `1px solid ${theme.border}`, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                            <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.text }}>
                                <FaCalendarAlt style={{ color: theme.primary }} /> TIMELINE 2025
                            </h4>

                            <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: `2px solid ${theme.border}` }}>
                                {[
                                    { phase: "Nomination", status: "Completed", date: "Nov 1-10", active: false, icon: "✓" },
                                    { phase: "Campaign", status: "Completed", date: "Nov 11-24", active: false, icon: "✓" },
                                    { phase: "Voting", status: "Active", date: "Nov 25-Dec 5", active: true, icon: "🔵" },
                                    { phase: "Results", status: "Upcoming", date: "Dec 7", active: false, icon: "○" }
                                ].map((item, i) => (
                                    <div key={i} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '-2.1rem', top: '0', width: '1.2rem', height: '1.2rem', background: item.active ? theme.primary : theme.cardBg, border: `2px solid ${item.active ? theme.primary : theme.border}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: item.active ? '#000' : theme.text, fontWeight: 'bold' }}>
                                            {item.icon}
                                        </div>
                                        <h6 style={{ fontWeight: '700', color: item.active ? theme.primary : theme.text, fontSize: '0.95rem' }}>Phase {i + 1}: {item.phase}</h6>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.date}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}>
                                <h6 style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.9rem' }}>✅ Voting Process:</h6>
                                <ol style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                    <li>Student authentication</li>
                                    <li>Eligibility verification</li>
                                    <li>Candidate review</li>
                                    <li>Secure ballot casting</li>
                                    <li>Vote confirmation</li>
                                </ol>
                            </div>
                            <button onClick={() => setVotersGuideModalOpen(true)} style={{ marginTop: '1.5rem', background: 'none', border: `1px solid ${theme.secondary}`, color: theme.secondary, padding: '0.5rem 1rem', borderRadius: '50px', cursor: 'pointer', fontWeight: '600', width: '100%', transition: 'all 0.2s' }} onMouseOver={e => { e.target.style.background = theme.secondary; e.target.style.color = '#fff' }} onMouseOut={e => { e.target.style.background = 'none'; e.target.style.color = theme.secondary }}>
                                DOWNLOAD GUIDE →
                            </button>
                        </motion.div>
                    </div>

                    {/* Featured Candidates & Principles Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>

                        {/* Featured Candidates */}
                        <div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <FaUsers style={{ color: theme.secondary }} /> Meet The Candidates
                            </h3>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {[
                                    { name: "Alex Teklu", dept: "Software Engineering, Year 3", platform: "Digital transformation of student services", color: "#3b82f6" },
                                    { name: "Sarah Mengi", dept: "Law, Year 4", platform: "Strengthening student rights protection", color: "#ec4899" }
                                ].map((cand, i) => (
                                    <motion.div key={i} whileHover={{ x: 5 }} style={{ background: theme.cardBg, padding: '1.5rem', borderRadius: '15px', borderLeft: `5px solid ${cand.color}`, boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                                        <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.3rem' }}>{cand.name}</h4>
                                        <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.8rem' }}>{cand.dept}</div>
                                        <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: theme.text }}>"{cand.platform}"</p>
                                    </motion.div>
                                ))}
                            </div>
                            <div style={{ marginTop: '2rem' }}>
                                <h5 style={{ fontWeight: '700', marginBottom: '1rem' }}>Key Campaign Issues:</h5>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                    {['Infrastructure', 'Academic Support', 'Student Welfare', 'Transparency'].map((tag, i) => (
                                        <span key={i} style={{ background: darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Election Principles */}
                        <div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <FaBalanceScale style={{ color: theme.primary }} /> Our Principles
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ background: theme.cardBg, padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                    <FaVoteYea size={24} style={{ color: theme.primary, marginBottom: '1rem' }} />
                                    <h5 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>One Student, One Vote</h5>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Article 14: Equal voting power for all.</p>
                                </div>
                                <div style={{ background: theme.cardBg, padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                    <FaGavel size={24} style={{ color: theme.secondary, marginBottom: '1rem' }} />
                                    <h5 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Independent Oversight</h5>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Article 67: Free from interference.</p>
                                </div>
                                <div style={{ background: theme.cardBg, padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                    <FaLock size={24} style={{ color: theme.primary, marginBottom: '1rem' }} />
                                    <h5 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Secure & Encrypted</h5>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Anonymous ballots & fraud monitoring.</p>
                                </div>
                                <div style={{ background: theme.cardBg, padding: '1.5rem', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                    <FaGlobe size={24} style={{ color: theme.secondary, marginBottom: '1rem' }} />
                                    <h5 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Accessible to All</h5>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Mobile-optimized & inclusive.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Testimonials & Impact */}
                    <div style={{ background: theme.cardBg, borderRadius: '25px', padding: '3rem', marginBottom: '5rem', border: `1px solid ${theme.border}` }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <FaGraduationCap /> Student Voices
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ fontStyle: 'italic', borderLeft: `3px solid ${theme.primary}`, paddingLeft: '1rem' }}>
                                        "As a first-time voter, I appreciated how simple and secure the process was."
                                        <div style={{ fontWeight: '700', marginTop: '0.5rem', fontStyle: 'normal', fontSize: '0.9rem' }}>- Meron A., Freshman</div>
                                    </div>
                                    <div style={{ fontStyle: 'italic', borderLeft: `3px solid ${theme.secondary}`, paddingLeft: '1rem' }}>
                                        "Seeing real-time participation stats encouraged me to cast my vote."
                                        <div style={{ fontWeight: '700', marginTop: '0.5rem', fontStyle: 'normal', fontSize: '0.9rem' }}>- Fatima H., Medical Student</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <FaChartLine /> Election Impact
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: '0.5rem' }}>
                                        <span>2023 Participation</span>
                                        <span style={{ fontWeight: '700', color: theme.primary }}>82% (New Library Hours)</span>
                                    </li>
                                    <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: '0.5rem' }}>
                                        <span>2021 Participation</span>
                                        <span style={{ fontWeight: '700', color: theme.secondary }}>75% (Better WiFi)</span>
                                    </li>
                                    <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>2025 Goal</span>
                                        <span style={{ fontWeight: '700', color: theme.primary }}>85% Target</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action Footer */}
                    <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '3rem', borderRadius: '25px', color: '#fff' }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Get Involved in Democracy</h3>
                        <p style={{ maxWidth: '600px', margin: '0 auto 2rem', color: '#cbd5e1' }}>
                            Whether you want to run for office or simply cast your vote, your participation is what makes our union strong.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button onClick={() => { setHowItWorksInitialTab('eligibility'); setHowItWorksModalOpen(true); }} style={{ padding: '1.2rem 2.5rem', borderRadius: '50px', background: theme.primary, color: '#FFFFFF', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '1.1rem', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', letterSpacing: '0.5px', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>Check Eligibility</button>
                            <button onClick={() => { setHowItWorksInitialTab('contact'); setHowItWorksModalOpen(true); }} style={{ padding: '1.2rem 2.5rem', borderRadius: '50px', background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: '700', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s' }} onMouseOver={e => { e.target.style.background = 'rgba(255,255,255,0.2)'; e.target.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.transform = 'translateY(0)'; }}>Contact Committee</button>
                        </div>
                        <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaBook size={12} /> Articles 11, 14, 67-69</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaGavel size={12} /> Independent Council</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaLock size={12} /> Encrypted System</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Departments Section */}
            <section id="departments" style={{ padding: '6rem 2rem', background: darkMode ? 'rgba(255,255,255,0.02)' : '#f1f5f9' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '800', marginBottom: '3rem' }}>Departments & Affairs</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {departments.map((dept, index) => (
                            <div key={index} style={{ background: theme.cardBg, borderRadius: '15px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
                                <button
                                    onClick={() => setActiveDepartment(activeDepartment === index ? null : index)}
                                    style={{
                                        width: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        background: 'none', border: 'none', color: theme.text, fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left'
                                    }}
                                >
                                    {dept.title}
                                    <span style={{ color: theme.primary, fontSize: '1.5rem' }}>{activeDepartment === index ? '−' : '+'}</span>
                                </button>
                                <AnimatePresence>
                                    {activeDepartment === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={{ padding: '0 1.5rem 1.5rem', color: darkMode ? '#cbd5e1' : '#475569', lineHeight: '1.6' }}>
                                                {dept.content}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events & Announcements Section */}
            <section id="events" style={{ padding: '6rem 2rem' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: theme.primary }}>Upcoming Events & News</h2>
                        <p style={{ fontSize: '1.1rem', color: darkMode ? '#cbd5e1' : '#475569' }}>Stay updated with what's happening around campus.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Featured Event (First item) */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            style={{
                                gridColumn: '1 / -1',
                                background: theme.cardBg,
                                borderRadius: '25px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column', // Mobile first
                                border: `1px solid ${theme.border}`,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                                <span style={{ color: theme.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    Featured Event
                                </span>
                                <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', color: theme.text }}>{events[0].title}</h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: darkMode ? '#cbd5e1' : '#475569', marginBottom: '1.5rem' }}>
                                    {events[0].description}
                                </p>
                                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem', fontSize: '0.95rem', color: theme.secondary }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaCalendarAlt /> {events[0].date}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaClock /> {events[0].time}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaMapMarkerAlt /> {events[0].location}</div>
                                </div>
                                <button style={{ alignSelf: 'start', padding: '0.8rem 2rem', borderRadius: '50px', background: theme.primary, color: '#000', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Event Details <FaArrowRight />
                                </button>
                            </div>
                        </motion.div>

                        {/* Other Events */}
                        {events.slice(1).map(event => (
                            <motion.div
                                key={event.id}
                                whileHover={{ y: -5 }}
                                style={{
                                    background: theme.cardBg,
                                    borderRadius: '20px',
                                    padding: '2rem',
                                    border: `1px solid ${theme.border}`,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <div style={{ marginBottom: '1rem' }}>
                                    <span style={{ background: darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', color: theme.text }}>
                                        {event.category}
                                    </span>
                                </div>
                                <h4 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: theme.text }}>{event.title}</h4>
                                <p style={{ fontSize: '0.95rem', color: darkMode ? '#94a3b8' : '#64748b', marginBottom: '1.5rem', flex: 1 }}>
                                    {event.description}
                                </p>
                                <div style={{ fontSize: '0.9rem', color: theme.secondary, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaCalendarAlt /> {event.date}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaMapMarkerAlt /> {event.location}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Constitution Highlights */}
            <section style={{ padding: '6rem 2rem' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '800', marginBottom: '4rem' }}>Constitution Highlights</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                        <div style={{ padding: '2rem', background: 'rgba(0, 255, 0, 0.05)', borderRadius: '20px', border: '1px solid rgba(0, 255, 0, 0.2)' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: theme.primary, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <FaVoteYea /> Rights of Students
                            </h3>
                            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                                <li>Right to vote and be elected</li>
                                <li>Freedom of expression and assembly</li>
                                <li>Access to university resources</li>
                                <li>Fair disciplinary hearing</li>
                                <li>Participate in union activities</li>
                            </ul>
                        </div>
                        <div style={{ padding: '2rem', background: 'rgba(0, 170, 255, 0.05)', borderRadius: '20px', border: '1px solid rgba(0, 170, 255, 0.2)' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: theme.secondary, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <FaBook /> Duties of Students
                            </h3>
                            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                                <li>Respect university rules and regulations</li>
                                <li>Protect university property</li>
                                <li>Respect rights of others</li>
                                <li>Promote tolerance and unity</li>
                                <li>Pay union membership fees</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Developer Profile - Built By Students, For Students */}
            <section style={{ padding: '6rem 2rem', background: darkMode ? 'rgba(255,255,255,0.02)' : '#f1f5f9' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '800', marginBottom: '4rem' }}>Built By Students, For Students</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
                        {[
                            {
                                name: "Ezedin Aliyi",
                                role: "Lead Developer",
                                studentRole: "Software Engineering Student",
                                techRole: "Full-Stack Developer",
                                skills: ['React', 'Node.js', 'MongoDB', 'UI/UX Design'],
                                quote: "Transforming student governance through technology.",
                                image: ezedinImg
                            },
                            {
                                name: "Sultan Adinan",
                                role: "Full-Stack Developer",
                                studentRole: "Software Engineering Student",
                                techRole: "Full-Stack Developer",
                                skills: ['React', 'Node.js', 'MongoDB', 'UI/UX Design'],
                                quote: "Empowering students with innovative solutions.",
                                image: sultanImg
                            }
                        ].map((dev, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5, boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.2)' }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.92)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                                    border: `1px solid ${theme.border}`
                                }}
                            >
                                {/* Top - Image */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '1.5rem'
                                }}>
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        background: theme.primary,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
                                        border: '2px solid rgba(255,255,255,0.1)',
                                        overflow: 'hidden'
                                    }}>
                                        {dev.image ? (
                                            <img src={dev.image} alt={dev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <FaUserTie size={50} color="#000" />
                                        )}
                                    </div>
                                </div>

                                {/* Bottom - Info */}
                                <div style={{
                                    padding: '1.5rem',
                                    background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    flex: 1
                                }}>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.2rem', color: theme.text }}>{dev.name}</h3>
                                    <div style={{
                                        fontSize: '0.8rem',
                                        fontWeight: '700',
                                        color: theme.primary,
                                        marginBottom: '1rem',
                                        letterSpacing: '0.5px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {dev.role}
                                    </div>

                                    <div style={{ marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: theme.text, fontSize: '0.8rem' }}>
                                            <FaUniversity style={{ color: theme.secondary }} />
                                            <span style={{ fontWeight: '600' }}>{dev.studentRole}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: theme.text, fontSize: '0.8rem' }}>
                                            <FaCode style={{ color: theme.secondary }} />
                                            <span style={{ fontWeight: '600' }}>{dev.techRole}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem', justifyContent: 'center' }}>
                                        {dev.skills.map((skill, i) => (
                                            <span key={i} style={{
                                                padding: '0.3rem 0.6rem',
                                                borderRadius: '50px',
                                                background: darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                                                color: theme.text,
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <p style={{
                                        fontStyle: 'italic',
                                        color: darkMode ? '#94a3b8' : '#64748b',
                                        marginBottom: '1.2rem',
                                        maxWidth: '95%',
                                        fontSize: '0.8rem'
                                    }}>
                                        "{dev.quote}"
                                    </p>

                                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: 'auto' }}>
                                        {[FaGithub, FaLinkedin, FaEnvelope].map((Icon, i) => (
                                            <motion.a
                                                key={i}
                                                whileHover={{ scale: 1.1, color: theme.primary }}
                                                href="#"
                                                style={{
                                                    fontSize: '1.1rem',
                                                    color: darkMode ? '#cbd5e1' : '#475569',
                                                    transition: 'color 0.2s'
                                                }}
                                            >
                                                <Icon />
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tech Stack Banner */}
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '2rem', color: theme.secondary, textTransform: 'uppercase', letterSpacing: '2px' }}>Powered By Modern Tech Stack</h4>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                            {[
                                { icon: SiReact, name: 'React', color: '#61DAFB' },
                                { icon: SiNodedotjs, name: 'Node.js', color: '#339933' },
                                { icon: SiMongodb, name: 'MongoDB', color: '#47A248' },
                                { icon: SiExpress, name: 'Express', color: theme.text },
                                { icon: SiTailwindcss, name: 'Tailwind', color: '#06B6D4' }
                            ].map((tech, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <tech.icon size={40} color={tech.color} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: theme.text }}>{tech.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" style={{ background: '#0f172a', color: '#fff', padding: '5rem 2rem 2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaUniversity style={{ color: theme.primary }} /> HUSUMS
                            </h3>
                            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                                The official management system for the Haramaya University Students' Union. Empowering students through technology.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: theme.primary }}>Quick Links</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {sections.slice(0, 5).map(item => (
                                    <li key={item.id}><a href={`#${item.id}`} style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-white">{item.label}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: theme.primary }}>Contact Us</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#cbd5e1' }}><FaMapMarkerAlt /> Main Campus, Haramaya University</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#cbd5e1' }}><FaEnvelope /> union@haramaya.edu.et</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#cbd5e1' }}><FaPhone /> +251 25 553 0334</li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: theme.primary }}>Follow Us</h4>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {[FaFacebook, FaTwitter, FaInstagram, FaTelegram].map((Icon, i) => (
                                    <a key={i} href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'background 0.2s' }}>
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#64748b', fontSize: '0.9rem' }}>
                        &copy; 2025 Haramaya University Students' Union. All rights reserved.
                    </div>
                </div>
            </footer>

            <style>{`
        html { scroll-behavior: smooth; }
        .dark { color-scheme: dark; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>

            {/* Constitution Modal */}
            <ConstitutionModal
                isOpen={constitutionModalOpen}
                onClose={() => setConstitutionModalOpen(false)}
            />

            {/* Voters Guide Modal */}
            <VotersGuideModal
                isOpen={votersGuideModalOpen}
                onClose={() => setVotersGuideModalOpen(false)}
                onOpenConstitution={() => setConstitutionModalOpen(true)}
            />

            {/* How It Works Modal */}
            <HowItWorksModal
                isOpen={howItWorksModalOpen}
                onClose={() => setHowItWorksModalOpen(false)}
                initialTab={howItWorksInitialTab}
            />
        </div>
    );
};

export default Home;
