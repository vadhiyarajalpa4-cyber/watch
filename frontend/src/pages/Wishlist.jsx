// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Wishlist = () => {
//     const [wishlistItems, setWishlistItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     const fetchWishlist = async () => {
//         const userInfo = localStorage.getItem('userInfo');
//         const token = userInfo ? JSON.parse(userInfo).token : null;

//         if (!token) {
//             navigate('/login');
//             return;
//         }

//         try {
//             setLoading(true);
//             const { data } = await axios.get('http://localhost:5000/api/admin/wishlist', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             console.log("DEBUG: API Response Data:", data); // Check this in the Browser Console
//             // data is expected to be an array of wishlist documents
//             setWishlistItems(data);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error fetching wishlist:", err);
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchWishlist();
//     }, []);

// // Update your removeFromWishlist function one last time with this structure
// const removeFromWishlist = async (e, productId, variantIndex) => {
//     e.stopPropagation();
//     e.preventDefault();
    
//     const userInfo = localStorage.getItem('userInfo');
//     const token = userInfo ? JSON.parse(userInfo).token : null;

//     try {
//         await axios.post('http://localhost:5000/api/admin/wishlist/toggle',
//             { productId, variantIndex },
//             { headers: { Authorization: `Bearer ${token}` } }
//         );

//         // State update is now simple because wishlistItems is a flat array
//         setWishlistItems(prev => prev.filter(i => 
//             !(i.product?._id === productId && i.variantIndex === variantIndex)
//         ));

//         window.dispatchEvent(new Event('wishlistUpdate'));
//     } catch (err) {
//         console.error("Error removing item:", err);
//     }
// };

//     // const removeFromWishlist = async (e, productId, variantIndex) => {
//     //     e.stopPropagation();
//     //     e.preventDefault();
//     //     const userInfo = localStorage.getItem('userInfo');
//     //     const token = userInfo ? JSON.parse(userInfo).token : null;

//     //     try {
//     //         await axios.post('http://localhost:5000/api/admin/wishlist/toggle',
//     //             {
//     //                 productId: productId,
//     //                 variantIndex: variantIndex
//     //             },
//     //             { headers: { Authorization: `Bearer ${token}` } }
//     //         );

//     //         // 1. Update local UI state
//     //         setWishlistItems(prev => prev.map(entry => ({
//     //             ...entry,
//     //             items: entry.items.filter(i =>
//     //                 !(i.product?._id === productId && i.variantIndex === variantIndex)
//     //             )
//     //         })).filter(entry => entry.items.length > 0));

//     //         // 2. IMPORTANT: Force a global refresh for the Navbar
//     //         localStorage.setItem('wishlistCount', totalItems);
//     //         window.dispatchEvent(new Event('wishlistUpdate'));
//     //     } catch (err) {
//     //         console.error("Error removing item:", err);
//     //     }
//     // };

//     if (loading) return (
//         <div className="pt-32 flex justify-center items-center min-h-screen">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37]"></div>
//         </div>
//     );

//     return (
//         <div className="max-w-7xl mx-auto p-6 pt-40 min-h-screen font-serif">
//             <div className="text-center mb-16">
//                 <h1 className="text-4xl font-light tracking-[0.2em] uppercase text-gray-900 mb-4">My Wishlist</h1>
//                 <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
//             </div>

//             {wishlistItems.length === 0 || wishlistItems.every(entry => entry.items.length === 0) ? (
//                 <div className="text-center py-20">
//                     <p className="text-gray-400 italic mb-8">Your wishlist is currently empty.</p>
//                     <button
//                         onClick={() => navigate('/collection')}
//                         className="px-8 py-4 bg-black text-white uppercase tracking-widest text-xs hover:bg-[#D4AF37] transition-colors"
//                     >
//                         Explore Collection
//                     </button>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
//                     {wishlistItems.flatMap(entry => entry.items || []).map((item) => {
//                         console.log("Full Item object:", item);
//                         return (
//                             <div
//                                 key={`${item.product?._id}-${item.variantIndex}`} // Unique key per variant
//                                 className="group cursor-pointer relative"
//                                 onClick={() => navigate(`/products/${item.product?._id}`)}
//                             >
//                                 {/* Heart Button */}
//                                 <button
//                                     onClick={(e) => removeFromWishlist(e, item.product?._id, item.variantIndex)}
//                                     className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full shadow-sm hover:bg-red-50 transition-colors group/btn"
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="h-5 w-5 text-red-500 fill-current group-hover/btn:scale-110 transition-transform pointer-events-none"
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
//                                     </svg>
//                                 </button>

