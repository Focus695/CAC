"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { apiService } from '@/services/api';
import { useUser } from '@/contexts/UserContext';
import { useCart } from '@/contexts/CartContext';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { setUser, setToken } = useUser();
  const { addToCart } = useCart();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      setLoginError(null);

      if (!formData.email || !formData.password) {
        setLoginError('请填写邮箱和密码');
        return;
      }

      const response = await apiService.login(formData);

      // 兼容后端 TransformInterceptor 包裹的返回结构，apiService 已自动解包 data
      // 使用UserContext管理用户状态
      setUser(response.user);
      setToken(response.access_token);

      // 显示成功提示
      toast.success('登录成功！', { duration: 3000 });

      // 检查是否有未完成的购物车添加操作
      const pendingCartItem = localStorage.getItem('pendingCartItem');
      if (pendingCartItem) {
        try {
          const { productId, quantity, productName } = JSON.parse(pendingCartItem);
          await addToCart(productId, quantity);
          toast.success(`${productName} 已自动加入购物车！`, { duration: 3000 });
          // 清除本地存储的未完成操作
          localStorage.removeItem('pendingCartItem');
        } catch (error) {
          console.error('自动添加商品到购物车失败:', error);
        }
      }

      // 延迟跳转到首页
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error: any) {
      console.error('登录失败:', error);
      setLoginError('邮箱或密码错误');
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
          <h1 className="text-3xl font-serif font-bold text-cinnabar tracking-widest">登录账户</h1>
          <p className="mt-3 text-sm text-sandalwood">
            没有账户？ <Link href="/auth/register" className="font-medium text-cinnabar hover:text-cinnabar/80 transition-colors">注册</Link>
          </p>
        </div>

        <div className="bg-paper rounded-xl shadow-lg border border-stone-200 p-8">
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {loginError}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-sandalwood mb-2">邮箱地址</label>
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
              <label className="block text-sm font-medium text-sandalwood mb-2">密码</label>
              <input
                type="password"
                placeholder="••••••"
                className="w-full px-4 py-3 border border-stone-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cinnabar/30 focus:border-transparent transition-all duration-300 bg-white"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-cinnabar hover:bg-cinnabar/90 text-white font-medium rounded-lg shadow-md transition-colors duration-300 font-serif tracking-wide"
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}