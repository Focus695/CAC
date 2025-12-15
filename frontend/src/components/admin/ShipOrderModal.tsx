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

function validateTrackingNumber(value: string): string | null {
  const v = value.trim();
  if (!v) return null; // optional
  if (!/^[A-Za-z0-9-]{3,40}$/.test(v)) {
    return "物流单号必须为 3-40 个字符（字母/数字/短横线）。";
  }
  return null;
}

export function ShipOrderModal({
  open,
  orderNumber,
  onOpenChange,
  onSubmit,
  loading,
}: {
  open: boolean;
  orderNumber?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (trackingNumber: string) => Promise<void> | void;
  loading?: boolean;
}) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const error = useMemo(() => validateTrackingNumber(trackingNumber), [trackingNumber]);

  useEffect(() => {
    if (!open) {
      setTrackingNumber("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-900">发货</DialogTitle>
          <DialogDescription className="text-gray-500">
            {orderNumber ? `请输入订单 #${orderNumber} 的物流信息。` : "请输入物流信息。"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="trackingNumber" className="text-gray-700 font-medium">物流单号 (可选)</Label>
            <Input
              id="trackingNumber"
              placeholder="例如：SF123-456-XYZ"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              disabled={!!loading}
              className="h-11"
            />
            {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : <p className="text-xs text-gray-400">允许字母、数字和短横线（3-40 个字符）。</p>}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={!!loading} className="text-gray-600">
            取消
          </Button>
          <Button
            onClick={() => onSubmit(trackingNumber.trim())}
            disabled={!!loading || !!error}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
          >
            确认发货
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


