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
                const likedIds = data.map(item => (item.product?._id || item.product).toString());
                setIsLiked(likedIds.includes(product._id.toString()));
            } catch (err) {
                console.error("Wishlist check failed:", err);
            }
        };
        checkWishlist();
        
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
        setIsLiked(!previousState); 

        try {
            await axios.post('http://localhost:5000/api/admin/wishlist/toggle',
                { productId: product._id, variantIndex: 0 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            window.dispatchEvent(new Event('wishlistUpdate'));
        } catch (err) {
            setIsLiked(previousState);
            console.error("Wishlist toggle failed:", err);
        }
    };

    const addToCart = async () => {
        if (!selectedVariant) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to add items to your cart.");
            return;
        }
        const payload = {
            productId: product._id,
            color: selectedVariant.color,
            price: displayPrice, 
            image: imageGallery[0],
            quantity: quantity,
            variantKey: `${product._id}-${selectedVariant.color}`
        };

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

    const imageGallery = (selectedVariant?.images && selectedVariant.images.length > 0)
        ? [selectedVariant.image, ...selectedVariant.images]
        : [selectedVariant?.image || product?.image];        

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
                <div className="flex flex-col gap-6 relative">
                    <button 
                        onClick={toggleWishlist}
                        className="absolute top-4 right-4 z-20 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors duration-300 ${isLiked ? 'fill-red-500 stroke-red-500' : 'fill-transparent stroke-gray-600'}`} viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </button>
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