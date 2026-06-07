// import React, { useState, useEffect } from 'react';
// import API from '../../api/axios';

// const ManageProducts = () => {
//     const [categories, setCategories] = useState([]);
//     const [products, setProducts] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [availableStyles, setAvailableStyles] = useState([]);

//     // --- EDIT STATES ---
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [editProduct, setEditProduct] = useState(null);
//     const [editStyles, setEditStyles] = useState([]);

//     const [product, setProduct] = useState({
//         name: '', description: '', price: '', discountPrice: '',
//         image: null, style: '', warranty: '1 Year Warranty', countInStock: 0, brand: ''
//     });

//     const [imagePreview, setImagePreview] = useState(null);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (imagePreview) URL.revokeObjectURL(imagePreview);
//             setProduct({ ...product, image: file });
//             setImagePreview(URL.createObjectURL(file));
//         }
//     };

//     const refreshData = async () => {
//         try {
//             const catRes = await API.get('/api/admin/category');
//             const prodRes = await API.get('/api/admin/products');

//             setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);
//             setProducts(Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.products || []);
//         } catch (err) {
//             console.error("Data refresh failed", err);
//         }
//     };

//     useEffect(() => {
//         refreshData();
//     }, []);

//     const handleCategoryChange = (e) => {
//         const catId = e.target.value;
//         setSelectedCategory(catId);
//         const foundCategory = categories.find(c => c._id === catId);
//         if (foundCategory) {
//             setAvailableStyles(foundCategory.subCategories || []);
//             setProduct({ ...product, category: catId, style: '' });
//         }
//     };

//     // --- FIXED EDIT LOGIC ---
//     const openEditModal = (p) => {
//         // Fix: Ensure we extract the ID if category is an object
//         const catId = typeof p.category === 'object' ? p.category._id : p.category;

//         setEditProduct({ ...p, category: catId });

//         // Find the category to populate the "Style" dropdown in the modal
//         const foundCategory = categories.find(c => c._id === catId);
//         setEditStyles(foundCategory ? foundCategory.subCategories || [] : []);
//         setIsEditModalOpen(true);
//     };

//     const handleEditCategoryChange = (e) => {
//         const catId = e.target.value;
//         const foundCategory = categories.find(c => c._id === catId);
//         setEditStyles(foundCategory ? foundCategory.subCategories || [] : []);
//         setEditProduct({ ...editProduct, category: catId, style: '' });
//     };

//     const handleUpdateSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const formData = new FormData();
//             formData.append('name', editProduct.name);
//             formData.append('price', editProduct.price);
//             formData.append('description', editProduct.description);
//             formData.append('style', editProduct.style);
//             formData.append('countInStock', editProduct.countInStock);
//             formData.append('category', editProduct.category);
//             formData.append('brand', editProduct.brand);

//             if (editProduct.newImage) {
//                 formData.append('image', editProduct.newImage);
//             }

//             await API.put(`/api/admin/products/${editProduct._id}`, formData);
//             alert("Update Successful!");
//             setIsEditModalOpen(false);
//             refreshData();
//         } catch (err) {
//             alert(err.response?.data?.message || "Update failed");
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const formData = new FormData();
//             formData.append('name', product.name);
//             formData.append('price', product.price);
//             formData.append('description', product.description);
//             formData.append('image', product.image);
//             formData.append('style', product.style);
//             formData.append('countInStock', product.countInStock);
//             formData.append('category', selectedCategory);
//             formData.append('brand', product.brand);

//             await API.post('/api/admin/products', formData);
//             alert("Success! Product uploaded.");

//             setProduct({
//                 name: '', description: '', price: '', discountPrice: '',
//                 image: null, style: '', warranty: '1 Year Warranty', countInStock: 0, brand: ''
//             });
//             if (imagePreview) URL.revokeObjectURL(imagePreview);
//             setImagePreview(null);
//             setSelectedCategory('');

//             const fileInput = document.querySelector('input[type="file"]');
//             if (fileInput) fileInput.value = "";

//             refreshData();
//         } catch (err) {
//             alert(err.response?.data?.message || "Upload failed");
//         }
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to remove this watch?")) {
//             try {
//                 await API.delete(`/api/admin/products/${id}`);
//                 refreshData();
//             } catch (err) {
//                 alert("Delete failed");
//             }
//         }
//     };

//     return (
//         <div className="max-w-6xl mx-auto p-6 space-y-12">
//             {/* --- ADD PRODUCT FORM --- */}
//             <div className="bg-white shadow-lg rounded-lg p-8 border-t-4 border-[#D4AF37]">
//                 <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Add New Sarvoday Watch</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <input
//                             type="text" placeholder="Watch Name" className="border p-2 rounded"
//                             value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })}
//                             required
//                         />
//                         <input
//                             type="text" placeholder="Brand Name" className="border p-2 rounded"
//                             value={product.brand} onChange={(e) => setProduct({ ...product, brand: e.target.value })}
//                             required
//                         />
//                         <div className="flex gap-2">
//                             <select className="border p-2 rounded flex-1" onChange={handleCategoryChange} value={selectedCategory} required>
//                                 <option value="">Select Category</option>
//                                 {categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//                             </select>
//                             <select className="border p-2 rounded flex-1" value={product.style} required
//                                 onChange={(e) => setProduct({ ...product, style: e.target.value })} disabled={!availableStyles.length}>
//                                 <option value="">Select Style</option>
//                                 {availableStyles?.map(s => <option key={s} value={s}>{s}</option>)}
//                             </select>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <input type="number" placeholder="Price (₹)" className="border p-2 rounded"
//                             value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} required />
//                         <input type="number" placeholder="Stock" className="border p-2 rounded"
//                             value={product.countInStock} onChange={(e) => setProduct({ ...product, countInStock: e.target.value })} required />
//                         <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all relative">
//                             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
//                             {imagePreview ? (
//                                 <img src={imagePreview} alt="Preview" className="h-32 object-contain" />
//                             ) : (
//                                 <div className="text-center">
//                                     <p className="text-sm text-gray-600">Click to upload watch image</p>
//                                     <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <textarea placeholder="Description" className="border p-2 w-full rounded h-24"
//                         value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} required />
//                     <button type="submit" className="w-full bg-[#1a1a1a] text-[#D4AF37] font-bold py-3 rounded hover:bg-black transition-colors">
//                         Save to Collection
//                     </button>
//                 </form>
//             </div>

