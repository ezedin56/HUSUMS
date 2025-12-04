import { Users, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, total, icon: Icon, color, subtext }) => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
                <Icon className={color.replace('bg-', 'text-')} size={24} />
            </div>
            <div className="flex-1">
                <p className="text-gray-400 text-sm">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-white">{value}</h3>
                    {total > 0 && (
                        <span className="text-xs text-gray-500">({percentage}%)</span>
                    )}
                </div>
                {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
            </div>
        </div>
    );
};

const AttendanceStats = ({ stats }) => {
    const { totalMembers, presentCount, absentCount, lateCount, excusedCount } = stats;
    const markedCount = presentCount + absentCount + lateCount + excusedCount;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard
                title="Total Members"
                value={totalMembers}
                total={0}
                icon={Users}
                color="bg-blue-500"
                subtext={`${markedCount} marked`}
            />
            <StatCard
                title="Present"
                value={presentCount}
                total={markedCount}
                icon={CheckCircle}
                color="bg-green-500"
            />
            <StatCard
                title="Absent"
                value={absentCount}
                total={markedCount}
                icon={XCircle}
                color="bg-red-500"
            />
            <StatCard
                title="Late"
                value={lateCount}
                total={markedCount}
                icon={Clock}
                color="bg-yellow-500"
            />
            <StatCard
                title="Excused"
                value={excusedCount}
                total={markedCount}
                icon={AlertTriangle}
                color="bg-purple-500"
            />
        </div>
    );
};

export default AttendanceStats;
