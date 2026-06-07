import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MoveRight, 
  ShieldCheck, 
  Settings, 
  Clock, 
  MapPin, 
  Wrench, 
  Gem, 
  Smartphone,
  ArrowUpRight
} from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-white font-sans text-[#1a1a1a]">

      {/* 1. HERO SECTION - Cinematic Entry */}
      <section className="relative h-screen flex items-center justify-center bg-[#0d0d0d] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6">
          <span className="text-[#D4AF37] uppercase tracking-[0.8em] text-[10px] mb-6 block font-bold">
            Established 2026
          </span>
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-10 tracking-tighter leading-tight">
            The Art of <br /> <span className="italic font-light text-gray-400">Timelessness</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <button className="bg-[#D4AF37] text-black px-14 py-5 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-all duration-500">
              Explore Store
            </button>
            <button className="text-white border-b border-white/20 py-2 text-[11px] uppercase tracking-[0.3em] hover:border-[#D4AF37] transition-all">
              Our Services
            </button>
          </div>
        </div>
      </section>

      {/* 2. COLLECTIONS OVERVIEW - Clean & Editorial */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-4">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] mb-4 font-bold">The Portfolio</h2>
            <p className="font-serif text-5xl tracking-tight">Our Collections</p>
          </div>
          <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
            A curated selection of mechanical excellence, designed for those who appreciate the finer details of horology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[1, 2, 3].map((id) => (
            <div key={id} className="group cursor-pointer relative">
              <div className="relative aspect-[3/4] bg-[#fdfdfd] overflow-hidden flex items-center justify-center border border-gray-50">
                <img
                  src={`/images/watch-${id}.jpg`}
                  className="w-3/4 object-contain transition-transform duration-[1500ms] group-hover:scale-110"
                  alt="Collection Piece"
                />
                {/* Subtle Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                
                {/* View More Label - Appears on Hover */}
                <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                   <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold bg-white px-6 py-3 shadow-xl">
                      View Details <ArrowUpRight size={14} />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
            {/* Redirecting Link */}
            <a href="/collection" className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-bold border-b border-black/10 pb-2 hover:border-[#D4AF37] transition-all">
                View Full Collection <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </a>
        </div>
      </section>

      {/* 3. WHY CHOOSE US - Dark Luxury Banner */}
      <section className="py-28 bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 text-center">
          {[
            { icon: <ShieldCheck size={28} />, title: "Authenticity", desc: "Verified Certification" },
            { icon: <Clock size={28} />, title: "Longevity", desc: "Lifetime Support" },
            { icon: <Gem size={28} />, title: "Heritage", desc: "Rare Acquisitions" },
            { icon: <Smartphone size={28} />, title: "Concierge", desc: "Digital Assistance" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div className="text-[#D4AF37] mb-8 transition-transform duration-500 group-hover:scale-110">{item.icon}</div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4">{item.title}</h4>
              <div className="w-8 h-[1px] bg-white/10 mb-4"></div>
              <p className="text-gray-500 text-[9px] uppercase tracking-[0.2em]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SERVICES OVERVIEW - The Atelier */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
              <div className="overflow-hidden">
                <img src="/images/service-repair.jpg" alt="Watch Repair" className="w-full h-[650px] object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-[#D4AF37] p-10 hidden lg:block shadow-2xl">
                <Wrench size={40} className="text-black" />
              </div>
            </div>
            <div className="lg:pl-10">
              <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] mb-6 font-bold">Atelier Services</h2>
              <h3 className="text-5xl font-serif mb-10 leading-tight tracking-tighter">Restoring the <br /> Pulse of Time</h3>
              <p className="text-gray-500 mb-12 leading-loose font-light text-lg">
                Our Ahmedabad atelier represents the pinnacle of technical expertise. From vintage restoration to modern movement calibration, we treat every timepiece as a masterpiece of engineering.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                {['Movement Overhaul', 'Case Refurbishing', 'Dial Restoration', 'Part Fabrication'].map((s, i) => (
                  <div key={i} className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold border-l-2 border-[#D4AF37] pl-4">
                     {s}
                  </div>
                ))}
              </div>
              <button className="bg-black text-white px-12 py-5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg">Request Appointment</button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LOCATION - Premium Dark Map */}
      <section className="py-28 bg-[#fafafa] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-20">
            <div className="lg:w-1/3">
              <div className="inline-flex items-center gap-3 text-[#D4AF37] mb-8 border border-[#D4AF37]/20 px-4 py-2 rounded-full">
                <MapPin size={16} />
                <span className="uppercase tracking-[0.3em] text-[9px] font-bold">Visit our flagship</span>
              </div>
              <h2 className="text-4xl font-serif mb-8 tracking-tight">Nava Naroda, <br/>Ahmedabad</h2>
              <p className="text-gray-500 text-sm uppercase tracking-[0.2em] leading-loose mb-10 border-l border-gray-200 pl-6">
                2MW4+GJ8, <br/>
                Nava Naroda, <br/>
                Ahmedabad, Gujarat 380049
              </p>
              <div className="space-y-4 text-[10px] uppercase tracking-[0.3em] font-bold">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-400">Mon - Sat</span>
                    <span>08:30 — 20:30</span>
                </div>
                <div className="flex justify-between text-red-500">
                    <span>Sunday</span>
                    <span>By Appointment Only</span>
                </div>
              </div>
            </div>
            
            {/* THE BLACK THEME MAP */}
            <div className="lg:w-2/3 w-full h-[500px] bg-gray-200 overflow-hidden shadow-2xl relative">
              <iframe
                title="Sarvoday Watch Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.439044234557!2d72.66567547603332!3d23.044358815526365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e86e107563177%3A0xc3ec4d57a911765c!2sSarvoday%20Watch%20Co.!5e0!3m2!1sen!2sin!4v1712863615431!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ 
                  border: 0, 
                  filter: "grayscale(1) contrast(1.2) invert(0.92)", 
                  position: "absolute",
                  top: 0,
                  left: 0
                }} 
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;