import { Crown, Lock, Check, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PremiumPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export default function PremiumPaywall({
  isOpen,
  onClose,
  feature = "Doküman Analizi",
}: PremiumPaywallProps) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleUpgrade = () => {
    navigate("/paketler");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
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
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
          
          {/* Header */}
          <div className="relative bg-white/5 border-b border-white/10 p-5 md:p-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 shrink-0">
                <Crown className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-black text-white mb-2 leading-tight">
                  <span className="text-gradient-vibrant">Premium'a</span> Yükseltin
                </h2>
                <p className="text-gray-400 text-sm md:text-lg leading-relaxed font-medium">
                  <span className="text-white font-bold">{feature}</span> için Premium üyelik gerekiyor.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-5 md:p-8">
            {/* Mobile: Simplified Text */}
            <div className="md:hidden mb-6 text-center">
               <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  Yapay zeka destekli analizler, özel şablonlar ve sınırsız kullanım için hemen Premium'a geçin.
               </p>
            </div>

            {/* Desktop: Detailed Features (Hidden on Mobile) */}
            <div className="hidden md:block">
                {/* Feature Description */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-8">
                <div className="flex items-start gap-4">
                    <Lock className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                    <h3 className="font-bold text-indigo-400 mb-1">
                        Neden Premium?
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                        Yapay zeka destekli analizler, özel dilekçe şablonları ve öncelikli işlem gücü Premium üyelerimize özeldir. 
                        İşlerinizi saniyeler içinde halletmek için hemen geçiş yapın.
                    </p>
                    </div>
                </div>
                </div>

                {/* Premium Features Grid */}
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
            </div>

            {/* Pricing & CTA */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 md:pt-6 md:border-t md:border-white/10">
              <div className="flex-1 text-center md:text-left">
                <p className="text-gray-500 md:text-gray-400 text-xs md:text-sm mb-1 uppercase tracking-wider font-bold">Aylık Plan</p>
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-3xl md:text-4xl font-black text-white tracking-tighter">₺49.90</span>
                  <span className="text-gray-400 font-medium">/ay</span>
                </div>
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
                    className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 text-sm md:text-base w-full md:w-auto uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Crown className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Planları İncele</span>
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
