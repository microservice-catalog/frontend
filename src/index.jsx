// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import App from './App';
import {AuthProvider} from "./context/AuthContext.jsx";
import {ThemeProvider} from "./context/ThemeContext.jsx";
import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    </QueryClientProvider>
    // </React.StrictMode>
);
