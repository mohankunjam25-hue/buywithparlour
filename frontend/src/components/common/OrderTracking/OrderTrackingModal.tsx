import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Truck,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Loader2,
  Calendar,
} from 'lucide-react';
import { api } from '../../../services/api/axios';
import { useAuthStore } from '../../../store/authStore';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = '',
}) => {
  const { isAuthenticated } = useAuthStore();
  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNumber);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [trackingData, setTrackingData] = useState<any | null>(null);
  const [copiedAWB, setCopiedAWB] = useState(false);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // Fetch logged in user's recent orders for 1-click selection
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      api
        .get('/orders')
        .then((res) => {
          const list = res.data?.data?.orders || [];
          setRecentOrders(list);
          if (list.length > 0 && !initialOrderNumber && !orderNumberInput) {
            setOrderNumberInput(list[0].orderNumber);
            handleTrackOrder(list[0].orderNumber);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    if (initialOrderNumber) {
      setOrderNumberInput(initialOrderNumber);
      handleTrackOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  if (!isOpen) return null;

  const handleTrackOrder = async (targetOrderNumber?: string) => {
    const num = (targetOrderNumber || orderNumberInput).trim();
    if (!num) {
      setErrorMsg('Please enter an Order ID (e.g. BP-...)');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.post('/orders/track', { orderNumber: num });
      setTrackingData(res.data?.data?.tracking);
    } catch (err: any) {
      setTrackingData(null);
      setErrorMsg(
        err.response?.data?.message ||
          `No active parcel found for Order ID: ${num}. Please verify the Order ID.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAWB = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopiedAWB(true);
    setTimeout(() => setCopiedAWB(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#212121]/60 z-50 flex items-center justify-center p-3 sm:p-4 font-sans backdrop-blur-xs">
      <div className="bg-white border border-[#E0E0E0] rounded-[4px] max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto text-[#212121] animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#878787] hover:text-[#212121] p-1 rounded-[2px] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#EEEEEE] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[2px] bg-[#2874F0] text-white flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#212121]">
                Live Order & Courier Tracking Desk
              </h2>
              <p className="text-xs text-[#878787]">
                Delhivery & BlueDart Express certified delivery tracking
              </p>
            </div>
          </div>
        </div>

        {/* Logged-in Quick Order Switcher Chips */}
        {recentOrders.length > 0 && (
          <div className="space-y-1.5 bg-[#F1F3F6] p-2.5 rounded-[2px] text-xs">
            <span className="text-[10px] font-bold text-[#878787] uppercase tracking-wider block">
              Quick Select Your Recent Orders:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {recentOrders.slice(0, 4).map((ord) => (
                <button
                  key={ord._id}
                  onClick={() => {
                    setOrderNumberInput(ord.orderNumber);
                    handleTrackOrder(ord.orderNumber);
                  }}
                  className={`px-2.5 py-1 rounded-[2px] text-xs font-semibold border transition-all cursor-pointer ${
                    orderNumberInput === ord.orderNumber
                      ? 'bg-[#2874F0] text-white border-[#2874F0]'
                      : 'bg-white text-[#212121] border-[#E0E0E0] hover:border-[#2874F0]'
                  }`}
                >
                  {ord.orderNumber} • ₹{ord.totalAmount}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrackOrder();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={orderNumberInput}
              onChange={(e) => setOrderNumberInput(e.target.value)}
              placeholder="Enter Order ID (e.g. BP-1786731455094-5963)"
              className="w-full bg-white border border-[#E0E0E0] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#2874F0] hover:bg-[#1259c7] text-white text-xs font-bold px-5 py-2 rounded-[2px] shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'TRACK NOW'}
          </button>
        </form>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-[#FFEBEE] border border-[#D32F2F]/20 text-[#D32F2F] p-3 rounded-[2px] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Live Tracking Result Details */}
        {trackingData && (
          <div className="space-y-4 pt-1 animate-fade-in text-xs">
            {/* Courier Banner Card */}
            <div className="bg-[#E3F2FD] border border-[#2874F0]/30 p-3.5 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#212121]">
                    {trackingData.carrier}
                  </span>
                  <span className="bg-[#2874F0] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] uppercase">
                    AIR EXPRESS
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#666666]">
                  <span>AWB: <strong className="font-mono text-[#212121]">{trackingData.awbNumber}</strong></span>
                  <button
                    onClick={() => handleCopyAWB(trackingData.awbNumber)}
                    className="text-[#2874F0] hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
                  >
                    {copiedAWB ? <Check className="w-3 h-3 text-[#2E7D32]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAWB ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-[#2874F0]/20 sm:pl-4 space-y-0.5">
                <span className="text-[10px] text-[#878787] uppercase font-bold block">
                  Estimated Delivery Date:
                </span>
                <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 sm:justify-end">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{trackingData.estimatedDelivery}</span>
                </span>
              </div>
            </div>

            {/* Current Hub Location Banner */}
            <div className="bg-[#F1F3F6] p-3 rounded-[2px] border border-[#E0E0E0] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#ED6C02] flex-shrink-0" />
              <span className="text-xs font-semibold text-[#212121]">
                Current Location: <strong className="text-[#2874F0]">{trackingData.currentHub}</strong>
              </span>
            </div>

            {/* 4-Stage Visual Shipment Progress Timeline */}
            <div className="border border-[#EEEEEE] rounded-[4px] p-4 bg-white space-y-4">
              <h3 className="text-xs font-bold text-[#878787] uppercase tracking-wider border-b border-[#EEEEEE] pb-2">
                Shipment Milestones
              </h3>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-200">
                {trackingData.timeline.map((step: any, idx: number) => (
                  <div key={idx} className="relative flex items-start gap-3.5 z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        step.completed
                          ? 'bg-[#2E7D32] text-white shadow-sm'
                          : 'bg-slate-200 text-[#878787]'
                      }`}
                    >
                      {step.completed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold text-xs ${
                            step.completed ? 'text-[#212121]' : 'text-[#878787]'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-[10px] text-[#878787]">{step.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#666666]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items inside Parcel */}
            <div className="border border-[#EEEEEE] rounded-[4px] p-3.5 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#212121]">
                <span>Items in this Package ({trackingData.items?.length || 1})</span>
                <span className="text-[#2874F0]">Total: ₹{trackingData.totalAmount}</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                {trackingData.items?.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-white p-2 rounded-[2px] border border-[#E0E0E0]">
                    <span className="font-semibold text-[#212121] truncate max-w-xs">{it.title}</span>
                    <span className="text-[#666666]">Qty: {it.quantity} • ₹{it.price || it.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Trust Guarantees */}
            <div className="flex items-center justify-between text-[11px] text-[#878787] pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Tamper-Proof Box & OTP Verification at Doorstep</span>
              </div>
              <button
                onClick={onClose}
                className="text-[#2874F0] font-semibold hover:underline cursor-pointer"
              >
                Close Tracker
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
