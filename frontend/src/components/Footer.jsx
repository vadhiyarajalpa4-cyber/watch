import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#1a1a1a] text-white pt-20 pb-8 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16 text-center md:text-left">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-2xl font-serif font-bold tracking-tight">
              Sarvoday<span className="text-[#D4AF37] font-light">Watch</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">
              Crafting elegance and precision in Ahmedabad.
            </p>
            <div className="flex space-x-4 text-[10px] font-bold tracking-widest text-gray-500">
              <a href="#" className="hover:text-[#D4AF37] transition">INSTAGRAM</a>
              <a href="#" className="hover:text-[#D4AF37] transition">TWITTER</a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-center">
            <h4 className="text-[#D4AF37] uppercase tracking-widest text-[10px] font-bold mb-6">Explore</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/collection" className="hover:text-white transition">Collections</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Account</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-[#D4AF37] uppercase tracking-widest text-[10px] font-bold mb-6">Visit Us</h4>
            <div className="space-y-2 text-sm text-gray-400 text-center md:text-right">
              <p>Nava Naroda, Ahmedabad</p>
              <p>sarvoday1212@gmail.com</p>
              <p className="font-semibold text-white">+91 98765 43210</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.2em] text-gray-600">
          <p>© 2026 Sarvoday Watch. All Rights Reserved.</p>
          <button onClick={scrollToTop} className="mt-4 md:mt-0 hover:text-[#D4AF37] transition">
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;