
"use client";
import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { NAV_LINKS } from '@/constants';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useUser } from '@/contexts/UserContext';
import LanguageSwitcher from '../LanguageSwitcher';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrder: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, cartCount, onOpenCart, onOpenOrder, onOpenSettings }) => {
  // 控制用户菜单显示/隐藏的状态
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  // 从UserContext获取用户信息和logout方法
  const { user, logout } = useUser();

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

  return (
    <aside className="hidden md:flex flex-col w-80 h-screen fixed left-0 top-0 bg-paper border-r border-stone-200 z-50 p-8 justify-between">
      {/* Logo Area */}
      <div>
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-full bg-cinnabar flex items-center justify-center text-white font-serif font-bold shadow-md">
            Z
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-cinnabar tracking-widest leading-none">ZENCHILL</h1>
            <span className="text-[10px] text-stone-500 tracking-[0.2em] uppercase">Botanical Treasures</span>
          </div>
        </div>

        {/* Navigation Title */}
        <h2 className="text-3xl font-serif text-sandalwood mb-8 font-bold">
          Menu <span className="text-sm font-light text-stone-400 ml-2 italic">Navigation</span>
        </h2>

        {/* Navigation Links */}
        <nav className="space-y-4">
          {NAV_LINKS.map((link) => {
            // Extract ID from href (e.g., "#about" -> "about")
            const tabId = link.href.substring(1);
            const isActive = activeTab === tabId;
            
            return (
              <button
                key={link.name}
                onClick={() => onTabChange(tabId)}
                className={`w-full group flex items-center justify-between p-4 rounded-xl transition-all duration-500 border text-left ${
                  isActive 
                    ? 'bg-ink text-paper border-ink shadow-xl' 
                    : 'bg-white text-sandalwood border-stone-100 hover:border-cinnabar/30 hover:shadow-md'
                }`}
              >
                <div>
                  <span className={`block font-bold text-lg font-sans ${isActive ? 'text-white' : 'text-sandalwood'}`}>
                    {link.name}
                  </span>
                  <span className={`text-xs mt-1 block font-serif tracking-wide ${isActive ? 'text-stone-400' : 'text-stone-400'}`}>
                    {link.label}
                  </span>
                </div>
                <ArrowRight 
                  size={20} 
                  className={`transform transition-transform duration-300 ${
                    isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:opacity-50 group-hover:translate-x-0'
                  }`} 
                />
              </button>
            );
          })}
        </nav>

        {/* Shopping Cart Button - Desktop Only */}
        <div className="mt-8">
          <button
            onClick={onOpenCart}
            className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-500 border bg-white text-sandalwood border-stone-100 hover:border-cinnabar/30 hover:shadow-md group"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="group-hover:text-cinnabar transition-colors" />
              <div>
                <span className="block font-bold text-lg font-sans">Cart</span>
                <span className="text-xs mt-1 block font-serif tracking-wide text-stone-400">Shopping Bag</span>
              </div>
            </div>
            {cartCount > 0 && (
              <span className="bg-cinnabar text-white text-xs w-6 h-6 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* User Authentication Area */}
      <div className="border-t border-stone-200 pt-6">
        {!user ? (
          <div className="space-y-3">
            <Link href="/auth/login" className="w-full block">
              <Button variant="outline" size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register" className="w-full block">
              <Button size="sm" className="w-full bg-cinnabar text-white hover:bg-cinnabar/90">
                Sign Up
              </Button>
            </Link>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
            <p className="text-[10px] text-stone-400 font-light leading-relaxed opacity-60 mt-4">
              © 2024 Zenchill.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* User Profile */}
            <div className="space-y-4">
              <div className="relative flex items-center justify-between">
                {/* User Avatar */}
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium shadow-md cursor-pointer hover:shadow-lg transition-transform hover:scale-105"
                    style={{ backgroundColor: getFixedColor() }}
                    title={user.email}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    {getAvatarLetter()}
                  </div>

                  {/* User Menu - 添加动画效果 */}
                  <div
                    className={`absolute left-0 bottom-full mb-2 w-64 bg-paper shadow-xl rounded-xl py-2 border border-stone-200 z-50 transition-all duration-300 ease-in-out ${
                      isUserMenuOpen
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
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
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-sm text-cinnabar hover:bg-stone-100 transition-colors text-left border-t border-stone-100 mt-2"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Language Switcher */}
                <LanguageSwitcher />
              </div>
            </div>
            <p className="text-[10px] text-stone-400 font-light leading-relaxed opacity-60">
              © 2024 Zenchill.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
