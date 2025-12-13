"use client";
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-cinnabar font-serif font-bold border border-stone-700">
                Z
              </div>
              <span className="text-2xl font-serif font-bold text-stone-200">
                ZENCHILL
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 font-light">
              Honoring ancient wisdom through handcrafted botanical treasures.
              <br/>Pure ingredients, mindful creation.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-stone-200 font-serif text-lg mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-cinnabar transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-cinnabar transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-cinnabar transition-colors">Our Craft</a></li>
              <li><a href="#" className="hover:text-cinnabar transition-colors">Membership</a></li>
            </ul>
          </div>

           <div>
            <h4 className="text-stone-200 font-serif text-lg mb-6">About</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-cinnabar transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-cinnabar transition-colors">Artisan Studio</a></li>
              <li><a href="#" className="hover:text-cinnabar transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-stone-200 font-serif text-lg mb-6">Newsletter</h4>
            <p className="text-xs mb-4">Subscribe for updates on new collections and exclusive offers.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-stone-800 border-none outline-none text-stone-200 text-sm px-4 py-2 flex-1 focus:ring-1 focus:ring-cinnabar"
              />
              <button className="bg-cinnabar text-white px-4 py-2 text-sm font-medium hover:bg-red-900 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© 2024 Zenchill. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <span>Privacy Policy</span>
             <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;