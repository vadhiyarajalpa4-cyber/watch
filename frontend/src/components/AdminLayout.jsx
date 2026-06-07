// import React, { useState, useEffect } from 'react';
// import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
// import { LayoutDashboard, FolderTree, Watch, ShoppingCart, LogOut, Users, Bell, Mail } from 'lucide-react';
// import { useNotifications } from '../context/NotificationContext';
// import axios from 'axios';

// const AdminLayout = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { notifications, fetchNotifications } = useNotifications();
//     const [showBellDropdown, setShowBellDropdown] = useState(false);

//     // 🔄 AUTOMATIC PAGE WATCHER: Fetch live updates whenever shifting routes
//     useEffect(() => {
//         fetchNotifications();
//     }, [location.pathname]);

//     // 🔥 COVERS BOTH BASES: Lights up if the array contains ANY notification of this type
//     const hasNewOrders = notifications.some(
//         n => n.type?.toString().trim().toUpperCase() === 'NEW_ORDER' && n.isRead === true
//     );

//     const hasNewUsers = notifications.some(
//         n => n.type?.toString().trim().toUpperCase() === 'NEW_USER' && n.isRead === true
//     );

//     const hasNewInquiries = notifications.some(
//         n => n.type?.toString().trim().toUpperCase() === 'NEW_INQUIRY' && n.isRead === true
//     );

//     // 🔥 FIXED: Matched directly to your main navbar logic (Boolean + String check)
//     const unreadCount = notifications.filter(
//         n => n.isRead === true || n.isRead?.toString().trim() === 'true'
//     ).length;

//     // 🚪 TERMINAL EXIT ACCESS
//     const handleLogout = () => {
//         localStorage.removeItem('userInfo');
//         navigate('/login');
//     };

//     const handleClearDot = async (category) => {
//         try {
//             const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//             if (!userInfo?.token) return;

//             const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

//             // Run the backend update in the background
//             await axios.put('http://localhost:5000/api/notifications/mark-read', { type: category }, config);

//             // Silently fetch fresh data from the database to ensure alignment
//             fetchNotifications();
//         } catch (error) {
//             console.error("Could not clear notification dot", error);
//         }
//     };

//     const navItems = [
//         { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
//         { path: '/admin/categories', label: 'Manage Categories', icon: <FolderTree size={18} /> },
//         { path: '/admin/products', label: 'Manage Products', icon: <Watch size={18} /> },
//         {
//             path: '/admin/orders',
//             label: 'View Orders',
//             icon: <ShoppingCart size={18} />,
//             hasDot: hasNewOrders,
//             category: 'NEW_ORDER'
//         },
//         {
//             path: '/admin/userlist',
//             label: 'Registered Clients',
//             icon: <Users size={18} />,
//             hasDot: hasNewUsers,
//             category: 'NEW_USER'
//         },
//         {
//             path: '/admin/inbox',
//             label: 'Inquiry Vault',
//             icon: <Mail size={18} />,
//             hasDot: hasNewInquiries,
//             category: 'NEW_INQUIRY'
//         },
//     ];

//     return (
//         <div className="flex min-h-screen bg-[#FDFDFD]">
//             {/* Sidebar */}
//             <div className="w-[280px] bg-[#111] text-white p-8 fixed h-full flex flex-col shadow-2xl z-50">
//                 <div className="mb-12">
//                     <h2 className="text-[#D4AF37] font-serif text-2xl tracking-[0.2em] uppercase border-b border-[#D4AF37]/20 pb-4">
//                         Sarvoday
//                         <span className="block text-[10px] text-gray-400 tracking-[0.4em] mt-1">Concierge Admin</span>
//                     </h2>
//                 </div>

//                 <nav className="flex-1">
//                     <ul className="space-y-2">
//                         {navItems.map((item) => (
//                             <li key={item.path}>
//                                 <button
//                                     onClick={async () => {
//                                         if (item.hasDot) {
//                                             try {
//                                                 const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//                                                 if (userInfo?.token) {
//                                                     const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
//                                                     await axios.put('http://localhost:5000/api/notifications/mark-read', { type: item.category }, config);
//                                                 }
//                                             } catch (err) {
//                                                 console.error("Clear dot error", err);
//                                             }
//                                         }

