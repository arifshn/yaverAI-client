import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  CheckCircle2,
  Building2,
  Activity,
  MapPin,
  ExternalLink,
  FileText,
  MousePointer2
} from "lucide-react";
import Seo from "../../../components/Seo";

export default function RoadmapPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.roadmap;
  const [roadmapData, setRoadmapData] = useState<any>(null); // Local state to handle persistence

  useEffect(() => {
    // 1. Initial Load
    if (data) {
       // Started freshly from form, save to local storage
       setRoadmapData(data);
       localStorage.setItem("lastRoadmap", JSON.stringify(data));
    } else {
       // Try to restore from local storage
       const saved = localStorage.getItem("lastRoadmap");
       if (saved) {
           try {
               setRoadmapData(JSON.parse(saved));
           } catch {
               localStorage.removeItem("lastRoadmap");
           }
       }
    }
  }, [data]);

  if (!roadmapData) {
    return (
      <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-10 animate-fade-in-up">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto opacity-50" />
            <h1 className="text-2xl font-bold text-white">Veri Bulunamadı</h1>
            <p className="text-gray-500 text-sm">Yol haritası oluşturulabilmesi için önce bir sorgu başlatmalısınız.</p>
            <button 
              onClick={() => navigate("/rehber")}
              className="px-6 py-3 bg-indigo-600 rounded-xl text-white font-medium hover:bg-indigo-500 transition-colors"
            >
              Yeni Sorgu
            </button>
        </div>
      </div>
    );
  }

  // Helper to detect if a location is a URL
  const isUrl = (text: string) => text?.startsWith("http");

  return (
    <div className="min-h-screen bg-[#0a0b14] flex flex-col font-sans text-gray-200 overflow-x-hidden selection:bg-indigo-500/30">
      <Seo 
        title={roadmapData.issue ? `${roadmapData.issue} Yol Haritası` : "Rehber Sonucu"} 
        description="Size özel oluşturulan yol haritası ile işlemlerinizi kolayca tamamlayın."
      />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      {/* Header */}
      <div className="relative z-50 border-b border-white/5 bg-[#0a0b14]/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center justify-between w-full md:w-auto md:justify-start md:gap-4">
              {/* Back button removed as requested */}
              <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Yol <span className="text-gradient-vibrant">Haritası</span></span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-3 w-full md:w-auto md:flex md:items-center md:gap-4">
              <button
                onClick={() => navigate("/rehber")}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 w-full md:w-auto"
              >
                <Activity className="w-4 h-4" />
                <span>Yeni Sorgu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl w-full mx-auto px-6 py-12 space-y-16 relative z-10">
        
        {/* Title Section */}
        <section className="space-y-6 text-center md:text-left">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest mx-auto md:mx-0">
              <Building2 className="w-3 h-3" /> {roadmapData.institution}
           </div>
           
           <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
             {roadmapData.issue}
           </h2>
           
           <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-2xl">
              {roadmapData.description}
           </p>
        </section>

        {/* Timeline Steps */}
        <section className="space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <Activity className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-white">İşlem Adımları</h3>
            </div>

            <div className="relative pl-6 space-y-12">
              {/* Timeline Line */}
              <div className="absolute left-[11px] top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500 via-gray-800 to-transparent opacity-50"></div>

              {roadmapData.detailedSteps?.map((step: any, idx: number) => (
                <div key={idx} className="relative group">
                   {/* Node */}
                   <div className="absolute -left-[23px] top-1 w-6 h-6 rounded-full bg-[#0a0b14] border-2 border-indigo-500 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                   </div>

                   {/* Card */}
                   <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{step.title}</h4>
                          {/* Location Badge */}
                          {step.locationName && (
                              <a 
                                href={isUrl(step.locationName) ? step.locationName : undefined}
                                target={isUrl(step.locationName) ? "_blank" : undefined}
                                rel="noreferrer"
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all w-fit
                                    ${isUrl(step.locationName) 
                                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 cursor-pointer' 
                                        : 'bg-white/5 border-white/10 text-gray-400'}`}
                              >
                                  {isUrl(step.locationName) ? <MousePointer2 className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                                  {isUrl(step.locationName) ? 'Siteye Git' : step.locationName}
                                  {isUrl(step.locationName) && <ExternalLink className="w-3 h-3 opacity-50" />}
                              </a>
                          )}
                      </div>

                      <div className="glass-card p-6 border-white/5 bg-[#0a0b14]/50 hover:bg-white/[0.02] transition-colors rounded-2xl space-y-4">
                          <p className="text-gray-300 leading-relaxed font-medium">
                              {step.description}
                          </p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
        </section>

        {/* Documents & Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Documents */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <FileText className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-bold text-white">Gerekli Evraklar</h3>
                </div>
                <div className="space-y-3">
                    {roadmapData.requiredDocuments?.map((doc: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-emerald-900/[0.05] border border-emerald-500/10 hover:border-emerald-500/30 transition-all group">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{doc}</span>
                        </div>
                    ))}
                    {(!roadmapData.requiredDocuments || roadmapData.requiredDocuments.length === 0) && (
                        <p className="text-sm text-gray-500 italic">Özel bir evrak belirtilmedi.</p>
                    )}
                </div>
            </section>

            {/* Resources (Official Links) */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <Building2 className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-bold text-white">İlgili Bağlantılar</h3>
                </div>
                <div className="space-y-3">
                    {roadmapData.resources?.map((res: any, idx: number) => {
                        // Handle both string and object formats
                        const isString = typeof res === 'string';
                        const url = isString ? res : res.url;
                        const title = isString ? (url.replace(/^https?:\/\//, '').split('/')[0]) : res.title;
                        
                        return (
                            <a 
                                key={idx} 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 rounded-xl bg-blue-900/[0.05] border border-blue-500/10 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all group cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <span className="block text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{title}</span>
                                    <span className="text-[10px] text-blue-400 opacity-60 font-mono truncate max-w-[200px] block">{url}</span>
                                </div>
                            </a>
                        );
                    })}
                    {(!roadmapData.resources || roadmapData.resources.length === 0) && (
                        <p className="text-sm text-gray-500 italic">Bağlantı belirtilmedi.</p>
                    )}
                </div>
            </section>
        </div>

        {/* Disclaimer */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-center">
           <ShieldAlert className="w-5 h-5 text-orange-500/50" />
           <p className="text-xs text-gray-500 font-medium leading-relaxed">
             Bu yol haritası yapay zeka tarafından oluşturulmuştur ve uzman tavsiyesi niteliği taşımaz. Güncel mevzuat değişiklikleri için ilgili kurumlarla iletişime geçiniz.
           </p>
        </div>

      </div>
    </div>
  );
}
