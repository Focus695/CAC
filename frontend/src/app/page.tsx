// 首页 - 静态生成页面
// 注意：由于使用了客户端上下文(AppContext)，该页面暂时需要保留为客户端组件

"use client";

import React from 'react';
import { Wind, Sprout, Heart, Feather, Mail, Instagram, Twitter } from 'lucide-react';
import Sidebar from '@/components/zenchill/Sidebar';
import Navbar from '@/components/zenchill/Navbar';
import Hero from '@/components/zenchill/Hero';
import ProductCard from '@/components/zenchill/ProductCard';
import Footer from '@/components/zenchill/Footer';
import ScrollReveal from '@/components/zenchill/ScrollReveal';
import CartDrawer from '@/components/zenchill/CartDrawer';
import CheckoutModal from '@/components/zenchill/CheckoutModal';
import OrderDrawer from '@/components/zenchill/OrderDrawer';
import SettingsDrawer from '@/components/zenchill/SettingsDrawer';
import ProductDetailModal from '@/components/zenchill/ProductDetailModal';
import { useAppContext } from '@/contexts/AppContext';
import { TEAM_MEMBERS } from '@/constants';
import { Category } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { apiService } from '@/services/api';

const fallbackCategories = ['All', ...Object.values(Category)];

export default function Home() {
  const { user } = useUser();
  const {
    cart,
    cartCount,
    cartTotal,
    isCartOpen,
    isCheckoutOpen,
    selectedProduct,
    isProductModalOpen,
    activeCategory,
    setActiveCategory,
    activeTab,
    setActiveTab,
    filteredProducts,
    handleAddToCart,
    handleCheckoutStart,
    handlePaymentSuccess,
    handleProductClick,
    setIsCartOpen,
    setIsCheckoutOpen,
    setIsProductModalOpen,
    isOrderDrawerOpen,
    isSettingsDrawerOpen,
    setIsOrderDrawerOpen,
    setIsSettingsDrawerOpen,
    isProductsLoading,
    productsError,
  } = useAppContext();

  const [categoryTabs, setCategoryTabs] = React.useState<string[]>(fallbackCategories);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cats = await apiService.getCategories();
        const names: string[] = [];
        const walk = (arr: any[]) => {
          for (const n of arr || []) {
            if (!n) continue;
            if (n.name) names.push(String(n.name));
            if (Array.isArray(n.children) && n.children.length > 0) walk(n.children);
          }
        };
        if (Array.isArray(cats)) walk(cats);
        const uniq = Array.from(new Set(names.filter(Boolean)));
        if (!cancelled && uniq.length > 0) {
          setCategoryTabs(['All', ...uniq]);
        }
      } catch {
        // ignore, keep fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    // If activeCategory is no longer available (because categories changed), reset to All
    if (activeCategory !== 'All' && !categoryTabs.includes(activeCategory)) {
      setActiveCategory('All');
    }
  }, [activeCategory, categoryTabs, setActiveCategory]);

  const AboutView = () => (
    <div className="animate-fade-in-up">
      <Hero />
      <div className="py-32 px-6 bg-stone-100 relative overflow-hidden min-h-[60vh]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-serif text-stone-200/40 select-none pointer-events-none z-0">
          Z
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="w-full h-[500px] bg-stone-300 overflow-hidden rounded-sm shadow-xl">
                  <img
                    src="https://picsum.photos/id/1035/800/1000"
                    alt="Craftsman"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-white p-8 shadow-2xl max-w-xs border-l-4 border-cinnabar hidden md:block">
                  <p className="font-serif text-sandalwood italic">
                    "Crafting is not just creation, it's meditation. Every step is a dialogue with nature."
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="inline-block border-b-2 border-cinnabar pb-2">
                  <h2 className="text-3xl md:text-4xl font-serif text-sandalwood">
                    Our Story
                  </h2>
                </div>
                <p className="text-stone-600 leading-loose font-light text-lg">
                  Zenchill was born from a passion for preserving ancient wisdom through handcrafted botanical treasures. In a world of mass production, we create a sanctuary where time-honored techniques meet pure, natural ingredients.
                </p>
                <p className="text-stone-600 leading-loose font-light text-lg">
                  Every piece begins with ethically sourced botanicals — from sacred sandalwood to healing herbs. We honor intangible cultural heritage craftsmanship, ensuring each meditation bead, incense stick, candle, and comb carries the soul of authentic artisan tradition.
                </p>

                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="flex items-center gap-3">
                    <Feather className="text-cinnabar" />
                    <span className="font-serif text-sandalwood">Heritage Craft</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wind className="text-cinnabar" />
                    <span className="font-serif text-sandalwood">Pure Botanicals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sprout className="text-cinnabar" />
                    <span className="font-serif text-sandalwood">Sustainable</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="text-cinnabar" />
                    <span className="font-serif text-sandalwood">Handmade</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );

  const HandmadeView = () => (
    <div className="animate-fade-in-up min-h-screen pt-24 md:pt-16 px-4 md:px-12 pb-12 bg-stone-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-serif text-sandalwood mb-2">Handcrafted Collection</h2>
            <p className="text-stone-500 font-light text-sm">Botanical treasures made with intention</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categoryTabs.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1 rounded-full text-sm font-serif transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-cinnabar text-white shadow-md'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-cinnabar hover:text-cinnabar'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isProductsLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cinnabar mb-4"></div>
              <p className="text-sandalwood font-serif">Loading products...</p>
            </div>
          </div>
        )}

        {productsError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-10">
            <p className="text-red-800">{productsError}</p>
          </div>
        )}

        {!isProductsLoading && !productsError && (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
            {filteredProducts.map((product) => (
              <ScrollReveal key={product.id} threshold={0.05}>
                <ProductCard
                  product={product}
                  onClick={handleProductClick}
                />
              </ScrollReveal>
            ))}
          </div>
        )}

        {!isProductsLoading && !productsError && filteredProducts.length === 0 && (
          <div className="py-20 text-center text-stone-400 font-serif">
            No items in this category yet. Please check back soon.
          </div>
        )}
      </div>
    </div>
  );

  const DesignView = () => (
    <div className="animate-fade-in-up min-h-screen pt-24 md:pt-16 px-6 pb-12 bg-paper">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-sandalwood mb-4">Our Artisans</h2>
          <p className="text-stone-500 font-light">
            Behind every piece lies dedicated hands and a reverent heart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {TEAM_MEMBERS.map((member) => (
            <ScrollReveal key={member.id} className="text-center">
              <div className="mb-6 relative group overflow-hidden rounded-t-full mx-auto w-64 h-80">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
              </div>
              <h3 className="text-xl font-serif text-sandalwood mb-1">{member.name}</h3>
              <p className="text-xs text-cinnabar uppercase tracking-widest mb-3">{member.title}</p>
              <p className="text-stone-500 text-sm font-light leading-relaxed max-w-xs mx-auto">
                {member.bio}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );

  const SocialView = () => (
    <div className="animate-fade-in-up min-h-screen flex items-center justify-center bg-stone-900 text-stone-300">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-serif text-white mb-8">Connect With Us</h2>
        <p className="text-xl font-light mb-12 max-w-2xl mx-auto">
          For custom orders or collaboration inquiries, reach out via email or follow us on social media for updates.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
          <div className="flex flex-col items-center gap-4 group cursor-pointer">
            <div className="w-16 h-16 rounded-full border border-stone-600 flex items-center justify-center group-hover:bg-cinnabar group-hover:border-cinnabar transition-all">
              <Mail size={24} />
            </div>
            <span className="font-serif">hello@zenchill.com</span>
          </div>

          <div className="flex flex-col items-center gap-4 group cursor-pointer">
            <div className="w-16 h-16 rounded-full border border-stone-600 flex items-center justify-center group-hover:bg-cinnabar group-hover:border-cinnabar transition-all">
              <Instagram size={24} />
            </div>
            <span className="font-serif">@zenchill_official</span>
          </div>

          <div className="flex flex-col items-center gap-4 group cursor-pointer">
            <div className="w-16 h-16 rounded-full border border-stone-600 flex items-center justify-center group-hover:bg-cinnabar group-hover:border-cinnabar transition-all">
              <Twitter size={24} />
            </div>
            <span className="font-serif">@zenchill</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} onOpenOrder={() => setIsOrderDrawerOpen(true)} onOpenSettings={() => setIsSettingsDrawerOpen(true)} />

      <main className="flex-1 md:ml-80 relative min-h-screen md:h-screen md:overflow-y-auto flex flex-col">
        <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} onTabChange={setActiveTab} onOpenOrder={() => setIsOrderDrawerOpen(true)} onOpenSettings={() => setIsSettingsDrawerOpen(true)} />

        <div className="flex-1">
          {activeTab === 'about' && <AboutView />}
          {activeTab === 'handmade' && <HandmadeView />}
          {activeTab === 'design' && <DesignView />}
          {activeTab === 'social' && <SocialView />}
        </div>

        <Footer />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckoutStart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        total={cartTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />

      {/* Order Drawer */}
      <OrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
      />

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsDrawerOpen}
        onClose={() => setIsSettingsDrawerOpen(false)}
        userEmail={user?.email}
      />
    </div>
  );
}
