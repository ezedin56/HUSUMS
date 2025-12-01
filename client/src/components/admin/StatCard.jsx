import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const StatCard = ({
    title,
    value,
    icon: Icon,
    color = 'green',
    trend,
    chart: ChartComponent
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const controls = useAnimation();

    const colors = {
        green: {
            icon: '#00ff55',
            glow: 'rgba(0, 255, 85, 0.3)',
            gradient: 'linear-gradient(135deg, rgba(0, 255, 85, 0.1), rgba(0, 255, 85, 0.05))',
        },
        cyan: {
            icon: '#00d9ff',
            glow: 'rgba(0, 217, 255, 0.3)',
            gradient: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(0, 217, 255, 0.05))',
        },
        purple: {
            icon: '#a855f7',
            glow: 'rgba(168, 85, 247, 0.3)',
            gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05))',
        },
        orange: {
            icon: '#fb923c',
            glow: 'rgba(251, 146, 60, 0.3)',
            gradient: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(251, 146, 60, 0.05))',
        }
    };

    const colorScheme = colors[color];

    // Animated count-up effect
    useEffect(() => {
        let start = 0;
        const end = parseInt(value) || 0;
        const duration = 2000; // 2 seconds
        const increment = end / (duration / 16); // 60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);

        controls.start({
            scale: [1, 1.05, 1],
            transition: { duration: 0.5 }
        });

        return () => clearInterval(timer);
    }, [value, controls]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -5,
                boxShadow: `0 10px 40px ${colorScheme.glow}`
            }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-2xl p-6"
            style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: `0 4px 20px ${colorScheme.glow}`,
            }}
        >
            {/* Background gradient */}
            <div
                className="absolute inset-0 opacity-50"
                style={{ background: colorScheme.gradient }}
            />

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">{title}</p>
                        <motion.h3
                            animate={controls}
                            className="text-4xl font-bold text-white"
                        >
                            {displayValue.toLocaleString()}
                        </motion.h3>
                        {trend && (
                            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                            </p>
                        )}
                    </div>
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="p-3 rounded-xl"
                        style={{
                            background: colorScheme.gradient,
                            boxShadow: `0 0 20px ${colorScheme.glow}`,
                        }}
                    >
                        <Icon size={28} style={{ color: colorScheme.icon }} />
                    </motion.div>
                </div>

                {/* Mini chart */}
                {ChartComponent && (
                    <div className="mt-4 h-16">
                        <ChartComponent color={colorScheme.icon} />
                    </div>
                )}
            </div>

            {/* Glow effect */}
            <div
                className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20"
                style={{ background: colorScheme.icon }}
            />
        </motion.div>
    );
};

export default StatCard;
