import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FileText, Sparkles } from "lucide-react";
import { fetchTemplates, setSelectedTemplate } from "../slices/petitionSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import TemplateCard from "../components/TemplateCard";
import PetitionLimitBadge from "../components/PetitionLimitBadge";

export default function PetitionTemplatesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { templates, loading } = useSelector(
    (state: RootState) => state.petition
  );

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const handleSelectTemplate = (template: any) => {
    dispatch(setSelectedTemplate(template));
    navigate(`/petition/form/${template.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Şablonlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Dilekçe Oluştur</h1>
                <p className="text-slate-400 text-sm">
                  İhtiyacınıza uygun şablonu seçin
                </p>
              </div>
            </div>

            <PetitionLimitBadge />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {Object.keys(templates).length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">Henüz şablon bulunmuyor</p>
          </div>
        ) : (
          Object.entries(templates).map(([category, categoryTemplates]) => (
            <div key={category} className="mb-12">
              {/* Category Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{category}</h2>
                  <p className="text-sm text-slate-400">
                    {categoryTemplates.length} şablon
                  </p>
                </div>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => handleSelectTemplate(template)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