//             {/* --- PRODUCTS TABLE WITH BRAND COLUMN --- */}
//             <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//                 <div className="bg-gray-800 p-4 text-white font-bold flex justify-between items-center">
//                     <span>Live Inventory</span>
//                     <span className="text-sm font-normal text-gray-300">{products.length} Products Found</span>
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
//                                 <th className="p-4">Watch</th>
//                                 <th className="p-4">Brand</th>
//                                 <th className="p-4">Style</th>
//                                 <th className="p-4">Price</th>
//                                 <th className="p-4">Stock</th>
//                                 <th className="p-4 text-center">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {products.map((p) => (
//                                 <tr key={p._id} className="border-b hover:bg-gray-50 transition-colors">
//                                     <td className="p-4 flex items-center gap-3">
//                                         <img
//                                             src={`http://localhost:5000${p.image}`}
//                                             alt={p.name}
//                                             className="w-12 h-12 object-cover rounded shadow-sm"
//                                             onError={(e) => {
//                                                 e.target.onerror = null;
//                                                 e.target.src = 'https://placehold.jp/24/1a1a1a/d4af37/50x50.png?text=Watch';
//                                             }}
//                                         />
//                                         <span className="font-medium text-gray-800">{p.name}</span>
//                                     </td>
//                                     <td className="p-4 text-gray-600 font-semibold">{p.brand || 'N/A'}</td>
//                                     <td className="p-4 text-gray-600 text-sm">{p.style}</td>
//                                     <td className="p-4 font-bold text-gray-900">₹{p.price.toLocaleString()}</td>
//                                     <td className="p-4">
//                                         <div className="flex flex-col items-start">
//                                             <span className="font-medium text-gray-900">{p.countInStock} Units</span>
//                                             {p.countInStock <= 3 && p.countInStock > 0 && (
//                                                 <span className="text-[8px] font-bold uppercase tracking-tighter text-orange-600 bg-orange-50 px-2 py-0.5 rounded mt-1 animate-pulse border border-orange-100">
//                                                     Low Stock
//                                                 </span>
//                                             )}
//                                             {p.countInStock === 0 && (
//                                                 <span className="text-[8px] font-bold uppercase tracking-tighter text-red-600 bg-red-50 px-2 py-0.5 rounded mt-1 border border-red-100">
//                                                     Out of Stock
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </td>
//                                     <td className="p-4 text-center">
//                                         <div className="flex justify-center gap-4">
//                                             <button
//                                                 onClick={() => openEditModal(p)}
//                                                 className="text-blue-500 hover:text-blue-700 font-semibold"
//                                             >
//                                                 Edit
//                                             </button>
//                                             <button
//                                                 onClick={() => handleDelete(p._id)}
//                                                 className="text-red-500 hover:text-red-700 font-semibold"
//                                             >
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* --- EDIT MODAL --- */}
//             {isEditModalOpen && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
//                     <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
//                         <h2 className="text-xl font-bold mb-4 border-b pb-2">Edit Product</h2>
//                         <form onSubmit={handleUpdateSubmit} className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Watch Name</label>
//                                     <input type="text" className="border p-2 rounded" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Brand</label>
//                                     <input type="text" className="border p-2 rounded" value={editProduct.brand} onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })} />
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Category</label>
//                                     <select className="border p-2 rounded" value={editProduct.category} onChange={handleEditCategoryChange}>
//                                         {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//                                     </select>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Style</label>
//                                     <select className="border p-2 rounded" value={editProduct.style} onChange={(e) => setEditProduct({ ...editProduct, style: e.target.value })}>
//                                         <option value="">Select Style</option>
//                                         {editStyles.map(s => <option key={s} value={s}>{s}</option>)}
//                                     </select>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Price (₹)</label>
//                                     <input type="number" className="border p-2 rounded" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} />
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Stock</label>
//                                     <input type="number" className="border p-2 rounded" value={editProduct.countInStock} onChange={(e) => setEditProduct({ ...editProduct, countInStock: e.target.value })} />
//                                 </div>
//                             </div>
//                             <div className="flex flex-col">
//                                 <label className="text-xs text-gray-500 mb-1">Change Image (Optional)</label>
//                                 <input type="file" className="text-sm" onChange={(e) => setEditProduct({ ...editProduct, newImage: e.target.files[0] })} />
//                             </div>
//                             <div className="flex flex-col">
//                                 <label className="text-xs text-gray-500 mb-1">Description</label>
//                                 <textarea className="border p-2 w-full rounded h-20" value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
//                             </div>
//                             <div className="flex gap-4 pt-4">
//                                 <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Update</button>
//                                 <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-400 text-white px-6 py-2 rounded font-bold hover:bg-gray-500">Cancel</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ManageProducts;
// import React, { useState, useEffect } from 'react';
// import API from '../../api/axios';

