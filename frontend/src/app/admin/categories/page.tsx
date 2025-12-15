"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { apiService } from "@/services/api";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { CategoryFormModal, CategoryFormValues } from "@/components/admin/CategoryFormModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, Plus, Tag, Trash2, CheckCircle, XCircle, Search } from "lucide-react";

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "danger" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>{children}</span>;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formInitial, setFormInitial] = useState<any | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [toggleTarget, setToggleTarget] = useState<any | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getAdminCategories();
      setCategories(Array.isArray(result) ? result : []);
    } catch (e: any) {
      console.error("Failed to fetch categories:", e);
      setError(e?.message || "获取分类失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => {
      const name = String(c?.name || "").toLowerCase();
      const slug = String(c?.slug || "").toLowerCase();
      return name.includes(q) || slug.includes(q);
    });
  }, [categories, search]);

  const parentOptions = useMemo(() => {
    return categories.map((c) => ({ id: c.id, name: c.name }));
  }, [categories]);

  const openCreate = () => {
    setFormMode("create");
    setFormInitial(null);
    setFormOpen(true);
  };

  const openEdit = (category: any) => {
    setFormMode("edit");
    setFormInitial(category);
    setFormOpen(true);
  };

  const submitCategory = async (values: CategoryFormValues) => {
    try {
      setLoading(true);
      if (formMode === "create") {
        const payload = { ...values, slug: values.slug || slugify(values.name) };
        await apiService.createCategory(payload);
        toast.success("分类已创建");
      } else {
        await apiService.updateCategory(formInitial.id, values);
        toast.success("分类已更新");
      }
      setFormOpen(false);
      await fetchCategories();
    } catch (e: any) {
      console.error("Save category failed:", e);
      toast.error(e?.message || "保存分类失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: any) => {
    try {
      setLoading(true);
      await apiService.deleteCategory(category.id);
      toast.success("分类已删除");
      await fetchCategories();
    } catch (e: any) {
      console.error("Delete failed:", e);
      toast.error(e?.message || "删除失败");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (category: any) => {
    try {
      setLoading(true);
      await apiService.toggleCategoryStatus(category.id);
      toast.success(category.isActive ? "分类已停用" : "分类已激活");
      await fetchCategories();
    } catch (e: any) {
      console.error("Toggle failed:", e);
      toast.error(e?.message || "切换状态失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>分类管理</CardTitle>
              <CardDescription>管理产品目录中使用的分类</CardDescription>
            </div>
            <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> 添加分类
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索分类..." className="pl-9" />
            </div>
          </div>

          <div className="rounded-md border">
            {error && <div className="p-4 bg-red-50 text-red-700 border-b border-red-100">{error}</div>}
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left font-medium text-gray-500">分类</th>
                    <th className="h-12 px-4 text-left font-medium text-gray-500">Slug</th>
                    <th className="h-12 px-4 text-left font-medium text-gray-500">产品数</th>
                    <th className="h-12 px-4 text-left font-medium text-gray-500">状态</th>
                    <th className="h-12 px-4 text-right font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {loading && filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500">
                        正在加载分类...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Tag className="w-8 h-8 text-gray-300" />
                          <p>未找到分类。</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c) => (
                      <tr key={c.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{c.name}</span>
                            {c.parent?.name ? <span className="text-xs text-gray-500">父分类: {c.parent.name}</span> : null}
                          </div>
                        </td>
                        <td className="p-4 align-middle text-gray-700 font-mono">{c.slug}</td>
                        <td className="p-4 align-middle text-gray-700">{c?._count?.products ?? 0}</td>
                        <td className="p-4 align-middle">
                          <Badge variant={c.isActive ? "success" : "danger"}>{c.isActive ? "激活" : "未激活"}</Badge>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(c)} title="编辑">
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`h-8 w-8 p-0 ${c.isActive ? "hover:bg-red-50 border-red-200" : "hover:bg-green-50 border-green-200"}`}
                              onClick={() => setToggleTarget(c)}
                              title={c.isActive ? "停用" : "激活"}
                            >
                              {c.isActive ? <XCircle className="h-4 w-4 text-red-600" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 hover:bg-red-50 border-red-200" onClick={() => setDeleteTarget(c)} title="删除">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        open={!!deleteTarget}
        title="删除分类？"
        description={deleteTarget ? `这将永久删除 "${deleteTarget.name}"。` : undefined}
        confirmText="删除"
        cancelText="取消"
        confirmDisabled={loading}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={async () => {
          await handleDelete(deleteTarget);
          setDeleteTarget(null);
        }}
      />

      <ConfirmModal
        open={!!toggleTarget}
        title={toggleTarget?.isActive ? "停用分类？" : "激活分类？"}
        description={toggleTarget ? `分类: ${toggleTarget.name}` : undefined}
        confirmText={toggleTarget?.isActive ? "停用" : "激活"}
        cancelText="取消"
        confirmDisabled={loading}
        onOpenChange={(open) => {
          if (!open) setToggleTarget(null);
        }}
        onConfirm={async () => {
          await handleToggle(toggleTarget);
          setToggleTarget(null);
        }}
      />

      <CategoryFormModal
        open={formOpen}
        mode={formMode}
        loading={loading}
        parentOptions={parentOptions.filter((p) => p.id !== formInitial?.id)}
        initialValues={
          formMode === "edit" && formInitial
            ? {
                name: formInitial.name,
                slug: formInitial.slug,
                description: formInitial.description,
                image: formInitial.image,
                parentId: formInitial.parentId || "",
                isActive: !!formInitial.isActive,
              }
            : { isActive: true }
        }
        onOpenChange={setFormOpen}
        onSubmit={submitCategory}
      />
    </div>
  );
}


