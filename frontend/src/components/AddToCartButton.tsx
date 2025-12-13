'use client';

import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import toast from 'react-hot-toast';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  stock: number;
  defaultQuantity?: number;
  variant?: 'default' | 'overlay'; // Added variant prop
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  productName,
  stock,
  defaultQuantity = 1,
  variant = 'default', // Default variant
}) => {
  const { addToCart } = useCart();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Handle login button click in modal
  const handleLoginRedirect = () => {
    // Save product to localStorage before redirect
    localStorage.setItem('pendingCartItem', JSON.stringify({
      productId,
      quantity: defaultQuantity,
      productName
    }));
    window.location.href = '/auth/login';
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      // User not logged in, show modal
      setShowLoginModal(true);
      return;
    }

    if (stock <= 0) {
      toast.error('Product out of stock', {
        position: 'bottom-right',
        duration: 5000
      });
      return;
    }

    try {
      setLoading(true);
      await addToCart(productId, defaultQuantity);
      toast.success(`${productName} added to cart!`, {
        position: 'bottom-right',
        duration: 3000
      });
    } catch (err: any) {
      // Handle different types of errors
      let errorMessage = 'Failed to add product to cart';

      if (err.message) {
        // Extract user-friendly message from error
        if (err.message.includes('Not enough stock')) {
          errorMessage = 'Not enough stock available';
        } else if (err.message.includes('Product not found')) {
          errorMessage = 'Product not found';
        } else {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage, {
        position: 'bottom-right',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleAddToCart}
        disabled={loading || stock <= 0}
        className={`${
          variant === 'overlay'
            ? 'w-auto px-6 py-2 text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 hidden md:flex'
            : 'w-full py-3 px-4'
        } rounded-full font-serif transition-all ${
          stock <= 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[rgb(142_40_0)] hover:bg-[rgb(115_32_0)] text-white'
        } ${loading ? 'opacity-70 cursor-wait' : ''}`}
      >
        {loading ? 'Adding...' : stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>



      {/* Login Required Modal */}
      {showLoginModal && (
        <>
          {/* Overlay - z-index 101 to appear above other modals */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[101] transition-opacity duration-300 opacity-100 pointer-events-auto"
            onClick={() => setShowLoginModal(false)}
          ></div>

          {/* Modal Content */}
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-paper shadow-2xl z-[102] rounded-sm w-full max-w-md p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif text-sandalwood mb-2">Please Sign In</h2>
              <p className="text-stone-500 font-light">
                You need to sign in to add items to your cart
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-[rgb(142_40_0)] text-white py-3 font-serif text-lg tracking-widest hover:bg-[rgb(115_32_0)] transition-all duration-300 shadow-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full bg-white border-2 border-stone-300 text-sandalwood py-3 font-serif text-lg tracking-widest hover:border-cinnabar hover:text-cinnabar transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddToCartButton;
