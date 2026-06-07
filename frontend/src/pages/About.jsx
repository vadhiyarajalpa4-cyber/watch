import React from 'react';
import { Link } from 'react-router-dom';
import { MoveRight, Award, Users, Globe, History, Zap, ShieldCheck, Microscope } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-white font-sans text-[#1a1a1a]">

            {/* 1. MINIMALIST HEADER */}
            <section className="pt-32 pb-20 px-6 border-b border-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="text-[10px] uppercase tracking-[0.6em] text-[#D4AF37] font-bold mb-6 block">
                        The Sarvoday Legacy
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif tracking-tighter leading-none mb-10">
                        Where Tradition <br /> <span className="italic text-gray-400 font-light">Meets Precision</span>
                    </h1>
                    <div className="w-20 h-[1px] bg-black mx-auto"></div>
                </div>
            </section>

            {/* 2. THE PHILOSOPHY - EDITORIAL GRID */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-3xl font-serif mb-8 leading-tight">Time is not merely measured; it is honored.</h2>
                        <div className="space-y-8 text-gray-500 font-light leading-loose text-lg">
                            <p>
                                At Sarvoday Watch, we view every timepiece as a vessel for memories and a masterpiece of mechanical engineering. Our dedication goes beyond simple retail—it is a pursuit of horological perfection.
                            </p>
                            <p>
                                Based in Ahmedabad, our journey is defined by a commitment to "Old World" craftsmanship. We combine traditional watchmaking techniques with the digital precision of 2026, ensuring every movement we touch carries our seal of excellence.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-[4/5] bg-[#fafafa] p-4">
                            <img
                                src="/images/workshop-wide.jpg"
                                alt="Our Workshop"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2000ms]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CORE PILLARS - ARCHITECTURAL LAYOUT */}
            <section className="py-32 bg-[#0a0a0a] text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] mb-4">The Pillars of Sarvoday</h2>
                        <p className="text-4xl font-serif">A Commitment to Excellence</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: ShieldCheck, title: "Authenticated", desc: "Rigorous multi-point inspection for every piece." },
                            { icon: Microscope, title: "Precision", desc: "Calibration to the highest industry standards." },
                            { icon: History, title: "Heritage", desc: "Preserving the legacy of mechanical art." },
                            { icon: Zap, title: "Innovation", desc: "Modern digital tools for vintage movements." }
                        ].map((value, i) => (
                            <div key={i} className="group p-8 border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 bg-white/5">
                                <div className="text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform">
                                    {<value.icon size={28} />}
                                </div>
                                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4">{value.title}</h3>
                                <p className="text-gray-400 text-[12px] leading-relaxed font-light">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. STATISTICS - MINIMALIST EMPHASIS */}
            <section className="py-24 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 flex justify-center gap-24">
                    <div className="text-center">
                        <p className="text-5xl font-serif mb-2">100%</p>
                        <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Authenticity Guaranteed</p>
                    </div>
                    <div className="text-center">
                        <p className="text-5xl font-serif mb-2">5000+</p>
                        <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Timepieces Serviced</p>
                    </div>
                </div>
            </section>

            {/* 5. CALL TO ACTION */}
            <section className="py-32 text-center">
                <h2 className="text-3xl font-serif mb-10">Experience the Art of Time.</h2>
                <Link to="/collection">
                    <button className="group inline-flex items-center gap-4 bg-black text-white px-14 py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg">
                        Explore The Collection
                        <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </Link>
            </section>
        </div>
    );
};

export default About;