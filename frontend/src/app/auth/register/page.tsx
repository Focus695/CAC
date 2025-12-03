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

  const { setUser, setToken } = useUser();
  const { addToCart } = useCart();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (!formData.email || !formData.password || !formData.confirmPassword) {
        toast.error('请填写完整信息');
        return;
      }

      // 验证两次密码是否一致
      if (formData.password !== formData.confirmPassword) {
        toast.error('两次输入的密码不一致，请重新输入');
        return;
      }

      // 仅传递email和password给API
      const response = await apiService.register({
        email: formData.email,
        password: formData.password,
      });

      // 兼容后端 TransformInterceptor 包裹的返回结构，apiService 已自动解包 data
      // 使用UserContext管理用户状态
      setUser(response.user);
      setToken(response.access_token);

      // 显示成功提示
      toast.success('注册成功！', { duration: 3000 });

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
      console.error('注册失败:', error);
      toast.error('注册失败，请检查邮箱是否已被使用');
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
          <h1 className="text-3xl font-serif font-bold text-cinnabar tracking-widest">注册账户</h1>
          <p className="mt-3 text-sm text-sandalwood">
            已有账户？ <Link href="/auth/login" className="font-medium text-cinnabar hover:text-cinnabar/80 transition-colors">登录</Link>
          </p>
        </div>

        <div className="bg-paper rounded-xl shadow-lg border border-stone-200 p-8">
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

            <div>
              <label className="block text-sm font-medium text-sandalwood mb-2">确认密码 <span className="text-cinnabar font-bold">*</span></label>
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
              {isLoading ? '注册中...' : '注册'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}