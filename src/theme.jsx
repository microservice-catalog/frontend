// src/theme.jsx
import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#9c27b0', // Фиолетовый
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#d05ce3', // Светлее фиолетовый
            contrastText: '#ffffff',
        },
        success: {
            main: '#66bb6a',
            contrastText: '#fff',
        },
        error: {
            main: '#f44336',
            contrastText: '#fff',
        },
        warning: {
            main: '#ffa726',
            contrastText: '#000',
        },
        info: {
            main: '#29b6f6',
            contrastText: '#000',
        },
        background: {
            default: '#2c2035', // Тёмный фон
            paper: '#3b2b50',   // Цвет карточек
        },
        text: {
            primary: '#ffffff',
            secondary: '#bcbcbc',
            disabled: '#777777',
        },
    },
    shape: {
        borderRadius: 12,
    },
    spacing: 8,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#2c2035',
                    color: '#ffffff',
                },
            },
        },
        MuiAppBar: {
            defaultProps: {
                elevation: 1,
            },
            styleOverrides: {
                root: {
                    backgroundColor: '#4a3375',
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                regular: {
                    minHeight: 64,
                    '@media (min-width:0px)': {
                        minHeight: 56,
                    },
                    '@media (min-width:600px)': {
                        minHeight: 64,
                    },
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#4a3375',
                    borderRadius: 12,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#3b2b50',
                },
            },
        },
        MuiDialog: {
            defaultProps: {
                disablePortal: true,
            },
            styleOverrides: {
                paper: {
                    backgroundColor: '#3b2b50',
                    padding: '16px',
                    borderRadius: 12,
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontSize: '1.25rem',
                    fontWeight: 500,
                },
            },
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: '8px 16px',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                fullWidth: true,
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#bcbcbc',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: '#2c2035',
                    '& fieldset': {
                        borderColor: '#555',
                    },
                    '&:hover fieldset': {
                        borderColor: '#888',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#9c27b0',
                    },
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    border: '2px solid #9c27b0',
                },
            },
        },
        MuiPagination: {
            styleOverrides: {
                root: {
                    '& .Mui-selected': {
                        backgroundColor: '#9c27b0',
                        color: '#fff',
                    },
                },
            },
        },
        MuiSnackbarContent: {
            styleOverrides: {
                root: {
                    backgroundColor: '#4a3375',
                },
            },
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
            fontSize: '2.125rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1rem',
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
        },
        body2: {
            fontSize: '0.875rem',
        },
        button: {
            fontWeight: 500,
            textTransform: 'none',
        },
    },
});

export default theme;