// const ManageProducts = () => {
//     const [categories, setCategories] = useState([]);
//     const [products, setProducts] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [availableStyles, setAvailableStyles] = useState([]);
//     const [variants, setVariants] = useState([{ color: 'Default', price: '', discountPrice: '', countInStock: '', imageFile: null }]);
//     // --- EDIT STATES ---
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     // const [editProduct, setEditProduct] = useState(null);
//     const [editProduct, setEditProduct] = useState({
//         images: [],
//         imagesToDelete: []
//     });
//     const [variantPreview, setVariantPreview] = useState(null);
//     // Add this with your other useState hooks
//     const [editVariantPreview, setEditVariantPreview] = useState(null);
//     const [editStyles, setEditStyles] = useState([]);
//     const [editGalleryPreviews, setEditGalleryPreviews] = useState([]);
//     const [editMainPreview, setEditMainPreview] = useState(null);
//     const [product, setProduct] = useState({
//         name: '', description: '', image: null, images: [],
//         style: '', warranty: '1 Year International Warranty', brand: ''
//     });

//     const [mainImageFile, setMainImageFile] = useState(null);
//     const [removedImages, setRemovedImages] = useState([]);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [galleryPreviews, setGalleryPreviews] = useState([]);

//     // --- MISSING FUNCTIONS ADDED HERE ---
//     const handleEditCategoryChange = (e) => {
//         const catId = e.target.value;
//         const foundCategory = categories.find(c => c._id === catId);
//         setEditStyles(foundCategory ? foundCategory.subCategories || [] : []);
//         setEditProduct({ ...editProduct, category: catId, style: '' });
//     };

//     const clearAddGalleryImage = (idx) => {
//         // 1. Remove the file from the product.images state
//         const updatedFiles = product.images.filter((_, i) => i !== idx);

//         // 2. Remove the preview URL
//         const updatedPreviews = galleryPreviews.filter((_, i) => i !== idx);

//         // 3. Update state
//         setProduct({ ...product, images: updatedFiles });
//         setGalleryPreviews(updatedPreviews);

//         // 4. Revoke the object URL to free up memory
//         URL.revokeObjectURL(galleryPreviews[idx]);
//     };
//     const clearEditGalleryImage = (idx) => {
//         // Remove from new uploads
//         const updatedNew = editProduct.newGalleryImages.filter((_, i) => i !== idx);
//         const updatedPreviews = editGalleryPreviews.filter((_, i) => i !== idx);
//         setEditProduct({ ...editProduct, newGalleryImages: updatedNew });
//         setEditGalleryPreviews(updatedPreviews);
//     };
//     // --- VARIANT HELPER FUNCTIONS ---
//     const addVariant = () => {
//     setNewProduct({
//         ...newProduct,
//         variants: [...newProduct.variants, { color: '', price: '', countInStock: '', image: null }]
//     });
// };

//     const addEditVariant = () => setEditProduct({ ...editProduct, variants: [...editProduct.variants, { color: '', price: '', discountPrice: '', countInStock: '' }] });
//     const removeEditVariant = (idx) => setEditProduct({ ...editProduct, variants: editProduct.variants.filter((_, i) => i !== idx) });
//     const updateEditVariant = (idx, field, val) => {
//         const updated = [...editProduct.variants];
//         updated[idx][field] = val;
//         setEditProduct({ ...editProduct, variants: updated });
//     };
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // --- FILE/CLEANUP LOGIC ---
//     const cleanupEditPreviews = () => {
//         if (editMainPreview) URL.revokeObjectURL(editMainPreview);
//         editGalleryPreviews.forEach(url => URL.revokeObjectURL(url));

//         // Add this line if you have an editVariantPreview state:
//         // if (editVariantPreview) URL.revokeObjectURL(editVariantPreview);

//         setEditMainPreview(null);
//         setEditGalleryPreviews([]);
//         // setEditVariantPreview(null); // Add this
//     };

//     const clearAddForm = () => {
//         // Revoke all created URLs for the Add form
//         if (imagePreview) URL.revokeObjectURL(imagePreview);
//         galleryPreviews.forEach(url => URL.revokeObjectURL(url));
//         if (variantPreview) URL.revokeObjectURL(variantPreview);

//         // Reset States
//         setProduct({ name: '', description: '', image: null, images: [], style: '', warranty: '1 Year International Warranty', brand: '' });
//         setVariants([{ color: 'Default', price: '', discountPrice: '', countInStock: '', imageFile: null }]);
//         setImagePreview(null);
//         setGalleryPreviews([]);
//         setVariantPreview(null); // Clear the new preview
//         setSelectedCategory('');
//     };
//     useEffect(() => {
//         return () => {
//             if (imagePreview) URL.revokeObjectURL(imagePreview);
//             galleryPreviews.forEach(url => URL.revokeObjectURL(url));
//             if (variantPreview) URL.revokeObjectURL(variantPreview); // Add this

//             if (editMainPreview) URL.revokeObjectURL(editMainPreview);
//             editGalleryPreviews.forEach(url => URL.revokeObjectURL(url));
//             // If you add editVariantPreview, add it here too
//         };
//     }, [imagePreview, galleryPreviews, variantPreview, editMainPreview, editGalleryPreviews]);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (imagePreview) URL.revokeObjectURL(imagePreview);
//             setProduct({ ...product, image: file });
//             setImagePreview(URL.createObjectURL(file));
//         }
//     };

//     const handleGalleryChange = (e) => {
//         const files = Array.from(e.target.files);
//         if (files.length > 0) {
//             const updatedFiles = [...product.images, ...files];
//             setProduct({ ...product, images: updatedFiles });
//             setGalleryPreviews(updatedFiles.map(file => URL.createObjectURL(file)));
//         }
//     };

