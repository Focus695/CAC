"use client";
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-cinnabar font-serif font-bold border border-stone-700">
                禅
              </div>
              <span className="text-2xl font-serif font-bold text-stone-200">
                禅韵香舍
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 font-light">
              传承东方香道文化，甄选地道中药材。
              <br/>以物寄情，以香养心。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-stone-200 font-serif text-lg mb-6">探索</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-cinnabar transition-colors">当季新品</a></li>
              <li><a href="#" className="hover:text-cinnabar transition-colors">经典系列</a></li>
              <li><a href="#" className="hover:text-cinnabar transition-colors">香道知识</a></li>
              <li><a href="#" className="hover:text-cinnabar transition-colors">会员权益</a></li>
            </ul>
          </div>

           <div>
            <h4 className="text-stone-200 font-serif text-lg mb-6">关于</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-cinnabar transition-colors">品牌故事</a></li>
              <li><a href="#" className="hover:text-cinnabar transition-colors">大师工坊</a></li>
              <li><a href="#" className="hover:text-cinnabar transition-colors">联系我们</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-stone-200 font-serif text-lg mb-6">订阅雅趣</h4>
            <p className="text-xs mb-4">订阅即可获取最新的香道资讯与新品优惠。</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="您的电子邮箱" 
                className="bg-stone-800 border-none outline-none text-stone-200 text-sm px-4 py-2 flex-1 focus:ring-1 focus:ring-cinnabar"
              />
              <button className="bg-cinnabar text-white px-4 py-2 text-sm font-medium hover:bg-red-900 transition-colors">
                订阅
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© 2024 Zen & Incense. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <span>隐私政策</span>
             <span>服务条款</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;