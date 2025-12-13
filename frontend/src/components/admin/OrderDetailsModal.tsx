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
    // Fallback for older browsers / denied permissions
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

export function OrderDetailsModal({
  open,
  loading,
  error,
  order,
  onOpenChange,
}: {
  open: boolean;
  loading: boolean;
  error: string | null;
  order: any | null;
  onOpenChange: (open: boolean) => void;
}) {
  const shippingAddressText = order?.shippingAddress
    ? [
        `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim(),
        order.shippingAddress.company ? `${order.shippingAddress.company}` : null,
        order.shippingAddress.address1,
        order.shippingAddress.address2 ? order.shippingAddress.address2 : null,
        `${order.shippingAddress.city}${order.shippingAddress.state ? ` ${order.shippingAddress.state}` : ""} ${order.shippingAddress.zipCode}`.trim(),
        order.shippingAddress.country,
        order.shippingAddress.phone ? `Phone: ${order.shippingAddress.phone}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-900">Order Details</DialogTitle>
          <DialogDescription className="text-gray-500">
            {order?.orderNumber ? `Order #${order.orderNumber}` : "Viewing Order Information"}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
        ) : !order ? (
          <div className="text-center p-8 text-gray-500">No order data available.</div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-100">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={async () => {
                  const ok = await copyText(order.orderNumber);
                  ok ? toast.success("Copied") : toast.error("Failed");
                }}
              >
                Copy Order #
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                disabled={!order.trackingNumber}
                onClick={async () => {
                  const ok = await copyText(order.trackingNumber);
                  ok ? toast.success("Copied") : toast.error("Failed");
                }}
              >
                Copy Tracking
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                disabled={!shippingAddressText}
                onClick={async () => {
                  const ok = await copyText(shippingAddressText);
                  ok ? toast.success("Copied") : toast.error("Failed");
                }}
              >
                Copy Address
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3 uppercase tracking-wider text-xs">Customer & Status</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Email</span> <span className="text-gray-900 font-medium">{order.user?.email}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Username</span> <span className="text-gray-900">{order.user?.username || "-"}</span></div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between items-center"><span className="text-gray-500">Status</span> 
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'SHIPPED' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{order.status}</span>
                  </div>
                  <div className="flex justify-between"><span className="text-gray-500">Payment</span> <span className="text-gray-900 font-medium">{order.paymentStatus}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tracking</span> <span className="font-mono text-gray-700">{order.trackingNumber || "-"}</span></div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3 uppercase tracking-wider text-xs">Shipping Address</h4>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {order.shippingAddress ? (
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900 text-base">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </div>
                      <div>{order.shippingAddress.address1}</div>
                      {order.shippingAddress.address2 && <div>{order.shippingAddress.address2}</div>}
                      <div>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </div>
                      <div className="font-medium">{order.shippingAddress.country}</div>
                      {order.shippingAddress.phone && <div className="text-gray-500 mt-2">{order.shippingAddress.phone}</div>}
                    </div>
                  ) : (
                    <div className="italic text-gray-400">No shipping address provided.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="border rounded-xl overflow-hidden">
              <div className="bg-gray-100 px-5 py-3 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-xs">Order Items</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-left">
                      <th className="px-5 py-3 font-medium text-gray-500">Product</th>
                      <th className="px-5 py-3 font-medium text-gray-500 text-center">Qty</th>
                      <th className="px-5 py-3 font-medium text-gray-500 text-right">Price</th>
                      <th className="px-5 py-3 font-medium text-gray-500 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(order.items || []).map((it: any) => (
                      <tr key={it.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="font-medium text-gray-900">{it.product?.name_en || it.productId}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{it.product?.name_zh}</div>
                        </td>
                        <td className="px-5 py-4 text-center text-gray-700">{it.quantity}</td>
                        <td className="px-5 py-4 text-right text-gray-700">${Number(it.price).toFixed(2)}</td>
                        <td className="px-5 py-4 text-right font-medium text-gray-900">${(Number(it.price) * it.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-5 py-4 border-t border-gray-200">
                 <div className="flex flex-col gap-2 items-end text-sm">
                    <div className="flex justify-between w-48"><span className="text-gray-500">Subtotal:</span> <span className="text-gray-900">${order.subtotal}</span></div>
                    <div className="flex justify-between w-48"><span className="text-gray-500">Tax:</span> <span className="text-gray-900">${order.tax}</span></div>
                    <div className="flex justify-between w-48"><span className="text-gray-500">Shipping:</span> <span className="text-gray-900">${order.shipping}</span></div>
                    <div className="flex justify-between w-48 border-t border-gray-300 pt-2 mt-1"><span className="font-bold text-gray-900">Total:</span> <span className="font-bold text-blue-600 text-lg">${order.total}</span></div>
                 </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full px-8">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


