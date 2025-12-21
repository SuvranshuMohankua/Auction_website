import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSellerAuth } from '../context/SellerAuthContext';
import { LuBell, LuX, LuCheck, LuDollarSign, LuUser } from 'react-icons/lu';

const SellerNotifications = () => {
    const { seller, getSellerToken } = useSellerAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showPanel, setShowPanel] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUnreadCount();
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const token = getSellerToken();
            const res = await axios.get('http://localhost:3001/api/seller/notifications/unread-count', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadCount(res.data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const token = getSellerToken();
            const res = await axios.get('http://localhost:3001/api/seller/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = getSellerToken();
            await axios.put(`http://localhost:3001/api/seller/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = getSellerToken();
            await axios.put('http://localhost:3001/api/seller/notifications/mark-all-read', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleOpen = () => {
        setShowPanel(true);
        fetchNotifications();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'auction_won':
                return <LuCheck className="w-5 h-5 text-green-400" />;
            case 'payment_received':
                return <LuDollarSign className="w-5 h-5 text-cyan-400" />;
            default:
                return <LuBell className="w-5 h-5 text-purple-400" />;
        }
    };

    return (
        <>
            {/* Bell Icon */}
            <button
                onClick={handleOpen}
                className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
                <LuBell className="w-5 h-5 text-slate-300" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            {showPanel && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowPanel(false)}>
                    <div
                        className="absolute right-4 top-20 w-96 max-h-[70vh] glass-premium rounded-2xl border border-purple-500/20 overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h3 className="text-lg font-bold text-white">Notifications</h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-purple-400 hover:text-purple-300"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button onClick={() => setShowPanel(false)}>
                                    <LuX className="w-5 h-5 text-slate-400 hover:text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
                            {loading ? (
                                <div className="flex items-center justify-center p-8">
                                    <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-400">
                                    No notifications yet
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {notifications.map(notification => (
                                        <div
                                            key={notification._id}
                                            className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${!notification.read ? 'bg-purple-500/5' : ''}`}
                                            onClick={() => !notification.read && markAsRead(notification._id)}
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-grow">
                                                    <p className={`text-sm ${notification.read ? 'text-slate-400' : 'text-white'}`}>
                                                        {notification.message}
                                                    </p>

                                                    {/* Buyer Info */}
                                                    {notification.buyerInfo && (
                                                        <div className="mt-2 p-2 bg-white/5 rounded-lg">
                                                            <div className="flex items-center gap-2 text-xs">
                                                                <LuUser className="w-3 h-3 text-cyan-400" />
                                                                <span className="text-white">{notification.buyerInfo.username}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-400 mt-1">
                                                                {notification.buyerInfo.email}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <p className="text-xs text-slate-500 mt-2">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </p>
                                                </div>

                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SellerNotifications;
