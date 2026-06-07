// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const ProductDetail = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [quantity, setQuantity] = useState(1);
//     const [isLiked, setIsLiked] = useState(false);

//     const addToCart = async () => {
//     // 1. Get token
//     const userInfo = localStorage.getItem('userInfo');
//     const token = userInfo ? JSON.parse(userInfo).token : null;

//     if (!token) {
//         alert("Please signin to add items to your bag!");
//         return navigate('/login');
//     }
//     console.log("Product ID being sent:", id); // Check your console!
//     try {
//         // 2. Prepare the data (No req.body here!)
//         const cartData = { 
//             productId: id, // 'id' comes from useParams()
//             quantity: quantity 
//         };

//         // 3. Send the data to the real backend
//         await axios.post('http://localhost:5000/api/admin/cart/add', cartData, {
//             headers: { Authorization: `Bearer ${token}` }
//         });

//         // 4. Update UI
//         window.dispatchEvent(new Event('cartUpdate'));
//         alert("Product added to bag!");

//     } catch (err) {
//         console.error("Cart Error:", err.response?.data || err.message);
//         alert(err.response?.data?.message || "Error adding to bag");
//     }
// };

//     const fetchProductDetails = useCallback(async () => {
//         try {
//             setLoading(true);
//             const userInfo = localStorage.getItem('userInfo');
//             const token = userInfo ? JSON.parse(userInfo).token : null;

//             const { data } = await axios.get(`http://localhost:5000/api/admin/products/${id}`);
//             setProduct(data);

//             if (token && token !== "null") {
//                 try {
//                     const config = { headers: { Authorization: `Bearer ${token}` } };
//                     const { data: wishlistData } = await axios.get(`http://localhost:5000/api/admin/wishlist`, config);

//                     const isAlreadyLiked = wishlistData.some(item =>
//                         item.products && String(item.products._id || item.products) === String(id)
//                     );

//                     setIsLiked(isAlreadyLiked);
//                 } catch (wishErr) {
//                     console.error("Could not sync wishlist status", wishErr);
//                 }
//             }

//             setLoading(false);
//         } catch (err) {
//             console.error("Error fetching product details:", err);
//             setError("Product not found");
//             setLoading(false);
//         }
//     }, [id]);

//     useEffect(() => {
//         if (id) {
//             fetchProductDetails();
//         }
//     }, [id, fetchProductDetails]);

//     const handleWishlist = async () => {
//         const userInfo = localStorage.getItem('userInfo');
//         const token = userInfo ? JSON.parse(userInfo).token : null;

//         if (!token) {
//             return alert("Please signin to add items to your wishlist!");
//         }

//         try {
//             const { data } = await axios.post('http://localhost:5000/api/admin/wishlist/toggle',
//                 { products: id },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             // 1. Update the local heart icon
//             setIsLiked(data.isLiked);

//             // 2. TRIGGER CUSTOM EVENT: Tell Navbar to update the count immediately
//             window.dispatchEvent(new Event('wishlistUpdate'));

//         } catch (err) {
//             const message = err.response?.data?.message || "Error updating wishlist.";
//             console.error("Wishlist Error:", message);
//             alert(message);
//         }
//     };

//     if (loading) return (
//         <div className="pt-32 flex justify-center items-center min-h-screen">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37]"></div>
//         </div>
//     );

//     if (error || !product) return (
//         <div className="pt-32 text-center min-h-screen">
//             <p className="text-red-500 mb-4">{error}</p>
//             <button onClick={() => navigate('/collection')} className="text-[#D4AF37] underline">
//                 Return to Collection
//             </button>
//         </div>
//     );

