"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiService } from "@/services/api";

type CategoryOption = { id: string; name: string };

type ProductSectionForm = {
  title_zh?: string;
  title_en?: string;
  content_zh?: string;
  content_en?: string;
  order?: number;
};

export type ProductFormValues = {
  name_zh: string;
  name_en: string;
  price: number;
  stock: number;
  categoryId: string;
  isActive: boolean;
  sku?: string;
  mainImage?: string;
  detailImages: string[];
  sections?: ProductSectionForm[];
};

export function ProductFormModal({
  open,
  mode,
  categories,
  initialValues,
  loading,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  categories: CategoryOption[];
  initialValues?: Partial<ProductFormValues>;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
}) {
  const [nameZh, setNameZh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [price, setPrice] = useState("0");
  const [stock, setStock] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sku, setSku] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [detailImages, setDetailImages] = useState<string[]>([]);
  const [detailImageUrlInput, setDetailImageUrlInput] = useState("");
  const [sections, setSections] = useState<ProductSectionForm[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingDetails, setUploadingDetails] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setNameZh(initialValues?.name_zh ?? "");
    setNameEn(initialValues?.name_en ?? "");
    setPrice(String(initialValues?.price ?? 0));
    setStock(String(initialValues?.stock ?? 0));
    setCategoryId(initialValues?.categoryId ?? (categories[0]?.id ?? ""));
    setIsActive(initialValues?.isActive ?? true);
    setSku(initialValues?.sku ?? "");
    setMainImage(initialValues?.mainImage ?? "");
    setDetailImages(Array.isArray(initialValues?.detailImages) ? (initialValues?.detailImages as string[]).filter(Boolean).slice(0, 9) : []);
    setDetailImageUrlInput("");
    setSections(Array.isArray(initialValues?.sections) ? (initialValues?.sections as ProductSectionForm[]).slice(0, 3) : []);
  }, [open, initialValues, categories]);

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!nameZh.trim()) errs.nameZh = "Chinese name is required.";
    if (!nameEn.trim()) errs.nameEn = "English name is required.";
    const p = Number(price);
    if (!Number.isFinite(p) || p <= 0) errs.price = "Price must be a number > 0.";
    const s = Number(stock);
    if (!Number.isInteger(s) || s < 0) errs.stock = "Stock must be an integer ≥ 0.";
    if (!categoryId) errs.categoryId = "Category is required.";

    // Publish rules (when Active is checked)
    if (isActive) {
      if (!mainImage.trim()) errs.mainImage = "Main image is required to publish.";
      const hasSection = (sections || []).some((sec) => {
        const tzh = sec.title_zh && sec.title_zh.trim();
        const ten = sec.title_en && sec.title_en.trim();
        const czh = sec.content_zh && String(sec.content_zh).trim();
        const cen = sec.content_en && String(sec.content_en).trim();
        return Boolean(tzh || ten || czh || cen);
      });
      if (!hasSection) errs.sections = "At least 1 section is required to publish.";
    }
    return errs;
  }, [nameZh, nameEn, price, stock, categoryId, isActive, mainImage, sections]);

  const canSubmit = Object.keys(errors).length === 0 && !loading;

  const buildValues = (): ProductFormValues => {
    const normalizedSections = (sections || [])
      .slice(0, 3)
      .map((s, idx) => ({
        title_zh: s.title_zh?.trim() || undefined,
        title_en: s.title_en?.trim() || undefined,
        content_zh: s.content_zh || undefined,
        content_en: s.content_en || undefined,
        order: idx + 1,
      }))
      .filter((s) => s.title_zh || s.title_en || s.content_zh || s.content_en);

    return {
      name_zh: nameZh.trim(),
      name_en: nameEn.trim(),
      price: Number(price),
      stock: Number(stock),
      categoryId,
      isActive,
      sku: sku.trim() || undefined,
      mainImage: mainImage.trim() || undefined,
      detailImages: (detailImages || []).slice(0, 9),
      sections: normalizedSections.length > 0 ? normalizedSections : undefined,
    };
  };

  const moveDetailImage = (from: number, to: number) => {
    setDetailImages((cur) => {
      if (from < 0 || to < 0 || from >= cur.length || to >= cur.length) return cur;
      const next = [...cur];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const removeDetailImage = (idx: number) => {
    setDetailImages((cur) => cur.filter((_, i) => i !== idx));
  };

  const addDetailImageUrls = (urls: string[]) => {
    const cleaned = urls.map((u) => u.trim()).filter(Boolean);
    if (cleaned.length === 0) return;
    setDetailImages((cur) => {
      const merged = [...cur, ...cleaned].filter(Boolean);
      // de-dup while keeping order
      const seen = new Set<string>();
      const deduped: string[] = [];
      for (const u of merged) {
        if (seen.has(u)) continue;
        seen.add(u);
        deduped.push(u);
      }
      return deduped.slice(0, 9);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-blue-900">{mode === "create" ? "Add New Product" : "Edit Product"}</DialogTitle>
          <DialogDescription className="text-gray-500">
            Fill in the details below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-4">
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Basic Information</h3>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Chinese Name *</Label>
            <Input 
              value={nameZh} 
              onChange={(e) => setNameZh(e.target.value)} 
              disabled={!!loading} 
              placeholder="e.g. 茉莉花茶"
            />
            {errors.nameZh ? <p className="text-sm text-red-600 font-medium">{errors.nameZh}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">English Name *</Label>
            <Input 
              value={nameEn} 
              onChange={(e) => setNameEn(e.target.value)} 
              disabled={!!loading} 
              placeholder="e.g. Jasmine Tea"
            />
            {errors.nameEn ? <p className="text-sm text-red-600 font-medium">{errors.nameEn}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Category *</Label>
            <div className="relative">
              <select
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={!!loading}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            {errors.categoryId ? <p className="text-sm text-red-600 font-medium">{errors.categoryId}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">SKU (Optional)</Label>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} disabled={!!loading} placeholder="Stock Keeping Unit" />
          </div>

          <div className="md:col-span-2 mt-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Pricing & Inventory</h3>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Price ($) *</Label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={!!loading}
            />
            {errors.price ? <p className="text-sm text-red-600 font-medium">{errors.price}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Stock *</Label>
            <Input
              type="number"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              disabled={!!loading}
            />
            {errors.stock ? <p className="text-sm text-red-600 font-medium">{errors.stock}</p> : null}
          </div>

          <div className="md:col-span-2 mt-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Media & Status</h3>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-medium">Main Image URL</Label>
            <div className="flex flex-col md:flex-row gap-2">
              <Input
              value={mainImage} 
              onChange={(e) => setMainImage(e.target.value)} 
              disabled={!!loading} 
              placeholder="https://example.com/image.jpg"
              />
              <div className="flex items-center gap-2">
                <label className={`inline-flex items-center justify-center h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium ${uploadingMain || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    disabled={!!loading || uploadingMain}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (!file) return;
                      try {
                        setUploadingMain(true);
                        const res = await apiService.uploadImage(file);
                        setMainImage(res?.url || '');
                      } catch (err: any) {
                        console.error('Upload main image failed:', err);
                        // keep silent here; backend will also validate on publish
                      } finally {
                        setUploadingMain(false);
                      }
                    }}
                  />
                  {uploadingMain ? 'Uploading...' : 'Upload'}
                </label>
              </div>
            </div>
            {errors.mainImage ? <p className="text-sm text-red-600 font-medium">{errors.mainImage}</p> : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-medium">Detail Images</Label>
            <p className="text-xs text-gray-500">Upload up to 9 images. You can reorder by drag & drop or buttons.</p>

            {detailImages.length === 0 ? (
              <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100">
                No detail images yet.
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {detailImages.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className={[
                      "group relative aspect-square rounded-lg border bg-gray-50 overflow-hidden transition-all",
                      dragIndex === idx ? "opacity-60 scale-[0.98] border-blue-300" : "border-gray-200",
                      dragOverIndex === idx && dragIndex !== idx ? "ring-2 ring-blue-500 border-blue-400" : "",
                    ].join(" ")}
                    draggable={!loading}
                    onDragStart={() => setDragIndex(idx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragIndex !== null && dragIndex !== idx) setDragOverIndex(idx);
                    }}
                    onDrop={() => {
                      if (dragIndex === null) return;
                      moveDetailImage(dragIndex, idx);
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    onDragLeave={() => {
                      if (dragOverIndex === idx) setDragOverIndex(null);
                    }}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    title={url}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Detail ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                    <div className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] rounded bg-white/90 border border-gray-200 text-gray-700">
                      {idx + 1}
                    </div>

                    <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 bg-white/90"
                          disabled={!!loading || idx === 0}
                          onClick={() => moveDetailImage(idx, idx - 1)}
                          title="Move left"
                        >
                          ←
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 bg-white/90"
                          disabled={!!loading || idx === detailImages.length - 1}
                          onClick={() => moveDetailImage(idx, idx + 1)}
                          title="Move right"
                        >
                          →
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 bg-white/90 border-red-200 hover:bg-red-50"
                        disabled={!!loading}
                        onClick={() => removeDetailImage(idx)}
                        title="Remove"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <label className={`inline-flex items-center justify-center h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium ${uploadingDetails || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  multiple
                  className="hidden"
                  disabled={!!loading || uploadingDetails}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    e.target.value = '';
                    if (files.length === 0) return;
                    try {
                      setUploadingDetails(true);
                      const remaining = Math.max(0, 9 - detailImages.length);
                      const toUpload = remaining > 0 ? files.slice(0, remaining) : [];
                      if (toUpload.length === 0) return;
                      const res = await apiService.uploadImages(toUpload);
                      const urls = Array.isArray(res?.images) ? res.images.map((x: any) => x?.url).filter(Boolean) : [];
                      if (urls.length === 0) return;
                      addDetailImageUrls(urls);
                    } catch (err: any) {
                      console.error('Upload detail images failed:', err);
                    } finally {
                      setUploadingDetails(false);
                    }
                  }}
                />
                {uploadingDetails ? 'Uploading...' : 'Upload Images'}
              </label>

              <div className="flex-1 w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-2">
                <Input
                  value={detailImageUrlInput}
                  onChange={(e) => setDetailImageUrlInput(e.target.value)}
                  disabled={!!loading}
                  placeholder="Paste image URL and click Add"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={!!loading || !detailImageUrlInput.trim() || detailImages.length >= 9}
                  onClick={() => {
                    addDetailImageUrls([detailImageUrlInput]);
                    setDetailImageUrlInput('');
                  }}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!!loading}
                  onClick={() => setDetailImages([])}
                  className="text-gray-600"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 mt-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Product Introduction Sections (0~3)</h3>
          </div>

          <div className="md:col-span-2 space-y-4">
            {sections.length === 0 ? (
              <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100">
                No sections yet. You can add up to 3 sections (each supports ZH/EN title + content).
              </div>
            ) : null}

            {sections.map((section, idx) => (
              <div key={idx} className="border rounded-xl p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-900">Section {idx + 1}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 text-red-600 hover:bg-red-50"
                    disabled={!!loading}
                    onClick={() => setSections((cur) => cur.filter((_, i) => i !== idx))}
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Title (ZH)</Label>
                    <Input
                      value={section.title_zh ?? ""}
                      onChange={(e) =>
                        setSections((cur) =>
                          cur.map((s, i) => (i === idx ? { ...s, title_zh: e.target.value } : s))
                        )
                      }
                      disabled={!!loading}
                      placeholder="例如：产地与工艺"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Title (EN)</Label>
                    <Input
                      value={section.title_en ?? ""}
                      onChange={(e) =>
                        setSections((cur) =>
                          cur.map((s, i) => (i === idx ? { ...s, title_en: e.target.value } : s))
                        )
                      }
                      disabled={!!loading}
                      placeholder="e.g. Origin & Craft"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-700 font-medium">Content (ZH)</Label>
                    <textarea
                      className="flex min-h-[90px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                      value={section.content_zh ?? ""}
                      onChange={(e) =>
                        setSections((cur) =>
                          cur.map((s, i) => (i === idx ? { ...s, content_zh: e.target.value } : s))
                        )
                      }
                      disabled={!!loading}
                      placeholder="中文介绍内容"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-700 font-medium">Content (EN)</Label>
                    <textarea
                      className="flex min-h-[90px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                      value={section.content_en ?? ""}
                      onChange={(e) =>
                        setSections((cur) =>
                          cur.map((s, i) => (i === idx ? { ...s, content_en: e.target.value } : s))
                        )
                      }
                      disabled={!!loading}
                      placeholder="English introduction content"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">Max 3 sections.</p>
              <Button
                type="button"
                variant="outline"
                disabled={!!loading || sections.length >= 3}
                onClick={() => setSections((cur) => [...cur, {}])}
              >
                Add Section
              </Button>
            </div>
            {errors.sections ? <p className="text-sm text-red-600 font-medium">{errors.sections}</p> : null}
          </div>

          <div className="flex items-center gap-3 md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2">
            <input
              id="isActive"
              type="checkbox"
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-600 border-gray-300"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={!!loading}
            />
            <Label htmlFor="isActive" className="text-gray-900 font-medium cursor-pointer">Product is Active (Visible to customers)</Label>
          </div>
        </div>

        <DialogFooter className="mt-8 border-t pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={!!loading} className="text-gray-600">
            Cancel
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={() => onSubmit(buildValues())}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
          >
            {mode === "create" ? "Create Product" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