//     // const handleRemoveExistingGalleryImage = (urlToRemove) => {
//     //     const updatedExisting = editProduct.existingGalleryImages.filter(img => img !== urlToRemove);
//     //     const imagesToRemovedList = [...(editProduct.imagesToDelete || []), urlToRemove];
//     //     setEditProduct({ ...editProduct, existingGalleryImages: updatedExisting, imagesToDelete: imagesToRemovedList });
//     // };

//     const handleRemoveExistingGalleryImage = (urlToRemove) => {
//         setEditProduct(prev => ({
//             ...prev,
//             existingGalleryImages: prev.existingGalleryImages.filter(img => img !== urlToRemove),
//             images: prev.images.filter(img => img !== urlToRemove), // Keep this for your PUT request
//             imagesToDelete: [...(prev.imagesToDelete || []), urlToRemove]
//         }));
//     };
//     const handleEditMainImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (editMainPreview) URL.revokeObjectURL(editMainPreview);
//             setEditProduct({ ...editProduct, newImage: file });
//             setEditMainPreview(URL.createObjectURL(file));
//         }
//     };

//     const handleEditGalleryChange = (e) => {
//         const files = Array.from(e.target.files);
//         if (files.length > 0) {
//             const updatedEditFiles = [...(editProduct.newGalleryImages || []), ...files];
//             setEditProduct({ ...editProduct, newGalleryImages: updatedEditFiles });
//             setEditGalleryPreviews(updatedEditFiles.map(file => URL.createObjectURL(file)));
//         }
//     };

//     // --- DATA FETCHING ---
//     const refreshData = async () => {
//         try {
//             const catRes = await API.get('/api/admin/category');
//             const prodRes = await API.get('/api/admin/products');
//             setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);
//             setProducts(Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.products || []);
//         } catch (err) { console.error("Data refresh failed", err); }
//     };

//     useEffect(() => { refreshData(); }, []);

//     const handleCategoryChange = (e) => {
//         const catId = e.target.value;
//         setSelectedCategory(catId);
//         const foundCategory = categories.find(c => c._id === catId);
//         setAvailableStyles(foundCategory ? foundCategory.subCategories || [] : []);
//         setProduct({ ...product, category: catId, style: '' });
//     };

//     const openEditModal = (p) => {
//         const catId = typeof p.category === 'object' ? p.category._id : p.category;
//         setEditProduct({
//             ...p,
//             category: catId || '',
//             variants: p.variants && p.variants.length > 0 ? p.variants : [{ color: 'Default', price: 0, discountPrice: 0, countInStock: 0 }],
//             // Initialize 'images' with the current product images
//             images: p.images || [],
//             existingGalleryImages: p.images || [],
//             newImage: null,
//             newGalleryImages: [],
//             imagesToDelete: []
//         });
//         const foundCategory = categories.find(c => c._id === catId);
//         setEditStyles(foundCategory ? foundCategory.subCategories || [] : []);
//         setIsEditModalOpen(true);
//     };

//     // --- SUBMISSION ---
//     const handleUpdateSubmit = async (e) => {
//         e.preventDefault();

//         if (editProduct.newGalleryImages?.length > 5) {
//             alert("You can only upload up to 15 gallery images.");
//             return;
//         }
//         try {
//             const formData = new FormData();

//             // 1. Append simple fields
//             formData.append('name', editProduct.name || '');
//             formData.append('warranty', editProduct.warranty || '');
//             formData.append('description', editProduct.description || '');
//             formData.append('style', editProduct.style || '');
//             formData.append('category', editProduct.category || '');
//             formData.append('brand', editProduct.brand || '');

//             // 2. Append JSON data
//             formData.append('variants', JSON.stringify(editProduct.variants || []));
//             formData.append('imagesToDelete', JSON.stringify(editProduct.imagesToDelete || []));

//             // 3. Append Main Image if changed
//             if (editProduct.newImage) {
//                 formData.append('image', editProduct.newImage);
//             }

//             // 4. Append New Gallery Files ONLY ONCE
//             if (editProduct.newGalleryImages && editProduct.newGalleryImages.length > 0) {
//                 editProduct.newGalleryImages.forEach((file) => {
//                     formData.append('images', file);
//                 });
//             }

//             // 5. Append Variant Images
//             editProduct.variants.forEach((v, index) => {
//                 // 1. Send the variant data as a string
//                 formData.append(`variant_${index}`, JSON.stringify({
//                     color: v.color,
//                     price: v.price,
//                     discountPrice: v.discountPrice,
//                     countInStock: v.countInStock
//                 }));

//                 // 2. Send the NEW files for this specific variant
//                 if (v.newFiles && v.newFiles.length > 0) {
//                     v.newFiles.forEach((file) => {
//                         formData.append(`variant_${index}_images`, file);
//                     });
//                 }
//             });

//             // 6. Send request
//             const response = await API.put(`/api/admin/products/${editProduct._id}`, formData);

//             if (response.status === 200 || response.status === 201) {
//                 alert("Product updated successfully!");
//                 cleanupEditPreviews();
//                 setEditProduct(null);
//                 setIsEditModalOpen(false);
//                 refreshData();
//             }
//         } catch (err) {
//             console.error("Update error:", err);
//             // Use optional chaining to safely access the error message
//             const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred.";
//             alert(errorMessage);
//         } finally {
//             setIsSubmitting(false); // This ensures the button re-enables even if it crashes
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const formData = new FormData();
//             formData.append('name', product.name);
//             formData.append('description', product.description);
//             formData.append('category', selectedCategory);
//             formData.append('brand', product.brand);
//             formData.append('style', product.style);
//             formData.append('warranty', product.warranty);
//             formData.append('imagesToDelete', JSON.stringify(removedImages));
//             // variants.forEach((v, index) => {
//             //     formData.append(`variants[${index}][color]`, v.color);
//             //     formData.append(`variants[${index}][price]`, v.price);
//             //     formData.append(`variants[${index}][discountPrice]`, v.discountPrice);
//             //     formData.append(`variants[${index}][countInStock]`, v.countInStock);

