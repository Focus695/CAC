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
import toast from "react-hot-toast";

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
    if (!nameZh.trim()) errs.nameZh = "中文名称是必填项。";
    if (!nameEn.trim()) errs.nameEn = "英文名称是必填项。";
    const p = Number(price);
    if (!Number.isFinite(p) || p <= 0) errs.price = "价格必须大于 0。";
    const s = Number(stock);
    if (!Number.isInteger(s) || s < 0) errs.stock = "库存必须为大于等于 0 的整数。";
    if (!categoryId) errs.categoryId = "分类是必填项。";

    // Publish rules (when Active is checked)
    if (isActive) {
      if (!mainImage.trim()) errs.mainImage = "发布产品需要主图。";
      const hasSection = (sections || []).some((sec) => {
        const tzh = sec.title_zh && sec.title_zh.trim();
        const ten = sec.title_en && sec.title_en.trim();
        const czh = sec.content_zh && String(sec.content_zh).trim();
        const cen = sec.content_en && String(sec.content_en).trim();
        return Boolean(tzh || ten || czh || cen);
      });
      if (!hasSection) errs.sections = "发布产品至少需要 1 个介绍部分。";
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
          <DialogTitle className="text-2xl text-blue-900">{mode === "create" ? "添加新产品" : "编辑产品"}</DialogTitle>
          <DialogDescription className="text-gray-500">
            请填写以下详细信息。标记 * 的字段为必填项。
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-4">
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">基本信息</h3>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">中文名称 *</Label>
            <Input 
              value={nameZh} 
              onChange={(e) => setNameZh(e.target.value)} 
              disabled={!!loading} 
              placeholder="e.g. 茉莉花茶"
            />
            {errors.nameZh ? <p className="text-sm text-red-600 font-medium">{errors.nameZh}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">英文名称 *</Label>
            <Input 
              value={nameEn} 
              onChange={(e) => setNameEn(e.target.value)} 
              disabled={!!loading} 
              placeholder="e.g. Jasmine Tea"
            />
            {errors.nameEn ? <p className="text-sm text-red-600 font-medium">{errors.nameEn}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">分类 *</Label>
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
            <Label className="text-gray-700 font-medium">SKU (可选)</Label>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} disabled={!!loading} placeholder="库存单位" />
          </div>

          <div className="md:col-span-2 mt-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">定价与库存</h3>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">价格 ($) *</Label>
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
            <Label className="text-gray-700 font-medium">库存 *</Label>
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
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">媒体与状态</h3>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-medium">主图 URL</Label>
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
                      
                      // Check file size (10MB limit)
                      const maxSize = 10 * 1024 * 1024; // 10MB
                      if (file.size > maxSize) {
                        toast.error(`File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB. Please compress the image or choose a smaller file.`);
                        return;
                      }
                      
                      try {
                        setUploadingMain(true);
                        const res = await apiService.uploadImage(file);
                        if (res?.url) {
                          setMainImage(res.url);
                          toast.success('Image uploaded successfully');
                        } else {
                          throw new Error('No URL returned from server');
                        }
                      } catch (err: any) {
                        console.error('Upload main image failed:', err);
                        let errorMessage = err?.message || 'Failed to upload image. Please try again.';
                        // Handle 413 error specifically
                        if (errorMessage.includes('413') || errorMessage.includes('Payload Too Large') || errorMessage.includes('File too large')) {
                          errorMessage = 'File is too large. Maximum size is 10MB. Please compress the image or choose a smaller file.';
                        }
                        toast.error(errorMessage);
                      } finally {
                        setUploadingMain(false);
                      }
                    }}
                  />
                  {uploadingMain ? '上传中...' : '上传'}
                </label>
              </div>
            </div>
            {errors.mainImage ? <p className="text-sm text-red-600 font-medium">{errors.mainImage}</p> : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-medium">详情图片</Label>
            <p className="text-xs text-gray-500">最多上传 9 张图片。可通过拖拽或按钮重新排序。</p>

            {detailImages.length === 0 ? (
              <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100">
                暂无详情图片。
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
                          title="向左移动"
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
                          title="向右移动"
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
                        title="删除"
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
                    
                    // Check file sizes (10MB limit per file)
                    const maxSize = 10 * 1024 * 1024; // 10MB
                    const oversizedFiles = files.filter(f => f.size > maxSize);
                    if (oversizedFiles.length > 0) {
                      const fileNames = oversizedFiles.map(f => f.name).join(', ');
                      toast.error(`Some files exceed 10MB limit: ${fileNames}. Please compress the images or choose smaller files.`);
                      return;
                    }
                    
                    try {
                      setUploadingDetails(true);
                      const remaining = Math.max(0, 9 - detailImages.length);
                      const toUpload = remaining > 0 ? files.slice(0, remaining) : [];
                      if (toUpload.length === 0) {
                        toast.error('Maximum 9 detail images allowed');
                        return;
                      }
                      const res = await apiService.uploadImages(toUpload);
                      const urls = Array.isArray(res?.images) ? res.images.map((x: any) => x?.url).filter(Boolean) : [];
                      if (urls.length === 0) {
                        toast.error('No images were uploaded. Please try again.');
                        return;
                      }
                      addDetailImageUrls(urls);
                      toast.success(`${urls.length} image(s) uploaded successfully`);
                    } catch (err: any) {
                      console.error('Upload detail images failed:', err);
                      let errorMessage = err?.message || 'Failed to upload images. Please try again.';
                      // Handle 413 error specifically
                      if (errorMessage.includes('413') || errorMessage.includes('Payload Too Large') || errorMessage.includes('File too large')) {
                        errorMessage = 'One or more files are too large. Maximum size is 10MB per file. Please compress the images or choose smaller files.';
                      }
                      toast.error(errorMessage);
                    } finally {
                      setUploadingDetails(false);
                    }
                  }}
                />
                {uploadingDetails ? '上传中...' : '上传图片'}
              </label>

              <div className="flex-1 w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-2">
                <Input
                  value={detailImageUrlInput}
                  onChange={(e) => setDetailImageUrlInput(e.target.value)}
                  disabled={!!loading}
                  placeholder="粘贴图片 URL 并点击添加"
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
                  添加
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!!loading}
                  onClick={() => setDetailImages([])}
                  className="text-gray-600"
                >
                  清空全部
                </Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 mt-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">产品介绍部分 (0~3)</h3>
          </div>

          <div className="md:col-span-2 space-y-4">
            {sections.length === 0 ? (
              <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100">
                暂无部分。最多可添加 3 个部分（每个部分支持中英文标题和内容）。
              </div>
            ) : null}

            {sections.map((section, idx) => (
              <div key={idx} className="border rounded-xl p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-900">部分 {idx + 1}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 text-red-600 hover:bg-red-50"
                    disabled={!!loading}
                    onClick={() => setSections((cur) => cur.filter((_, i) => i !== idx))}
                  >
                    删除
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">标题 (中文)</Label>
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
                    <Label className="text-gray-700 font-medium">标题 (英文)</Label>
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
                    <Label className="text-gray-700 font-medium">内容 (中文)</Label>
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
                    <Label className="text-gray-700 font-medium">内容 (英文)</Label>
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
              <p className="text-xs text-gray-500">最多 3 个部分。</p>
              <Button
                type="button"
                variant="outline"
                disabled={!!loading || sections.length >= 3}
                onClick={() => setSections((cur) => [...cur, {}])}
              >
                添加部分
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
            <Label htmlFor="isActive" className="text-gray-900 font-medium cursor-pointer">产品已上架 (对客户可见)</Label>
          </div>
        </div>

        <DialogFooter className="mt-8 border-t pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={!!loading} className="text-gray-600">
            取消
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={() => onSubmit(buildValues())}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
          >
            {mode === "create" ? "创建产品" : "保存更改"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