//     return (
//         <div className="max-w-7xl mx-auto px-6 pt-40 pb-20 font-serif">
//             <button
//                 onClick={() => navigate(-1)}
//                 className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
//             >
//                 ← Back
//             </button>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
//                 <div className="bg-[#fdfdfd] border border-gray-100 p-12 aspect-square flex items-center justify-center relative shadow-sm">
//                     <img
//                         src={`http://localhost:5000${product.image}`}
//                         alt={product.name}
//                         className="max-h-full w-auto object-contain mix-blend-multiply transition-transform duration-500 hover:scale-110"
//                     />
//                     {product.countInStock === 0 && (
//                         <div className="absolute top-6 left-6 bg-black text-white text-[10px] tracking-widest px-4 py-2 uppercase">
//                             Sold Out
//                         </div>
//                     )}
//                 </div>

//                 <div className="flex flex-col">
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-2">
//                                 {product.brand || 'Luxury Collection'}
//                             </p>
//                             <h1 className="text-4xl font-light tracking-wider text-gray-900 uppercase mb-6 leading-tight">
//                                 {product.name}
//                             </h1>
//                         </div>

//                         <button
//                             onClick={handleWishlist}
//                             className="p-2 transition-transform hover:scale-125"
//                         >
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill={isLiked ? "red" : "none"}
//                                 viewBox="0 0 24 24"
//                                 strokeWidth={1.5}
//                                 stroke={isLiked ? "red" : "currentColor"}
//                                 className="w-8 h-8 transition-colors duration-300"
//                             >
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
//                             </svg>
//                         </button>
//                     </div>

//                     <div className="flex items-center gap-4 mb-8">
//                         <span className="text-3xl font-light text-[#D4AF37]">
//                             {/* Added Price Safety Check */}
//                             ₹{product.price?.toLocaleString() || '0'}
//                         </span>
//                     </div>

//                     <div className="w-full h-px bg-gray-100 mb-8"></div>

//                     <p className="text-gray-600 leading-relaxed mb-10 italic font-sans">
//                         {product.description || "An exquisite timepiece crafted with precision and elegance."}
//                     </p>

//                     <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10 text-[11px] uppercase tracking-widest text-gray-500 font-sans">
//                         <div className="flex justify-between border-b border-gray-50 pb-2">
//                             <span>Style</span>
//                             <span className="text-black">{product.category?.name || product.category || 'Classic'}</span>
//                         </div>
//                         <div className="flex justify-between border-b border-gray-50 pb-2">
//                             <span>Availability</span>
//                             <span className={product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}>
//                                 {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="flex gap-4">
//                         {product.countInStock > 0 && (
//                             <div className="flex border border-gray-200">
//                                 <button
//                                     onClick={() => setQuantity(q => Math.max(1, q - 1))}
//                                     className="px-4 py-2 hover:bg-gray-50"
//                                 >-</button>
//                                 <span className="px-4 py-2 flex items-center border-x border-gray-200">{quantity}</span>
//                                 <button
//                                     onClick={() => setQuantity(q => q + 1)}
//                                     className="px-4 py-2 hover:bg-gray-50"
//                                 >+</button>
//                             </div>
//                         )}

//                         {/* <button
//                             disabled={product.countInStock === 0}
//                             className={`flex-1 py-4 uppercase tracking-[0.2em] text-sm transition-all duration-300 ${product.countInStock > 0
//                                 ? 'bg-black text-white hover:bg-[#D4AF37]'
//                                 : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                                 }`}
//                         >
//                             {product.countInStock > 0 ? 'Add to Boutique Bag' : 'Out of Stock'}
//                         </button> */}
//                         <button
//                             onClick={addToCart} // Add the click handler here
//                             disabled={product.countInStock === 0}
//                             className={`flex-1 py-4 uppercase tracking-[0.2em] text-sm transition-all duration-300 ${product.countInStock > 0
//                                 ? 'bg-black text-white hover:bg-[#D4AF37]'
//                                 : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                                 }`}
//                         >
//                             {product.countInStock > 0 ? 'Add to Boutique Bag' : 'Out of Stock'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductDetail;


// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const ProductDetail = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [quantity, setQuantity] = useState(1);
//     const [isLiked, setIsLiked] = useState(false);

//     // Track the currently active image index in the viewer
//     const [activeImageIdx, setActiveImageIdx] = useState(0);

