
"use client";
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { CartItem } from '@/types';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import { useCart } from '@/contexts/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: CartItem[]; // Make optional, will use CartContext if not provided
  total?: number; // Make optional, will use CartContext if not provided
  onPaymentSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems: propCartItems, total: propTotal, onPaymentSuccess }) => {
  // Use CartContext as the source of truth
  const { cartItems: contextCartItems, subtotal: contextSubtotal } = useCart();
  
  // Use provided props if available, otherwise fall back to context
  const cartItems = propCartItems && propCartItems.length > 0 ? propCartItems : contextCartItems;
  
  // Calculate total: prefer contextSubtotal if using context items, otherwise calculate from cartItems
  const calculateTotal = () => {
    // If using context items, use context subtotal
    if (cartItems === contextCartItems && contextSubtotal > 0) {
      return contextSubtotal;
    }
    
    // Otherwise calculate from cartItems
    if (cartItems && cartItems.length > 0) {
      return cartItems.reduce((sum, item) => {
        const product = (item as any).product || item;
        const productPrice = typeof product.price === 'number' 
          ? product.price 
          : parseFloat(String(product.price || 0));
        const quantity = item.quantity || 1;
        return sum + (productPrice * quantity);
      }, 0);
    }
    
    // Fallback to propTotal if provided and > 0
    return propTotal && propTotal > 0 ? propTotal : 0;
  };
  
  const total = calculateTotal();
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address1: '', // This matches the backend's expected field name
  });

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address1) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setStep('processing');

    try {
      // Create order data
      const orderData = {
        shippingAddress: {
          ...formData,
          // For simplicity, we'll use default values for other required fields
          address2: '',
          city: '默认城市',
          state: '默认省',
          zipCode: '100000',
          country: '中国',
        },
        billingAddress: {
          ...formData,
          // For simplicity, we'll use the same as shipping address
          address2: '',
          city: '默认城市',
          state: '默认省',
          zipCode: '100000',
          country: '中国',
        },
        paymentMethod: 'credit_card', // Simulate credit card payment
      };

      // Create order API call
      const order = await apiService.createOrder(orderData);

      // Simulate payment success API call
      await apiService.simulatePaymentSuccess(order.id);

      // Update to success step
      setStep('success');

    } catch (error) {
      console.error('Order process failed:', error);
      toast.error('Order processing failed. Please try again.');
      setStep('form');
    }
  };

  const handleFinish = () => {
    onPaymentSuccess();
    setStep('form'); // Reset for next time
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      address1: '',
    });
  };

  return (
    // Increased z-index to 130 to be higher than CartDrawer (120) and ProductDetailModal (100)
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-paper w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply" 
             style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")'}}></div>

        {step === 'form' && (
          <div className="flex flex-col md:flex-row h-full md:h-[600px]">
            {/* Left: Order Summary */}
            <div className="w-full md:w-5/12 bg-stone-100/50 p-8 border-r border-stone-200 overflow-y-auto">
              <h3 className="font-serif text-xl text-sandalwood mb-6 border-b border-stone-300 pb-2">Order Summary</h3>
              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <p className="text-stone-400 text-sm italic">No items in cart</p>
                ) : (
                  cartItems.map((item) => {
                    // Get product data - support both nested product object and flat structure
                    const product = (item as any).product || item;
                    
                    // Get image URL - support mainImage, detailImages, images array, or imageUrl
                    const productImage = (product as any).mainImage 
                      || ((product as any).detailImages && Array.isArray((product as any).detailImages) && (product as any).detailImages.length > 0 
                        ? (product as any).detailImages[0] 
                        : null)
                      || ((product as any).images && Array.isArray((product as any).images) && (product as any).images.length > 0 
                        ? (product as any).images[0] 
                        : null)
                      || (product as any).imageUrl
                      || '';

                    // Get product name - support name_en, name_zh, or name
                    const productName = (product as any).name_en 
                      || (product as any).name_zh 
                      || product.name 
                      || 'Unknown Product';

                    // Get price - support nested product.price or item.price
                    const productPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
                    
                    // Get quantity
                    const quantity = item.quantity || 1;

                    return (
                      <div key={item.id} className="flex gap-3 text-sm">
                        {productImage ? (
                          <img src={productImage} className="w-12 h-12 object-cover rounded-sm bg-stone-200" alt={productName} />
                        ) : (
                          <div className="w-12 h-12 bg-stone-200 rounded-sm flex items-center justify-center text-stone-400 text-xs">No Image</div>
                        )}
                        <div className="flex-1">
                          <p className="font-serif text-stone-800">{productName}</p>
                          <p className="text-stone-500">x{quantity}</p>
                        </div>
                        <div className="font-serif text-stone-700">${(productPrice * quantity).toFixed(2)}</div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-stone-300">
                 <div className="flex justify-between text-lg font-serif font-bold text-cinnabar">
                   <span>Total</span>
                   <span>$ {typeof total === 'number' ? total.toFixed(2) : parseFloat(String(total || 0)).toFixed(2)}</span>
                 </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="w-full md:w-7/12 p-8 relative">
              <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-cinnabar">
                <X size={24} />
              </button>
              
              <h3 className="font-serif text-2xl text-sandalwood mb-8">Shipping Address</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-xs text-stone-500 uppercase tracking-wider">First Name</label>
                     <input
                       required
                       type="text"
                       name="firstName"
                       value={formData.firstName}
                       onChange={handleChange}
                       className="w-full bg-transparent border-b border-stone-300 focus:border-cinnabar outline-none py-2 font-serif text-sandalwood transition-colors"
                       placeholder="John" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs text-stone-500 uppercase tracking-wider">Last Name</label>
                     <input
                       required
                       type="text"
                       name="lastName"
                       value={formData.lastName}
                       onChange={handleChange}
                       className="w-full bg-transparent border-b border-stone-300 focus:border-cinnabar outline-none py-2 font-serif text-sandalwood transition-colors"
                       placeholder="Doe" />
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-xs text-stone-500 uppercase tracking-wider">Phone</label>
                   <input
                     required
                     type="tel"
                     name="phone"
                     value={formData.phone}
                     onChange={handleChange}
                     className="w-full bg-transparent border-b border-stone-300 focus:border-cinnabar outline-none py-2 font-serif text-sandalwood transition-colors" />
                </div>

                <div className="space-y-1">
                   <label className="text-xs text-stone-500 uppercase tracking-wider">Address</label>
                     <input
                     required
                     type="text"
                     name="address1"
                     value={formData.address1}
                     onChange={handleChange}
                     className="w-full bg-transparent border-b border-stone-300 focus:border-cinnabar outline-none py-2 font-serif text-sandalwood transition-colors"
                     placeholder="Street address" />
                </div>

                <div className="pt-8">
                  <button type="submit" className="w-full bg-sandalwood text-white py-3 font-serif hover:bg-cinnabar transition-colors duration-300 shadow-md">
                    Confirm Payment
                  </button>
                  <p className="text-center text-xs text-stone-400 mt-3">Your payment is encrypted and secure.</p>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="h-96 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-16 h-16 border-4 border-stone-200 border-t-cinnabar rounded-full animate-spin"></div>
            <p className="font-serif text-xl text-sandalwood animate-pulse">Processing your order...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="h-[500px] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            {/* Stamp Animation */}
            <div className="relative mb-8">
               <div className="w-32 h-32 border-4 border-cinnabar rounded-md flex items-center justify-center rotate-3 opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
                  <div className="w-28 h-28 border-2 border-cinnabar rounded-sm flex items-center justify-center">
                     <span className="font-serif text-cinnabar text-3xl font-bold">PAID</span>
                  </div>
               </div>
               <div className="absolute -bottom-2 -right-6 text-cinnabar opacity-0 animate-fade-in-up" style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}>
                  <Check size={40} strokeWidth={4} />
               </div>
            </div>

            <h3 className="text-2xl font-serif text-sandalwood mb-4">Thank you for your purchase!</h3>
            <p className="text-stone-500 font-light max-w-sm mb-10">
               Your order has been placed successfully. We&apos;ll send you an email with the details shortly.
            </p>

            <button onClick={handleFinish} className="bg-transparent border border-sandalwood text-sandalwood px-8 py-2 hover:bg-sandalwood hover:text-white transition-all duration-300 font-serif">
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
