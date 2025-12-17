import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileSearch, ArrowLeft, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  checkPremium,
  analyzeDocument,
  clearCurrentAnalysis,
} from "../slices/documentSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import DocumentUpload from "../components/DocumentUpload";
import AnalysisResult from "../components/AnalysisResult";
import PremiumPaywall from "../components/PremiumPaywall";

export default function DocumentAnalysisPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentAnalysis, analyzing, premiumCheck } = useSelector(
    (state: RootState) => state.document
  );
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    dispatch(checkPremium());
    return () => {
      dispatch(clearCurrentAnalysis());
    };
  }, [dispatch]);

  const handleUpload = async (file: File, documentType: string) => {
    if (premiumCheck && !premiumCheck.isPremium) {
      setShowPaywall(true);
      return;
    }

    const result = await dispatch(analyzeDocument({ file, documentType }));

    if (analyzeDocument.rejected.match(result)) {
      const error = result.payload as any;
      if (error?.message?.includes("Premium")) {
        setShowPaywall(true);
      }
    }
  };

  const handleNewAnalysis = () => {
    dispatch(clearCurrentAnalysis());
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Premium Paywall */}
      <PremiumPaywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="Doküman Analizi"
      />

      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Geri</span>
            </button>

            <button
              onClick={() => navigate("/document/my-analyses")}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <History className="w-4 h-4" />
              <span className="text-sm">Geçmiş Analizler</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FileSearch className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Doküman Analizi</h1>
              <p className="text-slate-400 text-sm">
                AI ile sözleşme ve belge analizi yapın
              </p>
            </div>
          </div>

          {/* Premium Badge */}
          {premiumCheck && !premiumCheck.isPremium && (
            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-sm text-yellow-300">
                ⚠️ Bu özellik Premium üyeler içindir.{" "}
                <button
                  onClick={() => setShowPaywall(true)}
                  className="underline hover:text-yellow-200"
                >
                  Premium'a geçin
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {currentAnalysis ? (
          <div>
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleNewAnalysis}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
              >
                Yeni Analiz Yap
              </button>
            </div>
            <AnalysisResult analysis={currentAnalysis} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <DocumentUpload onUpload={handleUpload} isAnalyzing={analyzing} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
