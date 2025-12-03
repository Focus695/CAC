
"use client";
import React from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { ShoppingBag, Eye } from 'lucide-react';
import AddToCartButton from '../AddToCartButton';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  size?: 'small' | 'medium' | 'large'; // 新增：支持不同尺寸
  showCategory?: boolean; // 新增：是否显示分类标签
  showQuickView?: boolean; // 新增：是否显示快速查看按钮
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onClick,
  size = 'medium', // 默认使用中等尺寸
  showCategory = true, // 默认显示分类标签
  showQuickView = true // 默认显示快速查看按钮
}) => {
  // 根据尺寸设置不同的卡片样式
  const sizeClasses = {
    small: 'max-w-xs',
    medium: 'max-w-sm',
    large: 'max-w-md'
  };
  return (
    <div 
      onClick={() => onClick(product)}
      className={`${sizeClasses[size]} group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full border border-stone-100 hover:border-gold/30 cursor-pointer`}
    >
      <div className="relative overflow-hidden aspect-[3/4]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={533}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy" // 懒加载优化
        />
        
        {/* Overlay Action - Hidden on touch devices typically, but we keep structure */}
        <div className="absolute inset-0 bg-sandalwood/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-3 items-center justify-center backdrop-blur-[1px]">
           <div className="bg-white/90 text-sandalwood px-6 py-2 rounded-full font-serif text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hidden md:flex">
             <Eye size={16} />
             <span>查看详情</span>
           </div>
           
           <AddToCartButton
            productId={product.id}
            productName={product.name}
            stock={product.stock}
            defaultQuantity={1}
            variant="overlay"
          />
        </div>
        
        {/* Tag */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-paper/90 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs text-sandalwood font-serif border border-stone-200 shadow-sm">
          {product.category}
        </div>
      </div>

      <div className="p-3 md:p-5 flex flex-col flex-grow text-center relative">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/snow.png")'}}></div>
        
        <h3 className="text-sm md:text-xl font-serif text-sandalwood mb-1 md:mb-2 group-hover:text-cinnabar transition-colors relative z-10 line-clamp-1 md:line-clamp-none">
          {product.name}
        </h3>
        <p className="hidden md:block text-stone-500 text-sm mb-4 line-clamp-2 font-light relative z-10">
          {product.description}
        </p>
        
        <div className="mt-auto relative z-10">
           <div className="inline-block border-t border-b border-stone-100 py-1 mb-2 md:mb-3 max-w-full">
             <span className="text-[10px] md:text-xs text-amber-700 tracking-wide line-clamp-1">
               {product.benefits}
             </span>
           </div>
           <div className="text-base md:text-lg font-serif text-cinnabar font-medium">
             ¥ {product.price}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
