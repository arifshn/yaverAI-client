import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Upload,
  AlertCircle,
  Search,
  Activity,
  FileCheck,
  XCircle,
  ArrowDown
} from "lucide-react";

import {
  checkPremium,
  analyzeDocument,
  clearCurrentAnalysis,
  clearError,
  setCurrentAnalysis,
} from "../slices/documentSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import DocumentUpload from "../components/DocumentUpload";
import AnalysisResult from "../components/AnalysisResult";
import PremiumPaywall from "../components/PremiumPaywall";
import DocumentChatPanel from "../components/DocumentChatPanel";

export default function DocumentAnalysisPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentAnalysis, analyzing, error } = useSelector(
    (state: RootState) => state.document
  );
  const { user } = useSelector((state: RootState) => state.account);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    dispatch(checkPremium());
    
    // Restore analysis from local storage if exists (persisting on reload)
    const savedAnalysis = localStorage.getItem("lastAnalysis");
    if (savedAnalysis) {
        try {
            dispatch(setCurrentAnalysis(JSON.parse(savedAnalysis)));
        } catch (e) {
            console.error("Failed to restore analysis", e);
            localStorage.removeItem("lastAnalysis");
        }
    }
  }, [dispatch]);

  // Persist analysis when it changes
  useEffect(() => {
    if (currentAnalysis) {
        localStorage.setItem("lastAnalysis", JSON.stringify(currentAnalysis));
        window.scrollTo(0, 0);
    }
  }, [currentAnalysis]);

  const handleUpload = async (file: File, documentType: string) => {
    // Premium değilse veya kredisi yetersizse (min 30 kredi) engelle
    if (user && (!user.isPremium || user.credits < 30)) {
      setShowPaywall(true);
      return;
    }

    const result = await dispatch(analyzeDocument({ file, documentType }));

    if (analyzeDocument.rejected.match(result)) {
      const error = result.payload as any;
      const errorMessage = typeof error === 'string' ? error : error?.message || '';
      if (errorMessage.includes("Premium") || errorMessage.toLowerCase().includes('kredi') || errorMessage.toLowerCase().includes('credit')) {
        setShowPaywall(true);
      }
    }
  };

  const handleNewAnalysis = () => {
    localStorage.removeItem("lastAnalysis");
    dispatch(clearCurrentAnalysis());
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white overflow-x-hidden">
      {/* Premium Paywall */}
      <PremiumPaywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="Belge Analizi"
      />

      {/* Header - Desktop Only (Visible only when analysis exists) */}
      {currentAnalysis && (
        <div className="hidden md:block sticky top-0 border-b border-white/5 bg-[#0a0b14]/80 backdrop-blur-xl z-30 transition-all shadow-2xl">
            <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 glass-card rounded-2xl text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                        <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white">
                            {currentAnalysis.originalFileName}
                        </h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">
                            Belge Analiz Raporu
                        </p>
                    </div>
                </div>

                <button
                onClick={handleNewAnalysis}
                className="flex items-center gap-2 px-6 py-3 glass-card hover:bg-white/5 text-gray-400 hover:text-white transition-all rounded-xl group border-white/5"
                >
                    <Upload className="w-4 h-4 group-hover:scale-110 transition-transform text-indigo-400" />
                    <span className="text-xs font-black uppercase tracking-widest">Yeni Analiz</span>
                </button>
            </div>
            </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {error && (
            <div className="mb-12 animate-fade-in-up">
                <div className="glass-card border-red-500/20 bg-red-500/5 p-6 flex items-start gap-4">
                    <div className="w-10 h-10 glass-card flex items-center justify-center flex-shrink-0 border-red-500/20">
                         <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                   <div className="flex-1">
                        <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Analiz Başarısız</h4>
                        <p className="text-sm text-red-100 font-medium leading-relaxed">{error}</p>
                   </div>
                </div>
            </div>
        )}

        {currentAnalysis ? (
            <div className="space-y-12 animate-fade-in pb-12">
                 {/* Mobile New Analysis Button */}
                 <div className="block md:hidden mb-6">
                    <button
                        onClick={handleNewAnalysis}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 glass-card hover:bg-white/5 text-gray-300 hover:text-white transition-all rounded-xl border-white/5"
                    >
                        <Upload className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-black uppercase tracking-widest">Yeni Analiz</span>
                    </button>
                 </div>

                 {/* Scroll Hint / Notification */}
                 <div className="glass-card p-4 bg-indigo-500/5 border-indigo-500/20 flex items-center gap-4 animate-fade-in-up rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
                        <ArrowDown className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Analiz Tamamlandı</h4>
                        <p className="text-xs text-indigo-200/60 mt-0.5 font-medium">
                            Rapor detayları ve <span className="text-white">Yaver Asistan</span> ile sohbet için aşağı kaydırın.
                        </p>
                    </div>
                 </div>

                 {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-6 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <AlertCircle className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Risk Skoru</h3>
                            <div className="flex items-end gap-3">
                                <span className={`text-5xl font-black italic tracking-tighter ${currentAnalysis.riskScore > 5 ? 'text-red-500' : 'text-emerald-400'}`}>
                                    {currentAnalysis.riskScore}
                                </span>
                                <span className="text-gray-500 font-bold text-lg mb-1 opacity-30">/ 10</span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 font-medium">
                                {currentAnalysis.riskScore > 7 ? 'Yüksek risk içeren maddeler tespit edildi.' : 'Belge genel olarak güvenli görünüyor.'}
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-6 group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                            <FileCheck className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Analiz Durumu</h3>
                            <div className="flex items-end gap-3">
                                <span className="text-5xl font-black italic tracking-tighter text-white">100</span>
                                <span className="text-gray-500 font-bold text-lg mb-1 opacity-30">%</span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 font-medium">
                                Tüm maddeler taranmış ve yapay zeka tarafından işlenmiştir.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 glass-card text-indigo-400 rounded-lg">
                                <Activity className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-black text-white tracking-tight">Analiz Özeti</h4>
                    </div>
                    <div className="prose prose-sm prose-invert max-w-none">
                        <p className="text-gray-400 leading-relaxed">
                            {currentAnalysis.analysisSummary}
                        </p>
                    </div>
                </div>

                {/* Detailed Analysis */}
                <div className="glass-card p-1">
                        <AnalysisResult analysis={currentAnalysis} />
                </div>

                {/* Document Chat Section - Separated & At Bottom */}
                <div className="pt-8 border-t border-white/5">
                    <div className="mb-6 flex items-center justify-between">
                         <div>
                            <h3 className="text-2xl font-black text-white italic tracking-tighter">
                                Yaver <span className="text-gradient-vibrant">Asistan</span>
                            </h3>
                            <p className="text-sm text-gray-500 font-medium mt-1">
                                Belgeniz hakkında aklınıza takılan soruları sorun.
                            </p>
                         </div>
                    </div>
                    
                    <div className="glass-card overflow-hidden shadow-2xl relative bg-[#0a0b14]/50">
                        <DocumentChatPanel 
                            documentContext={`## BELGE BİLGİLERİ
DOSYA ADI: ${currentAnalysis.originalFileName}
BELGE TÜRÜ: ${currentAnalysis.documentType || "Genel"}
RİSK SKORU: ${currentAnalysis.riskScore}/10

## ANALİZ ÖZETİ
${currentAnalysis.analysisSummary}

## ÖNEMLİ NOKTALAR
${currentAnalysis.keyPoints?.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n') || 'Yok'}

## RİSKLİ ALANLAR
${currentAnalysis.warnings?.map((w: string, i: number) => `${i + 1}. ${w}`).join('\n') || 'Yok'}

## BELGENİN TAM METNİ
${currentAnalysis.extractedText || 'Belge metni mevcut değil.'}`}
                            documentName={currentAnalysis.originalFileName}
                        />
                    </div>
                </div>

                {/* New Analysis Button - Bottom Action */}
                <div className="pt-8 flex justify-center">
                    <button
                        onClick={handleNewAnalysis}
                        className="group flex items-center gap-3 px-8 py-4 glass-card hover:bg-white/5 transition-all rounded-2xl"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="text-left">
                            <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-0.5">İşlem Tamamlandı mı?</div>
                            <div className="text-sm font-bold text-white">Başka Bir Belge Analiz Et</div>
                        </div>
                    </button>
                </div>
            </div>
        ) : (
            <div className="max-w-3xl mx-auto animate-fade-in-up">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic mb-6">
                        Belgelerini <span className="text-gradient-vibrant">Konuştur</span>
                    </h2>
                    <div className="space-y-4 max-w-xl mx-auto">
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed">
                            Dökümanları yükleyin, kritik verileri ve riskleri yapay zeka ile anında raporlayın.
                        </p>
                        <div className="flex justify-center mt-6">
                            <div className="group relative p-[1px] rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
                                <div className="relative px-6 py-3 bg-[#0a0b14]/90 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col items-center">
                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Ortalama İşlem Maliyeti</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-black text-white italic tracking-tighter">30 - 80</span>
                                        <span className="text-xs font-bold text-gray-400">Kredi</span>
                                    </div>
                                    <span className="text-[9px] text-gray-600 font-bold mt-1 uppercase tracking-wider">Dosya boyutuna göre değişir</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group p-[1px] rounded-[40px] overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 scale-150 animate-pulse" />
                   <div className="relative glass-card p-12 bg-[#0a0b14]/80 backdrop-blur-3xl rounded-[40px]">
                      <DocumentUpload
                          onUpload={handleUpload}
                          isAnalyzing={analyzing}
                      />
                   </div>
                </div>
                
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
                   {[
                     { icon: FileCheck, label: "Net Özet", desc: "Sayfalarca metni saniyeler içinde anlayın." },
                     { icon: AlertCircle, label: "Tazminat Oranları", desc: "Risk faktörlerini önceden görün." },
                     { icon: Search, label: "Kritik Sorgu", desc: "Döküman içeriğinde akıllı arama yapın." }
                   ].map((f, i) => {
                      const Icon = f.icon;
                      return (
                        <div key={i} className="text-center group">
                           <div className="w-12 h-12 glass-card mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform text-indigo-400">
                              <Icon className="w-5 h-5" />
                           </div>
                           <h5 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2">{f.label}</h5>
                           <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{f.desc}</p>
                        </div>
                      );
                   })}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
