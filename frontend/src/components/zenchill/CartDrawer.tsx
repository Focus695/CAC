
"use client";
import React, { useMemo } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
}) => {
  const { cartItems, updateCartItem, removeCartItem, loading } = useCart();

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <>
      {/* Overlay - z-index increased to 110 to appear above ProductDetailModal (z-100) */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer - z-index increased to 120 */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-paper shadow-2xl z-[120] transform transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-paper relative">
          <div>
            <h2 className="text-2xl font-serif text-sandalwood">珍宝囊</h2>
            <p className="text-xs text-stone-500 font-light mt-1">已选 {cartItems.length} 件雅物</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-cinnabar"
          >
            <X size={24} />
          </button>
          
          {/* Decorative Texture */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-5 pointer-events-none" 
               style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")'}}></div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4 opacity-60">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cinnabar mb-4"></div>
              <p className="font-serif text-lg">正在加载购物车...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4 opacity-60">
              <ShoppingBagIcon size={64} />
              <p className="font-serif text-lg">囊中空空，何不寻些雅物？</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-white rounded-sm border border-stone-100 shadow-sm relative group">
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-sm bg-stone-100">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-sandalwood font-medium">{item.product.name}</h3>
                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="text-stone-300 hover:text-cinnabar transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{item.product.category}</p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-stone-200 rounded-sm">
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-stone-100 text-stone-500"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-serif text-sandalwood">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-stone-100 text-stone-500"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="font-serif text-cinnabar">
                      ¥ {item.product.price * item.quantity}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <span className="font-serif text-stone-500">合计 (不含运费)</span>
              <span className="text-3xl font-serif text-cinnabar font-bold">¥ {total}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-cinnabar text-white py-4 font-serif text-lg tracking-widest hover:bg-red-900 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg"
            >
              <span>结算雅物</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Simple icon for empty state
const ShoppingBagIcon = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

export default CartDrawer;
