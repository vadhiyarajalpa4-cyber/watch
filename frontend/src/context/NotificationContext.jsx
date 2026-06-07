// import React, { createContext, useState, useEffect, useContext } from 'react';
// import axios from 'axios';

// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//     const [notifications, setNotifications] = useState([]);
//     const unreadCount = notifications.filter(n => !n.isRead).length;

//     const fetchNotifications = async () => {
//         try {
//             const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//             if (!userInfo) return;

//             const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
//             const { data } = await axios.get('http://localhost:5000/api/notifications', config);
//             setNotifications(data);
//         } catch (error) {
//             console.error("Error fetching notifications", error);
//         }
//     };

//     // Auto-refresh notifications every 60 seconds
//     useEffect(() => {
//         fetchNotifications();
//         const interval = setInterval(fetchNotifications, 60000);
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <NotificationContext.Provider value={{ notifications, setNotifications, fetchNotifications , unreadCount}}>
//             {children}
//         </NotificationContext.Provider>
//     );
// };

// export const useNotifications = () => useContext(NotificationContext);
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    
    // Derived state: calculate count based on the current notifications array
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // 1. Function to fetch notifications from Server
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

    // 2. 🔥 NEW: Function to Mark All as Read INSTANTLY
    const markAllAsRead = async () => {
        if (unreadCount === 0) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            // A. Optimistic Update: Change local state immediately so count hits 0 instantly
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

            // B. Database Update: Tell the server to save the change
            await axios.put('http://localhost:5000/api/notifications/mark-all-read', {}, config);
            
            // C. Sync: Optional final fetch to ensure local data matches server perfectly
            await fetchNotifications();
        } catch (error) {
            console.error("Error marking notifications as read", error);
            // If server fails, re-fetch to show the true state
            fetchNotifications();
        }
    };

    // Auto-refresh notifications every 60 seconds (Background sync)
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
            markAllAsRead, // 🔥 Exported this new function
            unreadCount 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);