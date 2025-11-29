import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import {
    TrendingUp,
    Users,
    Calendar,
    Vote,
    Download,
    BarChart3,
    PieChart as PieChartIcon
} from 'lucide-react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/president/analytics/system');
            setAnalytics(res.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (loading) return <div className="flex items-center justify-center h-64">Loading analytics...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <BarChart3 className="text-[var(--primary)]" />
                    Analytics & Reporting
                </h2>
                <button className="btn bg-green-600 text-white flex items-center gap-2">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                >
                    <div className="flex justify-between items-start mb-4">
                        <Users size={32} className="opacity-80" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">+12%</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{analytics?.overview?.totalMembers || 0}</h3>
                    <p className="text-sm opacity-90">Total Members</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card bg-gradient-to-br from-green-500 to-green-600 text-white"
                >
                    <div className="flex justify-between items-start mb-4">
                        <Calendar size={32} className="opacity-80" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">+8%</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{analytics?.overview?.totalEvents || 0}</h3>
                    <p className="text-sm opacity-90">Total Events</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                >
                    <div className="flex justify-between items-start mb-4">
                        <Vote size={32} className="opacity-80" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">+15%</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{analytics?.overview?.totalElections || 0}</h3>
                    <p className="text-sm opacity-90">Elections Held</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                >
                    <div className="flex justify-between items-start mb-4">
                        <TrendingUp size={32} className="opacity-80" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">+20%</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{analytics?.overview?.totalVotes || 0}</h3>
                    <p className="text-sm opacity-90">Total Votes Cast</p>
                </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card"
                >
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <BarChart3 size={20} />
                        Member Engagement Trend
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics?.engagement || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--primary)', r: 6 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="card"
                >
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <PieChartIcon size={20} />
                        Budget Distribution
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics?.budget || []}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {(analytics?.budget || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Additional Stats */}
            <div className="card">
                <h3 className="font-bold mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                        <p className="text-sm text-[var(--text-secondary)]">Event Attendance Rate</p>
                    </div>
                    <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">92%</div>
                        <p className="text-sm text-[var(--text-secondary)]">Member Satisfaction</p>
                    </div>
                    <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="text-3xl font-bold text-purple-600 mb-2">78%</div>
                        <p className="text-sm text-[var(--text-secondary)]">Voting Participation</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
