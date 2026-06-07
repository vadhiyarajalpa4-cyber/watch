import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [availableStyles, setAvailableStyles] = useState([]);

    const [formData, setFormData] = useState({
        name: '', brand: '', category: '', style: '', description: '', warranty: '',
        variants: [{ color: '', price: '', discountPrice: '', countInStock: '', image: null, images: [] }]
    });

    const [editingProduct, setEditingProduct] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/category');
                setCategories(res.data);
            } catch (err) { console.error("Failed to load categories", err); }
        };
        fetchCategories();
    }, []);

    const handleCategoryChange = (categoryId) => {
        const selectedCat = categories.find(c => c._id === categoryId);
        // console.log("Selected Category Object:", selectedCat); 
        setFormData(prev => ({ ...prev, category: categoryId, style: '' }));
        // setAvailableStyles(selectedCat ? selectedCat.styles : []);
        setAvailableStyles(selectedCat && selectedCat.subCategories ? selectedCat.subCategories : []);
    };

    const resetForm = () => {
        setFormData({
            name: '', brand: '', category: '', style: '', description: '', warranty: '',
            variants: [{ color: '', price: '', discountPrice: '', countInStock: '', image: null }]
        });
        setIsModalOpen(false);
    };
    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];

        if (value !== undefined) {
            newVariants[index][field] = value;
        }

        setFormData({ ...formData, variants: newVariants });
    };
    const addVariant = () => {
        setFormData({ ...formData, variants: [...formData.variants, { color: '', price: '', discountPrice: '', countInStock: '', image: null }] });
    };

    const removeVariant = (indexToRemove) => {
        if (formData.variants.length > 1) {
            setFormData(prev => ({
                ...prev,
                variants: prev.variants.filter((_, index) => index !== indexToRemove)
            }));
        } else {
            alert("You must have at least one variant.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo ? userInfo.token : null;

        if (!token) {
            alert("You are not authorized! Please login.");
            return;
        }
        const data = new FormData();

        console.log("CHECKING VARIANTS STATE BEFORE SEND:", formData.variants);
        data.append('name', formData.name);
        data.append('brand', formData.brand);
        data.append('category', formData.category);
        data.append('style', formData.style);
        data.append('description', formData.description);
        data.append('warranty', formData.warranty);

        const variantsForJson = formData.variants.map(v => ({
            color: v.color,
            hexCode: v.hexCode || "#000000",
            price: Number(v.price) || 0,
            discountPrice: Number(v.discountPrice) || 0,
            countInStock: Number(v.countInStock) || 0,
            // image: typeof v.image === 'string' ? v.image : null,
            // images: Array.isArray(v.images) ? v.images.filter(img => typeof img === 'string') : []
            // image: v.image ? (typeof v.image === 'string' ? v.image : "") : "",
            // images: Array.isArray(v.images) ? v.images.filter(img => typeof img === 'string') : []
            image: typeof v.image === 'string' ? v.image : "",
            images: Array.isArray(v.images) ? v.images.filter(img => typeof img === 'string') : []

        }));
        console.log("Payload being sent:", JSON.stringify(variantsForJson));
        console.log("DEBUG: Variants being sent to server:", variantsForJson);
        data.append('variants', JSON.stringify(variantsForJson));

        formData.variants.forEach((v, vIndex) => {
            if (v.image instanceof File) {

                // data.append('image', v.image); // Changed from variantImage_0

                data.append(`variantImage_${vIndex}`, v.image);

            }

            if (v.images && v.images.length > 0) {

                v.images.forEach((file) => {

                    if (file instanceof File) {

                        // data.append('images', file); // Changed from variantGallery_0

                        data.append(`variantGallery_${vIndex}`, file);

                    }

                });

            }

        });

        try {
            const url = editingProduct
                ? `http://localhost:5000/api/admin/products/${editingProduct._id}`
                : 'http://localhost:5000/api/admin/products';

            const method = editingProduct ? 'put' : 'post';

            await axios[method](url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },

            });

            alert(editingProduct ? "Product Updated Successfully!" : "Product Saved Successfully!");

            setIsModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
            resetForm();
        } catch (err) {
            console.error("Submission Error", err);
            if (err.response?.status === 401) {
                alert("Unauthorized: Please log in again.");
            } else {
                alert("Failed to save product.");
            }
        }
    };

    const fetchProducts = async (page = 1) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/products?page=${page}&limit=${itemsPerPage}`);

            setProducts(res.data.products);
            setCurrentPage(res.data.currentPage);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    const handleDelete = async (productId) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo ? userInfo.token : null;

        if (!token) {
            alert("You are not authorized! Please login.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setProducts(products.filter(p => p._id !== productId));
                alert("Product deleted successfully");
            } catch (err) {
                console.error("Delete Error", err);
                if (err.response?.status === 401) {
                    alert("Unauthorized: Session expired. Please login again.");
                } else {
                    alert("Failed to delete product.");
                }
            }
        }
    };

    const handleEdit = (product) => {
        console.log("Product Data being edited:", product);
        setEditingProduct(product);
        const variantsCopy = JSON.parse(JSON.stringify(product.variants || []));
        setFormData({
            name: product.name,
            brand: product.brand,
            category: product.category?._id,
            style: product.style,
            description: product.description,
            warranty: product.warranty,
            variants: product.variants
        });
        setAvailableStyles(product.category?.subCategories || []);
        setIsModalOpen(true);
    };
    return (
        <div className="p-6">
            <button
                onClick={() => {
                    setEditingProduct(null);
                    resetForm();             
                    setIsModalOpen(true);   
                }}
                className="bg-[#D4AF37] text-white px-4 py-2 rounded mb-6"
            >
                + Add New Product
            </button>

            {/* 3. The Table Render */}
            <table className="w-full mt-6 border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-3 border">Image</th>
                        <th className="p-3 border">Name</th>
                        <th className="p-3 border">Brand</th>
                        <th className="p-3 border">Price</th>
                        <th className="p-3 border">Discount Price</th>
                        <th className="p-3 border">Stock</th>
                        <th className="p-3 border">Category</th>
                        <th className="p-3 border">Style</th>
                        <th className="p-3 border">Actions</th>
                    </tr>
                </thead>
               <tbody>
  {products.length > 0 ? (
    products.map((product) =>
      (product.variants || []).map((variant, vIndex) => {
        const isLowStock = variant.countInStock <= 5;
        
        return (
          <tr 
            key={`${product._id}-${vIndex}`} 
            className={`border-b ${isLowStock ? 'bg-red-50' : 'hover:bg-gray-50'}`}
          >
            <td className="p-3 border">
              {variant.image ? (
                <img 
                  src={`http://localhost:5000${variant.image}`} 
                  className="w-12 h-12 object-cover rounded border" 
                  alt={product.name} 
                />
              ) : <div className="w-12 h-12 bg-gray-200 rounded" />}
            </td>
            <td className="p-3 border">
              <div className="font-semibold">{product.name}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: variant.hexCode }}></span>
                {variant.color}
              </div>
            </td>
            <td className="p-3 border">{product.brand}</td>
            <td className="p-3 border text-gray-500 line-through text-sm">₹{variant.price}</td>
            <td className="p-3 border text-green-600 font-bold">₹{variant.discountPrice}</td>
            
            <td className={`p-3 border font-bold ${isLowStock ? 'text-red-600' : 'text-green-700'}`}>
              {variant.countInStock}
              {isLowStock && <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-[10px] rounded">LOW STOCK</span>}
            </td>
            
            <td className="p-3 border">{product.category?.name}</td>
            <td className="p-3 border">{product.style}</td>
            <td className="p-3 border">
              <button onClick={() => handleEdit(product)} className="text-blue-600 mr-2">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="text-red-600">Delete</button>
            </td>
          </tr>
        );
      })
    )
  ) : (
    <tr><td colSpan="9" className="p-4 text-center">No products found.</td></tr>
  )}