//             //     // Append the file if it exists
//             //     if (v.imageFile) {
//             //         formData.append(`variants[${index}][image]`, v.imageFile);
//             //     }
//             // });
//             formData.append('variants', JSON.stringify(variants.map(v => ({
//                 color: v.color,
//                 price: v.price,
//                 discountPrice: v.discountPrice,
//                 countInStock: v.countInStock
//             }))));

//             // Append individual variant images with a predictable naming convention
//             variants.forEach((v, index) => {
//                 if (v.imageFile) {
//                     formData.append(`variantImage_${index}`, v.imageFile);
//                 }
//             });
//             // if (product.image) formData.append('image', product.image);
//             // if (mainImageFile) {
//             //     formData.append('image', mainImageFile);
//             // }
//             if (mainImageFile) formData.append('image', mainImageFile);
//             product.images.forEach(f => { if (f instanceof File) formData.append('images', f); });
//             // product.images.forEach(f => formData.append('images', f));

//             await API.post('/api/admin/products', formData, {
//                 // headers: { 'Content-Type': 'multipart/form-data' }
//             });
//             alert("Success! Product uploaded.");
//             // setRemovedImages([]);
//             // setProduct({ name: '', description: '', style: '', brand: '', warranty: '1 Year International Warranty', image: null, images: [] });
//             // setVariants([{ color: '', price: '', discountPrice: '', countInStock: '' }]);
//             refreshData();
//         } catch (err) {
//             console.error(err);
//             alert("Upload failed: " + (err.response?.data?.message || err.message));
//         }
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure?")) {
//             try { await API.delete(`/api/admin/products/${id}`); refreshData(); }
//             catch (err) { alert("Delete failed"); }
//         }
//     };
//     return (
//         <div className="max-w-6xl mx-auto p-6 space-y-12">
//             {/* --- ADD PRODUCT FORM --- */}
//             <div className="bg-white shadow-lg rounded-lg p-8 border-t-4 border-[#D4AF37]">
//                 <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Add New Sarvoday Watch</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <input
//                             type="text" placeholder="Watch Name" className="border p-2 rounded"
//                             value={product.name || ''}
//                             onChange={(e) => setProduct({ ...product, name: e.target.value })}
//                             required
//                         />
//                         <input
//                             type="text" placeholder="Brand Name" className="border p-2 rounded"
//                             value={product.brand || ''}
//                             onChange={(e) => setProduct({ ...product, brand: e.target.value })}
//                             required
//                         />
//                         <input
//                             type="text" placeholder="Color / Variant" className="border p-2 rounded"
//                             // Access nested variant property
//                             value={product.variants?.[0]?.color || ''}
//                             onChange={(e) => setProduct({
//                                 ...product,
//                                 variants: [{ ...(product.variants?.[0] || {}), color: e.target.value }]
//                             })}
//                             required
//                         />
//                         <div className="flex gap-2">
//                             <select className="border p-2 rounded flex-1" onChange={handleCategoryChange} value={selectedCategory || ''} required>
//                                 <option value="">Select Category</option>
//                                 {categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//                             </select>
//                             <select className="border p-2 rounded flex-1" value={product.style || ''} required
//                                 onChange={(e) => setProduct({ ...product, style: e.target.value })} disabled={!availableStyles.length}>
//                                 <option value="">Select Style</option>
//                                 {availableStyles?.map(s => <option key={s} value={s}>{s}</option>)}
//                             </select>
//                         </div>
//                         <input
//                             type="text" placeholder="Warranty Period" className="border p-2 rounded"
//                             value={product.warranty || ''}
//                             onChange={(e) => setProduct({ ...product, warranty: e.target.value })}
//                             required
//                         />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                         <input type="number" placeholder="Original Price (₹)" className="border p-2 rounded"
//                             value={product.variants?.[0]?.price || ''}
//                             onChange={(e) => setProduct({
//                                 ...product,
//                                 variants: [{ ...(product.variants?.[0] || {}), price: e.target.value }]
//                             })}
//                             required
//                         />

//                         <input type="number" placeholder="Discount Price (₹)" className="border p-2 rounded"
//                             value={product.discountPrice || ''} onChange={(e) => setProduct({ ...product, discountPrice: e.target.value })} />

//                         <input type="number" placeholder="Stock Inventory" className="border p-2 rounded"
//                             value={product.variants?.[0]?.countInStock || ''}
//                             onChange={(e) => setProduct({
//                                 ...product,
//                                 variants: [{ ...(product.variants?.[0] || {}), countInStock: e.target.value }]
//                             })}
//                             required
//                         />