//     const addToCart = async () => {
//         const userInfo = localStorage.getItem('userInfo');
//         const token = userInfo ? JSON.parse(userInfo).token : null;

//         if (!token) {
//             alert("Please signin to add items to your bag!");
//             return navigate('/login');
//         }

//         console.log("Product ID being sent:", id);
//         try {
//             const cartData = {
//                 productId: id,
//                 quantity: quantity
//             };

//             await axios.post('http://localhost:5000/api/admin/cart/add', cartData, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             window.dispatchEvent(new Event('cartUpdate'));
//             alert("Product added to bag!");

//         } catch (err) {
//             console.error("Cart Error:", err.response?.data || err.message);
//             alert(err.response?.data?.message || "Error adding to bag");
//         }
//     };

//     const fetchProductDetails = useCallback(async () => {
//         try {
//             setLoading(true);
//             const userInfo = localStorage.getItem('userInfo');
//             const token = userInfo ? JSON.parse(userInfo).token : null;

//             const { data } = await axios.get(`http://localhost:5000/api/admin/products/${id}`);
//             setProduct(data);
//             setActiveImageIdx(0); // Reset index on product shift

//             if (token && token !== "null") {
//                 try {
//                     const config = { headers: { Authorization: `Bearer ${token}` } };
//                     const { data: wishlistData } = await axios.get(`http://localhost:5000/api/admin/wishlist`, config);

//                     const isAlreadyLiked = wishlistData.some(item =>
//                         item.products && String(item.products._id || item.products) === String(id)
//                     );

//                     setIsLiked(isAlreadyLiked);
//                 } catch (wishErr) {
//                     console.error("Could not sync wishlist status", wishErr);
//                 }
//             }

//             setLoading(false);
//         } catch (err) {
//             console.error("Error fetching product details:", err);
//             setError("Product not found");
//             setLoading(false);
//         }
//     }, [id]);

//     useEffect(() => {
//         if (id) {
//             fetchProductDetails();
//         }
//     }, [id, fetchProductDetails]);

//     const handleWishlist = async () => {
//         const userInfo = localStorage.getItem('userInfo');
//         const token = userInfo ? JSON.parse(userInfo).token : null;

//         if (!token) {
//             return alert("Please signin to add items to your wishlist!");
//         }

//         try {
//             const { data } = await axios.post('http://localhost:5000/api/admin/wishlist/toggle',
//                 { products: id },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             setIsLiked(data.isLiked);
//             window.dispatchEvent(new Event('wishlistUpdate'));

//         } catch (err) {
//             const message = err.response?.data?.message || "Error updating wishlist.";
//             console.error("Wishlist Error:", message);
//             alert(message);
//         }
//     };

//     if (loading) return (
//         <div className="pt-32 flex justify-center items-center min-h-screen">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37]"></div>
//         </div>
//     );

//     if (error || !product) return (
//         <div className="pt-32 text-center min-h-screen">
//             <p className="text-red-500 mb-4">{error}</p>
//             <button onClick={() => navigate('/collection')} className="text-[#D4AF37] underline">
//                 Return to Collection
//             </button>
//         </div>
//     );

//     // --- FIXED: Smart Multi-Image Combined Aggregator ---
//     let imageGallery = [];

//     // 1. Add the primary featured image first if it exists
//     if (product.image) {
//         imageGallery.push(product.image);
//     }

//     // 2. Append extra gallery angles array right after it
//     if (product.images && Array.isArray(product.images)) {
//         product.images.forEach((img) => {
//             // Prevent duplicate entries if paths match identically
//             if (img && !imageGallery.includes(img)) {
//                 imageGallery.push(img);
//             }
//         });
//     }

//     // 3. Fallback array wrapper if both attributes are missing completely
//     if (imageGallery.length === 0) {
//         imageGallery.push("https://via.placeholder.com/600x600.png?text=No+Image+Available");
//     }

//     // Helper function to resolve localized backend media paths
//     const resolveImagePath = (imgSrc) => {
//         if (!imgSrc) return "https://via.placeholder.com/600x600.png?text=No+Image+Available";
//         if (imgSrc.startsWith('http')) return imgSrc;
//         const formattedPath = imgSrc.startsWith('/') ? imgSrc : `/${imgSrc}`;
//         return `http://localhost:5000${formattedPath}`;
//     };

