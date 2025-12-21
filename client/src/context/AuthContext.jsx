import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/auth/me');
            setUser(res.data);
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:3001/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        return res.data.user;
    };

    const register = async (username, email, password) => {
        const res = await axios.post('http://localhost:3001/api/auth/register', { username, email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const toggleWatchlist = async (auctionId) => {
        if (!user) return;
        try {
            const isWatched = user.watchlist?.includes(auctionId);
            const method = isWatched ? 'delete' : 'post';
            const res = await axios[method](`http://localhost:3001/api/users/watchlist/${auctionId}`);

            setUser(prev => ({ ...prev, watchlist: res.data }));
            return true;
        } catch (error) {
            console.error('Error toggling watchlist:', error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, toggleWatchlist }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
