import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Heart,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  Bell
} from 'lucide-react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';



const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { notifications, fetchNotifications, markAllAsRead } = useNotifications();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const storedUser = localStorage.getItem('userInfo');
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = userData?.user?.isAdmin || false;
  
  const accurateUnreadCount = notifications.filter(n => n.isRead === true).length;

  useEffect(() => {
    if (typeof fetchNotifications === 'function') {
      fetchNotifications();
    }
  }, [location.pathname, fetchNotifications]);

const fetchWishlistCount = useCallback(async () => {
    const token = userData?.token;
    
    if (!token || isAdmin) {
        setWishlistCount(0);
        return;
    }

    try {
        const { data } = await axios.get(`http://localhost:5000/api/admin/wishlist?t=${Date.now()}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const totalItems = Array.isArray(data) ? data.length : 0;
        
        localStorage.setItem('wishlistCount', totalItems);
        setWishlistCount(totalItems);
        
    } catch (err) {
        console.error("Navbar: Error fetching wishlist count", err);
        setWishlistCount(0);
    }
}, [userData?.token, isAdmin]);

  const fetchCartCount = useCallback(async () => {
    const token = userData?.token;
    if (!token || isAdmin) {
      setCartCount(0);
      return;
    }
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const totalItems = data.reduce((acc, item) => acc + (item.quantity || 0), 0);
      setCartCount(totalItems);
    } catch (err) {
      console.error("Error fetching cart count", err);
    }
  }, [userData?.token, isAdmin]);

  useEffect(() => {
    fetchWishlistCount();
    fetchCartCount();

    window.addEventListener('wishlistUpdate', fetchWishlistCount);
    window.addEventListener('wishlistUpdated', fetchWishlistCount);
    window.addEventListener('cartUpdate', fetchCartCount);
    window.addEventListener('cartUpdated', fetchCartCount);

    return () => {
      window.removeEventListener('wishlistUpdate', fetchWishlistCount);
      window.removeEventListener('wishlistUpdated', fetchWishlistCount);
      window.removeEventListener('cartUpdate', fetchCartCount);
      window.removeEventListener('cartUpdated', fetchCartCount);
    };
  }, [fetchWishlistCount, fetchCartCount]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload();
  };

  const handleBellClick = async () => {
    if (accurateUnreadCount > 0) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo?.token) return;

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        const targetType = isAdmin ? 'NEW_ORDER' : 'ORDER_STATUS';

        await axios.put('http://localhost:5000/api/notifications/mark-read', { type: targetType }, config);
        
        fetchNotifications();
      } catch (err) {
        console.error("Failed to clear notifications on click:", err);
      }
    }

    navigate(isAdmin ? "/admin" : "/profile");
  };

  const handleClearAndNavigate = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (accurateUnreadCount > 0) {
      await markAllAsRead();
    }

    const targetPath = isAdmin ? "/admin/orders" : "/profile";
    navigate(targetPath);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[1000] bg-white border-b border-[#D4AF37]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center">

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-800 p-2 -ml-2 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="text-xl md:text-2xl font-serif font-bold tracking-tight text-black no-underline">
            Sarvoday<span className="text-[#D4AF37] font-light">Watch</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-10 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
            <Link to="/" className="hover:text-[#D4AF37] transition no-underline">Home</Link>
            <Link to="/about" className="hover:text-[#D4AF37] transition no-underline">About Us</Link>
            <Link to="/collection" className="hover:text-[#D4AF37] transition no-underline">Collections</Link>
            <Link to="/contact" className="hover:text-[#D4AF37] transition no-underline">Contact</Link>
            {isAdmin && (
              <Link to="/admin" className="text-[#D4AF37] hover:opacity-80 transition flex items-center gap-1 no-underline">
                <LayoutDashboard size={14} /> Dashboard
              </Link>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4 md:space-x-6 text-gray-800">

            {/* --- BELL ICON CONFIGURATION --- */}
            {userData && (
              <div className="relative group">
                <button
                  onClick={handleBellClick}
                  className="relative p-1 text-inherit hover:text-[#D4AF37] transition-colors bg-transparent border-none cursor-pointer flex items-center"
                >
                  <Bell size={20} />
                  {accurateUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {accurateUnreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown on Hover */}
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-2xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 z-[1001] rounded-sm invisible group-hover:visible">
                  <div className="p-3 text-[10px] uppercase font-bold border-b tracking-widest text-gray-400">
                    Recent Notifications
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-[11px] text-gray-400 italic text-center">No notifications yet</div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n._id} className={`p-4 border-b text-[11px] leading-relaxed transition-colors ${n.isRead ? 'bg-blue-50/40' : 'hover:bg-gray-50'}`}>
                          {/* If it lights up blue when unread, make sure n.isRead is matching here too */}
                          <p className={n.isRead ? 'font-bold text-black' : 'text-gray-600'}>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div
                    onClick={(e) => handleClearAndNavigate(e)}
                    className="p-3 text-center border-t text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold cursor-pointer hover:bg-gray-50 bg-white transition-colors relative"
                    style={{ zIndex: 1010 }}
                  >
                    View All Activity
                  </div>
                </div>
              </div>
            )}

            {/* Desktop User Section */}
            <div className="hidden sm:flex items-center space-x-6 border-r border-gray-200 pr-6 mr-2 ml-2">
              {userData ? (
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span className="text-black">{userData?.user?.name?.split(' ')[0]}</span>
                  </span>
                  <button onClick={handleLogout} className="text-[10px] font-bold uppercase tracking-widest text-red-800 bg-transparent border-none cursor-pointer hover:underline">Logout</button>
                </div>
              ) : (
                <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest hover:text-[#D4AF37] no-underline">SignIn</Link>
              )}
            </div>

            {!isAdmin && (
              <>
                <Link to="/wishlist" className="relative group text-inherit">
                  <Heart size={20} className="cursor-pointer group-hover:text-[#D4AF37] transition-colors" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative group text-inherit">
                  <ShoppingCart size={20} className="cursor-pointer group-hover:text-[#D4AF37] transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="hidden md:block text-inherit">
                  <User size={20} className="cursor-pointer hover:text-[#D4AF37] transition-colors" />
                </Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin" className="text-inherit">
                <User size={20} className="text-[#D4AF37] cursor-pointer" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-black/70 z-[1001] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:hidden`}
          onClick={toggleMobileMenu}
        />

        <div className={`fixed top-0 left-0 w-[80%] h-full bg-white z-[1002] transition-transform duration-500 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden shadow-2xl`}>
          <div className="p-6 flex flex-col h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100">
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold text-[#D4AF37]">Menu</span>
              <button onClick={toggleMobileMenu} className="p-2 -mr-2">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col space-y-6">
              <Link to="/" onClick={toggleMobileMenu} className="text-xl font-serif flex justify-between items-center no-underline text-black py-2">
                Home <ChevronRight size={18} className="text-[#D4AF37]" />
              </Link>
              <Link to="/about" onClick={toggleMobileMenu} className="text-xl font-serif flex justify-between items-center no-underline text-black py-2">
                About Us <ChevronRight size={18} className="text-[#D4AF37]" />
              </Link>
              <Link to="/collection" onClick={toggleMobileMenu} className="text-xl font-serif flex justify-between items-center no-underline text-black py-2">
                Collections <ChevronRight size={18} className="text-[#D4AF37]" />
              </Link>
              {!isAdmin && (
                <Link to="/profile" onClick={toggleMobileMenu} className="text-xl font-serif flex justify-between items-center no-underline text-black py-2">
                  My Profile <ChevronRight size={18} className="text-[#D4AF37]" />
                </Link>
              )}
            </div>

            <div className="mt-auto pt-8 border-t border-gray-100">
              {userData ? (
                <div className="flex flex-col space-y-4">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">Signed in as <span className="text-black font-bold">{userData?.user?.name}</span></p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-600 py-4 rounded-lg text-[11px] font-bold uppercase tracking-widest active:bg-red-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={toggleMobileMenu}
                  className="block w-full bg-black text-white text-center py-4 rounded-lg text-[11px] font-bold uppercase tracking-widest no-underline active:bg-gray-800 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="h-20 md:h-20 w-full" />
    </>
  );
};

export default Navbar;