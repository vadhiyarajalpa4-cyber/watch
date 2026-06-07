// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { CheckCircle, Truck, CreditCard, Package } from 'lucide-react';


// const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//         if (window.Razorpay) {
//             resolve(true);
//             return;
//         }
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//     });
// };

// const PlaceOrder = () => {
//     const navigate = useNavigate();
//     const [cart, setCart] = useState(null);
//     const [paymentMethod, setPaymentMethod] = useState('COD');

//     // 1. Get Data from LocalStorage
//     const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//     const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));

//     useEffect(() => {
//         if (!shippingAddress) {
//             navigate('/checkout');
//             return;
//         }

//         const fetchCart = async () => {
//             try {
//                 const { data } = await axios.get('http://localhost:5000/api/admin/cart', {
//                     headers: { Authorization: `Bearer ${userInfo.token}` }
//                 });
//                 setCart(data);
//             } catch (err) {
//                 console.error("Error fetching cart for summary", err);
//             }
//         };
//         fetchCart();
//     }, [navigate, userInfo?.token, shippingAddress]);

//     // 2. Calculations
//     // const subtotal = cart?.reduce((acc, item) => acc + item.product.price * item.quantity, 0) || 0;
//     const subtotal = cart?.reduce((acc, item) => {
//         const price = item.price || item.product?.price || 0;
//         return acc + (price * item.quantity);
//     }, 0) || 0;
//     const shippingPrice = subtotal > 5000 ? 0 : 150;
//     const totalPrice = subtotal + shippingPrice;

//     const placeOrderHandler = async () => {
//         // 1. Prepare Order Data
//         // const orderData = {
//         //     user: userInfo._id || userInfo.id,
//         //     orderItems: cart.map(item => ({
//         //         name: item.product.name,
//         //         quantity: item.quantity,
//         //         image: item.product.image,
//         //         // price: item.product.price,
//         //         price: Number(item.price || item.product?.price || 0),
//         //         product: item.product._id,
//         //         brand: item.product.brand,
//         //         style: item.product.style,
//         //     })),
//         //     shippingAddress: shippingAddress,
//         //     paymentMethod: paymentMethod,
//         //     totalPrice: totalPrice,
//         // };
//         const orderData = {
//             user: userInfo._id || userInfo.id,
//             orderItems: cart.map(item => {
//                 console.log("DEBUG: Checking image for", item.product.name, ":", item.image);
//                 // --- THE FIX ---
//                 // Access the image from the item itself (since your Cart stores it)
//                 // or fall back to the product's first variant if it's not at the root
//                 const resolvedImage = item.image || item.product?.variants?.[0]?.image || "";

//                 return {
//                     name: item.product.name,
//                     quantity: item.quantity,
//                     // Use the variable that holds the actual image path
//                     image: resolvedImage,
//                     price: Number(item.price || item.product?.price || 0),
//                     product: item.product._id,
//                     brand: item.product.brand || "Standard",
//                     style: item.product.style || "Classic",
//                 };
//             }),
//             shippingAddress: shippingAddress,
//             paymentMethod: paymentMethod,
//             totalPrice: totalPrice,
//         };

//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${userInfo.token}`
//             },
//         };

//         // --- CASE 1: CASH ON DELIVERY ---
//         if (paymentMethod === 'COD') {
//             try {
//                 const { data } = await axios.post('http://localhost:5000/api/orders', orderData, config);

//                 // Clean up
//                 setCart([]);
//                 localStorage.removeItem('cartItems');
//                 window.dispatchEvent(new Event('cartUpdate'));
//                 navigate(`/order-success/${data._id}`);
//             } catch (err) {
//                 console.error("COD Error:", err);
//                 alert(err.response?.data?.message || "Failed to place COD order.");
//             }
//         }

//         // --- CASE 2: ONLINE PAYMENT (RAZORPAY) ---
//         else {
//             try {
//                 const testAmount = totalPrice > 100000 ? 50000 : totalPrice;

//                 const { data: { order } } = await axios.post(
//                     'http://localhost:5000/api/payment/create-order',
//                     { amount: testAmount },
//                     config
//                 );

