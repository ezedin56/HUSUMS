import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import {
    Building2,
    Users,
    CheckSquare,
    DollarSign,
    TrendingUp,
    AlertCircle,
    Activity
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);
    const [deptTasks, setDeptTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (selectedDept) {
            fetchDepartmentTasks(selectedDept.id);
        }
    }, [selectedDept]);

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/president/departments');
            setDepartments(res.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartmentTasks = async (deptId) => {
        try {
            const res = await api.get(`/president/departments/${deptId}/tasks`);
            setDeptTasks(res.data);
        } catch (error) {
            console.error('Error fetching department tasks:', error);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const chartData = departments.map(dept => ({
        name: dept.name,
        members: dept.memberCount,
        tasks: dept.taskCount,
        completed: dept.completedTasks
    }));

    if (loading) return <div className="flex items-center justify-center h-64">Loading departments...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Building2 className="text-[var(--primary)]" />
                    Department Oversight
                </h2>
            </div>

            {/* Department Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                >
                    <div className="flex justify-between items-start mb-4">
                        <Building2 size={32} className="opacity-80" />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{departments.length}</h3>
                    <p className="text-sm opacity-90">Total Departments</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card bg-gradient-to-br from-green-500 to-green-600 text-white"
                >
                    <div className="flex justify-between items-start mb-4">
                        <Users size={32} className="opacity-80" />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">
                        {departments.reduce((sum, d) => sum + d.memberCount, 0)}
                    </h3>
                    <p className="text-sm opacity-90">Total Members</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                >
                    <div className="flex justify-between items-start mb-4">
                        <CheckSquare size={32} className="opacity-80" />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">
                        {departments.reduce((sum, d) => sum + d.taskCount, 0)}
                    </h3>
                    <p className="text-sm opacity-90">Active Tasks</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                >
                    <div className="flex justify-between items-start mb-4">
                        <DollarSign size={32} className="opacity-80" />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">
                        ${departments.reduce((sum, d) => sum + parseFloat(d.budget || 0), 0).toFixed(0)}
                    </h3>
                    <p className="text-sm opacity-90">Total Budget</p>
                </motion.div>
            </div>

            {/* Department Performance Chart */}
            <div className="card">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Activity size={20} />
                    Department Performance Overview
                </h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="members" fill="#0088FE" name="Members" />
                            <Bar dataKey="tasks" fill="#00C49F" name="Tasks" />
                            <Bar dataKey="completed" fill="#FFBB28" name="Completed" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Department Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept, index) => (
                    <motion.div
                        key={dept.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedDept(dept)}
                        className={`card cursor-pointer transition-all hover:shadow-xl ${selectedDept?.id === dept.id ? 'ring-2 ring-[var(--primary)]' : ''
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{dept.name}</h3>
                                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                                    {dept.description || 'No description'}
                                </p>
                            </div>
                            <span className={`badge ${dept.status === 'active' ? 'badge-success' : 'badge-secondary'
                                }`}>
                                {dept.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center p-3 bg-[var(--bg-secondary)] rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{dept.memberCount}</div>
                                <div className="text-xs text-[var(--text-secondary)]">Members</div>
                            </div>
                            <div className="text-center p-3 bg-[var(--bg-secondary)] rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{dept.taskCount}</div>
                                <div className="text-xs text-[var(--text-secondary)]">Tasks</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-[var(--border-color)]">
                            <div className="text-sm">
                                <span className="text-[var(--text-secondary)]">Budget: </span>
                                <span className="font-bold">${dept.budget || 0}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-green-600 font-bold">
                                    {dept.taskCount > 0 ? Math.round((dept.completedTasks / dept.taskCount) * 100) : 0}%
                                </span>
                                <span className="text-[var(--text-secondary)]"> complete</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Department Tasks Detail */}
            {selectedDept && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                >
                    <h3 className="font-bold text-xl mb-4">
                        {selectedDept.name} - Tasks Overview
                    </h3>

                    {deptTasks.length === 0 ? (
                        <p className="text-[var(--text-secondary)]">No tasks assigned to this department.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[var(--border-color)]">
                                        <th className="text-left p-3">Task</th>
                                        <th className="text-left p-3">Assigned To</th>
                                        <th className="text-left p-3">Status</th>
                                        <th className="text-left p-3">Priority</th>
                                        <th className="text-left p-3">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deptTasks.map(task => (
                                        <tr key={task.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]">
                                            <td className="p-3">
                                                <div className="font-medium">{task.title}</div>
                                                <div className="text-xs text-[var(--text-secondary)] line-clamp-1">
                                                    {task.description}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                {task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned'}
                                            </td>
                                            <td className="p-3">
                                                <span className={`badge ${task.status === 'completed' ? 'badge-success' :
                                                    task.status === 'in-progress' ? 'badge-warning' : 'badge-secondary'
                                                    }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className={`badge ${task.priority === 'high' ? 'badge-error' :
                                                    task.priority === 'medium' ? 'badge-warning' : 'badge-secondary'
                                                    }`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="p-3 text-sm">
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Departments;
