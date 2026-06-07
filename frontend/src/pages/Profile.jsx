import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { generateInvoice } from '../components/generateInvoice';
import {
    Package, Truck, CheckCircle, Clock, CreditCard,
    Banknote, ShieldCheck, UserRoundPen, LockKeyhole,
    MapPin, Trash2, Plus, Pencil
} from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // States for Edit and Password
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Shipping States
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressData, setAddressData] = useState({
        label: 'Home', address: '', city: '', postalCode: '', country: 'India', phone: ''
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [currentView, setCurrentView] = useState('Profile Overview');
    const USER_API_URL = 'http://localhost:5000/api/users';

    useEffect(() => {
        const fetchUserData = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) return;

            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };

                const [profileRes, ordersRes] = await Promise.all([
                    axios.get(`${USER_API_URL}/profile`, config),
                    axios.get('http://localhost:5000/api/orders/myorders', config)
                ]);
                console.log("--- PROFILE DB SNAPSHOT ---", profileRes.data);

                setUser(profileRes.data);
                setFormData({ name: profileRes.data.name, email: profileRes.data.email });
                setOrders(ordersRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.put(`${USER_API_URL}/profile`, formData, config);

            const updatedUserInfo = { ...userInfo, user: data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            setUser(data);
            setMessage({ type: 'success', text: 'Identity details updated in the vault' });
            setIsEditing(false);
            window.dispatchEvent(new Event("userUpdate"));
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            // Password change stays in AUTH API
            await axios.put('http://localhost:5000/api/auth/change-password',
                { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword },
                config
            );
            setMessage({ type: 'success', text: 'Security credentials updated successfully' });
            setIsChangingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Password update failed' });
        }
    };

    const handleEditAddressClick = (addr) => {
        setEditingAddressId(addr._id);
        setAddressData({
            label: addr.label,
            address: addr.address,
            city: addr.city,
            postalCode: addr.postalCode,
            country: addr.country || 'India',
            phone: addr.phone
        });
        setShowAddressForm(true);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            let response;
            if (editingAddressId) {
                response = await axios.put(`${USER_API_URL}/address/${editingAddressId}`, addressData, config);
                setMessage({ type: 'success', text: 'Shipping destination updated' });
            } else {
                response = await axios.post(`${USER_API_URL}/address`, addressData, config);
                setMessage({ type: 'success', text: 'New shipping destination secured' });
            }

            setUser({ ...user, addresses: response.data });

            if (userInfo && userInfo.user) {
                userInfo.user.addresses = response.data;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
            }

            resetAddressForm();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to process address' });
        }
    };

    const resetAddressForm = () => {
        setShowAddressForm(false);
        setEditingAddressId(null);
        setAddressData({ label: 'Home', address: '', city: '', postalCode: '', country: 'India', phone: '' });
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm("Remove this address from your vault?")) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.delete(`${USER_API_URL}/address/${id}`, config);
            setUser({ ...user, addresses: data });
            setMessage({ type: 'success', text: 'Address removed successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete address' });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 font-serif text-black">
            <h1 className="text-3xl font-light tracking-widest uppercase mb-12">My Account</h1>

            {message.text && (
                <div className={`mb-6 p-4 text-[10px] uppercase tracking-[0.2em] text-center border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-6 text-[10px] uppercase tracking-widest text-gray-400">
                    <p className="text-black border-b border-[#D4AF37] pb-2 mb-4">Account Navigation</p>
                    <div className="space-y-4 px-1">
                        {['Profile Overview', 'Purchase History', 'Security Settings', 'Shipping Addresses'].map((tab) => (
                            <p
                                key={tab}
                                onClick={() => setCurrentView(tab)}
                                className={`cursor-pointer transition-all duration-300 ${currentView === tab ? 'text-black font-bold border-l-2 border-[#D4AF37] pl-2' : 'hover:text-black'
                                    }`}
                            >
                                {tab}
                            </p>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-3 space-y-12">

                    {/* 1. Profile Overview View */}
                    {currentView === 'Profile Overview' && (
                        <section className="bg-gray-50/50 border border-gray-100 p-8 rounded-sm shadow-sm animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-sans font-bold">Identity Details</h2>
                                <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                                    <UserRoundPen size={14} /> {isEditing ? 'Cancel' : 'Modify'}
                                </button>
                            </div>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-sans">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-2">Full Name</label>
                                        {isEditing ? (
                                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
                                        ) : (
                                            <p className="font-medium text-lg tracking-tight text-gray-900">{user?.name || 'Guest User'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                                        {isEditing ? (
                                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
                                        ) : (
                                            <p className="font-medium text-lg tracking-tight text-gray-900">{user?.email || 'N/A'}</p>
                                        )}
                                    </div>
                                </div>
                                {isEditing && <button type="submit" className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white px-10 py-3 hover:bg-[#D4AF37] hover:text-black transition-all duration-500">Save Profile Changes</button>}
                            </form>
                        </section>
                    )}

                    {/* 2. Purchase History View */}
                    {currentView === 'Purchase History' && (
                        <section className="animate-in fade-in duration-500">
                            <div className="flex justify-between items-end mb-8">
                                <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-sans font-bold">Recent Acquisitions</h2>
                                <span className="text-[10px] text-gray-400 font-sans">{orders.length} TOTAL ORDERS</span>
                            </div>

                            {loading ? (
                                <p className="text-sm text-gray-400 italic">Curating your purchase history...</p>
                            ) : orders.length === 0 ? (
                                <div className="border border-dashed border-gray-200 p-20 text-center rounded-sm">
                                    <Package className="mx-auto text-gray-200 mb-4" size={40} strokeWidth={1} />
                                    <p className="text-sm text-gray-400 uppercase tracking-widest italic">Your vault is currently empty.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                                <th className="py-5 px-2">Order Details</th>
                                                <th className="py-5 px-2">Status</th>
                                                <th className="py-5 px-2">Payment</th>
                                                <th className="py-5 px-2 text-right">Management</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {orders.map((order) => (
                                                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                                                    <td className="py-6 px-2">
                                                        <p className="font-mono text-xs font-bold">#{order._id.slice(-8).toUpperCase()}</p>
                                                        <p className="text-[10px] text-gray-400 uppercase">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
                                                        <p className="mt-2 text-xs font-bold text-[#D4AF37]">₹{order.totalPrice.toLocaleString()}</p>
                                                    </td>
                                                    <td className="py-6 px-2">
                                                        <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest">
                                                            {order.isDelivered ? <><CheckCircle size={14} className="text-green-600" /> Delivered</> : order.isShipped ? <><Truck size={14} className="text-blue-500" /> In Transit</> : <><Clock size={14} className="text-[#D4AF37]" /> Processing</>}
                                                        </div>
                                                    </td>
                                                    <td className="py-6 px-2">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-gray-700">
                                                                {order.paymentMethod === 'Online' ? <CreditCard size={12} /> : <Banknote size={12} />} {order.paymentMethod}
                                                            </div>
                                                            <span className={`text-[9px] uppercase font-bold ${order.isPaid ? 'text-green-600' : 'text-red-400'}`}>{order.isPaid ? 'Confirmed' : 'Awaited'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-6 px-2 text-right">
                                                        <button onClick={() => generateInvoice(order)} className="text-[9px] font-bold uppercase tracking-widest border border-black/10 px-5 py-2.5 hover:bg-black hover:text-white transition-all duration-500">Receipt</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Vault Security */}
                    <section className="bg-gray-50/50 border border-gray-100 p-8 rounded-sm shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-sans font-bold">Vault Security</h2>
                            <button onClick={() => setIsChangingPassword(true)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                                <LockKeyhole size={14} /> Change Password
                            </button>
                        </div>
                        {isChangingPassword && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] p-4">
                                <div className="bg-white p-10 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border-b pb-4">Update Security Credentials</h3>
                                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                                        <input type="password" placeholder="Current Password" className="w-full bg-transparent border-b py-2 text-sm focus:outline-none focus:border-[#D4AF37]" onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
                                        <input type="password" placeholder="New Password" className="w-full bg-transparent border-b py-2 text-sm focus:outline-none focus:border-[#D4AF37]" onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
                                        <input type="password" placeholder="Confirm Password" className="w-full bg-transparent border-b py-2 text-sm focus:outline-none focus:border-[#D4AF37]" onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                                        <div className="flex gap-4 pt-4">
                                            <button type="button" onClick={() => setIsChangingPassword(false)} className="w-full border py-3 text-[9px] uppercase tracking-widest hover:bg-gray-50">Cancel</button>
                                            <button type="submit" className="w-full bg-black text-white py-3 text-[9px] uppercase tracking-widest">Update</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Default State */}
                        <div className="flex items-center gap-4 text-gray-400 italic text-sm">
                            <ShieldCheck size={20} className="text-[#D4AF37]" />
                            <p>Your account is protected with encrypted credentials.</p>
                        </div>
                    </section>

                    {/* Shipping Vault Section */}
                    <section className="bg-gray-50/50 border border-gray-100 p-8 rounded-sm shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-sans font-bold">Shipping Vault</h2>
                            <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold hover:opacity-80">
                                <Plus size={14} /> Add New Address
                            </button>
                        </div>

                        {showAddressForm && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                                {/* Modal Box */}
                                <div className="bg-white p-8 w-full max-w-2xl rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">

                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">
                                            {editingAddressId ? 'Update Destination' : 'Add New Destination'}
                                        </h3>
                                        <button onClick={() => setShowAddressForm(false)} className="text-gray-400 hover:text-black">✕</button>
                                    </div>

                                    {/* Your Original Form */}
                                    <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3 font-bold">Save Destination As</label>
                                            <div className="flex gap-3 mb-2">
                                                {['Home', 'Office', 'Other'].map((type) => (
                                                    <button key={type} type="button" onClick={() => setAddressData({ ...addressData, label: type })} className={`px-6 py-2 text-[10px] uppercase tracking-widest border transition-all ${addressData.label === type ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400'}`}>
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                            {addressData.label === 'Other' && (
                                                <input type="text" placeholder="e.g. Parents' House" value={addressData.label === 'Other' ? '' : addressData.label} className="w-full border-b py-2 text-sm focus:outline-none focus:border-black mt-2" onChange={(e) => setAddressData({ ...addressData, label: e.target.value })} />
                                            )}
                                        </div>

                                        <input type="text" placeholder="Phone Number" value={addressData.phone} className="border-b py-2 text-sm focus:outline-none focus:border-black" onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })} required />
                                        <input type="text" placeholder="Full Address" value={addressData.address} className="border-b py-2 text-sm focus:outline-none focus:border-black sm:col-span-2" onChange={(e) => setAddressData({ ...addressData, address: e.target.value })} required />
                                        <input type="text" placeholder="City" value={addressData.city} className="border-b py-2 text-sm focus:outline-none focus:border-black" onChange={(e) => setAddressData({ ...addressData, city: e.target.value })} required />
                                        <input type="text" placeholder="Postal Code" value={addressData.postalCode} className="border-b py-2 text-sm focus:outline-none focus:border-black" onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })} required />

                                        <button type="submit" className="sm:col-span-2 bg-black text-white py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all">
                                            {editingAddressId ? 'Update Address Details' : 'Secure New Address'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {user?.addresses?.map((addr) => (
                                <div key={addr._id} className="group relative border border-gray-100 bg-white p-5 hover:border-black transition-all duration-500">
                                    <div className="absolute top-4 right-4 flex gap-3">
                                        <button onClick={() => handleEditAddressClick(addr)} className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => handleDeleteAddress(addr._id)} className="text-gray-300 hover:text-red-600 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <MapPin size={12} className="text-[#D4AF37]" />
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-black">{addr.label}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed">{addr.address}</p>
                                    <p className="text-xs text-gray-400 mt-1">{addr.city}, {addr.postalCode}</p>
                                    <p className="text-[10px] text-gray-400 mt-3 font-mono">{addr.phone}</p>
                                </div>
                            ))}
                            {(!user?.addresses || user.addresses.length === 0) && !showAddressForm && (
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest italic col-span-2 py-4">No saved delivery locations.</p>
                            )}
                        </div>
                    </section>
                    {/* Recent Acquisitions */}
                    <section>
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-sans font-bold">Recent Acquisitions</h2>
                            <span className="text-[10px] text-gray-400 font-sans">{orders.length} TOTAL ORDERS</span>
                        </div>

                        {loading ? (
                            <p className="text-sm text-gray-400 italic">Curating your purchase history...</p>
                        ) : orders.length === 0 ? (
                            <div className="border border-dashed border-gray-200 p-20 text-center rounded-sm">
                                <Package className="mx-auto text-gray-200 mb-4" size={40} strokeWidth={1} />
                                <p className="text-sm text-gray-400 uppercase tracking-widest italic">Your vault is currently empty.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                            <th className="py-5 px-2">Order Details</th>
                                            <th className="py-5 px-2">Status</th>
                                            <th className="py-5 px-2">Payment</th>
                                            <th className="py-5 px-2 text-right">Management</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {orders.map((order) => (
                                            <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                                                <td className="py-6 px-2">
                                                    <p className="font-mono text-xs font-bold">#{order._id.slice(-8).toUpperCase()}</p>
                                                    <p className="text-[10px] text-gray-400 uppercase">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
                                                    <p className="mt-2 text-xs font-bold text-[#D4AF37]">₹{order.totalPrice.toLocaleString()}</p>
                                                </td>
                                                <td className="py-6 px-2">
                                                    <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest">
                                                        {order.isDelivered ? <><CheckCircle size={14} className="text-green-600" /> Delivered</> : order.isShipped ? <><Truck size={14} className="text-blue-500" /> In Transit</> : <><Clock size={14} className="text-[#D4AF37]" /> Processing</>}
                                                    </div>
                                                </td>
                                                <td className="py-6 px-2">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-gray-700">
                                                            {order.paymentMethod === 'Online' ? <CreditCard size={12} /> : <Banknote size={12} />} {order.paymentMethod}
                                                        </div>
                                                        <span className={`text-[9px] uppercase font-bold ${order.isPaid ? 'text-green-600' : 'text-red-400'}`}>{order.isPaid ? 'Confirmed' : 'Awaited'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-2 text-right">
                                                    <button onClick={() => generateInvoice(order)} className="text-[9px] font-bold uppercase tracking-widest border border-black/10 px-5 py-2.5 hover:bg-black hover:text-white transition-all duration-500">Receipt</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div >
    );
};

export default Profile;
