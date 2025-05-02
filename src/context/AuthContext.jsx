import React, {createContext, useContext, useEffect, useState} from 'react';
import {authApi, userApi} from "../api/api.jsx";

const AuthContext = createContext();

// Provider component
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [isAuthenticated, setAuthenticated] = useState(false);

    // Fetch current user using /users/me
    const fetchUser = async () => {
        setAuthLoading(true);
        try {
            const response = await userApi.getMe();
            setUser(response.data);
            setAuthenticated(true);
        } catch (error) {
            setUser(null);
            setAuthenticated(false);
        } finally {
            setAuthLoading(false);
        }
    };

    useEffect(() => {
        setAuthLoading(true);
        fetchUser();
        setAuthLoading(false);
    }, []);

    // Login: posts credentials, server sets cookie, then fetch user data
    const login = async (username, password) => {
        setAuthLoading(true);
        try {
            await authApi.login({username, password});
            await fetchUser();
        } finally {
            setAuthLoading(false);
        }
    };

    // Logout: clears server session/cookie, then reset client state
    const logout = async () => {
        setAuthLoading(true);
        try {
            await authApi.logout();
        } catch (ignored) {
        }
        setAuthenticated(false);
        setUser(null);
        setAuthLoading(false);
    };

    return (
        <AuthContext.Provider value={{user, loading: authLoading, login, logout, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
