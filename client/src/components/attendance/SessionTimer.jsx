import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const SessionTimer = ({ endTime, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const [hours, minutes] = endTime.split(':');
            const end = new Date();
            end.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft('00:00:00');
                if (onExpire) onExpire();
                return;
            }

            // Less than 5 minutes remaining
            if (diff < 5 * 60 * 1000) {
                setIsUrgent(true);
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(
                `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
            );
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [endTime, onExpire]);

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold border ${isUrgent
                ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
                : 'bg-green-500/10 border-green-500/30 text-green-400'
            }`}>
            {isUrgent ? <AlertCircle size={20} /> : <Clock size={20} />}
            <span>{timeLeft}</span>
        </div>
    );
};

export default SessionTimer;
