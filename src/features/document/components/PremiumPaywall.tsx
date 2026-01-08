import { useState, useEffect } from "react";
import { Crown, Lock, Check, X, ArrowRight, Clock, Coins, Calendar, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/store";
import { subscriptionApi } from "../../payment/api/paymentApi";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface PremiumPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  showTimer?: boolean;
}

export default function PremiumPaywall({
  isOpen,
  onClose,
  feature = "Doküman Analizi",
  showTimer = false,
}: PremiumPaywallProps) {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.account);
  const [timeLeft, setTimeLeft] = useState("");
  const [recommendedPackage, setRecommendedPackage] = useState<any>(null);

  const isPremium = user?.isPremium;

  useEffect(() => {
    if (!isOpen) return;
    
    const loadPackages = async () => {
        try {
            const data = await subscriptionApi.getCreditPackages();
            if (data && data.length > 0) {
                // Recommend the middle one or the first one
                setRecommendedPackage(data.length > 1 ? data[1] : data[0]);
            }
        } catch (e) {
            console.error(e);
        }
    };
    
    if (isPremium) {
        loadPackages();
    }

    if (!showTimer) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours} saat ${minutes} dakika`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, [isOpen, showTimer, isPremium]);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    // Premium kullanıcılar (iptal olsun olmasın) her zaman kredi paketlerine yönlendirilir
    if (isPremium && recommendedPackage) {
        navigate(`/paketler?highlight=${recommendedPackage.id}`);
    } else {
        navigate("/paketler");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      {/* Mobile: max-w-[340px], Desktop: max-w-2xl */}
      <div className="relative w-full max-w-[340px] md:max-w-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-8 h-8 md:w-10 md:h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors border border-white/10 z-10"
        >
          <X className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        </button>

        {/* Card */}
        <div className="bg-[#0a0b14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${isPremium ? 'from-amber-500/5 to-orange-500/5' : 'from-indigo-500/5 to-purple-500/5'}`} />
          
          {/* Header */}
          <div className="relative bg-white/5 border-b border-white/10 p-5 md:p-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className={`w-16 h-16 md:w-20 md:h-20 ${isPremium ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-indigo-600 to-purple-600'} rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 shrink-0`}>
                {isPremium ? (
                    <Coins className="w-8 h-8 md:w-10 md:h-10 text-white" />
                ) : (
                    <Crown className="w-8 h-8 md:w-10 md:h-10 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-black text-white mb-2 leading-tight">
                  <span className="text-gradient-vibrant">{isPremium ? 'Krediniz' : 'Premium\'a'}</span> {isPremium ? 'Tükendi' : 'Yükseltin'}
                </h2>
                
                <div className="text-gray-400 text-sm md:text-lg leading-relaxed font-medium">
                  {isPremium ? (
                    <div className="space-y-3">
                        <p>Mevcut kredileriniz bitti. <span className="text-white font-bold">{feature}</span> işlemine devam etmek için ek kredi veya yenileme yapabilirsiniz.</p>
                        
                        {user?.premiumEndDate && (
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {user.autoRenew ? (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-xs text-gray-400 font-bold uppercase tracking-wider">
                                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                                        <span>Yenilenme: {format(new Date(user.premiumEndDate), "d MMMM yyyy", { locale: tr })}</span>
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20 text-xs text-red-400 font-bold uppercase tracking-wider">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        <span>Üyelik İptal Edildi • Bitiş: {format(new Date(user.premiumEndDate), "d MMMM yyyy", { locale: tr })}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                  ) : showTimer ? (
                    <span>Günlük işlem limitiniz doldu. <span className="text-white font-bold">{feature}</span> için Premium'a geçin ya da yenilenme süresini bekleyin.</span>
                  ) : (
                    <span><span className="text-white font-bold">{feature}</span> için Premium üyelik gerekiyor.</span>
                  )}
                </div>

                {showTimer && !isPremium && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-medium text-indigo-300">
                      Haklarınızın yenilenmesine: <span className="text-white font-bold">{timeLeft}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-5 md:p-8">
            {/* Desktop Only Features */}
            {/* Desktop Only Features */}
            <div className="hidden md:block">
                {/* Feature Description */}
                {/* Feature Description - Only for Non-Premium */}
                {!isPremium && (
                    <div className="bg-indigo-500/10 border-indigo-500/20 border rounded-xl p-4 mb-8">
                        <div className="flex items-start gap-4">
                            <Lock className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-indigo-400 mb-1">Neden Premium?</h3>
                                <p className="text-gray-300 leading-relaxed text-sm">
                                    Yapay zeka destekli analizler, özel dilekçe şablonları ve öncelikli işlem gücü Premium üyelerimize özeldir.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Package Recommendation Module - Show for ALL premium users if available */}
                {isPremium && recommendedPackage && (
                    <div className="mb-8 p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 rounded-xl border relative overflow-hidden group transition-all cursor-pointer hover:border-amber-500/40" onClick={handleUpgrade}>
                        <div className="flex items-center gap-5">
                             <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/10">
                                <Coins className="w-7 h-7" />
                             </div>
                             <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-black text-white text-lg">{recommendedPackage.name}</h4>
                                    <div className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded border border-amber-500/20">
                                        En Avantajlı
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 font-medium">Bakiyenize anında eklenir</p>
                             </div>
                             <div className="ml-auto text-right">
                                <p className="text-2xl font-black text-white tracking-tight">₺{recommendedPackage.price}</p>
                                <p className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">{recommendedPackage.creditAmount} Kredi</p>
                             </div>
                        </div>
                    </div>
                )}
                
                {/* Features Grid - Only for Non-Premium */}
                {!isPremium && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {[
                        { title: "1500 Kredi / Ay", desc: "Geniş işlem hacmi" },
                        { title: "Gelişmiş Analiz", desc: "Detaylı risk raporlama" },
                        { title: "Pro Dilekçeler", desc: "Tüm şablonlara erişim" },
                        { title: "Öncelikli Destek", desc: "Hızlı yanıt süresi" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <div>
                            <h4 className="font-bold text-white text-sm mb-0.5">{item.title}</h4>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                    </div>
                )}
            </div>

            {/* Pricing & CTA */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 md:pt-6 md:border-t md:border-white/10">
              <div className="flex-1 text-center md:text-left">
                {!isPremium ? (
                    <>
                        <p className="text-gray-500 md:text-gray-400 text-xs md:text-sm mb-1 uppercase tracking-wider font-bold">Aylık Plan</p>
                        <div className="flex items-baseline justify-center md:justify-start gap-2">
                        <span className="text-3xl md:text-4xl font-black text-white tracking-tighter">₺49.90</span>
                        <span className="text-gray-400 font-medium">/ay</span>
                        </div>
                    </>
                ) : (
                     <div className="hidden md:block">
                        <p className="text-gray-500 text-xs font-medium">
                            Paketleri inceleyerek hemen kredi yükleyebilirsiniz.
                        </p>
                     </div>
                )}
              </div>

              <div className="flex flex-col-reverse md:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0">
                <button
                    onClick={onClose}
                    className="px-6 py-3 text-gray-400 hover:text-white font-bold transition-colors text-sm w-full md:w-auto uppercase tracking-wide"
                >
                    Vazgeç
                </button>
                <button
                    onClick={handleUpgrade}
                    className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r ${isPremium ? 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-amber-500/25' : 'from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25'} text-white font-bold rounded-xl transition-all shadow-lg text-sm md:text-base w-full md:w-auto uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98]`}
                >
                    {isPremium ? <Coins className="w-4 h-4 md:w-5 md:h-5" /> : <Crown className="w-4 h-4 md:w-5 md:h-5" />}
                    <span>{isPremium ? 'Kredi Yükle' : 'Planları İncele'}</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
