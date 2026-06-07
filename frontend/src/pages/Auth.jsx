import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // New state
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // New success message state
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const validateForm = () => {
    const { name, email, password } = formData;

    // Email validation (needed for all modes)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Skip other checks if only doing Forgot Password
    if (isForgotPassword) return true;

    if (!isLogin && name.trim().length < 3) {
      setError("Name must be at least 3 characters long");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;
    setLoading(true);

    try {
      if (isForgotPassword) {
        // --- FORGOT PASSWORD LOGIC ---
        await axios.post(`http://localhost:5000/auth/api/forgot-password`, { email: formData.email });
        setSuccess("Reset link sent! Please check your email.");
        setLoading(false);
      } else {
        // --- LOGIN / REGISTER LOGIC ---
        const endpoint = isLogin ? '/login' : '/register';
        const { data } = await axios.post(`http://localhost:5000/auth/api${endpoint}`, formData);

        if (isLogin) {
          localStorage.setItem('userInfo', JSON.stringify(data));
          if (data.token) localStorage.setItem('token', data.token);
          alert("Login Successful!");
          navigate('/');
          window.location.reload(); 
        } else {
          alert("Registration Successful! Please login.");
          setLoading(false);
          setIsLogin(true); 
          setFormData({ name: '', email: '', password: '' });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-12 px-6">
      <div className="max-w-md w-full bg-white shadow-sm border border-gray-100 p-10">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif mb-2 uppercase tracking-tight">
            {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}
          </h2>
          <div className="w-12 h-[2px] bg-[#D4AF37] mx-auto mb-4"></div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-4">
               <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-2 mb-4">
               <p className="text-green-600 text-[10px] font-bold uppercase tracking-widest">{success}</p>
            </div>
          )}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Show Name only during Registration */}
          {!isLogin && !isForgotPassword && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 border-b border-gray-200 px-0 py-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={loading}
              />
            </div>
          )}

          {/* Email is always shown */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-gray-50 border-b border-gray-200 px-0 py-3 text-sm focus:outline-none focus:border-[#D4AF37]"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={loading}
            />
          </div>

          {/* Password hidden during Forgot Password mode */}
          {!isForgotPassword && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Password</label>
                {isLogin && (
                  <button 
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(''); setSuccess(''); }}
                    className="text-[9px] uppercase tracking-tighter text-[#D4AF37] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input 
                type="password" 
                className="w-full bg-gray-50 border-b border-gray-200 px-0 py-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                disabled={loading}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 mt-4 flex items-center justify-center
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1a1a1a] text-white hover:bg-[#D4AF37] hover:text-black'}`}
          >
            {loading ? 'Processing...' : (isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Register'))}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          {isForgotPassword ? (
            <button 
              onClick={() => { setIsForgotPassword(false); setIsLogin(true); setError(''); setSuccess(''); }}
              className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#D4AF37]"
            >
              Back to Login
            </button>
          ) : (
            <button 
              disabled={loading}
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }} 
              className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#D4AF37]"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;