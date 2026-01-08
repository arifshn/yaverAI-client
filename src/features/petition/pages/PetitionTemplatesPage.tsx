import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Activity,
  Filter
} from "lucide-react";
import { fetchTemplates, setSelectedTemplate } from "../slices/petitionSlice";
import { getUser } from "../../account/slices/accountSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import TemplateCard from "../components/TemplateCard";
import PremiumPaywall from "../../document/components/PremiumPaywall";
import { slugify } from "../../../utils/slugify";
import Seo from "../../../components/Seo";

export default function PetitionTemplatesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { templates, loading } = useSelector(
    (state: RootState) => state.petition
  );
  const { user } = useSelector((state: RootState) => state.account);
  const [showPaywall, setShowPaywall] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchTemplates());
    if (!user) {
        dispatch(getUser());
    }
  }, [dispatch, user]);

  const handleSelectTemplate = (template: any) => {
    // Premium değilse veya kredisi yetersizse (min 20 kredi) engelle
    if (user && (!user.isPremium || user.credits < 20)) {
        setShowPaywall(true);
        return;
    }
    dispatch(setSelectedTemplate(template));
    const slug = slugify(template.name);
    navigate(`/dilekce/olustur/${template.id}/${slug}`);
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
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Arşiv taranıyor...</p>
        </div>
      </div>
    );
  }

  // Filter logic
  const isTyping = searchTerm !== debouncedSearchTerm;

  const filteredCategories = Object.entries(templates).reduce((acc, [category, categoryTemplates]) => {
    const term = debouncedSearchTerm.toLocaleLowerCase('tr-TR');
    
    // Eğer arama terimi kategori adında geçiyorsa, o kategorideki TÜM şablonları göster
    // Değilse, şablon adı veya açıklamasında ara
    const isCategoryMatch = category.toLocaleLowerCase('tr-TR').includes(term);
    
    const filtered = isCategoryMatch 
        ? categoryTemplates 
        : categoryTemplates.filter(t => 
            t.name.toLocaleLowerCase('tr-TR').includes(term) || 
            t.description.toLocaleLowerCase('tr-TR').includes(term)
          );

    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof templates[string]>);

  const hasResults = Object.keys(filteredCategories).length > 0;

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white relative mobile-safe-area pb-20 md:pb-0 overflow-x-hidden">
      <Seo 
        title="Dilekçe Kütüphanesi" 
        description="Yüzlerce hazır işlem dilekçe şablonuna erişin. Anında oluşturun ve kullanın."
      />
      <PremiumPaywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="Dilekçe Sihirbazı"
      />

       {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 border-b border-white/5 bg-[#0a0b14]/40 backdrop-blur-xl z-30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic mb-4">
                Dilekçe <span className="text-gradient-vibrant inline-block pb-1 pr-1">Kütüphanesi</span>
              </h1>
              <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-[0.2em] max-w-xl leading-relaxed">
                Kullanıma hazır, profesyonelce kurgulanmış şablonlar.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="px-5 py-3 glass-card bg-indigo-500/5 border-indigo-500/10 rounded-2xl flex flex-col items-center sm:items-end justify-center">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">İşlem Maliyeti</span>
                    <span className="text-sm font-bold text-white">20 Kredi</span>
                </div>

                <button
                   onClick={() => navigate("/dilekce/arsivim")}
                   className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 glass-card glass-card-hover text-xs font-black uppercase tracking-widest text-indigo-400 group transition-all"
                >
                   <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                   <span>Arşivim</span>
                </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8 md:mt-12 relative group max-w-3xl w-full">
            <div className="absolute inset-0 bg-indigo-500/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-3 glass-card p-3 bg-[#0a0b14]/50 border-white/5 group-focus-within:border-indigo-500/30 transition-all rounded-[28px]">
              <div className="pl-5">
                 {isTyping ? (
                    <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                 ) : (
                    <Search className="w-6 h-6 text-gray-500" />
                 )}
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Şablonlarda veya kategorilerde ara..."
                className="flex-1 bg-transparent py-3 md:py-5 text-white placeholder-gray-600 text-sm md:text-base focus:outline-none font-medium"
              />
              <div className="pr-2">
                 <button className="p-3 glass-card text-gray-500 hover:text-indigo-400 transition-colors">
                    <Filter className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-7xl mx-auto px-8 py-16 transition-opacity duration-300 ${isTyping ? 'opacity-50' : 'opacity-100'}`}>
        {!hasResults ? (
          <div className="text-center py-32 glass-card border-white/5 bg-white/[0.01]">
            <div className="w-24 h-24 glass-card flex items-center justify-center mx-auto mb-8 text-gray-700">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 italic tracking-tighter">
              Sonuç <span className="text-indigo-500">Bulunamadı</span>
            </h3>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
             Aradığınız kriterlere uygun şablon bulunmuyor.
            </p>
          </div>
        ) : (
          Object.entries(filteredCategories).map(([category, categoryTemplates]) => (
            <div key={category} className="mb-24 last:mb-0">
              {/* Category Header */}
              <div className="flex items-center gap-6 mb-12">
                <div className="flex items-center gap-4 px-6 py-3 glass-card bg-indigo-600/5 border-indigo-500/10 backdrop-blur-xl">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase">
                    {category}
                  </h2>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
