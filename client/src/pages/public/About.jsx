const About = () => {
    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>About HUSUMS</h1>
            <div className="card">
                <p style={{ marginBottom: '1rem' }}>
                    The Haramaya University Student Union Management System (HUSUMS) is a dedicated platform designed to bridge the gap between the student body and the union leadership.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    Our mission is to foster transparency, enhance communication, and streamline the operations of the student union. Through this platform, we aim to empower every student to participate in the democratic process and have their voice heard.
                </p>
                <h3>Key Features</h3>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                    <li>Digital Voting System</li>
                    <li>Direct Communication Channels</li>
                    <li>Event Management</li>
                    <li>Resource Booking</li>
                </ul>
            </div>
        </div>
    );
};

export default About;
