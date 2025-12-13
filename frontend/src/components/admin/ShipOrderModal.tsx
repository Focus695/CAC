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
    return "Tracking number must be 3-40 chars (letters/numbers/dash).";
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
          <DialogTitle className="text-xl text-gray-900">Ship Order</DialogTitle>
          <DialogDescription className="text-gray-500">
            {orderNumber ? `Enter tracking details for order #${orderNumber}.` : "Enter tracking details."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="trackingNumber" className="text-gray-700 font-medium">Tracking Number (Optional)</Label>
            <Input
              id="trackingNumber"
              placeholder="e.g. SF123-456-XYZ"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              disabled={!!loading}
              className="h-11"
            />
            {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : <p className="text-xs text-gray-400">Letters, numbers and dashes allowed (3-40 chars).</p>}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={!!loading} className="text-gray-600">
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(trackingNumber.trim())}
            disabled={!!loading || !!error}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
          >
            Confirm Shipment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


