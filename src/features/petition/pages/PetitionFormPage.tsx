import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  ShieldCheck
} from "lucide-react";
import { fetchTemplate, createPetition } from "../slices/petitionSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import PetitionForm from "../components/PetitionForm";
import Seo from "../../../components/Seo";

export default function PetitionFormPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedTemplate, loading, creating } = useSelector(
    (state: RootState) => state.petition
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchTemplate(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleSubmit = async (formData: Record<string, string>) => {
    if (!selectedTemplate) return;

    const result = await dispatch(
      createPetition({
        templateId: selectedTemplate.id,
        formData,
      })
    );

    if (createPetition.fulfilled.match(result)) {
      navigate(`/dilekce/onizleme/${result.payload.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center relative overflow-hidden">
        <div className="text-center relative z-10 animate-fade-in">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            <FileText className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Hukuki taslak yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center p-8">
        <div className="max-w-md w-full glass-card p-12 text-center animate-fade-in-up">
          <div className="w-20 h-20 glass-card flex items-center justify-center mx-auto mb-8 border-red-500/20">
             <FileText className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4 italic tracking-tighter">Şablon <span className="text-red-500">Bulunamadı</span></h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-10">Lütfen geçerli bir şablon seçtiğinizden emin olun.</p>
          <button
            onClick={() => navigate("/dilekce")}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[20px] text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
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
         title={selectedTemplate ? `${selectedTemplate.name} Oluştur` : "Dilekçe Oluştur"} 
         description={selectedTemplate?.description || "Yaver ile saniyeler içinde dilekçe oluşturun."}
       />
       {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Top Navigation */}
      <div className="sticky top-0 z-30 border-b border-white/5 bg-[#0a0b14]/40 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between w-full md:w-auto md:justify-start gap-4">
            <button
              onClick={() => navigate("/dilekce")}
              className="flex items-center gap-3 text-gray-500 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 glass-card flex items-center justify-center group-hover:border-indigo-500/30">
                 <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Geri Dön</span>
            </button>
            <div className="flex items-center gap-4">
               <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
               <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic">yaverAI <span className="text-gradient-vibrant">Sihirbazı</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16 animate-fade-in-up">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6 italic tracking-tighter">
                {selectedTemplate.name}
              </h1>
              <p className="text-xs md:text-sm font-medium text-gray-400 max-w-xl mx-auto leading-relaxed">
                Aşağıdaki alanları doğru ve eksiksiz doldurarak profesyonel dilekçenizi oluşturun.
              </p>
            </div>

            {/* Stepper Removed as requested */}

            {/* Form Section */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-[40px] blur-2xl opacity-20" />
              <div className="relative glass-card p-5 md:p-14 bg-[#0a0b14]/80 backdrop-blur-3xl border-white/5 shadow-3xl overflow-hidden rounded-[24px] md:rounded-[40px]">
                <PetitionForm
                    template={selectedTemplate}
                    onSubmit={handleSubmit}
                    isSubmitting={creating}
                />
              </div>
            </div>

            {/* Help/Notice */}
            <div className="p-6 md:p-8 glass-card bg-white/[0.01] border-white/5 flex items-center gap-6 group rounded-[24px]">
                <div className="w-12 h-12 glass-card bg-amber-500/5 border-amber-500/20 flex items-center justify-center text-amber-500/80 shrink-0">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">
                   Girdiğiniz bilgiler, yalnızca dilekçenizi oluşturmak amacıyla güvenli bir şekilde işlenir.
                </p>
            </div>
          </div>
      </div>
    </div>
  );
}
