"use client";

import React from "react";

type PaginationInfo = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export function Pagination({
  pagination,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 20, 50],
}: {
  pagination: PaginationInfo | null;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
}) {
  if (!pagination) return null;

  const { page, limit, totalPages, totalCount, hasPrev, hasNext } = pagination;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
      <div className="text-sm text-gray-600">
        第 <span className="font-medium">{page}</span> 页 /{" "}
        <span className="font-medium">{totalPages}</span> 页 · 共{" "}
        <span className="font-medium">{totalCount}</span> 条
      </div>

      <div className="flex items-center gap-3">
        {onLimitChange && (
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <span>每页</span>
            <select
              className="px-2 py-1 border border-gray-300 rounded-md bg-white"
              value={limit}
              onChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasPrev}
            onClick={() => onPageChange(page - 1)}
          >
            上一页
          </button>
          <button
            className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasNext}
            onClick={() => onPageChange(page + 1)}
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
}


