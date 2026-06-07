import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const fetchNotifications = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) return;

            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/notifications', config);
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    const markAllAsRead = async () => {
        if (unreadCount === 0) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

            await axios.put('http://localhost:5000/api/notifications/mark-all-read', {}, config);
            
            await fetchNotifications();
        } catch (error) {
            console.error("Error marking notifications as read", error);
            fetchNotifications();
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            setNotifications, 
            fetchNotifications, 
            markAllAsRead, 
            unreadCount 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);