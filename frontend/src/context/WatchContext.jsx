import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';

const WatchContext = createContext();

export const WatchProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0 });

//     const fetchProducts = async (page = 1, limit = 8, style = 'All', search = '') => {
//     try {
//         setLoading(true);
//         // Build the URL with optional filters
//         const styleQuery = style !== 'All' ? `&style=${style}` : '';
//         const searchQuery = search ? `&search=${search}` : '';
        
//         const res = await API.get(`/api/admin/products?page=${page}&limit=${limit}${styleQuery}${searchQuery}`);
        
//         setProducts(res.data.products);
//         setPagination({
//             currentPage: res.data.currentPage,
//             totalPages: res.data.totalPages,
//             totalProducts: res.data.totalProducts
//         });
//         setLoading(false);
//     } catch (err) {
//         setLoading(false);
//     }
// };

const fetchProducts = async (page = 1, limit = 8, categoryId = '', style = 'All', search = '') => {
    try {
        setLoading(true);
        // Build the query string dynamically
        let url = `/api/admin/products?page=${page}&limit=${limit}`;
        if (categoryId) url += `&category=${categoryId}`;
        // if (style && style !== 'All') url += `&style=${style}`;
        if (style && style !== 'All') url += `&style=${encodeURIComponent(style)}`;
        if (search) url += `&search=${search}`;

        const res = await API.get(url);
        
        setProducts(res.data.products);
        setPagination({
            currentPage: res.data.currentPage,
            totalPages: res.data.totalPages,
            totalProducts: res.data.totalProducts
        });
        setLoading(false);
    } catch (err) {
        console.error("Context Fetch Error:", err);
        setLoading(false);
    }
};

    const refreshData = async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                API.get('/api/admin/category'),
                // API.get('/api/admin/products')
                // API.get('/api/admin/products?limit=500')
                fetchProducts(1, 8)
            ]);
            setCategories(catRes.data);
            // setProducts(prodRes.data);
            // setProducts(prodRes.data.products || prodRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Context Fetch Error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    // The line below was causing the error because of the .js extension
    return (
        <WatchContext.Provider value={{ categories, products, loading, pagination, fetchProducts, refreshData }}>
            {children}
        </WatchContext.Provider>
    );
};

export const useWatches = () => useContext(WatchContext);