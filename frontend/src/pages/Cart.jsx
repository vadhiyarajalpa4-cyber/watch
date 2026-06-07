// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';

// const Cart = () => {
//     const [cartItems, setCartItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     const userInfo = localStorage.getItem('userInfo');
//     const token = userInfo ? JSON.parse(userInfo).token : null;

//     // Use useCallback for fetchCart so it's stable across renders
//     const fetchCart = useCallback(async () => {
//         if (!token) return navigate('/login');

//         try {
//             setLoading(true);
//             const { data } = await axios.get('http://localhost:5000/api/admin/cart', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             // LOGIC FIX: Your backend returns 'cart.items'. 
//             // Ensure we handle both an array or an object response.
//             const items = Array.isArray(data) ? data : (data.items || []);

//             // Filter out items where the product might have been deleted from the DB
//             const validItems = items.filter(item => item && item.product);

//             setCartItems(validItems);
//         } catch (err) {
//             console.error("Error fetching cart:", err);
//             // If 404, the cart simply doesn't exist yet, which is fine
//             if (err.response?.status === 404) setCartItems([]);
//         } finally {
//             setLoading(false);
//         }
//     }, [token, navigate]);

//     useEffect(() => {
//         fetchCart();
//     }, [fetchCart]);

//     const updateQuantity = async (productId, newQty) => {
//         if (newQty < 1) return;
//         try {
//             // Optimistic Update: Update UI first for zero-lag luxury feel
//             const previousItems = [...cartItems];
//             setCartItems(prev => prev.map(item =>
//                 item.product?._id === productId ? { ...item, quantity: newQty } : item
//             ));

//             await axios.put('http://localhost:5000/api/admin/cart/update',
//                 { productId, quantity: newQty },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             window.dispatchEvent(new Event('cartUpdate'));
//         } catch (err) {
//             console.error("Update failed:", err);
//             fetchCart(); // Rollback to server state if API fails
//         }
//     };

//     const removeItem = async (productId) => {
//         try {
//             await axios.delete(`http://localhost:5000/api/admin/cart/remove/${productId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             setCartItems(prev => prev.filter(item => item.product?._id !== productId));
//             window.dispatchEvent(new Event('cartUpdate'));
//         } catch (err) {
//             console.error("Removal failed:", err);
//         }
//     };

//     // Safe Subtotal Calculation
//     const subtotal = cartItems.reduce((acc, item) => {
//         const price = Number(item.product?.price) || 0;
//         const qty = Number(item.quantity) || 0;
//         return acc + (price * qty);
//     }, 0);

//     if (loading) return (
//         <div className="pt-32 flex justify-center items-center min-h-screen">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37]"></div>
//         </div>
//     );

//     return (
//         <div className="max-w-7xl mx-auto p-6 pt-40 min-h-screen font-serif bg-white">
//             <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-center mb-16 text-gray-900">Your Boutique Bag</h1>

//             {cartItems.length === 0 ? (
//                 <div className="text-center py-24 border-t border-gray-100">
//                     <p className="text-gray-400 italic mb-8 text-lg">Your bag is currently empty.</p>
//                     <button
//                         onClick={() => navigate('/collection')}
//                         className="px-10 py-4 bg-black text-white text-[10px] uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all duration-700 shadow-xl"
//                     >
//                         Explore Collections
//                     </button>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
//                     {/* Items List */}
//                     <div className="lg:col-span-2 space-y-10">
//                         {cartItems.map((item) => (
//                             <div key={item.product?._id || Math.random()} className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-gray-50 group transition-all">
//                                 {/* Image Container */}
//                                 <div className="w-full sm:w-52 aspect-square bg-[#fdfdfd] border border-gray-50 p-6 flex items-center justify-center overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-500">
//                                     <img
//                                         src={`http://localhost:5000${item.product?.image}`}
//                                         alt={item.product?.name}
//                                         className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000"
//                                     />
//                                 </div>

//                                 {/* Details Container */}
//                                 <div className="flex-1 flex flex-col justify-between py-1">
//                                     <div className="flex justify-between items-start">
//                                         <div>
//                                             <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-3 font-semibold">
//                                                 {item.product?.brand || 'Premium Selection'}
//                                             </p>
//                                             <h3 className="text-2xl uppercase tracking-widest text-gray-900 font-light leading-tight">
//                                                 {item.product?.name}
//                                             </h3>
//                                         </div>
//                                         <button
//                                             onClick={() => removeItem(item.product?._id)}
//                                             className="text-gray-300 hover:text-red-900 transition-colors p-2"
//                                             title="Remove Item"
//                                         >
//                                             <Trash2 size={18} strokeWidth={1} />
//                                         </button>
//                                     </div>

