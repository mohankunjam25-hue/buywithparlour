import React, { useState } from 'react';
import { ShoppingBag, CheckCircle2, Search } from 'lucide-react';

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  itemsCount: number;
  totalAmount: number;
  paymentMethod: 'ONLINE (UPI)' | 'ONLINE (CARD)' | 'CASH ON DELIVERY (COD)';
  paymentStatus: 'PAID' | 'PENDING';
  status: 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  orderDate: string;
}

export const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: '1',
      orderNumber: 'BP-940218',
      customerName: 'Anjali Sharma',
      customerPhone: '+91 98765 43210',
      city: 'Jaipur, RJ',
      itemsCount: 2,
      totalAmount: 1198,
      paymentMethod: 'ONLINE (UPI)',
      paymentStatus: 'PAID',
      status: 'PROCESSING',
      orderDate: 'Today, 11:30 AM',
    },
    {
      id: '2',
      orderNumber: 'BP-940215',
      customerName: 'Sunita Mehra',
      customerPhone: '+91 98111 22334',
      city: 'New Delhi, DL',
      itemsCount: 1,
      totalAmount: 499,
      paymentMethod: 'CASH ON DELIVERY (COD)',
      paymentStatus: 'PENDING',
      status: 'CONFIRMED',
      orderDate: 'Today, 10:15 AM',
    },
    {
      id: '3',
      orderNumber: 'BP-940190',
      customerName: 'Neha Kapoor',
      customerPhone: '+91 99887 76655',
      city: 'Chandigarh, PB',
      itemsCount: 3,
      totalAmount: 2897,
      paymentMethod: 'ONLINE (CARD)',
      paymentStatus: 'PAID',
      status: 'SHIPPED',
      orderDate: 'Yesterday',
    },
    {
      id: '4',
      orderNumber: 'BP-940150',
      customerName: 'Priyanka Sen',
      customerPhone: '+91 91234 56789',
      city: 'Mumbai, MH',
      itemsCount: 1,
      totalAmount: 1899,
      paymentMethod: 'ONLINE (UPI)',
      paymentStatus: 'PAID',
      status: 'DELIVERED',
      orderDate: '12 Aug 2026',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchOrder, setSearchOrder] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleStatusChange = (orderId: string, newStatus: OrderItem['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setToastMessage(`Order #${orders.find((o) => o.id === orderId)?.orderNumber} status updated to ${newStatus}!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;
    if (
      searchOrder &&
      !o.orderNumber.toLowerCase().includes(searchOrder.toLowerCase()) &&
      !o.customerName.toLowerCase().includes(searchOrder.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Orders Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <span>Customer Orders & Express Fulfillment Desk</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live order tracking, payment verification, and courier dispatch lifecycle
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200">
              Total {orders.length} Orders Recorded
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-white text-blue-600 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Quick Filter Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              placeholder="Filter by Order # or Customer..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer Info</th>
                <th className="p-3">Items & City</th>
                <th className="p-3">Total Value</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3 text-right">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <span className="font-extrabold text-blue-600 block">{order.orderNumber}</span>
                    <span className="text-[10px] text-slate-400">{order.orderDate}</span>
                  </td>

                  <td className="p-3">
                    <strong className="text-slate-900 block">{order.customerName}</strong>
                    <span className="text-[11px] text-slate-500">{order.customerPhone}</span>
                  </td>

                  <td className="p-3">
                    <span className="font-semibold text-slate-800 block">{order.itemsCount} Beauty Items</span>
                    <span className="text-[11px] text-slate-500">{order.city}</span>
                  </td>

                  <td className="p-3">
                    <span className="font-black text-sm text-emerald-600">₹{order.totalAmount}</span>
                  </td>

                  <td className="p-3">
                    <span className="text-slate-800 block">{order.paymentMethod}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderItem['status'])
                      }
                      className="bg-slate-50 border border-slate-300 text-xs font-bold rounded-xl px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="CONFIRMED">🟡 CONFIRMED</option>
                      <option value="PROCESSING">🔵 PROCESSING</option>
                      <option value="SHIPPED">🚚 SHIPPED</option>
                      <option value="DELIVERED">🟢 DELIVERED</option>
                      <option value="CANCELLED">🔴 CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
