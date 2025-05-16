import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme(defaultTheme: Theme = 'light') {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : defaultTheme;
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);

        document.documentElement.setAttribute('data-theme', theme);

    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return {
        theme,
        toggleTheme,
        setTheme,
        reverseTheme: theme === 'light' ? 'dark' : 'light'
    } as const;
}