//                         <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50 relative min-h-[90px]">
//                             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
//                             {imagePreview ? (
//                                 <img src={`http://localhost:5000${product.image}`} alt="Preview" className="h-16 object-contain" />
//                             ) : (
//                                 <div className="text-center text-xs text-gray-500">
//                                     <p className="font-bold text-blue-600">Upload Main View</p>
//                                 </div>
//                             )}
//                         </div>
//                         <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50 relative min-h-[90px]">
//                             <label className="text-[10px] font-bold text-gray-600">Variant Color Image</label>
//                             <input
//                                 type="file"
//                                 className="absolute inset-0 opacity-0 cursor-pointer"
//                                 onChange={(e) => {
//                                     const file = e.target.files[0];
//                                     if (file) {
//                                         if (variantPreview) URL.revokeObjectURL(variantPreview);
//                                         setVariantPreview(URL.createObjectURL(file));
//                                         setProduct({
//                                             ...product,
//                                             variants: [{ ...(product.variants?.[0] || {}), imageFile: file }]
//                                         });
//                                     }
//                                 }}
//                                 accept="image/*"
//                             />
//                             {variantPreview ? (
//                                 <img src={variantPreview} alt="Variant Preview" className="h-16 object-contain mt-1" />
//                             ) : (
//                                 <p className="text-[10px] text-gray-400 mt-1">No image selected</p>
//                             )}
//                         </div>

//                     </div>

//                     <div className="border p-4 bg-gray-50 rounded-lg space-y-2">
//                         <label className="text-xs font-bold text-gray-600 block">Product Gallery Details Images (Select multiple angles up to 5)</label>
//                         <input type="file" multiple onChange={handleGalleryChange} accept="image/*" className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
//                         {galleryPreviews.length > 0 && (
//                             <div className="flex gap-2 pt-2 overflow-x-auto">
//                                 {galleryPreviews.map((url, idx) => (
//                                     <div key={idx} className="relative group w-16 h-16 flex-shrink-0">
//                                         <img src={url} alt={`Gallery Preview ${idx}`} className="w-full h-full object-cover border rounded shadow-sm bg-white" />
//                                         <button type="button" onClick={() => clearAddGalleryImage(idx)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center shadow opacity-90 hover:bg-red-700">✕</button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     <textarea placeholder="Description Details" className="border p-2 w-full rounded h-24"
//                         value={product.description || ''} onChange={(e) => setProduct({ ...product, description: e.target.value })} required />

//                     <button type="submit" className="w-full bg-[#1a1a1a] text-[#D4AF37] font-bold py-3 rounded hover:bg-black transition-colors">
//                         Save to Collection
//                     </button>
//                 </form>
//             </div>

//             {/* --- PRODUCTS TABLE --- */}
//             <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//                 <div className="bg-gray-800 p-4 text-white font-bold flex justify-between items-center">
//                     <span>Live Inventory</span>
//                     <span className="text-sm font-normal text-gray-300">{products.length} Products Found</span>
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
//                                 <th className="p-4">Watch</th>
//                                 <th className="p-4">Brand</th>
//                                 <th className="p-4">Color</th>
//                                 <th className="p-4">Style</th>
//                                 <th className="p-4">Price</th>
//                                 <th className="p-4">Stock</th>
//                                 <th className="p-4 text-center">Action</th>
//                             </tr>
//                         </thead>
//                         {/* --- UPDATED PRODUCTS TABLE --- */}
//                         <tbody>
//                             {products.map((p) => {
//                                 // Fallback to empty values to prevent crashes
//                                 const variants = p.variants || [];
//                                 const mainVariant = variants[0] || { color: 'N/A', price: 0, discountPrice: 0, countInStock: 0 };

//                                 return (
//                                     <tr key={p._id} className="border-b hover:bg-gray-50 transition-colors">
//                                         <td className="p-4 flex items-center gap-3">
//                                             <img
//                                                 src={mainVariant.image ? `http://localhost:5000${mainVariant.image}` : '/placeholder.jpg'}
//                                                 alt={p.name}
//                                                 className="w-12 h-12 object-cover rounded shadow-sm"
//                                             />
//                                             <span className="font-medium text-gray-800">{p.name}</span>
//                                         </td>
//                                         <td className="p-4 text-gray-600 font-semibold">{p.brand || 'N/A'}</td>
//                                         <td className="p-4 text-gray-600 text-sm">
//                                             {variants.map((v, i) => (
//                                                 <span key={`${p._id}-${i}`} className="block bg-gray-100 rounded px-2 py-0.5 mb-1 text-xs">
//                                                     {v.color}
//                                                 </span>
//                                             ))}
//                                         </td>
//                                         <td className="p-4 text-gray-600 text-sm">{p.style || 'N/A'}</td>
//                                         <td className="p-4 font-bold text-gray-900">
//                                             {mainVariant.discountPrice > 0 ? (
//                                                 <div className="flex flex-col">
//                                                     <span className="text-green-600">₹{Number(mainVariant.discountPrice).toLocaleString()}</span>
//                                                     <span className="text-xs line-through text-gray-400">₹{Number(mainVariant.price).toLocaleString()}</span>
//                                                 </div>
//                                             ) : (
//                                                 <span>₹{Number(mainVariant.price || 0).toLocaleString()}</span>
//                                             )}
//                                         </td>
//                                         <td className="p-4">
//                                             <span className="font-medium text-gray-900">{mainVariant.countInStock} Units</span>
//                                         </td>
//                                         <td className="p-4 text-center">
//                                             <button onClick={() => openEditModal(p)} className="text-blue-500 hover:text-blue-700 mr-4">Edit</button>
//                                             <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700">Delete</button>
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* --- EDIT MODAL --- */}
//             {isEditModalOpen && editProduct && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
//                     <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
//                         <h2 className="text-xl font-bold mb-4 border-b pb-2">Edit Product Profile</h2>
//                         <form onSubmit={handleUpdateSubmit} className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 {/* Root Properties */}
//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Watch Name</label>
//                                     <input type="text" className="border p-2 rounded" value={editProduct.name || ''} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Brand</label>
//                                     <input type="text" className="border p-2 rounded" value={editProduct.brand || ''} onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })} />
//                                 </div>