//     const stockCount = product.countInStock ?? 0;

//     return (
//         <div className="max-w-7xl mx-auto px-6 pt-40 pb-20 font-serif">
//             <button
//                 onClick={() => navigate(-1)}
//                 className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
//             >
//                 ← Back
//             </button>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
//                 {/* Left: Combined Image Showcase & Thumbnails Grid */}
//                 <div className="flex flex-col gap-6 w-full lg:max-w-xl">

//                     {/* Main Featured Display Box */}
//                     <div className="bg-[#fdfdfd] border border-gray-100 p-8 md:p-12 aspect-square w-full flex items-center justify-center relative shadow-sm rounded-sm">
//                         <img
//                             src={resolveImagePath(imageGallery[activeImageIdx])}
//                             alt={`${product.name || "Product"} View`}
//                             className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-110"
//                             onError={(e) => {
//                                 e.target.src = "https://via.placeholder.com/600x600.png?text=No+Image+Available";
//                             }}
//                         />
//                         {stockCount === 0 && (
//                             <div className="absolute top-6 left-6 bg-black text-white text-[10px] tracking-widest px-4 py-2 uppercase">
//                                 Sold Out
//                             </div>
//                         )}
//                     </div>

//                     {/* Interactive Thumbnail Carousel Row */}
//                     {imageGallery.length > 1 && (
//                         <div className="w-full">
//                             <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-sans">
//                                 Alternative Views ({imageGallery.length})
//                             </p>
//                             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin max-w-full">
//                                 {imageGallery.map((imgItem, idx) => (
//                                     <button
//                                         key={idx}
//                                         type="button"
//                                         onClick={() => setActiveImageIdx(idx)}
//                                         className={`w-20 h-20 min-w-[80px] min-h-[80px] bg-white border p-2 flex items-center justify-center transition-all duration-200 ${idx === activeImageIdx
//                                                 ? 'border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-sm'
//                                                 : 'border-gray-200 hover:border-black'
//                                             }`}
//                                     >
//                                         <img
//                                             src={resolveImagePath(imgItem)}
//                                             alt={`View ${idx + 1}`}
//                                             className="max-h-full max-w-full object-contain mix-blend-multiply"
//                                             onError={(e) => {
//                                                 e.target.src = "https://via.placeholder.com/80?text=Error";
//                                             }}
//                                         />
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Right: Product Details Breakdown */}
//                 <div className="flex flex-col">
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-2">
//                                 {product.brand || 'Luxury Collection'}
//                             </p>
//                             <h1 className="text-4xl font-light tracking-wider text-gray-900 uppercase mb-6 leading-tight">
//                                 {product.name || 'Unnamed Product'}
//                             </h1>
//                         </div>

//                         <button
//                             onClick={handleWishlist}
//                             className="p-2 transition-transform hover:scale-125"
//                         >
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill={isLiked ? "red" : "none"}
//                                 viewBox="0 0 24 24"
//                                 strokeWidth={1.5}
//                                 stroke={isLiked ? "red" : "currentColor"}
//                                 className="w-8 h-8 transition-colors duration-300"
//                             >
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
//                             </svg>
//                         </button>
//                     </div>

//                     <div className="flex items-center gap-4 mb-8">
//                         <span className="text-3xl font-light text-[#D4AF37]">
//                             ₹{product.price?.toLocaleString() || '0'}
//                         </span>
//                     </div>

//                     <div className="w-full h-px bg-gray-100 mb-8"></div>

//                     <p className="text-gray-600 leading-relaxed mb-10 italic font-sans">
//                         {product.description || "No description available for this luxury item."}
//                     </p>

