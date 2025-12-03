
"use client";

import React from 'react';
import ScrollReveal from './ScrollReveal';

const Hero: React.FC = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/id/1053/1920/1080" 
          alt="Zen Background" 
          className="w-full h-full object-cover opacity-90 scale-105"
        />
        {/* Darkening Gradient for mystery */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-800/20 to-paper"></div>
        
        {/* Mist Animation Layer 1 */}
        <div className="absolute inset-0 mist-layer opacity-30 animate-mist pointer-events-none"></div>
        {/* Mist Animation Layer 2 (Reverse) */}
        <div className="absolute inset-0 mist-layer opacity-20 animate-mist pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '30s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-0">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-6">
            <span className="text-white/80 tracking-[0.6em] text-sm md:text-base font-light uppercase mb-2 drop-shadow-md">
               隐于市 · 修于心
            </span>
            
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-4 drop-shadow-xl">
              <span className="block mb-4">灵韵 · 禅境</span>
              <span className="block text-xl md:text-3xl font-light tracking-[0.3em] mt-6 text-stone-200">
                寻找失落的东方香韵
              </span>
            </h1>

            <div className="w-1 h-20 bg-gradient-to-b from-gold via-white to-transparent my-4 opacity-70"></div>

            <p className="text-stone-100 text-lg md:text-xl font-light leading-relaxed max-w-2xl tracking-wide drop-shadow-md">
              万物皆有裂痕，那是光照进来的地方。<br/>
              于静谧中，听见内心的声音。
            </p>
          </div>
        </ScrollReveal>
        
        {/* Decorative Seal - Animated */}
        <div className="absolute top-10 right-0 md:right-[-80px] opacity-40 animate-float pointer-events-none mix-blend-overlay">
          <div className="w-40 h-40 border-[1px] border-white/30 rounded-full flex items-center justify-center rotate-12">
            <div className="w-36 h-36 border-[1px] border-white/50 rounded-full flex items-center justify-center">
               <span className="font-serif text-white text-4xl writing-vertical-rl opacity-80">无为</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
