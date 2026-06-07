import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, Clock, Loader2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Point this to your backend route
      await axios.post('http://localhost:5000/api/contact', formData);
      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error("Message failed to send", err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 font-serif">
      <div className="text-center mb-16">
        <h1 className="text-4xl tracking-[0.3em] uppercase mb-4">Contact Us</h1>
        <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
        <p className="mt-6 text-gray-500 font-sans tracking-widest uppercase text-[10px]">Reach out for bespoke inquiries and support</p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Contact Information */}
        <div className="space-y-12">
          <div>
            <h2 className="text-xl uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">Our Boutique</h2>
            <div className="space-y-6 font-sans">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#D4AF37] shrink-0" size={20} />
                <div>
                  <p className="text-sm font-bold uppercase tracking-tighter">Ahmedabad Headquarters</p>
                  <p className="text-sm text-gray-500 leading-relaxed">123 Luxury Lane, Satellite Road,<br />Ahmedabad, Gujarat 380015</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-[#D4AF37]" size={20} />
                <p className="text-sm text-gray-500">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="text-[#D4AF37]" size={20} />
                <p className="text-sm text-gray-500">concierge@sarvodaywatch.com</p>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="text-[#D4AF37]" size={20} />
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Mon - Sat: 10:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>

          {/* Optional: Embed a Google Map here */}
          {/* <div className="h-64 bg-gray-100 grayscale opacity-80 hover:grayscale-0 transition-all duration-700"> */}
             {/* Map Placeholder */}
             {/* <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] tracking-widest uppercase italic">
                Interactive Map View
             </div>
          </div> */}
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-[#D4AF37]">
                <Send size={24} />
              </div>
              <h3 className="text-lg uppercase tracking-widest">Message Received</h3>
              <p className="text-xs text-gray-500 font-sans uppercase">Our team will respond within 24 hours.</p>
              <button onClick={() => setSent(false)} className="text-[10px] underline tracking-widest uppercase mt-4">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-sans">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Full Name</label>
                  <input 
                    type="text" required 
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37] transition"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Email Address</label>
                  <input 
                    type="email" required 
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37] transition"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">Subject</label>
                <input 
                  type="text" required 
                  className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37] transition"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">How can we assist you?</label>
                <textarea 
                  rows="4" required 
                  className="w-full border border-gray-100 p-4 outline-none focus:border-[#D4AF37] transition resize-none"
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex justify-center items-center gap-3 hover:bg-[#D4AF37] transition duration-500 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Dispatch Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;