//                                         await fetchNotifications();
//                                         navigate(item.path);
//                                     }}
//                                     className={`w-full relative flex items-center justify-between px-4 py-3 rounded-sm transition-all duration-300 text-[11px] uppercase tracking-widest font-sans text-left ${location.pathname === item.path
//                                             ? 'bg-[#D4AF37] text-black font-bold'
//                                             : 'text-gray-400 hover:text-white hover:bg-white/5'
//                                         }`}
//                                 >
//                                     <div className="flex items-center gap-4">
//                                         {item.icon}
//                                         <span>{item.label}</span>
//                                     </div>

//                                     {item.hasDot && (
//                                         <span
//                                             className="w-2.5 h-2.5 bg-blue-500 rounded-full block animate-pulse"
//                                             style={{
//                                                 boxShadow: '0 0 12px #3b82f6',
//                                                 minWidth: '10px',
//                                                 minHeight: '10px'
//                                             }}
//                                         />
//                                     )}
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 </nav>

//                 <button
//                     onClick={handleLogout}
//                     className="mt-auto flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-red-400 hover:text-red-300 transition-colors border border-red-900/30 rounded-sm font-bold"
//                 >
//                     <LogOut size={18} />
//                     Terminal Access Close
//                 </button>
//             </div>

//             {/* Content Area */}
//             <div className="flex-1 ml-[280px] bg-[#F8F8F8] min-h-screen">
//                 <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 relative">
//                     <p className="text-[10px] uppercase tracking-widest text-gray-400">System Status: <span className="text-green-500">Operational</span></p>

//                     <div className="flex items-center gap-6">
//                         {/* --- NAVBAR BELL ICON --- */}
//                         <div className="relative cursor-pointer" onClick={() => setShowBellDropdown(!showBellDropdown)}>
//                             <Bell size={20} className="text-gray-500 hover:text-[#D4AF37] transition-colors" />
//                             {unreadCount > 0 && (
//                                 <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
//                                     {unreadCount}
//                                 </span>
//                             )}

//                             {showBellDropdown && (
//                                 <div className="absolute right-0 mt-4 w-72 bg-white shadow-2xl border border-gray-100 z-[60] rounded-sm window-animation">
//                                     <div className="p-4 text-[10px] uppercase font-bold border-b tracking-widest text-gray-400 bg-gray-50/50">Recent Notifications</div>
//                                     <div className="max-h-64 overflow-y-auto">
//                                         {notifications.length === 0 ? (
//                                             <div className="p-6 text-center text-[11px] text-gray-400 italic">All clear in the vault.</div>
//                                         ) : (
//                                             notifications.slice(0, 5).map(n => (
//                                                 <div key={n._id} className={`p-4 border-b text-[11px] transition-colors ${(n.isRead === true || n.isRead?.toString().trim() === 'true') ? 'bg-blue-50/40 font-bold text-black' : 'hover:bg-gray-50 text-gray-500'}`}>
//                                                     <p>{n.message}</p>
//                                                     <p className="text-[8px] text-gray-300 mt-1 uppercase">{new Date(n.createdAt).toLocaleTimeString()}</p>
//                                                 </div>
//                                             ))
//                                         )}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-xs shadow-inner">P</div>
//                     </div>
//                 </header>
//                 <main className="p-10">
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default AdminLayout;




