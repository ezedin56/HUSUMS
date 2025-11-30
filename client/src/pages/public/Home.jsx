import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const sections = [
        { id: 'home', label: 'Home' },
        { id: 'announcements', label: 'News' },
        { id: 'events', label: 'Events' },
        { id: 'leadership', label: 'Leadership' },
        { id: 'contact', label: 'Contact' }
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* 2. Animated Navigation Bar */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: scrolled ? '1rem 2rem' : '1.5rem 2rem',
                backgroundColor: scrolled ? 'var(--bg-primary)' : 'transparent',
                boxShadow: scrolled ? 'var(--card-shadow)' : 'none',
                transition: 'all 0.3s ease',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backdropFilter: scrolled ? 'blur(10px)' : 'none'
            }}>
                <div className="animate-slide-right" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    HUSUMS
                </div>
                <div className="animate-slide-left" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {sections.map(section => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            style={{
                                textDecoration: 'none',
                                color: 'var(--text-primary)',
                                fontWeight: '500',
                                position: 'relative',
                                transition: 'color 0.3s'
                            }}
                            className="nav-link"
                        >
                            {section.label}
                        </a>
                    ))}
                    <Link to="/login" className="btn btn-primary">Login</Link>
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            color: 'var(--text-primary)'
                        }}
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </nav>

            {/* 3. Dynamic Hero Section */}
            <section id="home" style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center',
                color: 'white'
            }}>
                {/* Parallax Background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.4)',
                    zIndex: -1,
                    transform: `translateY(${scrolled ? window.scrollY * 0.5 : 0}px)`
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h1 className="animate-fade-up" style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                        Your Voice, <span style={{ color: 'var(--primary)' }}>Our Mission</span>
                    </h1>
                    <p className="animate-fade-up delay-200" style={{ fontSize: '1.5rem', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
                        Empowering Haramaya University students through unity, leadership, and service.
                    </p>
                    <div className="animate-fade-up delay-400" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/vote" className="btn" style={{
                            padding: '1rem 2.5rem',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            border: 'none',
                            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                            animation: 'pulse 2s infinite'
                        }}>
                            🗳️ Vote Now
                        </Link>
                        <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                            Get Started
                        </Link>
                        <a href="#announcements" className="btn" style={{
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                            backdropFilter: 'blur(5px)'
                        }}>
                            Latest News
                        </a>
                    </div>

                    {/* Stats Counter */}
                    <div className="animate-fade-up delay-500" style={{
                        marginTop: '4rem',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '4rem'
                    }}>
                        {[
                            { label: 'Students', value: '30k+' },
                            { label: 'Departments', value: '12' },
                            { label: 'Events', value: '50+' }
                        ].map((stat, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stat.value}</div>
                                <div style={{ fontSize: '1rem', opacity: 0.8 }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Announcements Carousel */}
            <section id="announcements" className="container" style={{ padding: '6rem 2rem', backgroundColor: 'var(--bg-secondary)' }}>
                <h2 className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>Latest Announcements</h2>
                <div style={{ display: 'flex', overflowX: 'auto', gap: '2rem', paddingBottom: '2rem', scrollSnapType: 'x mandatory' }}>
                    {[
                        { title: 'Election Results', date: 'Nov 28', content: 'The results for the 2025 Student Union elections are now live!' },
                        { title: 'Library Hours Extended', date: 'Nov 25', content: 'During exam week, the library will remain open 24/7.' },
                        { title: 'New Cafeteria Menu', date: 'Nov 20', content: 'Check out the new healthy options available starting next week.' },
                        { title: 'Sports Tournament', date: 'Nov 15', content: 'Register your team for the inter-department football cup.' }
                    ].map((item, index) => (
                        <div key={index} className="card animate-slide-right" style={{
                            minWidth: '300px',
                            scrollSnapAlign: 'start',
                            borderLeft: '4px solid var(--primary)'
                        }}>
                            <span className="badge badge-warning" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{item.date}</span>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{item.content}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. Leadership Gallery */}
            <section id="leadership" style={{ backgroundColor: 'var(--bg-secondary)', padding: '6rem 0' }}>
                <div className="container">
                    <h2 className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>Our Leadership</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[
                            { name: 'Dawit Mekonnen', role: 'President', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
                            { name: 'Hanna Tadesse', role: 'Secretary', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
                            { name: 'Ahmed Mohammed', role: 'Dept Head', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' }
                        ].map((leader, index) => (
                            <div key={index} className={`card animate-fade-up delay-${(index + 1) * 200}`} style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ height: '300px', overflow: 'hidden' }}>
                                    <img
                                        src={leader.img}
                                        alt={leader.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                        onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                                        onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                    />
                                </div>
                                <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                                    <h3>{leader.name}</h3>
                                    <p style={{ color: 'var(--primary)', fontWeight: '600' }}>{leader.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Affairs Department Showcase */}
            <section id="affairs" className="container" style={{ padding: '6rem 2rem' }}>
                <h2 className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>Affairs Departments</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                    {[
                        { icon: '🎓', name: 'Academic Affairs', count: '12 Projects' },
                        { icon: '⚽', name: 'Sports & Recreation', count: '5 Events' },
                        { icon: '🍽️', name: 'Food & Dining', count: '3 Initiatives' },
                        { icon: '🏥', name: 'Health & Wellness', count: '2 Campaigns' },
                        { icon: '🏘️', name: 'Dormitory Services', count: '4 Upgrades' },
                        { icon: '⚖️', name: 'Discipline & Conduct', count: 'Active' }
                    ].map((dept, index) => (
                        <div key={index} className="card animate-scale-in" style={{ textAlign: 'center', cursor: 'pointer' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', transition: 'transform 0.3s' }}
                                onMouseOver={e => e.target.style.transform = 'scale(1.2)'}
                                onMouseOut={e => e.target.style.transform = 'scale(1)'}>
                                {dept.icon}
                            </div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{dept.name}</h3>
                            <span className="badge badge-secondary">{dept.count}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 8. Events Timeline */}
            <section id="events" className="container" style={{ padding: '6rem 2rem' }}>
                <h2 className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>Upcoming Events</h2>
                <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', backgroundColor: 'var(--border-color)', transform: 'translateX(-50%)' }} />
                    {[
                        { date: 'Nov 30', title: 'General Assembly', desc: 'Annual meeting for all students.' },
                        { date: 'Dec 05', title: 'Cultural Night', desc: 'Celebrating our diverse heritage.' },
                        { date: 'Dec 12', title: 'Exam Prep Workshop', desc: 'Tips and tricks for finals.' }
                    ].map((event, index) => (
                        <div key={index} className={`animate-slide-${index % 2 === 0 ? 'left' : 'right'}`} style={{
                            display: 'flex',
                            justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start',
                            marginBottom: '2rem',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '45%',
                                padding: '1.5rem',
                                backgroundColor: 'var(--card-bg)',
                                borderRadius: '1rem',
                                boxShadow: 'var(--card-shadow)',
                                border: '1px solid var(--border-color)',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    [index % 2 === 0 ? 'right' : 'left']: '-3.5rem',
                                    transform: 'translateY(-50%)',
                                    width: '1rem',
                                    height: '1rem',
                                    backgroundColor: 'var(--primary)',
                                    borderRadius: '50%',
                                    border: '4px solid var(--bg-primary)'
                                }} />
                                <span className="badge badge-success" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{event.date}</span>
                                <h3>{event.title}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>{event.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 9. Problem Resolution Pathway */}
            <section id="resolution" style={{ backgroundColor: 'var(--bg-secondary)', padding: '6rem 0' }}>
                <div className="container">
                    <h2 className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>Problem Resolution Pathway</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                        {[
                            { step: 1, title: 'Submit Issue', icon: '📝' },
                            { step: 2, title: 'Dept Review', icon: '👀' },
                            { step: 3, title: 'Action Plan', icon: '⚙️' },
                            { step: 4, title: 'Resolution', icon: '✅' }
                        ].map((item, index) => (
                            <div key={index} style={{ flex: 1, textAlign: 'center', minWidth: '150px', position: 'relative' }}>
                                <div className="animate-pulse" style={{
                                    width: '80px', height: '80px',
                                    backgroundColor: 'var(--card-bg)',
                                    borderRadius: '50%',
                                    margin: '0 auto 1rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem',
                                    boxShadow: 'var(--card-shadow)',
                                    border: '2px solid var(--primary)'
                                }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '1.1rem' }}>{item.title}</h3>
                                {index < 3 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '40px',
                                        right: '-50%',
                                        width: '100%',
                                        height: '2px',
                                        backgroundColor: 'var(--primary)',
                                        zIndex: 0,
                                        display: 'none' // Hidden on mobile, could show on desktop with media query
                                    }} className="desktop-only-line" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 10. Developer Team Section */}
            <section id="developers" className="container" style={{ padding: '6rem 2rem' }}>
                <h2 className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>Meet the Developers</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {[
                        { name: 'Ezadin Aliyi', role: 'Lead Developer', skills: ['React', 'Node.js', 'UI/UX'] },
                        { name: 'Sultan Adinan', role: 'Backend Engineer', skills: ['Database', 'API', 'Security'] },
                        { name: 'Kume Amin', role: 'Frontend Engineer', skills: ['CSS', 'Animation', 'Responsive'] }
                    ].map((dev, index) => (
                        <div key={index} className="card animate-fade-up" style={{ perspective: '1000px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '100px', height: '100px',
                                    backgroundColor: '#ddd',
                                    borderRadius: '50%',
                                    margin: '0 auto 1rem',
                                    backgroundImage: `url(https://ui-avatars.com/api/?name=${dev.name}&background=random)`,
                                    backgroundSize: 'cover'
                                }} />
                                <h3>{dev.name}</h3>
                                <p style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{dev.role}</p>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    {dev.skills.map(skill => (
                                        <span key={skill} className="badge badge-secondary">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 11. Interactive Union Map */}
            <section id="map" style={{ height: '400px', backgroundColor: '#e5e7eb', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    width: '100%', height: '100%',
                    backgroundImage: 'url("https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=1920&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(0.5)'
                }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.9)', padding: '2rem', borderRadius: '1rem' }}>
                    <h3>Campus Map</h3>
                    <p>Find your way to the Student Union Office</p>
                    <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Get Directions</button>
                </div>
            </section>

            {/* 12. Social Feed */}
            <section id="social" className="container" style={{ padding: '6rem 2rem' }}>
                <h2 className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>Social Feed</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {[
                        { user: 'HUSUMS', time: '2h ago', content: 'Great turnout at the General Assembly! Thank you all for coming. #Unity', likes: 120 },
                        { user: 'HUSUMS', time: '5h ago', content: 'Don\'t forget to vote in the upcoming elections. Your voice matters! 🗳️', likes: 85 },
                        { user: 'HUSUMS', time: '1d ago', content: 'New study spaces opened in the main library. Check them out!', likes: 200 }
                    ].map((post, index) => (
                        <div key={index} className="card animate-fade-in" style={{ borderLeft: '4px solid #1da1f2' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <strong>@{post.user}</strong>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{post.time}</span>
                            </div>
                            <p style={{ marginBottom: '1rem' }}>{post.content}</p>
                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
                                <span>❤️ {post.likes}</span>
                                <span>🔁 Share</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 13. Enhanced Footer */}
            <footer id="contact" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', color: 'white', padding: '4rem 0 2rem' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                        <div>
                            <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>HUSUMS</h3>
                            <p style={{ color: '#9ca3af' }}>Serving the student body with dedication and transparency.</p>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem' }}>Quick Links</h4>
                            <ul style={{ listStyle: 'none', color: '#9ca3af' }}>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#home" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a></li>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>About</a></li>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#events" style={{ color: 'inherit', textDecoration: 'none' }}>Events</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem' }}>Contact</h4>
                            <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>Campus Main Building</p>
                            <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>info@hu.edu.et</p>
                            <p style={{ color: '#9ca3af' }}>+251 123 456 789</p>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem' }}>Newsletter</h4>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="email" placeholder="Your email" style={{ padding: '0.5rem', borderRadius: '0.25rem', border: 'none', flex: 1 }} />
                                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Subscribe</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid #333', paddingTop: '2rem', textAlign: 'center', color: '#6b7280' }}>
                        &copy; 2025 Haramaya University Student Union. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
