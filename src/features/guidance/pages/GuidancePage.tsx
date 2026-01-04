import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Map,
  ArrowRight,
  Loader2,
  Activity,
  HelpCircle
} from "lucide-react";
import { guidanceApi } from "../api/guidanceApi";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../store/store";
import { updateCredits } from "../../account/slices/creditSlice";
import Seo from "../../../components/Seo";

export default function GuidancePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [chatId, setChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [roadmapData, setRoadmapData] = useState<any | null>(null);
  const [redirectionLoading, setRedirectionLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    handleStart();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        setTimeout(() => {
            scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
        }, 100);
    }
  }, [messages, loading]);

  useEffect(() => {
    if (!loading && !roadmapData && inputRef.current) {
        inputRef.current.focus();
    }
  }, [loading, roadmapData]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const chat = await guidanceApi.startGuidance();
      setChatId(chat.id);
      const welcomeMsg = { 
        role: "assistant", 
        content: "Merhaba! Ben Yaver. Size nasıl yardımcı olabilirim? Lütfen yaşadığınız sorunu veya gerçekleştirmek istediğiniz resmi işlemi kısaca anlatın.",
        createdAt: new Date().toISOString() 
      };
      setMessages([welcomeMsg]);
    } catch (error) {
      toast.error("Rehber başlatılamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatId || loading || roadmapData) return;

    const userMsg = { role: "user", content: input, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await guidanceApi.sendMessage(chatId, currentInput, messages);
      const content = response.message.content;
      const jsonMatch = content.match(/```roadmap-json\s*([\s\S]*?)\s*```/);
      
      let cleanContent = content;
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          setRoadmapData(parsed);
          cleanContent = content.replace(/```roadmap-json\n[\s\S]*?\n```/, "").trim();
        } catch (e) {
          console.error("JSON parse error", e);
        }
      }

      if (cleanContent) {
        const aiMsg = { ...response.message, content: cleanContent };
        setMessages((prev) => [...prev, aiMsg]);
      }
      dispatch(updateCredits(response.remainingCredits));
      
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#0a0b14] flex flex-col overflow-hidden relative font-sans">
      <Seo 
        title="Yaver Rehber" 
        description="Hukuki veya resmi işlemleriniz için adım adım akıllı yol haritası oluşturun."
      />
      
      {/* Header - Only show when chat starts or roadmap exists */}
      {(messages.length > 1 || roadmapData) && (
        <div className="shrink-0 px-8 py-6 border-b border-white/5 bg-[#0a0b14]/40 backdrop-blur-xl z-30 animate-fade-in-down">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 glass-card flex items-center justify-center text-indigo-400">
                <Activity className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h1 className="page-title !mb-0 text-xl md:text-2xl">Rehber <span className="text-gradient-vibrant inline-block pb-1 pr-1">Sohbeti</span></h1>
                <p className="page-subtitle hidden md:block">Sorunuzu anlatın, çözüm yolunuzu çizelim.</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 glass-card">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Çevrimiçi</span>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Main Content */}
      <div 
        ref={scrollRef}
        className="flex-1 w-full overflow-y-auto custom-scrollbar relative scroll-smooth bg-transparent"
      >
        <div className="max-w-4xl w-full mx-auto px-6 py-6 md:py-10 min-h-full flex flex-col justify-end md:justify-start">
            
            {/* Initial Hero State */}
            {messages.length <= 1 && !roadmapData && (
                <div className="flex flex-col items-center justify-center flex-1 min-h-[50vh] text-center space-y-6 animate-fade-in">
                    <div className="w-16 h-16 md:w-20 md:h-20 glass-card rounded-full flex items-center justify-center mx-auto text-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                        <Activity className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">
                        Size Nasıl <br className="hidden md:block" /> 
                        <span className="text-gradient-vibrant inline-block pb-1 pr-1">Yardımcı Olabilirim?</span>
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
                        Hukuki süreçler, resmi başvurular veya aklınıza takılan herhangi bir bürokratik işlem... Sadece anlatın, sizin için bir yol haritası çıkaralım.
                    </p>
                </div>
            )}

            {/* Chat Messages */}
            {(messages.length > 1 || roadmapData) && (
                <div className="space-y-8 pb-4">
                    {messages.map((msg, idx) => (
                        <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up duration-500`}
                        >
                            <div className="flex flex-col gap-2 max-w-[90%] md:max-w-[85%] animate-fade-in">
                                <div className="flex items-center gap-2 px-2">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">
                                    {msg.role === "user" ? "Siz" : "yaverAI"}
                                </span>
                                </div>
                                <div
                                className={`relative rounded-[24px] p-5 md:p-7 ${
                                    msg.role === "user"
                                    ? "bg-indigo-600 text-white rounded-tr-none shadow-[0_10px_30px_rgba(79,70,229,0.2)]"
                                    : "glass-card border-white/5 text-gray-300 rounded-tl-none"
                                }`}
                                >
                                <div className="whitespace-pre-wrap text-sm md:text-lg leading-relaxed font-medium">
                                    {msg.content}
                                </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start animate-fade-in-up">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 px-2">
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">yaverAI</span>
                                </div>
                                <div className="glass-card border-white/5 rounded-[32px] rounded-tl-none p-6 flex items-center gap-4">
                                    <div className="flex gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                                    </div>
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Analiz ediliyor...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {roadmapData && (
                        <div className="mb-4 relative group h-auto animate-fade-in-up w-full">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
                            <div className="relative glass-card p-8 md:p-12 bg-indigo-600/10 overflow-hidden rounded-[32px]">
                                <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-5">
                                <Map className="w-32 h-32 text-white" />
                                </div>
                                <div className="relative z-10">
                                <h3 className="page-title !text-2xl md:!text-4xl">Yol Haritanız <span className="text-gradient-vibrant inline-block pb-1 pr-1">Hazır</span></h3>
                                <p className="page-subtitle !mb-6">Sorunuzu analiz ettim ve çözüm adımlarını hazırladım.</p>
                                <button 
                                    disabled={redirectionLoading}
                                    onClick={async () => {
                                    setRedirectionLoading(true);
                                    try {
                                        if (chatId && roadmapData) {
                                        await guidanceApi.updateGuidanceResult(
                                            chatId, 
                                            roadmapData.issue, 
                                            roadmapData.hasTemplate ? "/dilekce" : (roadmapData.hasAnalysis ? "/belge/analiz" : "/rehber/yol-haritasi")
                                        );
                                        }
                                    } catch (e) {
                                        console.error("Result update failed, navigating anyway", e);
                                    } finally {
                                        navigate("/rehber/yol-haritasi", { state: { roadmap: roadmapData } });
                                        setRedirectionLoading(false);
                                    }
                                    }}
                                    className="btn-primary"
                                >
                                    {redirectionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yol Haritasını Görüntüle"}
                                    {!redirectionLoading && <ArrowRight className="w-5 h-5" />}
                                </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* Input Area (Fixed Bottom) */}
      {!roadmapData && (
         <div className="shrink-0 w-full p-4 md:p-6 bg-[#0a0b14]/90 backdrop-blur-xl border-t border-white/5 z-40">
            <div className="max-w-2xl mx-auto w-full relative group">
                <div className="absolute inset-0 bg-indigo-500/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3 glass-card p-3 bg-[#0a0b14] border-white/10 group-focus-within:border-indigo-500/30 transition-all rounded-[32px]">
                <div className="pl-4">
                    <HelpCircle className="w-6 h-6 text-gray-500" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Örn: Kira sözleşmemi feshetmek istiyorum..."
                    className="flex-1 bg-transparent py-4 text-white placeholder-gray-500 text-sm md:text-base focus:outline-none font-medium"
                    disabled={loading}
                    autoFocus
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                >
                    <ArrowRight className="w-6 h-6" />
                </button>
                </div>
            </div>
         </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0b14;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
