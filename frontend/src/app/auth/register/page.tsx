"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { apiService } from '@/services/api';
import { useUser } from '@/contexts/UserContext';
import { useCart } from '@/contexts/CartContext';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { setUser } = useUser();
  const { addToCart } = useCart();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (!formData.email || !formData.password || !formData.confirmPassword) {
        toast.error('Please fill in all fields');
        return;
      }

      // Verify that the two passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match, please try again');
        return;
      }

      // Only pass email and password to the API
      const response = await apiService.register({
        email: formData.email,
        password: formData.password,
      });

      // Compatible with backend TransformInterceptor wrapped return structure, apiService has automatically unpacked data
      // Use UserContext to manage user state
      setUser(response.user);

      // Show success message
      toast.success('Registration successful!', { duration: 3000 });

      // Check if there are any pending cart add operations
      const pendingCartItem = localStorage.getItem('pendingCartItem');
      if (pendingCartItem) {
        try {
          const { productId, quantity, productName } = JSON.parse(pendingCartItem);
          await addToCart(productId, quantity);
          toast.success(`${productName} has been automatically added to your cart!`, { duration: 3000 });
          // Clear pending operations from localStorage
          localStorage.removeItem('pendingCartItem');
        } catch (error) {
          console.error('Failed to automatically add product to cart:', error);
        }
      }

      // Delay redirect to homepage
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error: any) {
      console.error('Registration failed:', error);
      // Display different prompts based on error type
      const errorMessage = error.message || 'Registration failed, please try again later';

      if (errorMessage.includes('Email already registered') || errorMessage.includes('邮箱已经被注册')) {
        toast.error('Registration failed, please check if the email is already in use');
      } else if (errorMessage.includes('API request timeout') || errorMessage.includes('API请求超时')) {
        toast.error('Network request timeout, please try again later');
      } else if (errorMessage.includes('password must be longer than or equal to 6 characters')) {
        toast.error('Registration failed, password must be at least 6 characters');
      } else if (errorMessage.includes('email must be an email')) {
        toast.error('Registration failed, please enter a valid email address');
      } else {
        toast.error(`Registration failed: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* 顶部返回按钮 */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-sandalwood hover:text-cinnabar transition-colors"
          >
            <span className="mr-1 text-lg">←</span>
            返回首页
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-cinnabar tracking-widest">Create an Account</h1>
          <p className="mt-3 text-sm text-sandalwood">
            Already have an account? <Link href="/auth/login" className="font-medium text-cinnabar hover:text-cinnabar/80 transition-colors">Sign In</Link>
          </p>
        </div>

        <div className="bg-paper rounded-xl shadow-lg border border-stone-200 p-8">
          <form onSubmit={onSubmit} className="space-y-6">
              <div>
              <label className="block text-sm font-medium text-sandalwood mb-2">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full px-4 py-3 border border-stone-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cinnabar/30 focus:border-transparent transition-all duration-300 bg-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sandalwood mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••"
                className="w-full px-4 py-3 border border-stone-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cinnabar/30 focus:border-transparent transition-all duration-300 bg-white"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sandalwood mb-2">Confirm Password <span className="text-cinnabar font-bold">*</span></label>
              <input
                type="password"
                placeholder="••••••"
                className="w-full px-4 py-3 border border-stone-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cinnabar/30 focus:border-transparent transition-all duration-300 bg-white"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-cinnabar hover:bg-cinnabar/90 text-white font-medium rounded-lg shadow-md transition-colors duration-300 font-serif tracking-wide"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}