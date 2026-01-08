import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  History,
  Download,
  Activity,
  Plus
} from "lucide-react";
import {
  fetchPetition,
  downloadPetition,
  clearCurrentPetition,
} from "../slices/petitionSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import PetitionPreview from "../components/PetitionPreview";
import Seo from "../../../components/Seo";

export default function PetitionPreviewPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPetition, loading } = useSelector(
    (state: RootState) => state.petition
  );
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchPetition(parseInt(id)));
    }

    return () => {
      dispatch(clearCurrentPetition());
    };
  }, [dispatch, id]);

  const handleDownload = async () => {
    if (!currentPetition) return;

    setIsDownloading(true);
    await dispatch(
      downloadPetition({
        id: currentPetition.id,
        filename: `${currentPetition.templateName}_${
          new Date().toISOString().split("T")[0]
        }.pdf`,
      })
    );
    setIsDownloading(false);
  };

  const handleNewPetition = () => {
    dispatch(clearCurrentPetition());
    navigate("/dilekce");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center relative overflow-hidden">
        <div className="text-center relative z-10 animate-fade-in">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            <Activity className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Belge hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  if (!currentPetition) {
    return (
      <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center p-8">
        <div className="max-w-md w-full glass-card p-12 text-center animate-fade-in-up">
          <div className="w-20 h-20 glass-card flex items-center justify-center mx-auto mb-8 border-red-500/20">
             <FileText className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4 italic tracking-tighter">Belge <span className="text-red-500">Bulunamadı</span></h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-10">Lütfen geçerli bir belge seçtiğinizden emin olun.</p>
          <button
            onClick={() => navigate("/petition")}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
          >
            Kütüphaneye Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white relative mobile-safe-area pb-20 md:pb-0 overflow-x-hidden">
      <Seo 
        title={currentPetition ? `${currentPetition.templateName} Önizleme` : "Belge Önizleme"} 
        description="Hazırladığınız resmi belgeyi önizleyin ve profesyonel formatta indirin."
      />

       {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <div className="relative z-50 border-b border-white/5 bg-[#0a0b14]/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center justify-between w-full md:w-auto md:justify-start md:gap-4">
              <button
                onClick={() => navigate("/dilekce")}
                className="flex items-center gap-3 text-gray-500 hover:text-white transition-all group"
              >
                <div className="w-8 h-8 glass-card flex items-center justify-center group-hover:border-indigo-500/30">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Geri Dön</span>
              </button>
              <div className="h-6 w-px bg-white/10 hidden md:block"></div>
              <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Belge <span className="text-gradient-vibrant">Önizleme</span></span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:flex md:items-center md:gap-4">
              <button
                onClick={() => navigate("/dilekce/arsivim")}
                className="flex items-center justify-center gap-3 px-6 py-3 glass-card glass-card-hover text-[10px] font-black uppercase tracking-widest text-gray-400 group transition-all w-full md:w-auto"
              >
                <History className="w-4 h-4" />
                <span>Arşivim</span>
              </button>

              <button
                onClick={handleNewPetition}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 w-full md:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Dilekçe</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 py-10 animate-fade-in-up">
        
        {/* Success Banner */}
        <div className="mb-10">
            <div className="glass-card bg-emerald-500/5 border-emerald-500/20 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 glass-card bg-emerald-500/10 border-emerald-500/20 flex items-center justify-center flex-shrink-0 animate-bounce-slow">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-black text-white mb-2 italic tracking-tighter">
                      Belgeniz <span className="text-emerald-500">Hazır!</span>
                    </h2>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] leading-relaxed">
                      Dilekçe taslağınız, girdiğiniz bilgiler doğrultusunda oluşturulmuştur. Lütfen içeriği kontrol ederek imzalayınız.
                    </p>
                </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="glass-card p-4 mb-10 bg-white/[0.02] border-white/5 flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
                 <div className="flex items-center gap-3 px-6 py-3 glass-card bg-indigo-600/5 border-indigo-500/10 w-full sm:w-auto">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-black text-white italic tracking-tight">{currentPetition.templateName}</span>
                 </div>
                 <div className="flex items-center gap-3 px-6 py-3 glass-card bg-white/[0.03] border-white/10 w-full sm:w-auto">
                    <History className="w-4 h-4 text-gray-500" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {new Date(currentPetition.createdAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                      })}
                    </span>
                 </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                 <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center justify-center gap-3 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[16px] text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 w-full md:w-auto"
                 >
                    {isDownloading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>PDF İndir</span>
                </button>
            </div>
        </div>

        {/* Main Preview Container - Mobile Optimized with Scale */}
        <div className="glass-card p-0 md:p-1.5 bg-transparent md:bg-white shadow-2xl overflow-hidden relative group flex justify-center">
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden md:block"></div>
                
                {/* Scroll Container for Mobile - Centered & Scaled */}
                <div className="overflow-hidden pb-6 md:pb-0 scrollbar-hide md:rounded-[14px] w-full flex justify-center">
                   <div className="bg-white min-w-[21cm] md:w-full min-h-[29.7cm] md:min-h-0 origin-top transform scale-[0.41] xs:scale-[0.45] sm:scale-75 md:scale-100 mb-[-16cm] xs:mb-[-15cm] sm:mb-[-7cm] md:mb-0 shadow-lg md:shadow-none">
                      <div className="overflow-hidden md:rounded-[14px]">
                        <PetitionPreview
                            id={currentPetition.id}
                            templateName={currentPetition.templateName}
                            content={currentPetition.generatedContent}
                            createdAt={currentPetition.createdAt}
                            onDownload={handleDownload}
                            isDownloading={isDownloading}
                            signerName={currentPetition.signerName}
                            signerPhone={currentPetition.signerPhone}
                            institutionName={currentPetition.institutionName}
                        />
                      </div>
                   </div>
                </div>
                
                {/* Mobile Hint */}
                <div className="md:hidden text-center text-[10px] text-gray-500 mt-2 font-medium absolute bottom-2 left-0 right-0">
                   (Belge önizlemesi ekrana sığdırılmıştır)
                </div>
        </div>
      </div>
    </div>
  );
}
