import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import {
    Users,
    Vote,
    BarChart3,
    TrendingUp,
    Activity,
    Calendar,
    ChevronDown,
    ChevronUp,
    User,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import StatCard from '../../components/admin/StatCard';
import NeonBadge from '../../components/admin/NeonBadge';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalElections: 0,
        activeElections: 0,
        totalCandidates: 0,
        totalVotes: 0
    });
    const [loading, setLoading] = useState(true);
    const [elections, setElections] = useState([]);
    const [expandedElections, setExpandedElections] = useState({});

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const analyticsRes = await api.get('/president/analytics/system');
            const electionsRes = await api.get('/president/elections');
            setElections(electionsRes);

            const activeCount = electionsRes.filter(e => e.status === 'ongoing').length;
            const candidateCount = electionsRes.reduce((acc, curr) => acc + (curr.Candidates?.length || 0), 0);

            setStats({
                totalElections: analyticsRes.overview?.totalElections || electionsRes.length,
                activeElections: activeCount,
                totalCandidates: candidateCount,
                totalVotes: analyticsRes.overview?.totalVotes || 0
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const COLORS = ['#00ff55', '#00d9ff', '#a855f7', '#fb923c'];

    const getStatusData = () => {
        const statusCounts = { upcoming: 0, ongoing: 0, completed: 0 };
        elections.forEach(e => {
            if (statusCounts[e.status] !== undefined) {
                statusCounts[e.status]++;
            }
        });
        return [
            { name: 'Upcoming', value: statusCounts.upcoming },
            { name: 'Ongoing', value: statusCounts.ongoing },
            { name: 'Completed', value: statusCounts.completed }
        ];
    };

    const getVotesData = () => {
        return elections.slice(0, 5).map(e => ({
            name: e.title.substring(0, 15) + '...',
            votes: e.Candidates?.reduce((acc, c) => acc + (c.voteCount || 0), 0) || 0
        }));
    };

    const toggleExpand = (electionId) => {
        setExpandedElections(prev => ({
            ...prev,
            [electionId]: !prev[electionId]
        }));
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="space-y-8">
            {/* Welcome Card */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl p-4 sm:p-6 md:p-8"
                style={{
                    background: 'linear-gradient(135deg, rgba(0, 255, 85, 0.1), rgba(0, 217, 255, 0.1))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 255, 85, 0.2)',
                    boxShadow: '0 0 40px rgba(0, 255, 85, 0.2)'
                }}
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#00ff55' }} />
                        <h1 style={{
                            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #00ff55, #00d9ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Welcome back, {user.firstName || 'Admin'}!
                        </h1>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Here's what's happening with your elections today
                    </p>
                </div>
                <div
                    className="absolute -bottom-10 -right-10 w-40 h-40 sm:w-60 sm:h-60 rounded-full blur-3xl opacity-30"
                    style={{ background: '#00ff55' }}
                />
            </motion.div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
                    />
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Elections"
                            value={stats.totalElections}
                            icon={Vote}
                            color="green"
                        />
                        <StatCard
                            title="Active Elections"
                            value={stats.activeElections}
                            icon={Activity}
                            color="cyan"
                        />
                        <StatCard
                            title="Total Candidates"
                            value={stats.totalCandidates}
                            icon={Users}
                            color="purple"
                        />
                        <StatCard
                            title="Total Votes"
                            value={stats.totalVotes}
                            icon={BarChart3}
                            color="orange"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Election Status Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-4 sm:p-6 rounded-2xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(0, 255, 85, 0.2)',
                                boxShadow: '0 0 20px rgba(0, 255, 85, 0.1)'
                            }}
                        >
                            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                                <TrendingUp size={20} style={{ color: '#00ff55' }} />
                                <span style={{ color: '#fff' }}>Election Status</span>
                            </h3>
                            <div className="h-[200px] sm:h-[250px] md:h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={getStatusData()}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {getStatusData().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#0a0e27',
                                                borderColor: 'rgba(0, 255, 85, 0.3)',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(0, 255, 85, 0.3)'
                                            }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-3 sm:gap-6 mt-4 flex-wrap">
                                {getStatusData().map((entry, index) => (
                                    <div key={entry.name} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor: COLORS[index % COLORS.length],
                                                boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}`
                                            }}
                                        />
                                        <span className="text-xs sm:text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                            {entry.name} ({entry.value})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Votes Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-4 sm:p-6 rounded-2xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(0, 217, 255, 0.2)',
                                boxShadow: '0 0 20px rgba(0, 217, 255, 0.1)'
                            }}
                        >
                            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                                <BarChart3 size={20} style={{ color: '#00d9ff' }} />
                                <span style={{ color: '#fff' }}>Votes per Election</span>
                            </h3>
                            <div className="h-[200px] sm:h-[250px] md:h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={getVotesData()}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="rgba(255,255,255,0.5)"
                                            fontSize={12}
                                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                                        />
                                        <YAxis
                                            stroke="rgba(255,255,255,0.5)"
                                            fontSize={12}
                                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#0a0e27',
                                                borderColor: 'rgba(0, 217, 255, 0.3)',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(0, 217, 255, 0.3)'
                                            }}
                                            cursor={{ fill: 'rgba(0, 217, 255, 0.1)' }}
                                        />
                                        <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                                            {getVotesData().map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    {/* Elections List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                            <Calendar size={20} style={{ color: '#00ff55' }} />
                            <span style={{ color: '#fff' }}>Elections & Candidates</span>
                        </h3>

                        {elections.map((election) => (
                            <motion.div
                                key={election._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -2 }}
                                className="rounded-2xl overflow-hidden"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <div className="p-4 sm:p-6">
                                    <div className="flex justify-between items-start flex-wrap gap-2 sm:gap-4">
                                        <div className="flex-1 min-w-[200px]">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                                                <h4 className="text-base sm:text-lg font-bold" style={{ color: '#fff' }}>
                                                    {election.title}
                                                </h4>
                                                <NeonBadge
                                                    variant={
                                                        election.status === 'ongoing' ? 'success' :
                                                            election.status === 'completed' ? 'info' : 'warning'
                                                    }
                                                    pulse={election.status === 'ongoing'}
                                                >
                                                    {election.status.toUpperCase()}
                                                </NeonBadge>
                                            </div>
                                            <div className="flex gap-3 sm:gap-6 text-xs sm:text-sm flex-wrap" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                <span>{new Date(election.startDate).toLocaleDateString()}</span>
                                                <span>{election.Candidates?.length || 0} Candidates</span>
                                                <span>{election.Candidates?.reduce((acc, c) => acc + (c.voteCount || 0), 0) || 0} Votes</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleExpand(election._id)}
                                            className="px-3 py-2 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all"
                                            style={{
                                                background: 'rgba(0, 217, 255, 0.1)',
                                                border: '1px solid rgba(0, 217, 255, 0.3)',
                                                color: '#00d9ff'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'rgba(0, 217, 255, 0.2)';
                                                e.target.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'rgba(0, 217, 255, 0.1)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                {expandedElections[election._id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                <span className="hidden sm:inline">{expandedElections[election._id] ? 'Hide' : 'View'} Candidates</span>
                                                <span className="sm:hidden">{expandedElections[election._id] ? 'Hide' : 'View'}</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedElections[election._id] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            style={{
                                                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                                background: 'rgba(0, 0, 0, 0.2)'
                                            }}
                                        >
                                            <div className="p-4 sm:p-6">
                                                <h5 className="text-sm sm:text-md font-bold mb-4" style={{ color: '#fff' }}>
                                                    Candidates
                                                </h5>
                                                {election.Candidates && election.Candidates.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {election.Candidates.map(candidate => (
                                                            <motion.div
                                                                key={candidate.id}
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                whileHover={{ scale: 1.02 }}
                                                                className="rounded-lg p-4 transition-all"
                                                                style={{
                                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                                                }}
                                                            >
                                                                <div className="flex items-start gap-4">
                                                                    <div
                                                                        className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                                                                        style={{
                                                                            background: 'rgba(255, 255, 255, 0.1)',
                                                                            border: '2px solid rgba(0, 255, 85, 0.3)'
                                                                        }}
                                                                    >
                                                                        {candidate.photoUrl ? (
                                                                            <img
                                                                                src={`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}${candidate.photoUrl}`}
                                                                                alt={`${candidate.User?.firstName} ${candidate.User?.lastName}`}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <User size={32} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h6 className="font-bold truncate" style={{ color: '#fff' }}>
                                                                            {candidate.User?.firstName} {candidate.User?.lastName}
                                                                        </h6>
                                                                        <p className="text-sm font-medium" style={{ color: '#00ff55' }}>
                                                                            {candidate.position}
                                                                        </p>
                                                                        <p className="text-xs mt-1 line-clamp-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                                            {candidate.description}
                                                                        </p>
                                                                        <div className="mt-2">
                                                                            <span className="text-xs font-bold" style={{ color: '#a855f7' }}>
                                                                                {candidate.voteCount || 0} votes
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {candidate.manifesto && (
                                                                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                                        <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                                            Manifesto:
                                                                        </p>
                                                                        <p className="text-xs line-clamp-3" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                                            {candidate.manifesto}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-center py-8" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                        No candidates registered for this election yet.
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
