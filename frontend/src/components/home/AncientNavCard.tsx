"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface AncientNavCardProps {
  item: {
    title: string;
    href: string;
    icon: React.ReactNode;
  };
  index: number;
}

export default function AncientNavCard({ item, index }: AncientNavCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
      }}
      viewport={{ once: true }}
    >
      <Link
        href={item.href}
        className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-2 border-[#e8d4b9] hover:border-[#d4af37]/60 transition-all duration-300 overflow-hidden relative"
      >
        {/* 顶部装饰线条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl text-[#8b4513] group-hover:text-[#d4af37] transition-colors">
            {item.icon}
          </div>
          <div className="font-serif text-xl font-semibold text-[#4a4a4a] group-hover:text-[#8b4513] transition-colors">
            {item.title}
          </div>

          {/* 古风装饰元素 */}
          <div className="mt-3 flex items-center gap-1 opacity-30 group-hover:opacity-60 transition-opacity">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-xs text-[#d4af37]">
                •
              </span>
            ))}
          </div>
        </div>

        {/* 悬停时显示的箭头 */}
        <div className="absolute bottom-4 right-4 text-[#d4af37]/30 group-hover:text-[#d4af37] transition-all transform group-hover:translate-x-2">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ➤
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
