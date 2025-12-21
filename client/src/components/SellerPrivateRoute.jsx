import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSellerAuth } from '../context/SellerAuthContext';

const SellerPrivateRoute = ({ children }) => {
    const { seller, loading } = useSellerAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
            </div>
        );
    }

    return seller ? children : <Navigate to="/seller/login" />;
};

export default SellerPrivateRoute;