//                 const options = {
//                     key: "rzp_test_SqLF34XdMtC8rp",
//                     amount: order.amount,
//                     currency: order.currency,
//                     name: "Sarvoday Watch",
//                     description: "Premium Purchase",
//                     order_id: order.id,
//                     handler: async (response) => {
//                         try {
//                             const verifyData = {
//                                 razorpay_order_id: response.razorpay_order_id,
//                                 razorpay_payment_id: response.razorpay_payment_id,
//                                 razorpay_signature: response.razorpay_signature,
//                                 orderData: orderData
//                             };

//                             const { data: successData } = await axios.post(
//                                 'http://localhost:5000/api/payment/verify-payment',
//                                 verifyData,
//                                 config
//                             );

//                             if (successData.success) {
//                                 setCart([]);
//                                 localStorage.removeItem('cartItems');
//                                 window.dispatchEvent(new Event('cartUpdate'));
//                                 navigate(`/order-success/${successData.order._id}`);
//                             }
//                         } catch (err) {
//                             console.error("Verification Error:", err);
//                             alert("Payment verification failed.");
//                         }
//                     },
//                     prefill: {
//                         name: userInfo.name,
//                         email: userInfo.email,
//                     },
//                     theme: { color: "#D4AF37" },
//                 };

//                 const rzp = new window.Razorpay(options);
//                 rzp.open();

//             } catch (err) {
//                 console.error("Order process error:", err);
//                 alert(err.response?.data?.message || "Failed to initiate payment.");
//             }
//         }
//     };


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Truck, CreditCard, Package } from 'lucide-react';

