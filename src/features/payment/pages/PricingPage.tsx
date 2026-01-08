import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/store";
import { subscriptionApi } from "../api/paymentApi";
import {
  Check,
  Shield,
  Loader2,
  MessageCircle,
  Search,
  ShoppingCart,
  Activity,
  CreditCard,
  Star,
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (packages.length > 0 && params.get("highlight")) {
        setTimeout(() => {
             const element = document.getElementById("packages-section");
             if (element) {
                 element.scrollIntoView({ behavior: "smooth", block: "center" });
             }
        }, 100);
    }
  }, [packages]);

  const fetchPackages = async () => {
    try {
      const data = await subscriptionApi.getCreditPackages();
      setPackages(data);
    } catch (error) {
      console.error("Paketler yüklenirken hata oluştu:", error);
    }
  };

  // Helper to handle auto-submit form
  const handlePaymentRequest = async (type: "subscription" | "credit", packageId?: number, creditAmount?: number) => {
    if (!user) {
      navigate("/");
      return;
    }
    
    setLoading(true);
    if (packageId) setPurchaseLoading(packageId);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://yaverapp.com.tr/api/payment/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
           type,
           packageId,
           creditAmount
        })
      });

      if (!response.ok) {
        toast.error("Ödeme servisine erişilemedi.");
        return;
      }

      // Backend HTML (Form) döner
      const html = await response.text();
      
      // Geçici bir div oluşturup, HTML'i içine basarız ve formu submit ederiz
      const div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);
      
      const form = div.querySelector("form");
      if (form) {
        form.submit(); // Otomatik Yönlendirme
      } else {
        toast.error("Ödeme formu oluşturulamadı.");
      }

    } catch (error) {
       console.error("Ödeme hatası:", error);
       toast.error("Bir hata oluştu.");
    } finally {
       setLoading(false);
       setPurchaseLoading(null);
    }
  };


  const handleUpgrade = () => handlePaymentRequest("subscription");
  const handlePurchaseCredits = (pkgId: number, amount: number) => handlePaymentRequest("credit", pkgId, amount);


  const premiumFeatures = [
    {
      icon: <Activity className="w-5 h-5 text-indigo-400" />,
      title: "1500 Kredi",
      description: "1 ay boyunca geçerli geniş kredi havuzu.",
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-purple-400" />,
      title: "Tüm Şablonlar",
      description: "Tüm dilekçe şablonlarını kullanabilirsiniz.",
    },
    {
      icon: <Search className="w-5 h-5 text-indigo-400" />,
      title: "Belge Analizi",
      description: "Döküman yükleyerek analiz yapabilirsiniz.",
    },
    {
      icon: <Activity className="w-5 h-5 text-pink-400" />,
      title: "Rehber Hizmeti",
      description: "Adım adım rehberlik alabilirsiniz.",
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
                <div className="p-12 flex flex-col justify-between opacity-80 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 backdrop-blur-xl">
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
                           <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em]">1 Aylık Hizmet Paketi</h3>
                        </div>
                        <div className="flex items-baseline gap-2 mb-10">
                           <span className="text-6xl font-black text-white italic">₺49,90</span>
                           <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">/tek seferlik</span>
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
                         {loading ? "Yönlendiriliyor..." : (user?.isPremium ? "Hizmetiniz Aktif" : "Hemen Satın Al")}
                       </button>
                       <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                         <Shield className="w-3 h-3" /> Güvenli Ödeme • Shopier
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
                {packages.map((pkg) => {
                  const isPopular = pkg.creditAmount === 500;
                  return (
                    <div key={pkg.id} className={`group relative p-8 rounded-3xl bg-gradient-to-br border backdrop-blur-xl transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 ${isPopular ? 'from-indigo-900/40 to-indigo-900/10 border-indigo-500/50 hover:border-indigo-500 hover:from-indigo-900/50 hover:to-indigo-900/20 ring-1 ring-indigo-500/50' : 'from-white/[0.03] to-transparent border-white/5 hover:border-white/10 hover:from-white/[0.06] hover:to-white/[0.02]'}`}>
                       
                       {isPopular && (
                         <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-500/20 whitespace-nowrap z-10">
                            En Çok Tercih Edilen
                         </div>
                       )}

                       <div className="flex justify-between items-start mb-10">
                          <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${isPopular ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/5 text-purple-400'}`}>
                             <CreditCard className="w-6 h-6" />
                          </div>
                          {isPopular && (
                            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 animate-pulse">
                              <Star className="w-4 h-4 text-indigo-400" />
                            </div>
                          )}
                       </div>
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{pkg.name}</span>
                       <h3 className="text-3xl font-black text-white mt-1 mb-6 italic">{pkg.creditAmount} <span className="text-sm not-italic text-gray-400">Kredi</span></h3>
                       
                       <div className={`flex items-center justify-between pt-8 border-t ${isPopular ? 'border-indigo-500/20' : 'border-white/5'}`}>
                          <div>
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fiyat</p>
                             <p className="text-xl font-black text-white">₺{pkg.price.toFixed(2)}</p>
                          </div>
                          <button 
                            onClick={() => handlePurchaseCredits(pkg.id, pkg.creditAmount)}
                            disabled={purchaseLoading === pkg.id}
                            className={`p-4 rounded-xl border transition-all ${isPopular ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-white/5 hover:bg-white/10 text-white border-white/5'}`}
                          >
                             {purchaseLoading === pkg.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                          </button>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        )}

 
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
