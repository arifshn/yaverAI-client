import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { fetchTemplate, createPetition } from "../slices/petitionSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import PetitionForm from "../components/PetitionForm";

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
      navigate(`/petition/preview/${result.payload.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Şablon yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <p className="text-slate-400">Şablon bulunamadı</p>
          <button
            onClick={() => navigate("/petition")}
            className="mt-4 text-blue-400 hover:text-blue-300"
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
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate("/petition")}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Şablonlara Dön</span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{selectedTemplate.name}</h1>
              <p className="text-slate-400 text-sm">
                {selectedTemplate.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
          <PetitionForm
            template={selectedTemplate}
            onSubmit={handleSubmit}
            isSubmitting={creating}
          />
        </div>
      </div>
    </div>
  );
}
