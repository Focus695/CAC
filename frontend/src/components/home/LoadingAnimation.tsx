"use client";

export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f5f3eb] z-50">
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-4 border-[#d4af37]/30 border-t-[#d4af37] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-[#8b4513]/30 border-b-[#8b4513] animate-spin-slow"></div>
        </div>
        <div className="absolute -bottom-8 left-0 right-0 text-center mt-4 text-[#8b4513] font-serif">
          加载中...
        </div>
      </div>
    </div>
  );
}