</tbody>
            </table>
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => fetchProducts(currentPage - 1)}
                        className="px-4 py-1 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-sm font-bold">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => fetchProducts(currentPage + 1)}
                        className="px-4 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Add Product</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Name" className="border p-2 rounded" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                <input placeholder="Brand" className="border p-2 rounded" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />

                                <select className="border p-2 rounded" value={formData.category} onChange={(e) => handleCategoryChange(e.target.value)}>
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>

                                <select
                                    className="border p-2 rounded"
                                    value={formData.style}
                                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                                    disabled={!formData.category}
                                >
                                    <option value="">Select Style</option>
                                    {(availableStyles || []).map((s, index) => (
                                        <option key={index} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <textarea placeholder="Description" className="w-full border p-2 rounded" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            <input placeholder="Warranty Information" className="w-full border p-2 rounded" value={formData.warranty} onChange={(e) => setFormData({ ...formData, warranty: e.target.value })} />

                            <div className="border-t pt-4">
                                <label className="font-bold block mb-2">Manage Variants</label>
                                {formData.variants.map((v, i) => (
                                    <div key={i} className="flex gap-2 mb-2 items-center">
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(i)}
                                            className="bg-red-500 text-white px-2 py-1 rounded text-[10px] hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                        <div className="flex flex-col w-1/12">
                                            <label className="text-[10px] font-bold">Pick Color</label>
                                            <input
                                                type="color"
                                                className="h-10 w-full"
                                                value={v.hexCode || "#000000"}
                                                onChange={(e) => handleVariantChange(i, 'hexCode', e.target.value)}
                                            />
                                        </div>
                                        <input placeholder="Color" className="w-1/4 border p-1" value={v.color} onChange={(e) => handleVariantChange(i, 'color', e.target.value)} />
                                        <input type="number" placeholder="Price" className="w-1/4 border p-1" value={v.price} onChange={(e) => handleVariantChange(i, 'price', e.target.value)} />
                                        <input type="number" placeholder="Discount Price" className="w-1/4 border p-1" value={v.discountPrice} onChange={(e) => handleVariantChange(i, 'discountPrice', e.target.value)} />
                                        <input type="number" placeholder="Count In Stock" className="w-1/4 border p-1" value={v.countInStock} onChange={(e) => handleVariantChange(i, 'countInStock', e.target.value)} />

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs font-bold">Thumbnail Image</label>
                                                {/* Display existing image if we are in Edit mode */}
                                                {/* {v.image && typeof v.image === 'string' && (
                                                    <img
                                                        src={`http://localhost:5000${v.image}`}
                                                        alt="Current"
                                                        className="w-16 h-16 object-cover mb-2 rounded border"
                                                    />
                                                )} */}
                                                {v.image && (
                                                    <img
                                                        src={typeof v.image === 'string' ? `http://localhost:5000${v.image}` : URL.createObjectURL(v.image)}
                                                        alt="Thumbnail"
                                                        className="w-16 h-16 object-cover mb-1 rounded border"
                                                    />
                                                )}
                                                <input
                                                    type="file"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            handleVariantChange(i, 'image', e.target.files[0]); // This sets the File object
                                                        }
                                                    }}
                                                />
                                                {/* <input
                                                    type="file"
                                                    multiple
                                                    onChange={(e) => {
                                                        if (!e.target.files) return;

                                                        const newVariants = [...formData.variants];
                                                        const newFiles = Array.from(e.target.files);

                                                        // GET EXISTING IMAGES FIRST
                                                        const currentImages = newVariants[i].images || [];

                                                        // MERGE OLD + NEW
                                                        newVariants[i].images = [...currentImages, ...newFiles];

                                                        setFormData({ ...formData, variants: newVariants });
                                                    }}
                                                /> */}
                                            </div>
                                            <div className='mt-2'>
                                                <label className="text-xs font-bold block mb-1">Gallery Images</label>
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {(v.images || []).map((img, imgIndex) => (
                                                        <div key={imgIndex} className="relative w-12 h-12">
                                                            <img
                                                                src={typeof img === 'string' ? `http://localhost:5000${img}` : URL.createObjectURL(img)}
                                                                alt="Gallery"
                                                                className="w-full h-full object-cover rounded border"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                                                                onClick={() => {
                                                                    const newVariants = [...formData.variants];
                                                                    newVariants[i].images = newVariants[i].images.filter((_, idx) => idx !== imgIndex);
                                                                    setFormData({ ...formData, variants: newVariants });
                                                                }}
                                                            >✕</button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={(e) => {
                                                        if (!e.target.files) return;
                                                        const newFiles = Array.from(e.target.files);
                                                        const newVariants = [...formData.variants];
                                                        // MERGE: Keep existing images AND add new ones
                                                        newVariants[i].images = [...(newVariants[i].images || []), ...newFiles];
                                                        setFormData({ ...formData, variants: newVariants });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addVariant} className="text-blue-500 text-sm font-semibold">+ Add Variant</button>
                            </div>

                            <div className="flex gap-4">
                                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Save Product</button>
                                <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-6 py-2 rounded">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div >
            )}
        </div >
    );
};

export default ManageProducts;