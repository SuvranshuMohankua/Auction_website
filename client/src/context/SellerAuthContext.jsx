import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SellerAuthContext = createContext();

export const useSellerAuth = () => useContext(SellerAuthContext);

export const SellerAuthProvider = ({ children }) => {
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('sellerToken');
        if (token) {
            fetchSeller(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchSeller = async (token) => {
        try {
            const res = await axios.get('http://localhost:3001/api/seller/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSeller(res.data.seller);
        } catch (error) {
            console.error('Fetch seller error:', error);
            logoutSeller();
        } finally {
            setLoading(false);
        }
    };

    const loginSeller = async (email, password) => {
        const res = await axios.post('http://localhost:3001/api/seller/login', { email, password });
        localStorage.setItem('sellerToken', res.data.token);
        setSeller(res.data.seller);
        return res.data.seller;
    };

    const registerSeller = async (sellername, email, password) => {
        const res = await axios.post('http://localhost:3001/api/seller/register', { sellername, email, password });
        localStorage.setItem('sellerToken', res.data.token);
        setSeller(res.data.seller);
        return res.data.seller;
    };

    const updateSellerProfile = async (updates) => {
        const token = localStorage.getItem('sellerToken');
        const res = await axios.put('http://localhost:3001/api/seller/profile', updates, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSeller(res.data.seller);
        return res.data.seller;
    };

    const logoutSeller = () => {
        localStorage.removeItem('sellerToken');
        setSeller(null);
    };

    const getSellerToken = () => localStorage.getItem('sellerToken');

    return (
        <SellerAuthContext.Provider value={{
            seller,
            loginSeller,
            registerSeller,
            logoutSeller,
            updateSellerProfile,
            getSellerToken,
            loading
        }}>
            {children}
        </SellerAuthContext.Provider>
    );
};
