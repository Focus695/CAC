
"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/constants';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useUser } from '@/contexts/UserContext';
import LanguageSwitcher from '../LanguageSwitcher';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onTabChange: (tab: string) => void;
  onOpenOrder: () => void;
  onOpenSettings: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onTabChange, onOpenOrder, onOpenSettings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // 控制用户菜单显示/隐藏的状态
  const { user, logout } = useUser(); // 从UserContext获取用户信息和logout方法

  // 生成用户头像字母
  const getAvatarLetter = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // 基于用户邮箱生成固定背景颜色
  const getFixedColor = () => {
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#06b6d4'];
    if (!user?.email) return colors[0];

    // 基于邮箱生成哈希值
    let hash = 0;
    for (let i = 0; i < user.email.length; i++) {
      hash = user.email.charCodeAt(i) + ((hash << 5) - hash);
    }

    // 确保哈希值为正数
    hash = Math.abs(hash);

    // 返回对应的颜色
    return colors[hash % colors.length];
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    const tabId = href.substring(1);
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // 移动端导航栏
    <nav
      className={`md:hidden fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-paper/95 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cinnabar flex items-center justify-center text-white font-serif font-bold">
            Z
          </div>
          <span className="text-xl font-serif font-bold tracking-widest text-cinnabar">
            ZENCHILL
          </span>
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center gap-4 text-sandalwood">
          {/* 用户认证区域 */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="bg-cinnabar text-white hover:bg-cinnabar/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* 用户头像与下拉菜单 */}
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-md cursor-pointer hover:shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: getFixedColor() }}
                  title={user.email}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  {getAvatarLetter()}
                </div>
                {/* 用户信息与退出按钮 - 添加动画效果 */}
                <div
                  className={`absolute right-0 top-full mt-2 w-48 bg-paper shadow-xl rounded-xl py-2 border border-stone-200 z-50 transition-all duration-300 ease-in-out ${
                    isUserMenuOpen
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-[-10px] scale-95 pointer-events-none'
                  }`}
                >
                  <div className="px-4 py-2 text-sm text-sandalwood border-b border-stone-100">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenOrder();
                    }}
                    className="w-full px-4 py-2 text-sm text-sandalwood hover:bg-stone-100 transition-colors text-left"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full px-4 py-2 text-sm text-sandalwood hover:bg-stone-100 transition-colors text-left"
                  >
                    Settings
                  </button>
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-sm text-cinnabar hover:bg-stone-100 transition-colors text-left border-t border-stone-100 mt-2"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
              {/* 用户名/邮箱 */}
              <div className="hidden md:block text-sm font-medium text-sandalwood">
                {user.email}
              </div>
            </div>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher />

          <div
            className="relative cursor-pointer hover:text-cinnabar transition-colors"
            onClick={onOpenCart}
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-cinnabar text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
          <button
            className="hover:text-cinnabar"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`absolute top-full left-0 w-full bg-paper border-b border-stone-200 transition-all duration-300 overflow-hidden shadow-xl ${
          isMobileMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col px-6 gap-2">
          {NAV_LINKS.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="text-left text-sandalwood font-medium text-lg py-3 border-b border-stone-100 flex justify-between items-center"
            >
              <span>{link.name}</span>
              <span className="text-xs text-stone-400 font-serif">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
