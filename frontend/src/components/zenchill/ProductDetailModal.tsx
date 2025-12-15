
"use client";
import React, { useEffect, useState } from 'react';
import { X, Wind, Star, Scroll, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import AddToCartButton from '../AddToCartButton';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  if (!isOpen || !product) return null;

  // Helper function to normalize image URLs
  const normalizeImageUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/uploads')) {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      return `${apiBase}${url}`;
    }
    return url;
  };

  // Get images array - support both detailImages and single imageUrl
  const rawImages: string[] = (product as any).detailImages && Array.isArray((product as any).detailImages) && (product as any).detailImages.length > 0
    ? (product as any).detailImages
    : product.imageUrl
    ? [product.imageUrl]
    : [];
  
  const images = rawImages.map(normalizeImageUrl).filter(Boolean);

  // Get sections - support both sections array and fallback to description
  const sections: any[] = (product as any).sections && Array.isArray((product as any).sections) && (product as any).sections.length > 0
    ? (product as any).sections
    : [];

  const currentImage = images[currentImageIndex] || normalizeImageUrl(product.imageUrl || '');

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/80 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full md:w-[90vw] max-w-5xl bg-paper rounded-none md:rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row h-full md:h-[85vh] md:min-h-[700px] animate-fade-in-up">
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
        <div className="w-full md:w-1/2 h-64 md:h-full relative bg-stone-200 shrink-0 group">
          {currentImage ? (
            <>
              <img 
                src={currentImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // Try fallback to main image
                  const fallback = normalizeImageUrl(product.imageUrl || '');
                  if (fallback && fallback !== currentImage) {
                    target.src = fallback;
                  } else {
                    target.style.display = 'none';
                  }
                }}
              />
              {/* Image Navigation - Only show if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-700 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-700 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? 'bg-white w-6'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                  {/* Image Counter */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
              {/* Touch swipe support for mobile */}
              <div
                className="absolute inset-0 md:hidden"
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  const startX = touch.clientX;
                  const handleTouchEnd = (e: TouchEvent) => {
                    const touch = e.changedTouches[0];
                    const endX = touch.clientX;
                    const diff = startX - endX;
                    if (Math.abs(diff) > 50) {
                      if (diff > 0) {
                        nextImage();
                      } else {
                        prevImage();
                      }
                    }
                    document.removeEventListener('touchend', handleTouchEnd);
                  };
                  document.addEventListener('touchend', handleTouchEnd);
                }}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              No Image
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white md:hidden">
             <h2 className="text-xl font-serif">{product.name}</h2>
          </div>
        </div>

        {/* Right: Details Section */}
        <div className="w-full md:w-1/2 p-5 md:p-12 overflow-y-auto relative z-10 flex flex-col bg-paper md:h-full">
          
          {/* Header */}
          <div className="mb-6 md:mb-8 border-b border-stone-200 pb-4 md:pb-6 hidden md:block">
            <div className="flex items-center gap-3 text-cinnabar mb-2">
              <span className="px-2 py-1 border border-cinnabar text-xs tracking-widest uppercase">{product.category}</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif text-sandalwood mb-4">{product.name}</h2>
            <div className="flex items-baseline gap-4">
              <span className="text-2xl text-cinnabar font-serif">$ {product.price}</span>
              <span className="text-sm text-stone-400 line-through">$ {Math.round(product.price * 1.2)}</span>
            </div>
          </div>

          {/* Mobile Price Header (Visible only on mobile) */}
          <div className="md:hidden mb-6 flex justify-between items-baseline border-b border-stone-100 pb-4">
            <span className="text-2xl text-cinnabar font-serif font-medium">$ {product.price}</span>
            <span className="px-2 py-0.5 border border-stone-300 text-[10px] text-stone-500 rounded-full">{product.category}</span>
          </div>

          {/* Content Body */}
          <div className="space-y-6 md:space-y-8 flex-1 pb-4">
            {/* Sections from backend */}
            {sections.length > 0 ? (
              sections
                .slice()
                .sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0))
                .map((section: any, idx: number) => {
                  const title = section.title_en || section.title_zh || `Section ${idx + 1}`;
                  const content = section.content_en || section.content_zh || '';
                  if (!content) return null;
                  
                  return (
                    <div key={idx}>
                      <h3 className="flex items-center gap-2 font-serif text-base md:text-lg text-sandalwood mb-2 md:mb-3">
                        <Scroll size={16} className="text-stone-400" />
                        <span>{title}</span>
                      </h3>
                      <div className="bg-stone-100/50 p-3 md:p-4 rounded-sm border-l-2 border-cinnabar">
                        <p className="text-stone-700 font-serif text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                          {content}
                        </p>
                      </div>
                    </div>
                  );
                })
            ) : (
              <>
                {/* Fallback: Description */}
                {product.description && (
                  <div>
                    <h3 className="flex items-center gap-2 font-serif text-base md:text-lg text-sandalwood mb-2 md:mb-3">
                      <Scroll size={16} className="text-stone-400" />
                      <span>Description</span>
                    </h3>
                    <p className="text-stone-600 leading-relaxed font-light text-justify text-sm md:text-base">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Fallback: Benefits */}
                {product.benefits && (
                  <div>
                    <h3 className="flex items-center gap-2 font-serif text-base md:text-lg text-sandalwood mb-2 md:mb-3">
                      <Wind size={16} className="text-stone-400" />
                      <span>Benefits</span>
                    </h3>
                    <div className="bg-stone-100/50 p-3 md:p-4 rounded-sm border-l-2 border-cinnabar">
                      <p className="text-stone-700 font-serif text-sm md:text-base">{product.benefits}</p>
                      <p className="text-[10px] md:text-xs text-stone-400 mt-2">* Traditional wellness properties, not medical advice.</p>
                    </div>
                  </div>
                )}

                {/* Fallback: Craftsmanship (Static content for atmosphere) */}
                <div>
                  <h3 className="flex items-center gap-2 font-serif text-base md:text-lg text-sandalwood mb-2 md:mb-3">
                    <Star size={16} className="text-stone-400" />
                    <span>Craftsmanship</span>
                  </h3>
                  <ul className="space-y-2 text-xs md:text-sm text-stone-600 font-light">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5"></span>
                      <span>Carefully selected botanicals from sustainable sources, ensuring purity and authenticity.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5"></span>
                      <span>Handcrafted through dozens of traditional steps, resulting in a smooth, refined finish.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5"></span>
                      <span>Natural materials and heritage techniques honored in every piece.</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
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
