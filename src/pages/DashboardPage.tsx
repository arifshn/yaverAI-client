import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import ReceptionChat from "../features/guidance/components/ReceptionChat";
import { 
  Map, 
  FileText, 
  Search, 
  ArrowRight,
  Activity,
  AlertCircle
} from "lucide-react";
import Seo from "../components/Seo";
import PageBackground from "../components/PageBackground";
import LegalDisclaimer from "../components/LegalDisclaimer";
import { useNavigate } from "react-router-dom";


export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.account);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0b14] p-4 md:p-8 overflow-x-hidden">
      <Seo 
        title="Panel" 
        description="Yaver AI kontrol paneli. Dilekçelerinizi yönetin, yeni işlemler başlatın."
      />

      {/* Background Glow */}
      <PageBackground />

      <div className="relative max-w-7xl mx-auto space-y-12 animate-fade-in-up">
        
        {/* Welcome Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tighter italic mb-4 leading-[1.3] py-2">
              HOŞ GELDİN, <span className="text-gradient-vibrant inline-block pb-1 pr-1">{user.firstName || user.username}</span>
            </h1>
            <p className="page-subtitle !mx-0 text-sm md:text-base">Bugün senin için hangi işlemi kolaylaştırabiliriz?</p>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Quick Chat */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-8">
             <div className="glass-card rounded-[32px] overflow-hidden bg-[#0a0b14]/20 border-white/5 shadow-none">
                <ReceptionChat />
             </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  icon: Map, 
                  label: "Yaver Rehber", 
                  desc: "Karmaşık süreçler için özel yol haritası.", 
                  color: "indigo", 
                  path: "/rehber",
                  action: "KEŞFET"
                },
                { 
                  icon: FileText, 
                  label: "Dilekçe Hazırla", 
                  desc: "Makamlara uygun resmi dilekçe oluştur.", 
                  color: "purple", 
                  path: "/dilekce",
                  action: "OLUŞTUR"
                },
                { 
                  icon: Search, 
                  label: "Belge Analizi", 
                  desc: "Dökümanlardaki riskleri tespit et.", 
                  color: "pink", 
                  path: "/belge/analiz",
                  action: "ANALİZ ET"
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={idx}
                    onClick={() => navigate(item.path)}
                    className="group relative p-8 text-left h-full flex flex-col justify-between rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 hover:from-white/[0.06] hover:to-white/[0.02] backdrop-blur-xl transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30"
                  >
                    <div>
                      <div className={`w-12 h-12 bg-${item.color}-500/10 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 text-${item.color}-400`} />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">{item.label}</h4>
                      <p className="text-sm text-gray-400 mb-6 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    <div className={`flex items-center gap-2 text-${item.color}-400 font-black text-[11px] uppercase tracking-[0.2em]`}>
                      {item.action} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side: Info / Stats / Suggestions */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-8">
            {/* Premium Promo Card */}
            <div className="relative p-8 rounded-[32px] overflow-hidden group min-h-[320px] flex flex-col justify-center">
              <div className={`absolute inset-0 bg-gradient-to-br ${user.isPremium ? 'from-emerald-600 via-teal-600 to-indigo-600' : 'from-indigo-600 via-purple-600 to-pink-600'} opacity-90 group-hover:opacity-100 transition-opacity`} />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                      <Activity className="w-5 h-5 text-white" />
                   </div>
                   <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">
                     {user.isPremium ? 'Membership Active' : 'Upgrade Your Plan'}
                   </span>
                </div>
                
                {user.isPremium ? (
                  <>
                    <h3 className="text-3xl font-black text-white mb-4 tracking-tighter italic">Premium Üyelik <br/>Aktif</h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-10 font-medium">
                      Tüm sınırsız özelliklere ve öncelikli desteğe sahipsiniz. Yaver yanınızda.
                    </p>
                    <div className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-[0.2em] italic cursor-default opacity-80">
                      AYRICALIKLARIN TADINI ÇIKARIN
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">Sınırları Kaldır</h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-10 font-medium">
                      Tüm özellikleri kısıtlamasız kullanın, profesyonel destek ve sınırsız analiz ile güçlenin.
                    </p>
                    <button 
                      onClick={() => navigate("/paketler")}
                      className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-[0_0_30_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all"
                    >
                      Premium'u Keşfet
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Hint Card */}
            <div className="glass-card p-8 space-y-6">
               <div className="flex items-center gap-2 mb-2">
                 <AlertCircle className="w-4 h-4 text-indigo-400" />
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Neler Yapabilirim?</h3>
               </div>
               
       <div className="space-y-6">
                  {[
                    "Rehber Sohbeti: Sorununuzu anlatın, size özel adım adım yol haritası çıkaralım.",
                    "Dilekçe Oluşturma: İhtiyacınız olan dilekçeyi şablonlar üzerinden kolayca hazırlayın.",
                    "Belge Analizi: Sözleşme veya evraklarınızı yükleyin, riskleri ve önemli maddeleri öğrenin."
                  ].map((hint, i) => (
                    <div key={i} className="flex gap-4 group">
                       <span className="w-7 h-7 rounded-xl bg-white/5 border border-white/5 text-indigo-400 flex items-center justify-center text-xs font-black shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors">{i+1}</span>
                       <span className="text-sm text-gray-400 font-medium leading-relaxed">{hint}</span>
                    </div>
                  ))}
               </div>
               
               <div className="pt-4 border-t border-white/5">
                 <LegalDisclaimer />
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