//                                 {/* --- DYNAMIC VARIANT EDITOR --- */}
//                                 <div className="col-span-2 space-y-4 border-t pt-4">
//                                     <h3 className="font-bold text-sm text-gray-700">Manage Variants (Colors)</h3>

//                                     {editProduct.variants?.map((v, index) => (
//                                         <div key={index} className="grid grid-cols-4 gap-2 items-center bg-gray-50 p-3 rounded border">
//                                             <input
//                                                 placeholder="Color" className="border p-2 rounded text-sm"
//                                                 value={v.color || ''}
//                                                 onChange={(e) => {
//                                                     const newVariants = [...editProduct.variants];
//                                                     newVariants[index].color = e.target.value;
//                                                     setEditProduct({ ...editProduct, variants: newVariants });
//                                                 }}
//                                             />
//                                             <input
//                                                 type="number" placeholder="Price" className="border p-2 rounded text-sm"
//                                                 value={v.price || ''}
//                                                 onChange={(e) => {
//                                                     const newVariants = [...editProduct.variants];
//                                                     newVariants[index].price = Number(e.target.value);
//                                                     setEditProduct({ ...editProduct, variants: newVariants });
//                                                 }}
//                                             />
//                                             <input
//                                                 type="number" placeholder="Stock" className="border p-2 rounded text-sm"
//                                                 value={v.countInStock || ''}
//                                                 onChange={(e) => {
//                                                     const newVariants = [...editProduct.variants];
//                                                     newVariants[index].countInStock = Number(e.target.value);
//                                                     setEditProduct({ ...editProduct, variants: newVariants });
//                                                 }}
//                                             />
//                                             <input
//                                                 type="file"
//                                                 onChange={(e) => handleVariantImageChange(e, index)}
//                                             />
//                                             {/* <img src={v.image} className="w-10 h-10" /> */}
//                                             <img
//                                                 src={v.image instanceof File ? URL.createObjectURL(v.image) : `http://localhost:5000${v.image}`}
//                                                 className="w-10 h-10 object-cover rounded"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 className="text-red-500 text-xs font-bold"
//                                                 onClick={() => {
//                                                     const newVariants = editProduct.variants.filter((_, i) => i !== index);
//                                                     setEditProduct({ ...editProduct, variants: newVariants });
//                                                 }}
//                                             >
//                                                 Remove
//                                             </button>
//                                         </div>
//                                     ))}

//                                     {/* Button to add a completely new variant */}
//                                     <button
//                                         type="button"
//                                         className="text-blue-600 text-sm font-bold mt-2"
//                                         onClick={() => setEditProduct({
//                                             ...editProduct,
//                                             variants: [...(editProduct.variants || []), { color: '', price: 0, countInStock: 0 }]
//                                         })}
//                                     >
//                                         + Add New Color Variant
//                                     </button>
//                                 </div>

//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Category</label>
//                                     <select className="border p-2 rounded" value={editProduct.category || ''} onChange={handleEditCategoryChange}>
//                                         <option value="">Select Category</option>
//                                         {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//                                     </select>
//                                 </div>

//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Style</label>
//                                     <select className="border p-2 rounded" value={editProduct.style || ''} onChange={(e) => setEditProduct({ ...editProduct, style: e.target.value })}>
//                                         <option value="">Select Style</option>
//                                         {editStyles.map(s => <option key={s} value={s}>{s}</option>)}
//                                     </select>
//                                 </div>

//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Original Price (₹)</label>
//                                     <input type="number" className="border p-2 rounded" value={editProduct.variants?.[0]?.price || ''} onChange={(e) => setEditProduct({ ...editProduct, variants: [{ ...(editProduct.variants?.[0] || {}), price: Number(e.target.value) }] })} />
//                                 </div>

//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Discount Price (₹)</label>
//                                     <input type="number" className="border p-2 rounded" value={editProduct.variants?.[0]?.discountPrice || ''} onChange={(e) => setEditProduct({ ...editProduct, variants: [{ ...(editProduct.variants?.[0] || {}), discountPrice: Number(e.target.value) }] })} />
//                                 </div>

//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Warranty Details</label>
//                                     <input type="text" className="border p-2 rounded" value={editProduct.warranty || ''} onChange={(e) => setEditProduct({ ...editProduct, warranty: e.target.value })} />
//                                 </div>

//                                 <div className="flex flex-col">
//                                     <label className="text-xs text-gray-500 mb-1">Stock</label>
//                                     <input type="number" className="border p-2 rounded" value={editProduct.variants?.[0]?.countInStock || ''} onChange={(e) => setEditProduct({ ...editProduct, variants: [{ ...(editProduct.variants?.[0] || {}), countInStock: Number(e.target.value) }] })} />
//                                 </div>
//                             </div>

//                             {/* --- LIVE IMAGE VISUALIZER FOR CHOSEN / EXISTING IMAGES --- */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 bg-gray-50 p-3 rounded">
//                                 {/* Main Image Block */}
//                                 <div className="flex flex-col space-y-2">
//                                     <label className="text-xs font-bold text-gray-600">Replace Main Image</label>

//                                     {/* Previews logic for Main Image */}
//                                     <div className="w-20 h-20 bg-white border rounded flex items-center justify-center p-1 shadow-sm">
//                                         {editMainPreview ? (
//                                             <img src={editMainPreview} alt="New preview" className="max-w-full max-h-full object-contain" />
//                                         ) : (editProduct.existingImage && editProduct.existingImage !== "") ? (
//                                             <img src={`http://localhost:5000${editProduct.existingImage}`} alt="Current Live" className="max-w-full max-h-full object-contain" />
//                                         ) : (
//                                             <span className="text-[10px] text-gray-400">No Image</span>
//                                         )}
//                                     </div>

