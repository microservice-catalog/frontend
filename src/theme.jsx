// src/theme.jsx
import React from 'react';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#9c27b0', // Фиолетовый
        },
        secondary: {
            main: '#d05ce3', // Светлее фиолетовый
        },
        background: {
            default: '#2c2035', // Тёмный фон
            paper: '#3b2b50',   // Цвет карточек
        },
        text: {
            primary: '#ffffff',
            secondary: '#bcbcbc',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#4a3375',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#4a3375',
                },
            },
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

export default theme;