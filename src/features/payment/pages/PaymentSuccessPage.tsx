import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../../store/store";
import { getUser } from "../../account/slices/accountSlice";
import { fetchCreditInfo } from "../../account/slices/creditSlice";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
  Crown,
  Zap,
  Shield,
  Headphones,
  Coins,
} from "lucide-react";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const paymentType = searchParams.get("type"); // 'subscription' or 'creditpurchase'
  const creditAmount = searchParams.get("amount");
  const isCreditPurchase = paymentType === "creditpurchase";

  useEffect(() => {
    // ✅ Token sync - user objesi içindeki token'ı localStorage'a da yaz
    const syncToken = () => {
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          const user = JSON.parse(userString);
          if (user.token) {
            localStorage.setItem("token", user.token);

          }
        } catch (error) {
          console.error("❌ Token sync error:", error);
        }
      }
    };

    const loadData = async () => {
      try {
        syncToken();
        await dispatch(getUser()).unwrap();
        await dispatch(fetchCreditInfo()).unwrap();
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      loadData();
    }, 1000);
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            İşleminiz Onaylanıyor
          </h2>
          <p className="text-gray-400">
            Hesabınız güncelleniyor, lütfen bekleyin...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Success Icon with Animation */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <CheckCircle2 className="w-14 h-14 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter italic">
              {isCreditPurchase 
                ? <>Kredi <span className="text-gradient-vibrant inline-block pb-1 pr-1">Yüklendi!</span></>
                : <>Ödeme <span className="text-gradient-vibrant inline-block pb-1 pr-1">Başarılı!</span></>}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
              {isCreditPurchase 
                ? `${creditAmount} kredi hesabınıza başarıyla eklendi! 🎉`
                : "Premium üyeliğiniz aktif! Her ay 1500 kredi + günlük 20 kredi alacaksınız 🎉"}
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 mb-6 shadow-2xl">
            {/* Main Badge */}
            <div className="mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50"></div>
                <div className="relative flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  {isCreditPurchase ? <Coins className="w-7 h-7 text-white" /> : <Crown className="w-7 h-7 text-white" />}
                  <span className="text-2xl font-bold text-white">
                    {isCreditPurchase ? `${creditAmount} Kredi Yüklendi` : "Premium Üye"}
                  </span>
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {isCreditPurchase ? `${creditAmount} Kredi` : "1500 Kredi + Günlük 20"}
                  </p>
                  <p className="text-sm text-gray-400">Hesabınıza eklendi</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Tüm Özellikler</p>
                  <p className="text-sm text-gray-400">Kullanıma hazır</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Öncelikli Erişim</p>
                  <p className="text-sm text-gray-400">Daha hızlı işlem</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Premium Destek</p>
                  <p className="text-sm text-gray-400">7/24 yanınızdayız</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-400">ℹ️</span>
                </div>
                <div>
                  <p className="text-sm text-blue-300 font-medium mb-1">
                    <strong>Bilgilendirme</strong>
                  </p>
                  <p className="text-sm text-blue-300/80">
                    {isCreditPurchase 
                      ? "Ek kredilerinizin kullanım süresi yoktur. Mevcut kredilerinize eklenmiştir."
                      : "Premium üyeliğiniz her ay otomatik olarak yenilenecektir. Her ay 1500 kredi alacak, ayrıca her gün 20 kredi daha kazanacaksınız. Dilediğiniz zaman Hesap Ayarları sayfasından iptal edebilirsiniz."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/panel")}
              className="py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-purple-500/30"
            >
              Kullanmaya Başla
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/profil")}
              className="py-4 px-6 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 text-white rounded-xl font-bold transition-all"
            >
              Hesabıma Git
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Yardıma mı ihtiyacınız var?{" "}
              <button
                onClick={() => navigate("/iletisim")}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Destekle İletişime Geçin
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
