import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { IndianRupee, ShoppingBag, Clock, TrendingUp, Package, Users } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        orderCount: 0,
        pendingOrders: 0,
        userCount: 0,
        rawOrders: []
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

                console.log("Attempting to fetch...");
                const { data } = await axios.get('http://localhost:5000/api/orders/stats', config);
                console.log("Ping Response:", data);
                setStats({
                    totalRevenue: data.totalRevenue || 0,
                    orderCount: data.orderCount || 0,
                    pendingOrders: data.pendingOrders || 0,
                    userCount: data.userCount || 0, 
                    rawOrders: data.rawOrders || [] 
                });
                setLoading(false);
            } catch (error) {
                console.error("Critical Dashboard Error", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const getPerformanceAnalytics = () => {
        const analytics = (stats.rawOrders || []).reduce((acc, order) => {
            (order.orderItems || []).forEach(item => {
                const label = item.brand || (item.category && item.category.name) || 'Standard Collection';

                if (!acc[label]) {
                    acc[label] = { name: label, value: 0, units: 0 };
                }

                acc[label].value += (item.price * item.quantity);
                acc[label].units += item.quantity;
            });
            return acc;
        }, {});

        return Object.values(analytics).sort((a, b) => b.value - a.value);
    };

    const topPerformance = useMemo(() => {
        return getPerformanceAnalytics();
    }, [stats.rawOrders]);

    if (loading) return (
        <div className="p-10 font-sans text-gray-400 italic uppercase tracking-widest text-[10px] animate-pulse">
            Synchronizing Sarvoday Ledger...
        </div>
    );

    return (
        <div className="font-serif max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl tracking-widest uppercase mb-8">Executive Overview</h1>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white p-8 shadow-sm border border-gray-100 flex justify-between items-start">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-sans">Total Revenue</p>
                        {/* <p className="text-3xl font-light text-[#D4AF37]">₹{stats.totalRevenue.toLocaleString()}</p> */}
                        <p className="text-xl font-light text-green-500">
                            ₹{(stats.orderCount && stats.orderCount > 0)
                                ? (stats.totalRevenue / stats.orderCount).toLocaleString(undefined, { maximumFractionDigits: 0 })
                                : "0"}
                        </p>
                    </div>
                    <div className="bg-[#D4AF37]/10 p-3 rounded-full text-[#D4AF37]">
                        <IndianRupee size={20} />
                    </div>
                </div>

                <div className="bg-white p-8 shadow-sm border border-gray-100 flex justify-between items-start">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-sans">Registered Clients</p>
                        <p className="text-3xl font-light">{stats.userCount}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                        <Users size={20} /> 
                    </div>
                </div>

                <div className="bg-white p-8 shadow-sm border border-gray-100 flex justify-between items-start">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-sans">Active Processing</p>
                        <p className="text-3xl font-light">{stats.pendingOrders}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-full text-black">
                        <Clock size={20} />
                    </div>
                </div>
            </div>

            {/* Bottom Row: Analytics & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Enhanced Best Sellers Card */}
                <div className="bg-white p-8 shadow-sm border border-gray-100 font-sans">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-[#D4AF37]" />
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                                Top Performing Styles & Brands
                            </h3>
                        </div>
                        <span className="text-[8px] bg-gray-50 px-2 py-1 text-gray-400 uppercase tracking-widest">Market Value</span>
                    </div>

                    <div className="space-y-6">
                        {topPerformance.length > 0 ? (
                            topPerformance.slice(0, 5).map((item, index) => (
                                <div key={index} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <p className="text-[11px] font-bold text-black uppercase tracking-tight">{item.name}</p>
                                            <p className="text-[9px] text-gray-400 flex items-center gap-1">
                                                <Package size={10} /> {item.units} {item.units === 1 ? 'Unit' : 'Units'} Sold
                                            </p>
                                        </div>
                                        <p className="text-[10px] font-mono font-bold text-[#D4AF37]">
                                            ₹{item.value.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="w-full h-1 bg-gray-50 overflow-hidden">
                                        <div
                                            className="h-full bg-[#D4AF37] transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${stats.totalRevenue > 0 ? (item.value / stats.totalRevenue) * 100 : 0}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 italic">No sales data recorded in the ledger.</p>
                        )}
                    </div>
                </div>

                {/* Quick Notice Card */}
                <div className="bg-[#1a1a1a] p-8 shadow-sm flex flex-col justify-between text-white">
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-4">Operational Status</h3>
                        <p className="text-sm font-light text-gray-400 leading-relaxed font-sans mb-6">
                            The dashboard is now synchronized with your updated backend. Style and Brand attributes are being pulled directly from the historical order records.
                        </p>
                        <div className="bg-white/5 border-l-2 border-[#D4AF37] p-4">
                            <p className="text-[10px] text-gray-300 italic leading-relaxed">
                                "Ensure all <span className="text-white font-bold">{stats.pendingOrders} active shipments</span> are marked as delivered to update the final revenue reports."
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex gap-8">
                        <div>
                            <p className="text-xl font-light">{stats.orderCount}</p>
                            <p className="text-[8px] uppercase text-gray-500 tracking-widest">Total Sales</p>
                        </div>
                        <div>
                            <p className="text-xl font-light text-green-500">
                                ₹{((stats.totalRevenue / (stats.orderCount || 1))).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-[8px] uppercase text-gray-500 tracking-widest">Avg Order Value</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;