//                                     <div className="flex justify-between items-end mt-12">
//                                         {/* Quantity Selector */}
//                                         <div className="flex items-center border border-gray-100 bg-white">
//                                             <button
//                                                 onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
//                                                 className="p-4 hover:bg-gray-50 transition-colors disabled:opacity-30"
//                                                 disabled={item.quantity <= 1}
//                                             >
//                                                 <Minus size={12} />
//                                             </button>
//                                             <span className="px-6 text-xs font-sans tracking-widest font-bold">{item.quantity}</span>
//                                             <button
//                                                 onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
//                                                 className="p-4 hover:bg-gray-50 transition-colors"
//                                             >
//                                                 <Plus size={12} />
//                                             </button>
//                                         </div>

//                                         {/* Item Total */}
//                                         <div className="text-right">
//                                             <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] mb-2 font-bold">Line Total</p>
//                                             <p className="text-2xl font-light text-gray-900">
//                                                 ₹{(Number(item.product?.price || 0) * item.quantity).toLocaleString()}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Order Summary */}
//                     <div className="lg:col-span-1">
//                         <div className="bg-[#fcfcfc] p-12 border border-gray-50 sticky top-40 shadow-sm">
//                             <h2 className="text-[11px] uppercase tracking-[0.4em] font-black mb-12 pb-5 border-b border-gray-200 text-gray-900">
//                                 Order Summary
//                             </h2>

//                             <div className="space-y-8 mb-12 text-[13px] tracking-wide">
//                                 <div className="flex justify-between text-gray-400 italic">
//                                     <span>Subtotal</span>
//                                     <span className="text-gray-900 not-italic font-medium">₹{subtotal.toLocaleString()}</span>
//                                 </div>
//                                 <div className="flex justify-between text-gray-400 italic">
//                                     <span>Insured Delivery</span>
//                                     <span className="uppercase text-[10px] tracking-[0.2em] text-green-700 font-bold not-italic">Complimentary</span>
//                                 </div>
//                                 <div className="pt-8 border-t border-gray-200 flex justify-between items-center">
//                                     <span className="text-sm uppercase tracking-[0.3em] text-gray-900 font-bold">Total</span>
//                                     <span className="text-3xl font-light text-[#D4AF37]">₹{subtotal.toLocaleString()}</span>
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={() => navigate('/checkout')} // 🚨 Add this
//                                 className="w-full bg-black text-white py-6 text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-[#D4AF37] transition-all duration-500 group shadow-2xl active:scale-[0.98]"
//                             >
//                                 Checkout Securely
//                                 <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
//                             </button>

//                             <div className="mt-10 pt-6 border-t border-gray-50 space-y-4">
//                                 <p className="text-[9px] text-gray-400 text-center uppercase tracking-[0.25em] leading-relaxed">
//                                     White Glove Service • Concierge Support
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Cart;


import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';

