import React, { createContext, useState, useEffect, useContext } from 'react';
import {authApi, userApi} from "../api/api.jsx";

const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch current user using /users/me
    const fetchUser = async () => {
        try {
            const response = await userApi.getMe();
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Login: posts credentials, server sets cookie, then fetch user data
    const login = async (username, password) => {
        setLoading(true);
        await authApi.login({"username": username, "password": password});
        await fetchUser();
    };

    // Logout: clears server session/cookie, then reset client state
    const logout = async () => {
        setLoading(true);
        await authApi.logout();
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
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
