import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Trash2, Eye, Calendar } from "lucide-react";
import {
  fetchMyPetitions,
  deletePetition,
  downloadPetition,
} from "../slices/petitionSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default function MyPetitionsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { myPetitions } = useSelector((state: RootState) => state.petition);

  useEffect(() => {
    dispatch(fetchMyPetitions());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (confirm("Bu dilekçeyi silmek istediğinize emin misiniz?")) {
      await dispatch(deletePetition(id));
    }
  };

  const handleDownload = (id: number, templateName: string) => {
    dispatch(
      downloadPetition({
        id,
        filename: `${templateName}_${
          new Date().toISOString().split("T")[0]
        }.pdf`,
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dilekçelerim</h1>
          <p className="text-slate-400">
            Oluşturduğunuz tüm dilekçeleri burada görüntüleyebilirsiniz
          </p>
        </div>

        {myPetitions.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 mb-4">Henüz dilekçe oluşturmadınız</p>
            <button
              onClick={() => navigate("/petition")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              İlk Dilekçeni Oluştur
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myPetitions.map((petition) => (
              <div
                key={petition.id}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">
                      {petition.templateName}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <span className="px-2 py-1 bg-slate-700/50 rounded-full">
                        {petition.category}
                      </span>
                      <span>•</span>
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDistanceToNow(new Date(petition.createdAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/petition/preview/${petition.id}`)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Görüntüle</span>
                  </button>

                  <button
                    onClick={() =>
                      handleDownload(petition.id, petition.templateName)
                    }
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(petition.id)}
                    className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
