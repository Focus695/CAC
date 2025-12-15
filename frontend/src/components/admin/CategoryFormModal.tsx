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

export type CategoryFormValues = {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
};

export function CategoryFormModal({
  open,
  mode,
  loading,
  initialValues,
  parentOptions,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  loading?: boolean;
  initialValues?: Partial<CategoryFormValues>;
  parentOptions: { id: string; name: string }[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CategoryFormValues) => Promise<void> | void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!open) return;
    setName(initialValues?.name ?? "");
    setSlug(initialValues?.slug ?? "");
    setDescription(initialValues?.description ?? "");
    setImage(initialValues?.image ?? "");
    setParentId(initialValues?.parentId ?? "");
    setIsActive(initialValues?.isActive ?? true);
  }, [open, initialValues]);

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "名称是必填项。";
    return errs;
  }, [name]);

  const canSubmit = Object.keys(errors).length === 0 && !loading;

  const buildValues = (): CategoryFormValues => ({
    name: name.trim(),
    slug: slug.trim() || undefined,
    description: description.trim() || undefined,
    image: image.trim() || undefined,
    parentId: parentId || undefined,
    isActive,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-blue-900">
            {mode === "create" ? "添加分类" : "编辑分类"}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            管理您的产品分类。标记 * 的字段为必填项。
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-4">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-medium">名称 *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!!loading} />
            {errors.name ? <p className="text-sm text-red-600 font-medium">{errors.name}</p> : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-medium">Slug (可选)</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={!!loading}
              placeholder="例如：stick-incense (留空将自动生成)"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-medium">父分类 (可选)</Label>
            <select
              className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              disabled={!!loading}
            >
              <option value="">无父分类</option>
              {parentOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-medium">描述 (可选)</Label>
            <textarea
              className="flex min-h-[90px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!!loading}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-medium">图片 URL (可选)</Label>
            <Input value={image} onChange={(e) => setImage(e.target.value)} disabled={!!loading} />
          </div>

          <div className="flex items-center gap-3 md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2">
            <input
              id="isActiveCategory"
              type="checkbox"
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-600 border-gray-300"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={!!loading}
            />
            <Label htmlFor="isActiveCategory" className="text-gray-900 font-medium cursor-pointer">
              分类已激活 (可用于产品选择)
            </Label>
          </div>
        </div>

        <DialogFooter className="mt-6 border-t pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={!!loading} className="text-gray-600">
            取消
          </Button>
          <Button disabled={!canSubmit} onClick={() => onSubmit(buildValues())} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
            {mode === "create" ? "创建分类" : "保存更改"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


