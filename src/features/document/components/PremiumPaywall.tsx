import { Crown, Lock, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    toast.info("Premium özelliği yakında aktif olacak!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors border border-slate-700"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {/* Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-yellow-500/30 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Premium Özellik
                </h2>
                <p className="text-yellow-200">
                  {feature} özelliği sadece Premium üyeler içindir
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Feature Description */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-400 mb-1">
                    Doküman Analizi Nedir?
                  </h3>
                  <p className="text-sm text-slate-300">
                    Sözleşme, fatura veya anlaşma yükleyin. AI teknolojisi ile
                    dokümanınızı analiz edelim, risk skorlaması yapalım ve size
                    profesyonel öneriler sunalım.
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">
                    🔍 Doküman Analizi
                  </h4>
                  <p className="text-sm text-slate-400">
                    Sözleşme ve belgeleri AI ile analiz et
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">
                    🧮 Hesaplama Araçları
                  </h4>
                  <p className="text-sm text-slate-400">
                    Kıdem, tazminat, nafaka hesapla
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">
                    ♾️ Sınırsız Kullanım
                  </h4>
                  <p className="text-sm text-slate-400">
                    Dilekçe ve AI sorgu limiti yok
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">
                    ⚡ Öncelikli Destek
                  </h4>
                  <p className="text-sm text-slate-400">
                    7/24 öncelikli müşteri desteği
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Aylık</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-white">₺99</span>
                    <span className="text-slate-400">/ay</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold mb-1">
                    İlk 7 Gün Ücretsiz
                  </p>
                  <p className="text-xs text-slate-400">
                    İstediğin zaman iptal et
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleUpgrade}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all"
              >
                <Crown className="w-5 h-5" />
                <span>Premium'a Geç</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Daha Sonra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
