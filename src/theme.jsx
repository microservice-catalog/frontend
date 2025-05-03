// src/theme.jsx
import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light', // Default mode, overridden in ThemeContext

        primary: {
            main: '#2E86DE',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#F39C12',
            contrastText: '#FFFFFF',
        },
        success: {
            main: '#27AE60',
            contrastText: '#FFFFFF',
        },
        info: {
            main: '#1ABC9C',
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#E74C3C',
            contrastText: '#FFFFFF',
        },

        background: {
            default: '#ECF0F1',
            paper: '#FFFFFF',
        },

        text: {
            primary: '#333333',
            secondary: '#666666',
            disabled: '#999999',
        },
    },

    shape: {
        borderRadius: 8,
    },

    spacing: 8,

    components: {
        MuiCssBaseline: {
            styleOverrides: (theme) => ({
                body: {
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                },
            }),
        },

        MuiAppBar: {
            styleOverrides: {
                root: ({theme}) => ({
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }),
            },
        },

        MuiToolbar: {
            styleOverrides: {
                regular: {
                    minHeight: 64,
                    '@media (min-width:0px)': {minHeight: 56},
                    '@media (min-width:600px)': {minHeight: 64},
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
                root: ({theme}) => ({
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }),
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: ({theme}) => ({
                    backgroundColor: theme.palette.background.paper,
                }),
            },
        },

        MuiDialog: {
            styleOverrides: {
                paper: ({theme}) => ({
                    backgroundColor: theme.palette.background.paper,
                    padding: '16px',
                    borderRadius: 8,
                    boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
                }),
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
                root: ({theme}) => ({
                    color: theme.palette.text.secondary,
                }),
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: ({theme}) => ({
                    backgroundColor: theme.palette.background.paper,
                    '& fieldset': {
                        borderColor: theme.palette.divider,
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.text.secondary,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                    },
                }),
            },
        },

        MuiAvatar: {
            styleOverrides: {
                root: ({theme}) => ({
                    border: `2px solid ${theme.palette.primary.main}`,
                }),
            },
        },

        MuiPagination: {
            styleOverrides: {
                root: ({theme}) => ({
                    '& .Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                    },
                }),
            },
        },

        MuiSnackbarContent: {
            styleOverrides: {
                root: ({theme}) => ({
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }),
            },
        },
    },

    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {fontSize: '2.125rem', fontWeight: 500},
        h2: {fontSize: '1.75rem', fontWeight: 500},
        h3: {fontSize: '1.5rem', fontWeight: 500},
        h4: {fontSize: '1.25rem', fontWeight: 500},
        h5: {fontSize: '1rem', fontWeight: 500},
        body1: {fontSize: '1rem'},
        body2: {fontSize: '0.875rem'},
        button: {fontWeight: 500, textTransform: 'none'},
    },
});

export default theme;
