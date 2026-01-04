import { useNavigate, useRouteError } from "react-router-dom";
import { ArrowLeft, AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorPage() {
  const navigate = useNavigate();
  const error: any = useRouteError(); // React Router DOM error hook

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white flex items-center justify-center relative overflow-hidden">
      
       {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="glass-card p-12 max-w-lg w-full text-center relative z-10 mx-4 border-red-500/30">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-black text-white mb-2">Eyvah!</h1>
        <h2 className="text-xl font-bold text-red-400 mb-4">Bir Sorun Oluştu</h2>
        
        <p className="text-gray-400 mb-6 leading-relaxed text-sm">
          Beklenmedik bir hata ile karşılaştık. Mühendislerimiz durumdan haberdar edildi.
        </p>

        {error && (
            <div className="bg-red-950/30 border border-red-500/20 rounded-lg p-3 text-xs text-red-300 font-mono mb-6 text-left overflow-auto max-h-32">
                {error.statusText || error.message || "Bilinmeyen Hata"}
            </div>
        )}
        
        <div className="flex flex-col gap-3">
             <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-5 h-5" />
              <span>Sayfayı Yenile</span>
            </button>

            <button 
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Ana Sayfaya Dön</span>
            </button>
        </div>
      </div>
    </div>
  );
}
