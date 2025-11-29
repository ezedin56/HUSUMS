import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Dark mode only - premium tech experience
    const [theme] = useState('dark');

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', 'dark');
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme: () => {}, setThemeMode: () => {}, isDark: true }}>
            {children}
        </ThemeContext.Provider>
    );
};

function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export { useTheme };