import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderTree, Watch, ShoppingCart, LogOut, Users, Bell, Mail } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import axios from 'axios';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { notifications, fetchNotifications } = useNotifications();
    const [showBellDropdown, setShowBellDropdown] = useState(false);

    // 🔄 AUTOMATIC PAGE WATCHER: Fetch live updates whenever shifting routes
    useEffect(() => {
        fetchNotifications();
    }, [location.pathname]);

    // 🔥 SMART TRACKING BYPASS: Stays on until you explicitly click the button!
    const lastClearedOrders = localStorage.getItem('lastCleared_NEW_ORDER') || 0;

    const hasNewOrders = notifications.some(n => {
        if (n.type?.toString().trim().toUpperCase() !== 'NEW_ORDER') return false;
        
        const orderTime = new Date(n.createdAt).getTime();
        // Light up only if the order is newer than the last time you clicked "View Orders"
        return orderTime > Number(lastClearedOrders);
    });

    const hasNewUsers = notifications.some(
        n => n.type?.toString().trim().toUpperCase() === 'NEW_USER' && (n.isRead === true || n.isRead?.toString().trim() === 'true')
    );

    const hasNewInquiries = notifications.some(
        n => n.type?.toString().trim().toUpperCase() === 'NEW_INQUIRY' && (n.isRead === true || n.isRead?.toString().trim() === 'true')
    );

    // 🔔 NAVBAR BADGE COUNT: Tracks active notifications
    const unreadCount = notifications.filter(
        n => n.isRead === true || n.isRead?.toString().trim() === 'true'
    ).length;

    // 🚪 TERMINAL EXIT ACCESS
    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { path: '/admin/categories', label: 'Manage Categories', icon: <FolderTree size={18} /> },
        { path: '/admin/products', label: 'Manage Products', icon: <Watch size={18} /> },
        {
            path: '/admin/orders',
            label: 'View Orders',
            icon: <ShoppingCart size={18} />,
            hasDot: hasNewOrders,
            category: 'NEW_ORDER'
        },
        {
            path: '/admin/userlist',
            label: 'Registered Clients',
            icon: <Users size={18} />,
            hasDot: hasNewUsers,
            category: 'NEW_USER'
        },
        {
            path: '/admin/inbox',
            label: 'Inquiry Vault',
            icon: <Mail size={18} />,
            hasDot: hasNewInquiries,
            category: 'NEW_INQUIRY'
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#FDFDFD]">
            {/* Sidebar */}
            <div className="w-[280px] bg-[#111] text-white p-8 fixed h-full flex flex-col shadow-2xl z-50">
                <div className="mb-12">
                    <h2 className="text-[#D4AF37] font-serif text-2xl tracking-[0.2em] uppercase border-b border-[#D4AF37]/20 pb-4">
                        Sarvoday
                        <span className="block text-[10px] text-gray-400 tracking-[0.4em] mt-1">Concierge Admin</span>
                    </h2>
                </div>

                <nav className="flex-1">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <button
                                    onClick={async () => {
                                        // 🎯 Save the exact timestamp when clicked to turn off the dot permanently for existing items
                                        if (item.category === 'NEW_ORDER') {
                                            localStorage.setItem('lastCleared_NEW_ORDER', Date.now().toString());
                                        }

                                        if (item.hasDot) {
                                            try {
                                                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                                                if (userInfo?.token) {
                                                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                                                    // Mark this specific module's notifications read when clicking the sidebar tab
                                                    await axios.put('http://localhost:5000/api/notifications/mark-read', { type: item.category }, config);
                                                }
                                            } catch (err) {
                                                console.error("Clear dot error", err);
                                            }
                                        }

                                        await fetchNotifications();
                                        navigate(item.path);
                                    }}
                                    className={`w-full relative flex items-center justify-between px-4 py-3 rounded-sm transition-all duration-300 text-[11px] uppercase tracking-widest font-sans text-left ${location.pathname === item.path
                                            ? 'bg-[#D4AF37] text-black font-bold'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>

                                    {item.hasDot && (
                                        <span
                                            className="w-2.5 h-2.5 bg-blue-500 rounded-full block animate-pulse"
                                            style={{
                                                boxShadow: '0 0 12px #3b82f6',
                                                minWidth: '10px',
                                                minHeight: '10px'
                                            }}
                                        />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-red-400 hover:text-red-300 transition-colors border border-red-900/30 rounded-sm font-bold"
                >
                    <LogOut size={18} />
                    Terminal Access Close
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 ml-[280px] bg-[#F8F8F8] min-h-screen">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 relative">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">System Status: <span className="text-green-500">Operational</span></p>

                    <div className="flex items-center gap-6">
                        {/* --- NAVBAR BELL ICON --- */}
                        <div className="relative cursor-pointer" onClick={() => setShowBellDropdown(!showBellDropdown)}>
                            <Bell size={20} className="text-gray-500 hover:text-[#D4AF37] transition-colors" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                                    {unreadCount}
                                </span>
                            )}

                            {showBellDropdown && (
                                <div className="absolute right-0 mt-4 w-72 bg-white shadow-2xl border border-gray-100 z-[60] rounded-sm window-animation">
                                    <div className="p-4 text-[10px] uppercase font-bold border-b tracking-widest text-gray-400 bg-gray-50/50">Recent Notifications</div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-6 text-center text-[11px] text-gray-400 italic">All clear in the vault.</div>
                                        ) : (
                                            notifications.slice(0, 5).map(n => (
                                                <div key={n._id} className="p-4 border-b text-[11px] hover:bg-gray-50 text-gray-500 transition-colors">
                                                    <p className={(n.isRead === true || n.isRead?.toString().trim() === 'true') ? 'font-bold text-black' : 'text-gray-500'}>
                                                        {n.message}
                                                    </p>
                                                    <p className="text-[8px] text-gray-300 mt-1 uppercase">{new Date(n.createdAt).toLocaleTimeString()}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-xs shadow-inner">S</div>
                    </div>
                </header>
                <main className="p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;