//                                     <input type="file" className="text-xs file:bg-gray-200 file:border-0 file:p-1.5 file:rounded cursor-pointer" onChange={handleEditMainImageChange} accept="image/*" />
//                                 </div>

//                                 {/* Gallery Image Block */}
//                                 <div className="flex flex-col space-y-2">
//                                     <label className="text-xs font-bold text-gray-600">Replace Gallery Angles (Accumulates selections)</label>

//                                     {/* Render currently saved gallery items if any are present */}
//                                     {editProduct.existingGalleryImages && editProduct.existingGalleryImages.length > 0 && (
//                                         <div className="space-y-1">
//                                             <span className="text-[9px] text-gray-400 block font-semibold uppercase">Currently Saved in DB:</span>
//                                             <div className="flex gap-1.5 overflow-x-auto py-1">
//                                                 {editProduct.existingGalleryImages.map((imgUrl, i) => (
//                                                     <div key={i} className="relative group w-10 h-10 flex-shrink-0">
//                                                         <img
//                                                             src={`http://localhost:5000${imgUrl}`}
//                                                             alt="Live Angle"
//                                                             className="w-full h-full object-cover border rounded bg-white shadow-sm"
//                                                         />
//                                                         {/* Absolute Delete Action Overlaid Badge */}
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => handleRemoveExistingGalleryImage(imgUrl)}
//                                                             className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center shadow opacity-90 hover:bg-red-700 z-10"
//                                                             title="Remove image from database"
//                                                         >
//                                                             ✕
//                                                         </button>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}

//                                     <input type="file" multiple className="text-xs file:bg-gray-200 file:border-0 file:p-1.5 file:rounded cursor-pointer" onChange={handleEditGalleryChange} accept="image/*" />
//                                 </div>
//                             </div>

//                             {/* Live Preview row specifically for pending updates in your Modal form context */}
//                             {editGalleryPreviews.length > 0 && (
//                                 <div className="border border-dashed p-3 rounded bg-white space-y-1">
//                                     <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">New Gallery Images Pending Update:</span>
//                                     <div className="flex gap-2 pt-1 overflow-x-auto">
//                                         {editGalleryPreviews.map((url, idx) => (
//                                             <div key={idx} className="relative group w-14 h-14 flex-shrink-0">
//                                                 <img src={url} alt={`Pending edit angle ${idx}`} className="w-full h-full object-cover border rounded shadow-inner" />
//                                                 <button type="button" onClick={() => clearEditGalleryImage(idx)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center shadow hover:bg-red-700">✕</button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             <div className="flex flex-col">
//                                 <label className="text-xs text-gray-500 mb-1">Description</label>
//                                 <textarea className="border p-2 w-full rounded h-20" value={editProduct.description || ''} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
//                             </div>
//                             <div className="flex gap-4 pt-4">
//                                 <button
//                                     type="submit"
//                                     disabled={isSubmitting}
//                                     className={`bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 transition-opacity ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//                                         }`}
//                                 >
//                                     {isSubmitting ? 'Updating...' : 'Update'}
//                                 </button>

//                                 <button
//                                     type="button"
//                                     disabled={isSubmitting} // Disable Cancel during submission as well
//                                     onClick={() => {
//                                         cleanupEditPreviews();
//                                         setIsEditModalOpen(false);
//                                     }}
//                                     className="bg-gray-400 text-white px-6 py-2 rounded font-bold hover:bg-gray-500"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ManageProducts;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [availableStyles, setAvailableStyles] = useState([]);

    // Clean state: Removed mainImage and galleryImages
    const [formData, setFormData] = useState({
        name: '', brand: '', category: '', style: '', description: '', warranty: '',
        variants: [{ color: '', price: '', discountPrice: '', countInStock: '', image: null, images: [] }]
    });

    const [editingProduct, setEditingProduct] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);
    // const totalPages = Math.ceil(products.length / itemsPerPage);

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

        // Only update if a value is provided
        if (value !== undefined) {
            newVariants[index][field] = value;
        }

        setFormData({ ...formData, variants: newVariants });
    };
    const addVariant = () => {
        setFormData({ ...formData, variants: [...formData.variants, { color: '', price: '', discountPrice: '', countInStock: '', image: null }] });
    };

    const removeVariant = (indexToRemove) => {
        // Prevent removing the last remaining variant if you want to keep at least one
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
        // 1. Append text fields
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

            // Cleanup
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

    //fetch product details
    const fetchProducts = async (page = 1) => {
        try {
            // Now requesting specific page and limit
            const res = await axios.get(`http://localhost:5000/api/admin/products?page=${page}&limit=${itemsPerPage}`);

            // Update state based on the new backend response object
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
        // 1. Get the token from local storage
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo ? userInfo.token : null;

        if (!token) {
            alert("You are not authorized! Please login.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                // 2. Include the Authorization header
                await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // 3. Update UI
                setProducts(products.filter(p => p._id !== productId));
                alert("Product deleted successfully");
            } catch (err) {
                console.error("Delete Error", err);
                // Handle specific errors
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
            variants: product.variants // Populate existing variants
        });
        setAvailableStyles(product.category?.subCategories || []); // Load styles for this category
        setIsModalOpen(true);
    };
    return (
        <div className="p-6">
            <button
                onClick={() => {
                    setEditingProduct(null); // Clear editing state
                    resetForm();             // Clear form data
                    setIsModalOpen(true);    // Open the modal
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
        // Highlight logic
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
            
            {/* Stock Cell: The Red Highlight makes it instantly visible */}
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
            {/* Pagination Controls */}
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
                                    {/* CHANGE THIS: Ensure it maps over the updated availableStyles array */}
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