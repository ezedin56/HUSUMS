import React from 'react';
import { motion } from 'framer-motion';

const NeonButton = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    loading = false,
    disabled = false,
    className = '',
    ...props
}) => {
    const variants = {
        primary: {
            bg: 'linear-gradient(135deg, rgba(0, 255, 85, 0.1), rgba(0, 255, 85, 0.05))',
            border: '1px solid rgba(0, 255, 85, 0.4)',
            color: '#00ff55',
            glow: '0 0 20px rgba(0, 255, 85, 0.3)',
            hoverGlow: '0 0 30px rgba(0, 255, 85, 0.5)',
        },
        secondary: {
            bg: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(0, 217, 255, 0.05))',
            border: '1px solid rgba(0, 217, 255, 0.4)',
            color: '#00d9ff',
            glow: '0 0 20px rgba(0, 217, 255, 0.3)',
            hoverGlow: '0 0 30px rgba(0, 217, 255, 0.5)',
        },
        danger: {
            bg: 'linear-gradient(135deg, rgba(255, 0, 85, 0.1), rgba(255, 0, 85, 0.05))',
            border: '1px solid rgba(255, 0, 85, 0.4)',
            color: '#ff0055',
            glow: '0 0 20px rgba(255, 0, 85, 0.3)',
            hoverGlow: '0 0 30px rgba(255, 0, 85, 0.5)',
        },
        ghost: {
            bg: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.8)',
            glow: 'none',
            hoverGlow: '0 0 20px rgba(0, 255, 85, 0.2)',
        }
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    const style = variants[variant];
    const sizeClass = sizes[size];

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`
                ${sizeClass}
                rounded-lg
                font-semibold
                transition-all
                duration-300
                flex
                items-center
                gap-2
                justify-center
                backdrop-blur-sm
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
            style={{
                background: style.bg,
                border: style.border,
                color: style.color,
                boxShadow: style.glow,
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.boxShadow = style.hoverGlow;
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = style.glow;
            }}
            {...props}
        >
            {loading ? (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                />
            ) : (
                <>
                    {Icon && <Icon size={18} />}
                    {children}
                </>
            )}
        </motion.button>
    );
};

export default NeonButton;
