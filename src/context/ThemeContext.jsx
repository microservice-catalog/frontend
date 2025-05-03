// src/context/ThemeContext.jsx
import React, {createContext, useContext, useMemo, useState} from 'react';
import {createTheme, ThemeProvider as MuiThemeProvider} from '@mui/material/styles';
import {CssBaseline} from '@mui/material';
import baseTheme from '../theme';

const ThemeContext = createContext();

export function ThemeProvider({children}) {
    const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

    const toggleMode = () => {
        setMode(prev => {
            const next = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', next);
            return next;
        });
    };

    const theme = useMemo(() => {
        // Merge base theme with current mode palette overrides
        const merged = createTheme({
            ...baseTheme,
            palette: {
                ...baseTheme.palette,
                mode,
                ...(mode === 'dark' && {
                    background: {
                        default: '#2c2035',
                        paper: '#3b2b50',
                    },
                    text: {
                        primary: '#FFFFFF',
                        secondary: '#BCBCBC',
                        disabled: baseTheme.palette.text.disabled,
                    },
                }),
            },
        });

        // Override CssBaseline to use theme palette dynamically
        merged.components = {
            ...merged.components,
            MuiCssBaseline: {
                styleOverrides: (theme) => ({
                    body: {
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                    },
                }),
            },
        };

        return merged;
    }, [mode]);

    return (
        <ThemeContext.Provider value={{mode, toggleMode}}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}

export const useThemeContext = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useThemeContext must be inside ThemeProvider');
    return ctx;
};
