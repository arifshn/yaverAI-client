import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, FileText, Home, History } from "lucide-react";
import {
  fetchPetition,
  downloadPetition,
  clearCurrentPetition,
} from "../slices/petitionSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import PetitionPreview from "../components/PetitionPreview";

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
    navigate("/petition");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Dilekçe yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!currentPetition) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <p className="text-slate-400 mb-4">Dilekçe bulunamadı</p>
          <button
            onClick={() => navigate("/petition")}
            className="text-blue-400 hover:text-blue-300"
          >
            Şablonlara Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/petition")}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Şablonlara Dön</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/petition/my-petitions")}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <History className="w-4 h-4" />
                <span className="text-sm">Dilekçelerim</span>
              </button>

              <button
                onClick={handleNewPetition}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm">Yeni Dilekçe</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-green-400">
                  Dilekçeniz Başarıyla Oluşturuldu!
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  Dilekçenizi inceleyebilir, PDF olarak indirebilir veya
                  yazdırabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <PetitionPreview
          id={currentPetition.id}
          templateName={currentPetition.templateName}
          content={currentPetition.generatedContent}
          createdAt={currentPetition.createdAt}
          onDownload={handleDownload}
          isDownloading={isDownloading}
        />
      </div>
    </div>
  );
}
