import React, { useState, useEffect } from 'react';
import API from '../../api/axios';

const ManageCategories = () => {
    const [name, setName] = useState('');
    const [subCategories, setSubCategories] = useState('');
    const [categories, setCategories] = useState([]);

    // --- EDIT STATES ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ id: '', name: '', subCategories: '' });

    const fetchCategories = async () => {
        try {
            const { data } = await API.get('/api/admin/category');
            if (Array.isArray(data)) {
                setCategories(data);
            } else if (data && Array.isArray(data.categories)) {
                setCategories(data.categories);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
            setCategories([]); 
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const getAuthConfig = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return { headers: { Authorization: `Bearer ${userInfo.token}` } };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const subsArray = subCategories.split(',').map(s => s.trim()).filter(s => s !== "");
            await API.post('/api/admin/category', { name, subCategories: subsArray }, getAuthConfig());
            alert("Category Added!");
            setName('');
            setSubCategories('');
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add category");
        }
    };

    // --- OPEN EDIT MODAL ---
    const openEditModal = (cat) => {
        setEditData({
            id: cat._id,
            name: cat.name,
            subCategories: cat.subCategories.join(', ') // Convert array back to comma string for input
        });
        setIsEditModalOpen(true);
    };

    // --- HANDLE UPDATE ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const subsArray = editData.subCategories.split(',').map(s => s.trim()).filter(s => s !== "");
            await API.put(`/api/admin/category/${editData.id}`, { 
                name: editData.name, 
                subCategories: subsArray 
            }, getAuthConfig());
            
            alert("Category Updated!");
            setIsEditModalOpen(false);
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || "Update failed");
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure? This will affect products linked to this category.")) {
            try {
                await API.delete(`/api/admin/category/${id}`, getAuthConfig());
                fetchCategories();
            } catch (err) {
                alert("Error deleting category");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-8">Manage Collections</h1>
            
            {/* Form to Add Category */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-10 border-t-4 border-[#D4AF37]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Main Category</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Men, Women" 
                            className="border p-2 rounded focus:outline-[#D4AF37]"
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Styles (Comma separated)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Analog, Digital" 
                            className="border p-2 rounded focus:outline-[#D4AF37]"
                            value={subCategories} 
                            onChange={(e) => setSubCategories(e.target.value)} 
                            required 
                        />
                    </div>
                </div>
                <button type="submit" className="bg-[#1a1a1a] text-[#D4AF37] px-6 py-2 rounded font-bold hover:bg-black transition-all">
                    Create Category
                </button>
            </form>

            {/* List of Categories */}
            <h3 className="text-xl font-bold text-gray-700 mb-4">Current Inventory Groups</h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Name</th>
                            <th className="p-4 font-semibold text-gray-600">Sub-Styles</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.length > 0 ? (
                            categories.map(cat => (
                                <tr key={cat._id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-800">{cat.name}</td>
                                    <td className="p-4 text-gray-600 text-sm italic">
                                        {cat.subCategories?.join(', ')}
                                    </td>
                                    <td className="p-4 text-right space-x-4">
                                        <button 
                                            onClick={() => openEditModal(cat)}
                                            className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteHandler(cat._id)}
                                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="p-10 text-center text-gray-400">
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- EDIT MODAL --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Edit Category</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-gray-500 mb-1">Category Name</label>
                                <input 
                                    type="text" 
                                    className="border p-2 rounded w-full" 
                                    value={editData.name} 
                                    onChange={(e) => setEditData({...editData, name: e.target.value})} 
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-gray-500 mb-1">Styles (Comma separated)</label>
                                <textarea 
                                    className="border p-2 rounded w-full h-24" 
                                    value={editData.subCategories} 
                                    onChange={(e) => setEditData({...editData, subCategories: e.target.value})} 
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
                                    Save Changes
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditModalOpen(false)} 
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-bold hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;