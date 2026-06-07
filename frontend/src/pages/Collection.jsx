import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWatches } from '../context/WatchContext';
import axios from 'axios';

const Collection = () => {
    const { categories, products, loading, fetchProducts, pagination } = useWatches();
    const [currentPage, setCurrentPage] = useState(1);
    // const { categories, products: productData, loading } = useWatches();
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const displayProducts = products;

    const [activeStyle, setActiveStyle] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState([]);
    useEffect(() => {
        const categoryId = selectedCategory ? selectedCategory._id : '';

        fetchProducts(currentPage, 8, categoryId, activeStyle, searchQuery);

    }, [currentPage, categoryName, activeStyle, searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [categoryName, activeStyle]);

    useEffect(() => {
    const fetchWishlist = async () => {
        const userInfo = localStorage.getItem('userInfo');
        const token = userInfo ? JSON.parse(userInfo).token : null;
        if (!token) return;

        try {
            const { data } = await axios.get(`http://localhost:5000/api/admin/wishlist?t=${Date.now()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const likedIds = Array.isArray(data) 
                ? data.map(item => item.product?._id?.toString() || item.product?.toString()) 
                : [];
            
            setFavorites(likedIds);
        } catch (err) {
            console.error("Collection wishlist sync failed:", err);
        }
    };

    fetchWishlist();
    window.addEventListener('wishlistUpdate', fetchWishlist);
    return () => window.removeEventListener('wishlistUpdate', fetchWishlist);
}, []);

    const selectedCategory = categories.find(
        cat => cat.name.toLowerCase() === categoryName?.toLowerCase()
    );

    const toggleFavorite = async (e, productId) => {
        e.stopPropagation();
        const userInfo = localStorage.getItem('userInfo');
        const token = userInfo ? JSON.parse(userInfo).token : null;
        if (!token) return alert("Please login!");

        // 1. Calculate the new state locally
        const isCurrentlyLiked = favorites.includes(productId);
        const newFavorites = isCurrentlyLiked
            ? favorites.filter(id => id !== productId)
            : [...favorites, productId];

        setFavorites(newFavorites);

        try {
            await axios.post('http://localhost:5000/api/admin/wishlist/toggle',
                { productId, variantIndex: 0 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            window.dispatchEvent(new Event('wishlistUpdate'));
            const { data } = await axios.get('http://localhost:5000/api/admin/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const serverLikedIds = data.map(item => item.product?._id || item.product);
            setFavorites(serverLikedIds);

        } catch (err) {
            console.error("Toggle failed, reverting UI:", err);
            setFavorites(favorites); // Revert to original
        }
    };
   
    if (loading) return (
        <div className="pt-32 flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6 pt-32 min-h-screen font-serif">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] uppercase text-gray-900 mb-4">Our Collection</h1>
                <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
                <div className="relative max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search our luxury timepieces..."
                        className="w-full py-4 px-6 bg-white border border-gray-200 outline-none italic text-gray-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {!selectedCategory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map(cat => (
                        <div
                            key={cat._id}
                            onClick={() => navigate(`/collection/${cat.name.toLowerCase()}`)}
                            className="group relative cursor-pointer overflow-hidden aspect-[4/5] flex items-center justify-center bg-black"
                        >
                            <div className="absolute inset-0 bg-gray-900 opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <div className="relative z-10 text-center p-4 border border-white/30 group-hover:border-[#D4AF37] transition-colors duration-500 w-[80%] py-12">
                                <h3 className="text-white text-xl font-light tracking-[0.3em] uppercase">{cat.name}</h3>
                                <p className="text-[#D4AF37] text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Explore Now</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <button onClick={() => navigate('/collection')} className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] transition-colors">
                        <span className="text-lg">←</span> Back to Categories
                    </button>

                    <h2 className="text-3xl font-light tracking-widest text-center uppercase mb-12">{selectedCategory.name}</h2>

                    <div className="flex flex-wrap justify-center gap-8 mb-16 border-b border-gray-100 pb-4">
                        <button
                            onClick={() => {
                                setActiveStyle('All');
                                setCurrentPage(1); 
                            }}
                            className={`text-xs uppercase tracking-[0.2em] pb-2 ${activeStyle === 'All' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400'}`}
                        >
                            All Models
                        </button>

                        {selectedCategory.subCategories?.map(s => (
                            <button
                                key={s}
                                onClick={() => {
                                    setActiveStyle(s);
                                    setCurrentPage(1); // Reset to page 1
                                }}
                                className={`text-xs uppercase tracking-[0.2em] pb-2 ${activeStyle === s ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {displayProducts.map(p => {
                            // const isLiked = favorites.includes(p._id);
                            const isLiked = favorites.includes(p._id?.toString());
                            return (
                                <div key={p._id} className="group cursor-pointer relative">
                                    <button
                                        onClick={(e) => toggleFavorite(e, p._id)} // Still pass the original p._id here
                                        className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all transform hover:scale-110"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors duration-300 ${isLiked ? 'fill-red-500 stroke-red-500' : 'fill-transparent stroke-gray-400'}`} viewBox="0 0 24 24" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>

                                    <div onClick={() => navigate(`/products/${p._id}`)}>
                                        <div className="relative aspect-square bg-[#fdfdfd] mb-6 overflow-hidden flex items-center justify-center p-8 border border-gray-50 shadow-sm group-hover:shadow-md">
                                            {/* <img src={`http://localhost:5000${p.image}`} alt={p.name} className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" /> */}
                                            <img
                                                src={`http://localhost:5000${p.variants?.[0]?.image || ''}`}
                                                alt={p.name}
                                                className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">{p.brand || 'Luxury'}</p>
                                            <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-2">{p.name}</h4>
                                            <span className="text-lg font-light text-[#D4AF37]">₹{p.variants?.[0]?.price?.toLocaleString() || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {displayProducts.length === 0 && (
                        <p className="text-center text-gray-400 italic mt-10">No timepieces found matching your criteria.</p>
                    )}
                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center gap-6 mt-16 pt-8 border-t border-gray-100">
                        <button
                            disabled={pagination.currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="text-xs uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] disabled:opacity-30 transition-colors"
                        >
                            ← Previous
                        </button>

                        <span className="text-sm font-light text-gray-400">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>

                        <button
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="text-xs uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] disabled:opacity-30 transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Collection;