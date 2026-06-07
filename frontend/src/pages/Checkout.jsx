import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Check, Loader2, Phone } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();

  // Form States
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState(''); // NEW: Phone state
  const [shouldSave, setShouldSave] = useState(true);

  // Data States
  const [cartItems, setCartItems] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) return navigate('/login');

      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        const { data: cartData } = await axios.get('http://localhost:5000/api/admin/cart', config);
        setCartItems(cartData);

        const { data: userData } = await axios.get('http://localhost:5000/api/users/profile', config);
        setSavedAddresses(userData.addresses || []);

        // Pre-fill phone from profile if available
        if (userData.phone) setPhone(userData.phone);
      } catch (err) {
        console.error("Error fetching checkout data:", err.response?.data?.message || err.message);
      }
    };
    fetchCheckoutData();
  }, [navigate]);

  const handleSelectSavedAddress = (addr) => {
    setAddress(addr.address);
    setCity(addr.city);
    setPostalCode(addr.postalCode);
    setCountry(addr.country);
    setPhone(addr.phone || phone); // Use address phone or keep current
    setSelectedAddressId(addr._id);
  };

  // const subtotal = cartItems.reduce((acc, item) => {
  //   const price = item.product?.price || 0;
  //   return acc + price * item.quantity;
  // }, 0);
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.price || item.product?.price || 0;
    return acc + (price * item.quantity);
}, 0);

const shippingPrice = (cartItems.length === 0 || subtotal >= 5000) ? 0 : 150;
const totalPrice = subtotal + shippingPrice;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (loading) return;
    setLoading(true);

    const shippingAddress = {
      address,
      city,
      postalCode,
      country,
      phone
    };

    try {
      // 1. Store locally for use by the PlaceOrder screen template
      localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
      localStorage.setItem('orderSummary', JSON.stringify({ subtotal, shippingPrice, totalPrice }));

      // 2. Safely sync to database vault if the user requested it
      if (shouldSave && !selectedAddressId) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        // Payload data to match what addAddress expects
        const backendAddressPayload = {
          label: 'Home',
          address,
          city,
          postalCode,
          country,
          phone
        };

        // 🎯 CAPTURE RESPONSE: Grab the freshly updated address array from backend
        const { data: updatedAddressesArray } = await axios.post(
          'http://localhost:5000/api/users/address',
          backendAddressPayload,
          config
        );

        console.log("✅ Address successfully saved to user vault!");

        // 🎯 SYNC STATE CACHE: Keep localStorage updated immediately
        if (userInfo) {
          // If your userInfo nests profile elements inside a .user property block:
          if (userInfo.user) {
            userInfo.user.addresses = updatedAddressesArray;
          } else {
            // If your userInfo object has a flat structure:
            userInfo.addresses = updatedAddressesArray;
          }
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }

        // Inform other tracking listeners (Navbar components, etc.) that user state updated
        window.dispatchEvent(new Event("userUpdate"));
      }

      setLoading(false);
      navigate('/placeorder');
    } catch (err) {
      console.error("Auto-save failed:", err.response?.data?.message || err.message);
      setLoading(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 font-serif">
      <div className="flex flex-col md:flex-row gap-16">
        <div className="flex-1">
          <h1 className="text-2xl tracking-widest uppercase mb-8 pb-4 border-b border-[#D4AF37]/20">
            Shipping Details
          </h1>

          {savedAddresses.length > 0 && (
            <div className="mb-12">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4 font-sans font-bold">
                Saved Destinations
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr._id}
                    onClick={() => handleSelectSavedAddress(addr)}
                    className={`relative p-4 border transition-all cursor-pointer ${selectedAddressId === addr._id ? 'border-black bg-gray-50' : 'border-gray-100'
                      }`}
                  >
                    {selectedAddressId === addr._id && <Check size={14} className="absolute top-2 right-2 text-black" />}
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={12} className="text-[#D4AF37]" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">{addr.label || 'Saved Address'}</span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{addr.address}</p>
                    <p className="text-[10px] text-gray-400 uppercase mt-1">{addr.city}, {addr.postalCode}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6 font-sans">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Street Address</label>
              <input
                type="text" required value={address}
                onChange={(e) => { setAddress(e.target.value); setSelectedAddressId(null); }}
                className="w-full border-b border-gray-200 py-3 focus:border-[#D4AF37] outline-none transition bg-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">City</label>
                <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full border-b border-gray-200 py-3 outline-none bg-transparent" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Postal Code</label>
                <input type="text" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full border-b border-gray-200 py-3 outline-none bg-transparent" />
              </div>
            </div>

            {/* NEW: Phone Field */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Contact Number</label>
              <div className="flex items-center border-b border-gray-200">
                <span className="text-xs text-gray-400 pr-2">+91</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-3 focus:border-[#D4AF37] outline-none transition bg-transparent"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
            </div>

            {!selectedAddressId && (
              <div className="flex items-center gap-3 py-4">
                <input type="checkbox" id="save" checked={shouldSave} onChange={(e) => setShouldSave(e.target.checked)} className="accent-black" />
                <label htmlFor="save" className="text-[10px] uppercase tracking-widest text-gray-500">Save for future use</label>
              </div>
            )}

            {/* 🔥 UPDATED SUBMIT BUTTON: Added styling enhancements for disabled state and dynamic processing text */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex justify-center items-center gap-2 hover:bg-[#D4AF37] disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Processing...
                </>
              ) : (
                'Continue to Payment'
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-80 h-fit sticky top-32">
          <div className="bg-gray-50 p-8 border border-gray-100">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-8 font-sans font-bold">Summary</h2>
            <div className="space-y-4 text-sm font-sans">
              <div className="flex justify-between text-gray-600">
                <span className="text-[10px] uppercase tracking-widest">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              {/* Only show shipping if there are items in the cart */}
              {cartItems.length > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span className="text-[10px] uppercase tracking-widest">Shipping</span>
                  <span className={`font-bold ${shippingPrice === 0 ? 'text-green-600' : ''}`}>
                    {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                  </span>
                </div>
              )}
              {subtotal > 0 && subtotal < 5000 && (
                <p className="text-[9px] text-[#D4AF37] italic mt-1">
                  Add ₹{(5000 - subtotal).toLocaleString()} more for free shipping
                </p>
              )}
              {/* <div className="flex justify-between text-gray-600">
                <span className="text-[10px] uppercase tracking-widest">Shipping</span>
                <span className={`font-bold ${shippingPrice === 0 ? 'text-green-600' : ''}`}>
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                </span>
              </div> */}
              <div className="border-t border-gray-200 pt-6 flex justify-between items-baseline font-bold">
                <span className="text-[10px] uppercase tracking-widest">Total</span>
                <span className="text-xl font-light">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