//                                 <div className="relative aspect-square bg-[#fdfdfd] mb-6 overflow-hidden flex items-center justify-center p-8 border border-gray-50 group-hover:shadow-md transition-all">
//                                     <img
//                                         src={
//                                             item.product?.variants && item.product.variants[item.variantIndex]?.image
//                                                 ? `http://localhost:5000${item.product.variants[item.variantIndex].image}`
//                                                 : (item.product?.variants?.[0]?.image ? `http://localhost:5000${item.product.variants[0].image}` : '')
//                                         }
//                                         alt={item.product?.name || 'Product'}
//                                         className="h-full w-full object-contain mix-blend-multiply"
//                                     />
//                                 </div>

//                                 <div className="text-center">
//                                     <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">{item.product?.brand || 'Luxury'}</p>
//                                     <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-2">{item.product?.name || 'Loading...'}</h4>
//                                     <span className="text-lg font-light text-[#D4AF37]">
//                                         ₹{
//                                             item.product?.variants && item.product.variants[item.variantIndex]
//                                                 ? item.product.variants[item.variantIndex].discountPrice?.toLocaleString()
//                                                 : (item.product?.variants?.[0]?.discountPrice?.toLocaleString() || '0')
//                                         }
//                                     </span>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Wishlist;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchWishlist = async () => {
        const userInfo = localStorage.getItem('userInfo');
        const token = userInfo ? JSON.parse(userInfo).token : null;

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            // Fetching the flat array of items directly from your updated controller
            const { data } = await axios.get('http://localhost:5000/api/admin/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // data is now a flat array: [{ product: {...}, variantIndex: 0 }, ...]
            setWishlistItems(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching wishlist:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        // 1. Initial fetch
        fetchWishlist();

        // 2. Listen for the global update event
        const handleUpdate = () => {
            console.log("Wishlist update detected, re-fetching...");
            fetchWishlist();
        };

        window.addEventListener('wishlistUpdate', handleUpdate);
        
        // 3. Cleanup
        return () => window.removeEventListener('wishlistUpdate', handleUpdate);
    }, []);

    const removeFromWishlist = async (e, productId, variantIndex) => {
        e.stopPropagation();
        e.preventDefault();
        
        const userInfo = localStorage.getItem('userInfo');
        const token = userInfo ? JSON.parse(userInfo).token : null;

        try {
            // This now returns the updated array from the backend
            await axios.post('http://localhost:5000/api/admin/wishlist/toggle',
                { productId, variantIndex },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Trigger the event so the Navbar and other components sync up
            window.dispatchEvent(new Event('wishlistUpdate'));
            
        } catch (err) {
            console.error("Error removing item:", err);
            alert("Failed to remove item.");
        }
    };

    if (loading) return (
        <div className="pt-32 flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37]"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6 pt-40 min-h-screen font-serif">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-light tracking-[0.2em] uppercase text-gray-900 mb-4">My Wishlist</h1>
                <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 italic mb-8">Your wishlist is currently empty.</p>
                    <button
                        onClick={() => navigate('/collection')}
                        className="px-8 py-4 bg-black text-white uppercase tracking-widest text-xs hover:bg-[#D4AF37] transition-colors"
                    >
                        Explore Collection
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {wishlistItems.map((item) => (
                        <div
                            key={`${item.product?._id}-${item.variantIndex}`}
                            className="group cursor-pointer relative"
                            onClick={() => navigate(`/products/${item.product?._id}`)}
                        >
                            <button
                                onClick={(e) => removeFromWishlist(e, item.product?._id, item.variantIndex)}
                                className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full shadow-sm hover:bg-red-50 transition-colors group/btn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 fill-current group-hover/btn:scale-110 transition-transform pointer-events-none" viewBox="0 0 24 24">
                                    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                            </button>

                            <div className="relative aspect-square bg-[#fdfdfd] mb-6 overflow-hidden flex items-center justify-center p-8 border border-gray-50 group-hover:shadow-md transition-all">
                                <img
                                    src={`http://localhost:5000${item.product?.variants?.[item.variantIndex]?.image || item.product?.variants?.[0]?.image || ''}`}
                                    alt={item.product?.name || 'Product'}
                                    className="h-full w-full object-contain mix-blend-multiply"
                                />
                            </div>

                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">{item.product?.brand || 'Luxury'}</p>
                                <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-2">{item.product?.name || 'Loading...'}</h4>
                                <span className="text-lg font-light text-[#D4AF37]">
                                    ₹{item.product?.variants?.[item.variantIndex]?.discountPrice?.toLocaleString() || 0}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;