//                     <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10 text-[11px] uppercase tracking-widest text-gray-500 font-sans">
//                         <div className="flex justify-between border-b border-gray-50 pb-2">
//                             <span>Style</span>
//                             <span className="text-black">
//                                 {product.style || 'Classic'}
//                             </span>
//                         </div>
//                         <div className="flex justify-between border-b border-gray-50 pb-2">
//                             <span>Availability</span>
//                             <span className={stockCount > 0 ? 'text-green-600' : 'text-red-600'}>
//                                 {stockCount > 0 ? 'In Stock' : 'Out of Stock'}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="flex gap-4">
//                         {stockCount > 0 && (
//                             <div className="flex border border-gray-200">
//                                 <button
//                                     onClick={() => setQuantity(q => Math.max(1, q - 1))}
//                                     className="px-4 py-2 hover:bg-gray-50"
//                                 >-</button>
//                                 <span className="px-4 py-2 flex items-center border-x border-gray-200">{quantity}</span>
//                                 <button
//                                     onClick={() => setQuantity(q => Math.min(stockCount, q + 1))}
//                                     className="px-4 py-2 hover:bg-gray-50"
//                                 >+</button>
//                             </div>
//                         )}

//                         <button
//                             onClick={addToCart}
//                             disabled={stockCount === 0}
//                             className={`flex-1 py-4 uppercase tracking-[0.2em] text-sm transition-all duration-300 ${stockCount > 0
//                                     ? 'bg-black text-white hover:bg-[#D4AF37]'
//                                     : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                                 }`}
//                         >
//                             {stockCount > 0 ? 'Add to Boutique Bag' : 'Out of Stock'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductDetail;
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIdx, setActiveImageIdx] = useState(0);

    // --- DERIVED DATA (Must be defined before usage) ---
    const stockCount = selectedVariant?.countInStock || 0;
    const displayPrice = selectedVariant?.discountPrice > 0 ? selectedVariant.discountPrice : (selectedVariant?.price || 0);
    const originalPrice = selectedVariant?.price || 0;

    const [isLiked, setIsLiked] = useState(false); // Add this

    const [relatedProducts, setRelatedProducts] = useState([]);

    const fetchProductDetails = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:5000/api/admin/products/${id}`);
            setProduct(data);
            setActiveImageIdx(0);

            if (data.variants && data.variants.length > 0) {
                setSelectedVariant(data.variants[0]);
            }
            setLoading(false);
        } catch (err) {
            setError("Product not found");
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchProductDetails();
    }, [id, fetchProductDetails]);

    // Add this useEffect to sync the gallery index with the selected variant
    useEffect(() => {
        setActiveImageIdx(0);
    }, [selectedVariant]);

    useEffect(() => {
        const checkWishlist = async () => {
            const userInfo = localStorage.getItem('userInfo');
            const token = userInfo ? JSON.parse(userInfo).token : null;
            if (!token || !product) return;

            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/wishlist', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Check if current product ID exists in the wishlist
                const likedIds = data.map(item => (item.product?._id || item.product).toString());
                setIsLiked(likedIds.includes(product._id.toString()));
            } catch (err) {
                console.error("Wishlist check failed:", err);
            }
        };
        checkWishlist();
        
        // Listen for updates from other pages
        window.addEventListener('wishlistUpdate', checkWishlist);
        return () => window.removeEventListener('wishlistUpdate', checkWishlist);
    }, [product]);

    useEffect(() => {
    const fetchRelated = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/admin/products/related/${id}`);
            setRelatedProducts(data);
        } catch (err) {
            console.error("Failed to load related products");
        }
    };
    if (id) fetchRelated();
}, [id]);

    const toggleWishlist = async (e) => {
        e.stopPropagation();
        const userInfo = localStorage.getItem('userInfo');
        const token = userInfo ? JSON.parse(userInfo).token : null;
        if (!token) return alert("Please login!");

        const previousState = isLiked;
        setIsLiked(!previousState); // Optimistic Update

        try {
            await axios.post('http://localhost:5000/api/admin/wishlist/toggle',
                { productId: product._id, variantIndex: 0 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            window.dispatchEvent(new Event('wishlistUpdate'));
        } catch (err) {
            setIsLiked(previousState); // Revert on fail
            console.error("Wishlist toggle failed:", err);
        }
    };

    const addToCart = async () => {
        // 1. Safety check
        if (!selectedVariant) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to add items to your cart.");
            // Optional: navigate('/login');
            return;
        }
        // 2. Define the payload directly from the state
        const payload = {
            productId: product._id,
            color: selectedVariant.color,
            price: displayPrice, // Use your derived 'displayPrice'
            image: imageGallery[0], // Or use selectedVariant.image
            quantity: quantity,
            variantKey: `${product._id}-${selectedVariant.color}`
        };

        // console.log("Sending Payload:", payload);

        try {
            await axios.post('http://localhost:5000/api/admin/cart/add', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.dispatchEvent(new Event('cartUpdated'));
            alert("Added to bag!");
        } catch (err) {
            console.error("Cart Add Error:", err.response?.data || err.message);
        }
    };
    const color = selectedVariant?.color?.toLowerCase() || '';
    const allAvailableImages = [product?.image, ...(product?.images || [])];
    const matchedImage = allAvailableImages.find(img =>
        img && img.toLowerCase().includes(color)
    );
    // const imageGallery = matchedImage 
    // ? [matchedImage, ...allAvailableImages.filter(i => i !== matchedImage)]
    // : allAvailableImages;
    // const imageGallery = selectedVariant?.images?.length > 0
    //     ? [selectedVariant.image, ...selectedVariant.images]
    //     : [product?.image, ...(product?.images || [])];

    // const imageGallery = (selectedVariant?.images && selectedVariant.images.length > 0)
    // ? [selectedVariant.image, ...selectedVariant.images]
    // : (selectedVariant?.image)
    //     ? [selectedVariant.image, ...(product?.images || [])] // If variant has a main image, use it, then show other product images
    //     : [product?.image, ...(product?.images || [])];      // Default fallback


    // This creates a single gallery array regardless of how many images exist
    const imageGallery = (selectedVariant?.images && selectedVariant.images.length > 0)
        ? [selectedVariant.image, ...selectedVariant.images] // Uses variant main + variant list
        : [selectedVariant?.image || product?.image];        // If no list, just show the main image

    const resolveImagePath = (imgSrc) => {
        if (!imgSrc) return "https://via.placeholder.com/600x600.png?text=No+Image";
        if (imgSrc.startsWith('http')) return imgSrc;
        return `http://localhost:5000${imgSrc.startsWith('/') ? imgSrc : `/${imgSrc}`}`;
    };

    console.log("Current Variant:", selectedVariant?.color);
    console.log("Current Gallery:", imageGallery);

    if (loading) return <div className="pt-32 flex justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37]"></div></div>;
    if (error || !product) return <div className="pt-32 text-center">{error} <button onClick={() => navigate('/collection')} className="block text-[#D4AF37] underline">Return to Collection</button></div>;

    return (
        <div className="max-w-7xl mx-auto px-6 pt-40 pb-20 font-serif">
            <button onClick={() => navigate(-1)} className="mb-8 text-xs uppercase tracking-widest text-gray-400 hover:text-black">← Back</button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* --- UPDATED IMAGE SECTION --- */}
                <div className="flex flex-col gap-6 relative">
                    {/* Add the Heart Icon here */}
                    <button 
                        onClick={toggleWishlist}
                        className="absolute top-4 right-4 z-20 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors duration-300 ${isLiked ? 'fill-red-500 stroke-red-500' : 'fill-transparent stroke-gray-600'}`} viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </button>
                    {/* By adding key={selectedVariant?._id}, React treats this as a brand new component 
        every time the variant changes, forcing the image to update immediately. */}
                    <div
                        key={`${selectedVariant?._id}-${activeImageIdx}`}
                        className="bg-[#fdfdfd] border border-gray-100 p-12 aspect-square flex items-center justify-center relative"
                    >
                        <img
                            src={resolveImagePath(imageGallery[activeImageIdx])}
                            alt={product.name}
                            className="max-h-full object-contain mix-blend-multiply"
                        />
                    </div>

                    <div className="flex gap-3 overflow-x-auto">
                        {imageGallery.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImageIdx(idx)}
                                className={`w-20 h-20 border p-2 ${idx === activeImageIdx ? 'border-[#D4AF37]' : 'border-gray-200'}`}
                            >
                                <img src={resolveImagePath(img)} alt="Thumb" className="max-h-full object-contain" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-4xl font-light uppercase mb-2">{product.name}</h1>
                    <p className="text-gray-500 mb-4 uppercase tracking-widest text-sm">{product.brand} | {product.style}</p>

                    <div className="mb-6">
                        <span className="text-3xl text-[#D4AF37]">₹{displayPrice.toLocaleString()}</span>
                        {selectedVariant?.discountPrice > 0 && (
                            <span className="ml-3 text-lg line-through text-gray-400">₹{originalPrice.toLocaleString()}</span>
                        )}
                    </div>

                    <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

                    {/* Variant Selector */}
                    {product.variants?.length > 0 && (
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-widest mb-4">
                                Select Color: <span className="font-bold">{selectedVariant?.color || 'Default'}</span>
                            </p>
                            <div className="flex gap-4">
                                {product.variants.map((v, index) => (
                                    <button
                                        key={v._id || index}
                                        onClick={() => {
                                            setSelectedVariant(v);
                                            setActiveImageIdx(0);
                                            setQuantity(1);
                                        }}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedVariant?.color === v.color
                                                ? 'border-black ring-2 ring-offset-2 ring-black scale-110'
                                                : 'border-gray-200'
                                            }`}
                                        style={{
                                            // Use the hexCode from the DB, fallback to gray if missing
                                            background: v.hexCode || '#cccccc',
                                            border: '1px solid rgba(0,0,0,0.1)'
                                        }}
                                        title={v.color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PROFESSIONAL STATUS SECTION */}
                    <div className="text-sm text-gray-500 mb-8 p-4 bg-gray-50 border-l-4 border-[#D4AF37]">
                        <p className="mb-2"><strong>Warranty:</strong> {product.warranty}</p>
                        {stockCount > 0 ? (
                            <p className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${stockCount <= 3 ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                                <strong>Status:</strong>
                                <span className="font-medium text-gray-800">
                                    {stockCount <= 3 ? " Low stock, order soon!" : " Ready to ship"}
                                </span>
                            </p>
                        ) : (
                            <p className="flex items-center gap-2 text-red-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                <strong>Status:</strong> Out of Stock
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4">
                        {stockCount > 0 && (
                            <div className="flex border border-gray-200">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gray-100">-</button>
                                <span className="px-4 py-2 border-x">{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(stockCount, q + 1))} className="px-4 py-2 hover:bg-gray-100">+</button>
                            </div>
                        )}
                        <button
                            onClick={addToCart}
                            disabled={stockCount === 0}
                            className={`flex-1 py-4 uppercase text-sm transition-colors ${stockCount > 0 ? 'bg-black text-white hover:bg-[#D4AF37]' : 'bg-gray-200 cursor-not-allowed'}`}>
                            {stockCount > 0 ? 'Add to Boutique Bag' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
            {relatedProducts.length > 0 && (
                <div className="mt-20 border-t pt-16">
                    <h2 className="text-2xl font-light uppercase mb-8">Related Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {relatedProducts.map((prod) => (
                            <div 
                                key={prod._id} 
                                onClick={() => {
                                    navigate(`/products/${prod._id}`);
                                    window.scrollTo(0, 0); // Ensures page scrolls to top on navigation
                                }} 
                                className="cursor-pointer group"
                            >
                                <div className="aspect-square bg-gray-50 mb-4 overflow-hidden flex items-center justify-center">
                                    <img 
                                        src={resolveImagePath(prod.variants[0]?.image)} 
                                        alt={prod.name} 
                                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-sm uppercase tracking-wider">{prod.name}</h3>
                                <p className="text-sm text-gray-500 font-serif">₹{prod.variants[0]?.price.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;