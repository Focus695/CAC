"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export function ProductDetailsModal({
  open,
  loading,
  error,
  product,
  onOpenChange,
}: {
  open: boolean;
  loading: boolean;
  error: string | null;
  product: any | null;
  onOpenChange: (open: boolean) => void;
}) {
  const sections: any[] = product && Array.isArray(product.sections) ? product.sections : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-900">Product Details</DialogTitle>
          <DialogDescription className="text-gray-500">
            {product?.name_en ? `${product.name_zh} (${product.name_en})` : "Product Information"}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-8">
             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
        ) : !product ? (
          <div className="text-center p-8 text-gray-500">No product data available.</div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 pb-4 border-b">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={async () => {
                  const ok = await copyText(product.id);
                  ok ? toast.success("ID Copied") : toast.error("Failed");
                }}
              >
                Copy ID
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                disabled={!product.slug}
                onClick={async () => {
                  const ok = await copyText(product.slug);
                  ok ? toast.success("Slug Copied") : toast.error("Failed");
                }}
              >
                Copy Slug
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3 uppercase tracking-wider text-xs">Basic Info</h4>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">ID</span> <span className="font-mono text-gray-700">{product.id.substring(0, 8)}...</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Slug</span> <span className="text-gray-900 font-medium">{product.slug}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">SKU</span> <span className="text-gray-900">{product.sku || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Category</span> <span className="text-gray-900 font-medium">{product.category?.name || product.categoryId || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Status</span> <span className={`font-medium ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>{product.isActive ? "Active" : "Inactive"}</span></div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3 uppercase tracking-wider text-xs">Pricing & Inventory</h4>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">Price</span> <span className="text-gray-900 font-bold text-lg">${product.price}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Stock Level</span> <span className="text-gray-900 font-medium">{product.stock} units</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Created</span> <span className="text-gray-700">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Last Updated</span> <span className="text-gray-700">{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : "-"}</span></div>
                </div>
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-xs">Introduction Sections</h4>

              {sections.length === 0 ? (
                <div className="text-gray-400 text-sm italic">No sections.</div>
              ) : (
                <div className="space-y-4">
                  {sections
                    .slice()
                    .sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0))
                    .map((s: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-6 h-4 bg-gray-200 block rounded-sm"></span>
                              <span className="font-medium text-gray-900">Chinese (ZH)</span>
                            </div>
                            <div className="text-sm font-semibold text-gray-900 mb-2">
                              {s?.title_zh || `Section ${idx + 1}`}
                            </div>
                            <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed bg-white p-3 rounded border border-gray-100 min-h-[60px]">
                              {s?.content_zh || <span className="text-gray-400 italic">No content.</span>}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-6 h-4 bg-gray-200 block rounded-sm"></span>
                              <span className="font-medium text-gray-900">English (EN)</span>
                            </div>
                            <div className="text-sm font-semibold text-gray-900 mb-2">
                              {s?.title_en || `Section ${idx + 1}`}
                            </div>
                            <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed bg-white p-3 rounded border border-gray-100 min-h-[60px]">
                              {s?.content_en || <span className="text-gray-400 italic">No content.</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="border rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-xs">Media Gallery</h4>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-medium text-gray-500 mb-2 block">MAIN IMAGE</span>
                  {product.mainImage ? (
                    <div className="flex items-start gap-4">
                      <div className="w-32 h-32 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shrink-0">
                        <img src={product.mainImage} alt="Main" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="text-sm text-blue-600 break-all bg-blue-50 p-2 rounded border border-blue-100 font-mono">{product.mainImage}</div>
                         <Button size="sm" variant="ghost" className="mt-2 text-gray-500 h-8" onClick={() => copyText(product.mainImage)}>Copy URL</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm italic">No main image set.</div>
                  )}
                </div>

                <div>
                   <span className="text-xs font-medium text-gray-500 mb-2 block">ADDITIONAL IMAGES</span>
                   {Array.isArray(product.detailImages) && product.detailImages.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {product.detailImages.map((url: string, idx: number) => (
                        <div key={idx} className="group relative aspect-square rounded-lg border border-gray-200 bg-gray-50 overflow-hidden cursor-pointer" title={url} onClick={() => copyText(url)}>
                          <img src={url} alt={`Detail ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm italic">No additional images.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full px-6">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


