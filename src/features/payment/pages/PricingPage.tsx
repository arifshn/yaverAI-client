import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/store";
import { paymentApi, subscriptionApi } from "../api/paymentApi";
import {
  Check,
  Shield,
  Loader2,
  MessageCircle,
  FileText,
  Search,
  ShoppingCart,
  Activity,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";
import type { CreditPackageDto } from "../models/IPayment";

import Seo from "../../../components/Seo";

export default function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.account);
  const [loading, setLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState<number | null>(null);
  const [packages, setPackages] = useState<CreditPackageDto[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await subscriptionApi.getCreditPackages();
      setPackages(data);
    } catch (error) {
      console.error("Paketler yüklenirken hata oluştu:", error);
    }
  };

  const handleUpgrade = async () => {
    if (!user) {
      navigate("/");
      return;
    }

    if (user.isPremium) {
      toast.info("Zaten Premium üyesiniz!");
      return;
    }

    try {
      setLoading(true);
      const response = await paymentApi.initiateSubscription();
      if (response.success && response.paymentPageUrl) {
        window.location.href = response.paymentPageUrl;
      } else {
        toast.error(response.errorMessage || "Ödeme başlatılamadı");
      }
    } catch (error) {
      console.error("Ödeme hatası:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseCredits = async (packageId: number) => {
    if (!user) {
      navigate("/");
      return;
    }

    try {
      setPurchaseLoading(packageId);
      const response = await paymentApi.initiateCreditPurchase(packageId);
      if (response.success && response.paymentPageUrl) {
        window.location.href = response.paymentPageUrl;
      } else {
        toast.error(response.errorMessage || "Ödeme başlatılamadı");
      }
    } catch (error) {
      console.error("Kredi alım hatası:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setPurchaseLoading(null);
    }
  };

  const premiumFeatures = [
    {
      icon: <Activity className="w-5 h-5 text-indigo-400" />,
      title: "Aylık 1500 Kredi",
      description: "Her ay yenilenen geniş kredi havuzu.",
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-purple-400" />,
      title: "Gelişmiş Destek",
      description: "Hukuki ve resmi süreçlerde tam rehberlik.",
    },
    {
      icon: <FileText className="w-5 h-5 text-pink-400" />,
      title: "Dilekçe Sihirbazı",
      description: "Profesyonel ve hukuki dilekçe oluşturma.",
    },
    {
      icon: <Search className="w-5 h-5 text-indigo-400" />,
      title: "Detaylı Analiz",
      description: "Dökümanlardaki riskleri ve fırsatları görün.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white overflow-hidden">
      <Seo 
        title="Paketler ve Üyelik" 
        description="Premium özelliklere sahip olun, sınırsız dilekçe ve analiz imkanlarından yararlanın."
      />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
           <h1 className="page-title !text-5xl md:!text-7xl !mb-8">
              Gücü <span className="text-gradient-vibrant inline-block pb-1 pr-1">Sahiplen</span>
           </h1>
           <p className="page-subtitle max-w-2xl mx-auto">
              Resmi süreçlerinizi hızlandırmak ve profesyonel sonuçlar almak için doğru planı seçin.
           </p>
        </div>

        {/* Pricing Cards or Subscription Management */}
        <div className="max-w-5xl mx-auto mb-32 animate-fade-in-up animation-delay-200">
             <div className="grid lg:grid-cols-2 gap-10">
                {/* Free Plan */}
                <div className="glass-card p-12 flex flex-col justify-between opacity-80">
                   <div>
                     <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Standart Plan</h3>
                     <div className="flex items-baseline gap-2 mb-10">
                       <span className="text-6xl font-black text-white italic">₺0</span>
                       <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">/aylık</span>
                     </div>
                     <ul className="space-y-6">
                       <li className="flex items-center gap-4 text-sm font-medium text-gray-400">
                         <Check className="w-4 h-4 text-indigo-400" /> Temel Rehberlik
                       </li>
                       <li className="flex items-center gap-4 text-sm font-medium text-gray-400">
                         <Check className="w-4 h-4 text-indigo-400" /> Yaver ile Sohbet
                       </li>
                       <li className="flex items-center gap-4 text-sm font-medium text-gray-600 opacity-60">
                         <XCircle className="w-4 h-4" /> Dilekçe Oluşturma Yok
                       </li>
                       <li className="flex items-center gap-4 text-sm font-medium text-gray-600 opacity-60">
                         <XCircle className="w-4 h-4" /> Belge Analizi Yok
                       </li>
                        <li className="flex items-center gap-4 text-sm font-medium text-gray-600 opacity-60">
                         <XCircle className="w-4 h-4" /> Öncelikli Destek Yok
                       </li>
                     </ul>
                   </div>
                   <button disabled className="w-full mt-12 py-5 rounded-2xl border border-white/5 bg-white/5 text-gray-500 font-black text-xs uppercase tracking-widest cursor-default">
                       {!user?.isPremium ? "Mevcut Planınız" : "Standart Özellikler"}
                   </button>
                </div>

                {/* Premium Plan */}
                <div className="relative p-[1px] rounded-3xl overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
                   <div className="relative h-full glass-card p-12 bg-[#0a0b14]/90 backdrop-blur-3xl flex flex-col justify-between">
                     <div>
                        <div className="flex justify-between items-start mb-8">
                           <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em]">Premium Plan</h3>
                        </div>
                        <div className="flex items-baseline gap-2 mb-10">
                           <span className="text-6xl font-black text-white italic">₺49,90</span>
                           <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">/aylık</span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                           {premiumFeatures.map((f, i) => (
                             <div key={i} className="flex gap-4">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/5 shrink-0">
                                   {f.icon}
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-white mb-1">{f.title}</p>
                                   <p className="text-[11px] font-medium text-gray-500 leading-relaxed">{f.description}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="mt-12 space-y-4">
                       <button 
                         onClick={handleUpgrade}
                         disabled={loading || user?.isPremium}
                         className={`btn-primary w-full py-5 text-sm uppercase tracking-[0.2em] ${user?.isPremium ? 'opacity-100 cursor-default hover:scale-100 bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20' : ''}`}
                       >
                         {loading ? "Yönlendiriliyor..." : (user?.isPremium ? "Aktif Üyelik" : "Hemen Yükselt")}
                       </button>
                       <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                         <Shield className="w-3 h-3" /> Güvenli Ödeme • iyzico
                       </p>
                     </div>
                   </div>
                </div>
             </div>
        </div>

        {/* Credit Packages */}
        {packages.length > 0 && (
          <div className="animate-fade-in-up animation-delay-400">
             <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-white tracking-tighter mb-4 italic">Kredi <span className="text-gradient-vibrant">Paketleri</span></h2>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Üyeliğe ek veya bağımsız alım</p>
             </div>

             <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="glass-card glass-card-hover p-8 group">
                     <div className="flex justify-between items-start mb-10">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-purple-400 group-hover:scale-110 transition-transform">
                           <CreditCard className="w-6 h-6" />
                        </div>
                     </div>
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{pkg.name}</span>
                     <h3 className="text-3xl font-black text-white mt-1 mb-6 italic">{pkg.creditAmount} <span className="text-sm not-italic text-gray-400">Kredi</span></h3>
                     
                     <div className="flex items-center justify-between pt-8 border-t border-white/5">
                        <div>
                           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fiyat</p>
                           <p className="text-xl font-black text-white">₺{pkg.price.toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={() => handlePurchaseCredits(pkg.id)}
                          disabled={purchaseLoading === pkg.id}
                          className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all"
                        >
                           {purchaseLoading === pkg.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* FAQ Preview */}
        <div className="mt-40 max-w-3xl mx-auto space-y-8 opacity-60">
           <h3 className="text-center text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-12">Sıkça Sorulan Sorular</h3>
           {[
             { q: "Aboneliği dilediğim zaman iptal edebilir miyim?", a: "Evet, profil sayfanızdan tek tıkla iptal edebilirsiniz. Fatura döneminiz sonuna kadar kullanmaya devam edersiniz." },
             { q: "Ek krediler silinir mi?", a: "Hayır, satın alınan ek paket kredileri üyeliğiniz bitse dahi hesabınızda kalır ve dilediğiniz zaman kullanabilirsiniz." }
           ].map((faq, i) => (
             <div key={i} className="glass-card p-8">
                <p className="text-sm font-black text-white mb-3 tracking-tight">{faq.q}</p>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">{faq.a}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function XCircle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
