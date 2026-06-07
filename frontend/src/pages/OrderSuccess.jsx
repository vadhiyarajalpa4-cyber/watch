import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams(); 

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 pt-20">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Animated Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full animate-ping"></div>
            <CheckCircle size={80} className="text-[#D4AF37] relative z-10" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-serif tracking-widest uppercase">Order Confirmed</h1>
          <p className="text-gray-500 font-sans tracking-wide">
            Thank you for choosing <span className="text-black font-semibold">Sarvoday Watch</span>. 
            Your horological masterpiece is now being prepared for shipment.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-50 p-8 border border-gray-100 rounded-sm space-y-4">
          <div className="flex justify-between items-center text-xs uppercase tracking-[0.2em] text-gray-400 pb-4 border-b border-gray-200">
            <span>Order Reference</span>
            <span className="text-black font-bold">#{id?.slice(-8).toUpperCase()}</span>
          </div>
          
          <div className="flex items-start gap-4 text-left py-4">
            <Package className="text-[#D4AF37] shrink-0" size={20} />
            <div>
              <p className="text-sm font-sans text-gray-600">
                A confirmation email has been sent. You can track your shipment status in your personal vault.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link 
            to="/profile" 
            className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all duration-500"
          >
            View My Orders <ArrowRight size={14} />
          </Link>
          <Link 
            to="/collection" 
            className="flex items-center justify-center gap-2 px-8 py-4 border border-black text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500"
          >
            <ShoppingBag size={14} /> Continue Shopping
          </Link>
        </div>

        <p className="text-[9px] text-gray-400 uppercase tracking-widest pt-10">
          Need assistance? Our concierge is available 24/7.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;