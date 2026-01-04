import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Calendar,
  Search,
  Plus,
  Grid,
  List
} from "lucide-react";
import {
  fetchMyPetitions,
  deletePetition,
  downloadPetition,
} from "../slices/petitionSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import Seo from "../../../components/Seo";
import { slugify } from "../../../utils/slugify";
import { ensureUtc } from "../../../utils/date";

export default function MyPetitionsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { myPetitions, loading } = useSelector((state: RootState) => state.petition);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredPetitions = myPetitions.filter(
    (petition) =>
      petition.templateName.toLocaleLowerCase("tr-TR").includes(searchQuery.toLocaleLowerCase("tr-TR")) ||
      petition.category?.toLocaleLowerCase("tr-TR").includes(searchQuery.toLocaleLowerCase("tr-TR"))
  );

  if (loading && myPetitions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center relative overflow-hidden">
        <div className="text-center relative z-10 animate-fade-in">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            <FileText className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Arşiviniz taranıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white relative mobile-safe-area pb-20 md:pb-0 overflow-x-hidden">
       <Seo 
         title="Dilekçe Arşivim" 
         description="Oluşturduğunuz tüm hukuki dilekçeler ve resmi belgeler burada güvenle saklanır."
       />
       {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <div className="relative z-50 border-b border-white/5 bg-[#0a0b14]/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic mb-4">
                Dilekçe <span className="text-gradient-vibrant">Arşivi</span>
              </h1>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] max-w-xl leading-relaxed">
                Tüm yasal süreçleriniz ve oluşturduğunuz belgeler güvenli bir şekilde burada saklanır.
              </p>
            </div>

            <button
               onClick={() => navigate("/dilekce")}
               className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 group"
            >
               <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
               <span>Yeni Dilekçe</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="w-full md:w-[450px] relative group">
                <div className="absolute inset-0 bg-indigo-500/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3 glass-card p-2 bg-[#0a0b14]/50 border-white/5 group-focus-within:border-indigo-500/30 transition-all rounded-[24px]">
                    <div className="pl-4">
                        <Search className="w-5 h-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Belgelerde ara..."
                        className="flex-1 bg-transparent py-4 text-white placeholder-gray-600 text-sm focus:outline-none font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 glass-card p-1.5 bg-white/[0.02] border-white/5 self-end md:self-auto">
                <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-[14px] transition-all ${
                    viewMode === "grid"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-gray-500 hover:text-white"
                }`}
                title="Izgara"
                >
                <Grid className="w-5 h-5" />
                </button>
                <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-[14px] transition-all ${
                    viewMode === "list"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-gray-500 hover:text-white"
                }`}
                title="Liste"
                >
                <List className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12 pb-32">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass-card p-8 bg-white/[0.01] border-white/5 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Toplam Belge</h3>
               <div className="w-10 h-10 glass-card flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <FileText className="w-5 h-5" />
               </div>
            </div>
            <div className="flex items-baseline gap-2">
               <span className="text-5xl font-black text-white italic tracking-tighter">{myPetitions.length}</span>
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic opacity-40">Adet</span>
            </div>
          </div>

          <div className="glass-card p-8 bg-white/[0.01] border-white/5 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">İndirmeler</h3>
               <div className="w-10 h-10 glass-card flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Download className="w-5 h-5" />
               </div>
            </div>
            <div className="flex items-baseline gap-2">
               <span className="text-5xl font-black text-white italic tracking-tighter">{myPetitions.length * 3}</span>
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic opacity-40">Kez</span>
            </div>
          </div>

          <div className="glass-card p-8 bg-white/[0.01] border-white/5 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Son Faaliyet</h3>
               <div className="w-10 h-10 glass-card flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Calendar className="w-5 h-5" />
               </div>
            </div>
            <div className="flex items-baseline gap-2 truncate">
               <span className="text-3xl font-black text-white italic tracking-tighter uppercase truncate">
                  {myPetitions.length > 0
                    ? new Date(myPetitions[0].createdAt).toLocaleDateString(
                        "tr-TR",
                        { month: "short", day: "numeric" }
                    )
                    : "Bulunmuyor"}
               </span>
            </div>
          </div>
        </div>

        {filteredPetitions.length === 0 ? (
          <div className="text-center py-32 glass-card border-white/5 bg-white/[0.01] border-dashed">
            <div className="w-24 h-24 glass-card flex items-center justify-center mx-auto mb-10 text-gray-700">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 italic tracking-tighter">
              {searchQuery ? <span className="text-red-500">Sonuç Bulunamadı</span> : "Arşiviniz Boş"}
            </h3>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-12 max-w-sm mx-auto leading-relaxed">
              {searchQuery
                ? "Arama kriterlerinizi değiştirerek tekrar deneyin."
                : "Hemen yeni bir dilekçe oluşturarak arşivinizi büyütün."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/dilekce")}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
              >
                İlk Dilekçenizi Oluşturun
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up"
                : "space-y-6 animate-fade-in-up"
            }
          >
            {filteredPetitions.map((petition) => (
              <div
                key={petition.id}
                className={`group glass-card p-8 bg-white/[0.01] border-white/5 hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden ${
                  viewMode === "list" ? "flex items-center justify-between gap-10" : ""
                }`}
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                
                <div
                  className={
                    viewMode === "list"
                      ? "flex items-center gap-10 flex-1"
                      : "mb-10"
                  }
                >
                  <div
                    className={`${
                      viewMode === "list" ? "w-20 h-20" : "w-16 h-16 mb-6"
                    } glass-card bg-indigo-600/5 border-indigo-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-500`}
                  >
                    <FileText className="w-7 h-7" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-black text-white italic tracking-tighter mb-3 truncate group-hover:text-indigo-400 transition-colors ${
                        viewMode === "list" ? "text-2xl" : "text-3xl"
                      }`}
                    >
                      {petition.templateName}
                    </h3>
                    <div className="flex items-center flex-wrap gap-4">
                      {petition.category && (
                        <span className="px-3 py-1.5 glass-card bg-indigo-500/5 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                          {petition.category}
                        </span>
                      )}
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {formatDistanceToNow(ensureUtc(petition.createdAt), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-3 ${
                    viewMode === "list" ? "" : "pt-8 border-t border-white/5"
                  }`}
                >
                  <button
                    onClick={() => {
                        const slug = slugify(petition.templateName);
                        navigate(`/dilekce/onizleme/${petition.id}/${slug}`);
                    }}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-3.5 glass-card glass-card-hover text-[10px] font-black uppercase tracking-widest text-white group"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Aç</span>
                  </button>

                  <button
                    onClick={() =>
                      handleDownload(petition.id, petition.templateName)
                    }
                    className="p-3.5 glass-card glass-card-hover text-gray-500 hover:text-white"
                    title="İndir"
                  >
                    <Download className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(petition.id)}
                    className="p-3.5 glass-card bg-red-500/5 hover:bg-red-500 border-red-500/10 text-red-500 hover:text-white transition-all duration-300"
                    title="Sil"
                  >
                    <Trash2 className="w-5 h-5" />
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