const PlaceOrder = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));

    // --- Helper: Load Razorpay Script Dynamically ---
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        if (!shippingAddress) {
            navigate('/checkout');
            return;
        }

        const fetchCart = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/cart', {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                setCart(data);
            } catch (err) {
                console.error("Error fetching cart for summary", err);
            }
        };
        fetchCart();
    }, [navigate, userInfo?.token, shippingAddress]);

    const subtotal = cart?.reduce((acc, item) => {
        const price = item.price || item.product?.price || 0;
        return acc + (price * item.quantity);
    }, 0) || 0;
    const shippingPrice = subtotal > 5000 ? 0 : 150;
    const totalPrice = subtotal + shippingPrice;

    const placeOrderHandler = async () => {
        // Prepare Order Data
        const orderData = {
            user: userInfo._id || userInfo.id,
            orderItems: cart.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                image: item.image || item.product?.variants?.[0]?.image || "",
                price: Number(item.price || item.product?.price || 0),
                product: item.product._id,
                brand: item.product.brand || "Standard",
                style: item.product.style || "Classic",
            })),
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            totalPrice: totalPrice,
        };

        const config = {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        };

        if (paymentMethod === 'COD') {
            try {
                const { data } = await axios.post('http://localhost:5000/api/orders', orderData, config);
                setCart([]);
                localStorage.removeItem('cartItems');
                window.dispatchEvent(new Event('cartUpdate'));
                navigate(`/order-success/${data._id}`);
            } catch (err) {
                alert(err.response?.data?.message || "Failed to place COD order.");
            }
        } else {
            // --- UPDATED: Wait for script before proceeding ---
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                alert("Payment gateway failed to load. Please check your connection.");
                return;
            }

            try {
                const testAmount = totalPrice > 100000 ? 50000 : totalPrice;
                const { data: { order } } = await axios.post(
                    'http://localhost:5000/api/payment/create-order',
                    { amount: testAmount },
                    config
                );

                const options = {
                    key: "rzp_test_SqLF34XdMtC8rp",
                    amount: order.amount,
                    currency: order.currency,
                    name: "Sarvoday Watch",
                    order_id: order.id,
                    handler: async (response) => {
                        try {
                            const { data: successData } = await axios.post(
                                'http://localhost:5000/api/payment/verify-payment',
                                { ...response, orderData },
                                config
                            );
                            if (successData.success) {
                                setCart([]);
                                localStorage.removeItem('cartItems');
                                window.dispatchEvent(new Event('cartUpdate'));
                                navigate(`/order-success/${successData.order._id}`);
                            }
                        } catch (err) {
                            alert("Payment verification failed.");
                        }
                    },
                    prefill: { name: userInfo.name, email: userInfo.email },
                    theme: { color: "#D4AF37" },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } catch (err) {
                alert("Failed to initiate payment.");
            }
        }
    };
    if (!cart) return <div className="pt-40 text-center">Loading Summary...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 font-serif">
            <h1 className="text-3xl tracking-[0.2em] uppercase mb-12 text-center">Review Your Order</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Side: Review Details */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Shipping Info */}
                    <div className="flex gap-6 p-6 bg-gray-50 rounded-sm">
                        <Truck className="text-[#D4AF37]" size={24} />
                        <div>
                            <h2 className="text-xs uppercase tracking-widest font-bold mb-2">Shipping Destination</h2>
                            <p className="text-sm text-gray-600 font-sans">
                                {shippingAddress.address}, {shippingAddress.city}<br />
                                {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-sm">
                        <div className="flex items-center gap-6">
                            <CreditCard className="text-[#D4AF37]" size={24} />
                            <div>
                                <h2 className="text-xs uppercase tracking-widest font-bold mb-2">Select Payment Method</h2>
                                <div className="flex gap-4 mt-2">
                                    <button
                                        onClick={() => setPaymentMethod('COD')}
                                        className={`px-4 py-2 text-[10px] tracking-widest uppercase border transition-all duration-300 ${paymentMethod === 'COD'
                                            ? 'border-[#D4AF37] bg-white text-[#D4AF37] font-bold'
                                            : 'border-gray-200 text-gray-400 bg-transparent'
                                            }`}
                                    >
                                        Cash on Delivery
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('Online')}
                                        className={`px-4 py-2 text-[10px] tracking-widest uppercase border transition-all duration-300 ${paymentMethod === 'Online'
                                            ? 'border-[#D4AF37] bg-white text-[#D4AF37] font-bold'
                                            : 'border-gray-200 text-gray-400 bg-transparent'
                                            }`}
                                    >
                                        Online Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Review */}
                    <div className="space-y-4">
                        <h2 className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                            <Package size={18} /> Your Selection
                        </h2>
                        {cart.map((item) => {
                            // Fallback: Use item.price if item.product.price is missing
                            const price = item.price || item.product?.price || 0;
                            const name = item.product?.name || "Product Name Unavailable";
                            const image = item.product?.image || "";

                            return (
                                <div key={item.product?._id || item._id} className="flex justify-between items-center border-b pb-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={
                                                // 1. Try to use the image from the cart item itself
                                                item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`
                                                    // 2. Fallback to the product's default image
                                                    || (item.product?.image?.startsWith('http') ? item.product.image : `http://localhost:5000${item.product?.image}`)
                                            }
                                            alt={item.product?.name || "Product"}
                                            className="w-16 h-16 object-contain rounded-sm"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=150&auto=format&fit=crop";
                                            }}
                                        />
                                        <div>
                                            <p className="text-sm font-medium">{name}</p>
                                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    {/* The math now uses the fallback 'price' variable */}
                                    <p className="text-sm font-bold">₹{(Number(price) * Number(item.quantity)).toLocaleString()}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side: Final Totals & Action */}
                <div className="bg-black text-white p-8 h-fit sticky top-32 rounded-sm shadow-2xl">
                    <h2 className="text-xs uppercase tracking-[0.3em] mb-8 border-b border-white/10 pb-4">Final Valuation</h2>
                    <div className="space-y-4 font-sans text-sm">
                        <div className="flex justify-between opacity-70">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between opacity-70">
                            <span>Shipping Fee</span>
                            <span>{shippingPrice === 0 ? 'COMPLIMENTARY' : `₹${shippingPrice}`}</span>
                        </div>
                        <div className="border-t border-white/20 pt-6 mt-6 flex justify-between text-xl font-serif">
                            <span className="tracking-widest">Total</span>
                            <span className="text-[#D4AF37]">₹{totalPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        onClick={placeOrderHandler}
                        className="w-full mt-10 bg-[#D4AF37] text-black py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors duration-500 flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={14} /> Complete Purchase
                    </button>
                    <p className="text-[9px] text-center mt-4 opacity-40 uppercase tracking-widest">
                        By clicking, you agree to our premium terms of sale.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;