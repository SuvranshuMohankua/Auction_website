import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SellerAuthProvider } from './context/SellerAuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import ThreeBackground from './components/ThreeBackground';
import SellerPrivateRoute from './components/SellerPrivateRoute';
import Footer from './components/Footer';

// Buyer Pages
import LandingPage from './pages/LandingPage';
import AuctionList from './components/AuctionList';
import AuctionDetail from './components/AuctionDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyBids from './pages/MyBids';
import PaymentPage from './pages/PaymentPage';
import NotFound from './pages/NotFound';

// Seller Pages
import SellerLogin from './pages/seller/SellerLogin';
import SellerRegister from './pages/seller/SellerRegister';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProfile from './pages/seller/SellerProfile';

const AppContent = () => {
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    return (
        <div className={`min-h-screen bg-slate-900 ${isLandingPage ? '' : 'pt-20'} relative`}>
            {isLandingPage ? <AnimatedBackground /> : <ThreeBackground />}
            <Navbar />
            <main className={`${isLandingPage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'} relative z-10`}>
                <Routes>
                    {/* Buyer Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auctions" element={<AuctionList />} />
                    <Route path="/auction/:id" element={<AuctionDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/my-bids" element={<MyBids />} />
                    <Route path="/payments" element={<PaymentPage />} />

                    {/* Seller Routes */}
                    <Route path="/seller/login" element={<SellerLogin />} />
                    <Route path="/seller/register" element={<SellerRegister />} />
                    <Route path="/seller/dashboard" element={
                        <SellerPrivateRoute><SellerDashboard /></SellerPrivateRoute>
                    } />
                    <Route path="/seller/profile" element={
                        <SellerPrivateRoute><SellerProfile /></SellerPrivateRoute>
                    } />

                    {/* 404 Catch-all */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            {isLandingPage && <Footer />}
        </div>
    );
};

function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <SellerAuthProvider>
                        <ToastProvider>
                            <AppContent />
                        </ToastProvider>
                    </SellerAuthProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;

