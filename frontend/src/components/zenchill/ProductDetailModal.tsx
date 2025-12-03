
"use client";
import React, { useEffect } from 'react';
import { X, Wind, Star, Scroll, Info } from 'lucide-react';
import { Product } from '@/types';
import AddToCartButton from '../AddToCartButton';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
  // Lock body scroll when modal is open to prevent background scrolling (scroll chaining)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/80 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-paper rounded-none md:rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row h-full md:h-auto md:max-h-[90vh] animate-fade-in-up">
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply z-0" 
             style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")'}}></div>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/50 hover:bg-cinnabar hover:text-white rounded-full transition-all duration-300"
        >
          <X size={24} />
        </button>

        {/* Left: Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-stone-200 shrink-0">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white md:hidden">
             <h2 className="text-xl font-serif">{product.name}</h2>
          </div>
        </div>

        {/* Right: Details Section */}
        <div className="w-full md:w-1/2 p-5 md:p-12 overflow-y-auto relative z-10 flex flex-col bg-paper">
          
          {/* Header */}
          <div className="mb-6 md:mb-8 border-b border-stone-200 pb-4 md:pb-6 hidden md:block">
            <div className="flex items-center gap-3 text-cinnabar mb-2">
              <span className="px-2 py-1 border border-cinnabar text-xs tracking-widest uppercase">{product.category}</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif text-sandalwood mb-4">{product.name}</h2>
            <div className="flex items-baseline gap-4">
              <span className="text-2xl text-cinnabar font-serif">¥ {product.price}</span>
              <span className="text-sm text-stone-400 line-through">¥ {Math.round(product.price * 1.2)}</span>
            </div>
          </div>

          {/* Mobile Price Header (Visible only on mobile) */}
          <div className="md:hidden mb-6 flex justify-between items-baseline border-b border-stone-100 pb-4">
            <span className="text-2xl text-cinnabar font-serif font-medium">¥ {product.price}</span>
            <span className="px-2 py-0.5 border border-stone-300 text-[10px] text-stone-500 rounded-full">{product.category}</span>
          </div>

          {/* Content Body */}
          <div className="space-y-6 md:space-y-8 flex-1 pb-4">
            
            {/* Description */}
            <div>
              <h3 className="flex items-center gap-2 font-serif text-base md:text-lg text-sandalwood mb-2 md:mb-3">
                <Scroll size={16} className="text-stone-400" />
                <span>雅物描述</span>
              </h3>
              <p className="text-stone-600 leading-relaxed font-light text-justify text-sm md:text-base">
                {product.description}
                此物源自天然，经匠人手工打磨，保留了材质最原始的灵性。无论是置于案头，还是随身佩戴，皆能感受到那份来自山川草木的静谧力量。
              </p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="flex items-center gap-2 font-serif text-base md:text-lg text-sandalwood mb-2 md:mb-3">
                <Wind size={16} className="text-stone-400" />
                <span>养生功效</span>
              </h3>
              <div className="bg-stone-100/50 p-3 md:p-4 rounded-sm border-l-2 border-cinnabar">
                <p className="text-stone-700 font-serif text-sm md:text-base">{product.benefits}</p>
                <p className="text-[10px] md:text-xs text-stone-400 mt-2">* 传统文化寓意，非医疗建议。</p>
              </div>
            </div>

            {/* Craftsmanship (Static content for atmosphere) */}
            <div>
               <h3 className="flex items-center gap-2 font-serif text-base md:text-lg text-sandalwood mb-2 md:mb-3">
                <Star size={16} className="text-stone-400" />
                <span>匠心工艺</span>
              </h3>
              <ul className="space-y-2 text-xs md:text-sm text-stone-600 font-light">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5"></span>
                  <span>严选原产地老料，油性充足，香韵纯正。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5"></span>
                  <span>数十道工序手工打磨，触感温润如玉。</span>
                </li>
                 <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5"></span>
                  <span>配饰采用天然矿石与纯银，古朴典雅。</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Action Footer - Compact for Mobile */}
          <div className="mt-4 md:mt-8 pt-3 md:pt-6 border-t border-stone-200 flex gap-3 sticky bottom-0 bg-paper/95 backdrop-blur-sm py-3 md:py-4 -mb-5 md:-mb-12 md:pb-12 z-20">
            <AddToCartButton
              productId={product.id}
              productName={product.name}
              stock={product.stock}
              defaultQuantity={1}
            />
             <button className="px-3 md:px-4 border border-stone-200 text-stone-500 hover:text-cinnabar hover:border-cinnabar transition-colors flex items-center justify-center rounded-sm">
                <Info size={18} className="md:w-5 md:h-5" />
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
