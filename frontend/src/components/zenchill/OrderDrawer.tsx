"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Package, Calendar, CheckCircle, Clock } from 'lucide-react';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
  };
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  total: string;
  createdAt: string;
  shippingAddress: any;
  items: OrderItem[];
}

const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation('common');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Prevent background scrolling when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isOpen]);

  // Fetch orders when the drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const userOrders = await apiService.getUserOrders();
      setOrders(userOrders);
    } catch (error) {
      console.error('获取订单失败:', error);
      toast.error(t('order.fetchOrdersFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get status text and icon
  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return { icon: Clock, text: t('order.confirmed'), color: 'text-amber-600' };
      case 'SHIPPED':
        return { icon: Package, text: t('order.shipped'), color: 'text-blue-600' };
      case 'DELIVERED':
        return { icon: CheckCircle, text: t('order.delivered'), color: 'text-green-600' };
      case 'CANCELED':
        return { icon: X, text: t('order.canceled'), color: 'text-red-600' };
      default:
        return { icon: Clock, text: t('order.pending'), color: 'text-gray-600' };
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-paper shadow-2xl z-[120] transform transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-paper relative">
          <div>
            <h2 className="text-2xl font-serif text-sandalwood">订单管理</h2>
            <p className="text-xs text-stone-500 font-light mt-1">我的订单</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-cinnabar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Order Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
              <div className="w-16 h-16 border-4 border-stone-200 border-t-cinnabar rounded-full animate-spin"></div>
              <p className="font-serif text-lg">{t('order.loadingOrders')}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4 opacity-60">
              <div className="w-32 h-32 flex items-center justify-center rounded-full bg-stone-100">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <p className="font-serif text-lg">{t('order.noOrders')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const StatusIcon = getStatusInfo(order.status).icon;
                const statusColor = getStatusInfo(order.status).color;

                return (
                  <div key={order.id} className="bg-stone-50 rounded-sm border border-stone-200 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-serif text-stone-500">{t('order.orderNumber')}</p>
                        <p className="font-mono font-semibold text-sandalwood">{order.orderNumber}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <StatusIcon size={18} className={statusColor} />
                        <span className={`text-sm font-serif ${statusColor}`}>{getStatusInfo(order.status).text}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mb-4">
                      <Calendar size={16} className="text-stone-400" />
                      <p className="text-xs text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString(i18n.language, {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-3 text-sm">
                          <img
                            src={item.product.imageUrl}
                            className="w-12 h-12 object-cover rounded-sm bg-stone-200"
                            alt={item.product.name}
                          />
                          <div className="flex-1">
                            <p className="font-serif text-stone-800 truncate">{item.product.name}</p>
                            <p className="text-stone-500">x{item.quantity}</p>
                          </div>
                          <div className="font-serif text-stone-700">¥{parseFloat(item.price).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between font-serif font-bold border-t border-stone-300 pt-3">
                      <span>{t('order.total')}</span>
                      <span className="text-cinnabar">¥{parseFloat(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default OrderDrawer;
