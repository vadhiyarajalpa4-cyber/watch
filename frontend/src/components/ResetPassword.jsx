import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams(); // Gets the token from the URL
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return alert("Passwords do not match");

        setLoading(true);
        try {
            // This calls the PUT route we discussed earlier
            await axios.put(`http://localhost:5000/auth/api/reset-password/${token}`, { password });
            alert("Password updated successfully!");
            navigate('/login'); // Send them back to login
        } catch (err) {
            alert(err.response?.data?.message || "Invalid or expired token");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white p-10 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-serif text-center uppercase mb-6">Set New Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">New Password</label>
                        <input 
                            type="password" 
                            className="w-full border-b py-2 outline-none focus:border-[#D4AF37]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Confirm Password</label>
                        <input 
                            type="password" 
                            className="w-full border-b py-2 outline-none focus:border-[#D4AF37]"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#1a1a1a] text-white py-4 text-[10px] font-bold uppercase hover:bg-[#D4AF37] transition-all"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;