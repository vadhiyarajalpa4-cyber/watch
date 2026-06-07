import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, ShieldCheck, User as UserIcon, Loader, Trash2 } from 'lucide-react';


const UserListScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            const { data } = await axios.get(`http://localhost:5000/api/users?page=${page}&limit=10`, config);

            setUsers(data.users);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load users", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure you want to remove this client? This action cannot be undone.")) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };

                await axios.delete(`http://localhost:5000/api/users/${id}`, config);

                if (users.length === 1 && currentPage > 1) {
                    fetchUsers(currentPage - 1);
                } else {
                    fetchUsers(currentPage);
                }

            } catch (error) {
                alert(error.response?.data?.message || "Failed to delete user");
            }
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader className="animate-spin text-[#D4AF37]" /></div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-serif mb-8 tracking-widest uppercase border-b pb-4">
                Client Directory
            </h1>

            <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr className="text-[10px] uppercase tracking-widest text-gray-400">
                            <th className="p-4">Customer ID</th>
                            <th className="p-4">Full Name</th>
                            <th className="p-4">Email Address</th>
                            <th className="p-4">Joined Date</th>
                            <th className="p-4">Access Level</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 font-mono text-[10px] text-gray-400">{user._id}</td>
                                <td className="p-4 text-sm font-medium text-gray-800">{user.name}</td>
                                <td className="p-4 text-sm text-gray-600 flex items-center gap-2">
                                    <Mail size={14} className="text-[#D4AF37]" /> {user.email}
                                </td>
                                <td className="p-4 text-[11px] text-gray-500 font-sans">
                                    {user.createdAt ? (
                                        new Date(user.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })
                                    ) : (
                                        new Date(parseInt(user._id.substring(0, 8), 16) * 1000).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })
                                    )}
                                </td>
                                <td className="p-4">
                                    {user.isAdmin ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-full">
                                            <ShieldCheck size={10} /> MASTER ADMIN
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            <UserIcon size={10} /> REGISTERED CLIENT
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    {!user.isAdmin && (
                                        <button
                                            onClick={() => deleteHandler(user._id)}
                                            className="text-gray-300 hover:text-red-600 transition-colors p-2"
                                            title="Delete User"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-6 mt-8 font-sans">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => fetchUsers(currentPage - 1)}
                            className="px-4 py-2 border text-[10px] uppercase tracking-widest disabled:opacity-20 hover:border-black transition-all"
                        >
                            Previous
                        </button>
                        <span className="text-[10px] uppercase tracking-widest text-gray-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => fetchUsers(currentPage + 1)}
                            className="px-4 py-2 border text-[10px] uppercase tracking-widest disabled:opacity-20 hover:border-black transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserListScreen;