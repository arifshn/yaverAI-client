import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/store";
import { subscriptionApi } from "../api/paymentApi";
import type { SubscriptionDto, PaymentDto } from "../models/IPayment";
import {
  Sparkles,
  Calendar,
  CreditCard,
  AlertTriangle,
  Loader2,
  X,
  History,

  Coins,
} from "lucide-react";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils/dateUtils";

export default function SubscriptionManagement() {
  const { user } = useAppSelector((state) => state.account);
  const [subscription, setSubscription] = useState<SubscriptionDto | null>(
    null
  );
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const promises: Promise<any>[] = [subscriptionApi.getPaymentHistory()];
      if (user?.isPremium) {
        promises.push(subscriptionApi.getActiveSubscription());
      }
      
      const [historyData, subData] = await Promise.all(promises);
      setPayments(historyData || []);
      setSubscription(subData || null);
    } catch (error) {
      console.error("Load data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCancelling(true);
      await subscriptionApi.cancelSubscription({ reason: cancelReason });
      toast.success("Aboneliğiniz iptal edildi");
      setShowCancelModal(false);
      loadData();
      // User'ı yeniden yükle
      window.location.reload();
    } catch (error) {
      console.error("Cancel subscription error:", error);
      toast.error("Abonelik iptal edilemedi");
    } finally {
      setCancelling(false);
    }
  };

  const navigate = useNavigate();

  if (loading && !payments.length && !subscription) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 text-purple-600 mx-auto mb-3 animate-spin" />
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  const isActive = subscription?.status === "Active";
  const isCancelled = subscription?.status === "Cancelled";

  return (
    <>

      {/* Subscription Card */}
      {user?.isPremium && (
        <div className="glass-card p-8 md:p-10 mb-12 animate-fade-in-up">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10 border-b border-white/5 pb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter">
                  Premium <span className="text-gradient-vibrant inline-block pb-1 pr-1">Abonelik</span>
                </h3>
              </div>
              <p className="text-sm text-gray-400 font-medium ml-1">
                {isActive && "Aboneliğiniz aktif ve tüm özellikler açık."}
                {isCancelled && "İptal edildi (dönem sonuna kadar aktif)."}
              </p>
            </div>
            <div
              className={`self-start px-6 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] border ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : isCancelled
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            >
              {subscription?.status === "Active" ? "AKTİF" : subscription?.status}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="glass-card p-6 flex flex-col justify-center border-indigo-500/10">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Başlangıç</span>
              </div>
              <p className="font-bold text-xl text-white tracking-tight">
                {subscription?.startDate && formatDate(subscription.startDate, "d MMMM yyyy")}
              </p>
            </div>

            <div className="glass-card p-6 flex flex-col justify-center border-purple-500/10">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {subscription?.autoRenew ? "Yenilenme" : "Bitiş"}
                </span>
              </div>
              <p className="font-bold text-xl text-white tracking-tight">
                {subscription?.nextBillingDate
                  ? formatDate(subscription.nextBillingDate, "d MMMM yyyy")
                  : "—"}
              </p>
            </div>

            <div className="glass-card p-6 flex flex-col justify-center border-pink-500/10">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tutar</span>
              </div>
              <p className="font-bold text-xl text-white tracking-tight">
                ₺{subscription?.price.toFixed(2)} <span className="text-xs text-gray-500 font-medium">/aylık</span>
              </p>
            </div>

            <div className="glass-card p-6 flex flex-col justify-center border-indigo-500/10">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Durum</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${subscription?.autoRenew ? "bg-emerald-500 animate-pulse" : "bg-gray-500"}`} />
                 <p className="font-bold text-xl text-white tracking-tight">
                    {subscription?.autoRenew ? "Otomatik Yenileme" : "Durduruldu"}
                 </p>
              </div>
            </div>
          </div>

          {/* Cancel Info */}
          {isCancelled && subscription?.cancelledAt && (
            <div className="p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-xl mb-8 flex items-start gap-4">
               <div className="p-2 bg-yellow-500/10 rounded-lg shrink-0">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
               </div>
               <div>
                  <h4 className="text-sm font-black text-yellow-200 uppercase tracking-wide mb-1">Abonelik İptal Edildi</h4>
                  <p className="text-sm text-yellow-200/60 leading-relaxed font-medium">
                     Premium ayrıcalıklarınız {subscription.endDate && formatDate(subscription.endDate, "d MMMM yyyy")} tarihine kadar devam edecektir.
                  </p>
               </div>
            </div>
          )}

          {/* Actions */}
          {isActive && subscription?.autoRenew && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 rounded-lg uppercase tracking-wider"
              >
                <X className="w-3.5 h-3.5" />
                Aboneliği İptal Et
              </button>
            </div>
          )}
        </div>
      )}

      {!user?.isPremium && (
        <div className="glass-card p-12 text-center mb-16 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">

            <h3 className="text-3xl font-black text-white mb-4 italic tracking-tighter">Premium'a <span className="text-gradient-vibrant inline-block pb-1 pr-1">Yükselt</span></h3>
            <p className="text-gray-400 max-w-lg mx-auto mb-10 font-medium leading-relaxed">
              Sınırsız sohbet, belge analizi ve dilekçe oluşturma gibi ayrıcalıklı özelliklere erişin.
            </p>
            <button
              onClick={() => navigate("/paketler")}
              className="btn-primary mx-auto"
            >
              Planları İncele
            </button>
          </div>
        </div>
      )}

      {/* Transaction History Section */}
      <div className="animate-fade-in-up animation-delay-200">
        <div className="flex items-center gap-3 mb-6 mt-12 border-b border-white/5 pb-4">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
             <History className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-black text-white italic tracking-tighter">
             İşlem <span className="text-gradient-vibrant inline-block">Geçmişi</span>
          </h3>
        </div>

        <div className="glass-card overflow-hidden">
          {!payments.length ? (
            <div className="p-16 text-center">
               <div className="w-16 h-16 glass-card mx-auto mb-4 flex items-center justify-center text-gray-600">
                  <History className="w-8 h-8" />
               </div>
               <p className="text-gray-500 font-medium">Henüz bir işlem geçmişiniz bulunmuyor.</p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Tarih</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">İşlem Detayı</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Tutar</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6">
                          <span className="text-xs font-bold text-gray-300">
                            {formatDate(payment.createdAt)}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            {payment.type === "Subscription" ? (
                              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                              </div>
                            ) : (
                              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                                <Coins className="w-4 h-4 text-purple-400" />
                              </div>
                            )}
                            <div className="flex flex-col">
                               <span className="text-sm font-bold text-white">
                                  {payment.type === "Subscription" ? "Premium Abonelik" : "Ek Kredi Paketi"}
                               </span>
                               <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                                  {payment.type === "Subscription" ? "Aylık Plan" : `${payment.creditAmount} Kredi`}
                               </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-sm font-black text-white px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                              ₺{payment.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Başarılı</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4 p-4">
                 {payments.map((payment) => (
                    <div key={payment.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                        {/* Status Line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>

                        <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center gap-3">
                              {payment.type === "Subscription" ? (
                                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                  <Sparkles className="w-5 h-5 text-indigo-400" />
                                </div>
                              ) : (
                                <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                  <Coins className="w-5 h-5 text-purple-400" />
                                </div>
                              )}
                              <div>
                                 <h4 className="text-sm font-bold text-white">
                                    {payment.type === "Subscription" ? "Premium Abonelik" : "Ek Kredi Paketi"}
                                 </h4>
                                 <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider block mt-0.5">
                                    {payment.type === "Subscription" ? "Aylık Plan" : `${payment.creditAmount} Kredi`}
                                 </span>
                              </div>
                           </div>
                           <span className="text-sm font-black text-white px-2.5 py-1 bg-white/5 rounded-lg border border-white/5">
                              ₺{payment.amount.toFixed(2)}
                           </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
                             <span className="text-gray-500 font-medium">
                               {formatDate(payment.createdAt)}
                             </span>
                            <div className="flex items-center gap-1.5">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Başarılı</span>
                            </div>
                        </div>
                    </div>
                 ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#1a1b26] border border-white/10 rounded-2xl shadow-2xl p-6">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            
            <h3 className="text-xl font-bold text-white mb-2">
              Aboneliği İptal Et
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Aboneliğinizi iptal etmek üzeresiniz. Premium özellikleriniz fatura dönemi sonuna kadar devam edecektir.
            </p>

            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                İptal Nedeni (Opsiyonel)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Neden ayrılıyorsunuz? Bize yardımcı olun..."
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all resize-none text-sm"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 px-4 py-2.5 text-gray-300 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="flex-1 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    İptal Ediliyor...
                  </>
                ) : (
                  "Planı İptal Et"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
