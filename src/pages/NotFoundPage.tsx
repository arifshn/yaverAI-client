import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileQuestion } from "lucide-react";
import Seo from "../components/Seo";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white flex items-center justify-center relative overflow-hidden">
      <Seo title="Sayfa Bulunamadı" description="Aradığınız sayfa bulunamadı." />
      
       {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="glass-card p-12 max-w-lg w-full text-center relative z-10 mx-4">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-indigo-400" />
        </div>
        
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Sayfa Bulunamadı</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
        </p>
        
        <button 
          onClick={() => navigate("/")}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Ana Sayfaya Dön</span>
        </button>
      </div>
    </div>
  );
}
