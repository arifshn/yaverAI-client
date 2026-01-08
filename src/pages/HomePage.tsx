import { useState } from "react";
import { ArrowRight, MessageCircle, Layout, FileText, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useAppDispatch } from "../store/store";
import { setUser, logout } from "../features/account/slices/accountSlice";
import { loginWithGoogle } from "../lib/firebaseConfig";
import Seo from "../components/Seo";
import PageBackground from "../components/PageBackground";

export default function HomePage() {
  const { user } = useSelector((state: RootState) => state.account);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setOauthLoading(true);
    setOauthError(null);
    try {
      const data = await loginWithGoogle();
      const normalizedUser = {
        ...data.user,
        token: data.token,
      };
      dispatch(setUser(normalizedUser));
      navigate("/panel");
    } catch (error: any) {
      setOauthError(error.message || "Google girişi başarısız oldu");
    } finally {
      setOauthLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white flex flex-col justify-between overflow-x-hidden">
      <Seo 
        title="Yaver AI - Belgelerinizi Yeniden Tanımlayın" 
        description="Dilekçelerinizi oluşturun, metinleri analiz edin ve karmaşık süreçler için akıllı rehberlik alın."
      />
      <Seo 
        title="Yaver AI - Belgelerinizi Yeniden Tanımlayın" 
        description="Dilekçelerinizi oluşturun, metinleri analiz edin ve karmaşık süreçler için akıllı rehberlik alın."
      />
      {/* Shared Background */}
      <PageBackground />

      {/* Top Navigation */}
      <nav className="relative z-50 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-gradient-vibrant italic inline-block pb-1 pr-1">
            yaverAI
          </span>
        </div>

        <div className="flex items-center gap-4 p-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
          {user ? (
            <button 
              onClick={handleLogout}
              className="px-6 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              Çıkış Yap
            </button>
          ) : (
            <button 
              onClick={handleGoogleLogin}
              disabled={oauthLoading}
              className="flex items-center gap-3 px-6 py-2.5 text-sm font-bold bg-white text-black rounded-full hover:bg-gray-200 transition-all shadow-lg shadow-white/10 disabled:opacity-50"
            >
               <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
               {oauthLoading ? "..." : "Oturum Aç"}
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative flex-grow flex items-center justify-center py-20">
        <div className="relative max-w-6xl mx-auto px-6 text-center">
            <div className="space-y-8 max-w-4xl mx-auto animate-fade-in-up">


              <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter italic">
                Belgelerinizi <br />
                <span className="text-gradient-vibrant inline-block pb-1 pr-1">
                  Yeniden Tanımlayın
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                  Yaver AI ile dökümanlarınızı analiz edin, dilekçelerinizi saniyeler içinde hazırlayın ve süreçlerinizi hızlandırın.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-6 mt-16 animate-fade-in-up animation-delay-200">
              {oauthError && (
                <div className="p-4 glass-card border-red-500/20 text-red-200 text-sm mb-4">
                  {oauthError}
                </div>
              )}
              
              <button
                onClick={user ? () => navigate("/panel") : handleGoogleLogin}
                disabled={oauthLoading}
                className="btn-primary min-w-[300px] flex items-center justify-center gap-3 text-lg transition-all"
              >
                <span>{user ? "Panele Git" : (oauthLoading ? "Yükleniyor..." : "Hemen Başlıyoruz")}</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
               {/* Passive Consent Text */}
               {!user && (
                <div className="max-w-sm mx-auto text-center mt-4">
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium leading-relaxed">
                     Devam ederek <Link to="/kullanim-sartlari" className="text-gray-400 hover:text-white underline decoration-gray-500/50 underline-offset-2 transition-colors">Kullanım Şartları'nı</Link> ve <Link to="/gizlilik-politikasi" className="text-gray-400 hover:text-white underline decoration-gray-500/50 underline-offset-2 transition-colors">Gizlilik Politikası'nı</Link> <br className="hidden md:block"/> kabul etmiş sayılırsınız.
                  </p>
                </div>
               )}
              

            </div>

          {/* Capabilities Section */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-400">
            <div className="group relative p-8 text-left rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 hover:from-white/[0.06] hover:to-white/[0.02] backdrop-blur-xl transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6">
                <Layout className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Yaver Rehber</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                Karmaşık süreçleri adım adım yönetin. İhtiyacınız olan her dökümanı ve yolu sizin için belirleyelim.
              </p>
            </div>

            <div className="group relative p-8 text-left rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 hover:from-white/[0.06] hover:to-white/[0.02] backdrop-blur-xl transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Dilekçe Hazırla</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                Kurumlara uygun formatta dilekçelerinizi saniyeler içinde oluşturun ve indirin.
              </p>
            </div>

            <div className="group relative p-8 text-left rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 hover:from-white/[0.06] hover:to-white/[0.02] backdrop-blur-xl transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30">
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Belge Analizi</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                Sözleşmeleri ve dökümanları yükleyin. Kritik maddeleri, riskleri ve özetleri anında raporlayın.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-20 border-t border-white/5 bg-[#0a0b14]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <span className="text-2xl font-black text-gradient-vibrant italic tracking-tighter inline-block pb-1 pr-1">yaverAI</span>
              <div className="flex items-start gap-4 p-5 glass-card max-w-lg">
                 <AlertTriangle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                 <p className="text-xs text-gray-400 leading-relaxed font-medium">
                   <strong>Yasal Uyarı:</strong> Bu uygulama bir yapay zeka asistanıdır ve sağladığı bilgiler tavsiye niteliğindedir. 
                   Herhangi bir kamu kurumuyla bağlantısı yoktur. Profesyonel destek almanız önerilir.
                 </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-end md:justify-end gap-10 text-xs font-bold uppercase tracking-[0.1em] text-gray-500">
                <Link to="/sss" className="hover:text-indigo-400 transition-colors">S.S.S</Link>
                <Link to="/iletisim" className="hover:text-indigo-400 transition-colors">İletişim</Link>
                <Link to="/gizlilik-politikasi" className="hover:text-indigo-400 transition-colors">Gizlilik</Link>
                <Link to="/kullanim-sartlari" className="hover:text-indigo-400 transition-colors">Şartlar</Link>
                <span className="text-gray-700">© 2025 yaverAI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
