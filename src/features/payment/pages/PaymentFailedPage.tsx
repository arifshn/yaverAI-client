import { useNavigate, useSearchParams } from "react-router-dom";
import {
  XCircle,
  RefreshCw,
  ArrowLeft,
  AlertCircle,
  CreditCard,
  Shield,
  Phone,
} from "lucide-react";

export default function PaymentFailedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorMessage =
    searchParams.get("error") || "Ödeme işlemi başarısız oldu";

  const handleRetry = () => {
    navigate("/paketler");
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Error Icon */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <XCircle className="w-14 h-14 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter italic">
          Ödeme <span className="text-red-500 inline-block pb-1 pr-1">Başarısız</span>
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto font-medium leading-relaxed">
          Ödeme işlemi sırasında bir sorun oluştu. Lütfen kart bilgilerinizi kontrol edip tekrar deneyin.
        </p>
          </div>

          {/* Error Card */}
          <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 mb-6 shadow-2xl">
            {/* Error Message */}
            <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300 font-medium">
                  {errorMessage}
                </p>
              </div>
            </div>

            {/* Common Reasons */}
            <div className="mb-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <span>Olası Sebepler:</span>
              </h3>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      Yetersiz Bakiye
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Kartınızda yeterli bakiye bulunmuyor olabilir.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      Hatalı Kart Bilgileri
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Kart numarası, CVV veya son kullanma tarihi hatalı.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      3D Secure İptali
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Doğrulama işlemi tamamlanmadan çıkış yapıldı.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      Banka Reddi
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      İşlem bankanız tarafından reddedildi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Box */}
            <div className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-400">💡</span>
                </div>
                <div>
                  <p className="text-sm text-blue-300 font-medium mb-1">
                    <strong>Yardım mı Lazım?</strong>
                  </p>
                  <p className="text-sm text-blue-300/80">
                    Hata devam ederse farklı bir kart deneyebilir veya bankanızla iletişime geçebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleRetry}
              className="py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-purple-500/30"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Tekrar Dene
            </button>

            <button
              onClick={() => navigate("/panel")}
              className="py-4 px-6 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Panele Dön
            </button>
          </div>

          {/* Support */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Destek mi gerekiyor?{" "}
              <button
                onClick={() => navigate("/iletisim")}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Destek Ekibiyle İletişime Geçin
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
