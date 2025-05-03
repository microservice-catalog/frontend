// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';

import App from './App';
import theme from './theme';
import {AuthProvider} from "./context/AuthContext.jsx";
import {CssBaseline} from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <AuthProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </AuthProvider>
    </ThemeProvider>
);