const resolveImagePath = (imgSrc) => {
    if (!imgSrc) return "https://via.placeholder.com/600x600.png?text=No+Image";
    if (imgSrc.startsWith('http')) return imgSrc;
    return `http://localhost:5000${imgSrc.startsWith('/') ? imgSrc : `/${imgSrc}`}`;
};

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userInfo = localStorage.getItem('userInfo');
    const token = userInfo ? JSON.parse(userInfo).token : null;

    const fetchCart = useCallback(async () => {
        if (!token) return navigate('/login');
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:5000/api/admin/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const items = Array.isArray(data) ? data : (data.items || []);
            setCartItems(items.filter(item => item && item.product));
        } catch (err) {
            console.error("Error fetching cart:", err);
            if (err.response?.status === 404) setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, [token, navigate]);

    useEffect(() => { fetchCart(); }, [fetchCart]);

    // Change these two functions in your Cart.js:

    const updateQuantity = async (variantKey, newQty) => {
        // If the key is missing, try falling back to the _id
        const idToUse = variantKey || item._id;

        if (!idToUse || newQty < 1) return;

        try {
            await axios.put('http://localhost:5000/api/admin/cart/update',
                { variantKey: idToUse, quantity: newQty },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCart(); // Refresh to ensure state matches DB
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    const removeItem = async (variantKey) => {
        // 1. Validation
        if (!variantKey) return;

        try {
            // 2. Correct URL: Ensure variantKey is defined
            await axios.delete(`http://localhost:5000/api/admin/cart/remove/${variantKey}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCartItems(prev => prev.filter(item => item.variantKey !== variantKey));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            console.error("Removal failed:", err.response?.data || err.message);
        }
    };

    // Use embedded variant price or product default
    // const getPrice = (item) => Number(item.variantDetails?.price || item.product?.price || 0);
    const getPrice = (item) => {
        // Priority: 1. Item price 2. Product price 3. Fallback to 0
        const price = item.price || item.product?.price || 0;
        return Number(price);
    };

    // const subtotal = cartItems.reduce((acc, item) => acc + (getPrice(item) * item.quantity), 0);
    const subtotal = cartItems.reduce((acc, item) => {
        const price = Number(item.price) || 0; // Using the price stored in your DB
        const qty = Number(item.quantity) || 0;
        return acc + (price * qty);
    }, 0);

    const shippingFee = subtotal >= 5000 ? 0 : 150;
    const total = subtotal + shippingFee;
    const amountNeededForFreeShipping = 5000 - subtotal;

    if (loading) return (
        <div className="pt-32 flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37]"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6 pt-40 min-h-screen font-serif bg-white">
            <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-center mb-16 text-gray-900">Your Boutique Bag</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-24 border-t border-gray-100">
                    <p className="text-gray-400 italic mb-8 text-lg">Your bag is currently empty.</p>
                    <button onClick={() => navigate('/collection')} className="px-10 py-4 bg-black text-white text-[10px] uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all duration-700 shadow-xl">
                        Explore Collections
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-10">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-gray-50 group">
                                <div className="w-full sm:w-52 aspect-square bg-[#fdfdfd] border border-gray-50 p-6 flex items-center justify-center overflow-hidden shadow-sm">
                                    <img
                                        // Use item.image directly since it is saved in your DB
                                        src={resolveImagePath(item.image || item.product?.image)}
                                        alt={item.product?.name}
                                        className="h-full w-full object-contain mix-blend-multiply"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="text-2xl uppercase tracking-widest text-gray-900 font-light">{item.product?.name}</h3>
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mt-2 font-semibold">
                                            {/* Use item.color directly */}
                                            Color: {item.color || 'Standard'}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-end mt-12">
                                        <div className="flex items-center border border-gray-100 bg-white">
                                            <button onClick={() => updateQuantity(item.variantKey, item.quantity - 1)} className="p-4 hover:bg-gray-50" disabled={item.quantity <= 1}><Minus size={12} /></button>
                                            <span className="px-6 text-xs font-sans font-bold">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.variantKey, item.quantity + 1)} className="p-4 hover:bg-gray-50"><Plus size={12} /></button>
                                        </div>
                                        <div className="text-right">
                                            {/* Use item.price directly */}
                                            <p className="text-2xl font-light text-gray-900">₹{(Number(item.price) * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => removeItem(item.variantKey)} className="text-gray-300 hover:text-red-900 self-start mt-2">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-[#fcfcfc] p-12 border border-gray-50 sticky top-40 shadow-sm">
                            <h2 className="text-[11px] uppercase tracking-[0.4em] font-black mb-12 pb-5 border-b border-gray-200">Order Summary</h2>
                            <div className="space-y-8 mb-12 text-[13px]">
                                {/* Subtotal */}
                                <div className="flex justify-between text-gray-400 italic">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 not-italic font-medium">₹{subtotal.toLocaleString()}</span>
                                </div>

                                {/* Shipping Fee */}
                                <div className="flex justify-between text-gray-400 italic">
                                    <span>Shipping Fee</span>
                                    <span className="text-gray-900 not-italic font-medium">
                                        {shippingFee === 0 ? "FREE" : `₹${shippingFee.toLocaleString()}`}
                                    </span>
                                </div>

                                {/* Final Total */}
                                <div className="pt-8 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-sm uppercase tracking-[0.3em] font-bold">Total</span>
                                    <span className="text-3xl font-light text-[#D4AF37]">₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                            {subtotal > 0 && subtotal < 5000 && (
                                <div className="mb-6 p-4 bg-[#fdfaf0] border border-[#d4af37] text-center">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-700">
                                        Add <span className="font-bold">₹{amountNeededForFreeShipping.toLocaleString()}</span> more to get free shipping!
                                    </p>
                                </div>
                            )}

                            <button onClick={() => navigate('/checkout')} className="w-full bg-black text-white py-6 text-[10px] uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-4">
                                Checkout Securely <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;