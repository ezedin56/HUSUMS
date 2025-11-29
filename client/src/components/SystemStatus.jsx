import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Wifi, WifiOff } from 'lucide-react';

const SystemStatus = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [dbStatus, setDbStatus] = useState('checking'); // 'connected', 'disconnected', 'checking'

    useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const checkStatus = async () => {
        try {
            // Try to fetch a lightweight endpoint to check DB connection
            // We can use the health check endpoint if it exists, or just try to fetch user profile or something simple
            // If the backend is down, this will fail
            await api.get('/auth/me').catch(() => { }); // Just checking connectivity, ignore auth errors
            setDbStatus('connected');
            setIsOnline(true);
        } catch (error) {
            // If network error or 500, assume disconnected
            if (!error.response || error.response.status >= 500) {
                setDbStatus('disconnected');
            } else {
                // 401/403 means server is up but we are not auth'd, which is fine for "system status"
                setDbStatus('connected');
            }
        }
    };

    if (dbStatus === 'connected') {
        return (
            <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm border border-green-200 z-50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                System Online
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm border border-red-200 z-50">
            <WifiOff size={12} />
            System Disconnected
        </div>
    );
};

export default SystemStatus;
