import { useState, useRef, useEffect } from "react";
import { Send, Activity, ArrowRight, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { guidanceApi } from "../api/guidanceApi";
import type { MessageDto } from "../../chat/models/IChat";

// Reception suggestion chips
const RECEPTION_CHIPS = [
  "Bu uygulama ne işe yarıyor?",
  "Dilekçe oluşturmak istiyorum",
  "Sözleşmemi analiz ettirmek istiyorum",
  "Bir sorunum var, yardım et"
];

export default function ReceptionChat() {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const start = async () => {
      const welcome: MessageDto = {
        id: 0,
        role: "assistant",
        content: "Merhaba! Ben Yaver. Aşağıdaki seçeneklerden birini seçebilir veya doğrudan sorunuzu yazabilirsiniz.",
        createdAt: new Date().toISOString()
      };
      setMessages([welcome]);

      try {
        const chat = await guidanceApi.startGuidance("Karşılama", "Reception");
        setChatId(chat.id);
      } catch (err) {
        console.error("Failed to start reception chat", err);
      }
    };
    start();
  }, []);

  const handleSend = async (messageContent?: string) => {
    const content = messageContent || input;
    if (!content.trim() || !chatId || loading) return;

    const userMsg: MessageDto = {
      id: Date.now(),
      role: "user",
      content: content,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await guidanceApi.sendMessage(chatId, content);
      setMessages(prev => [...prev, response.message]);
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full bg-transparent overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5 bg-[#0a0b14]/40 backdrop-blur-xl flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-5">
           <div className="w-12 h-12 glass-card flex items-center justify-center text-indigo-400">
             <Activity className="w-6 h-6 animate-pulse" />
           </div>
           <div>
             <h3 className="text-xl font-black text-white tracking-tighter italic">Yaver <span className="text-gradient-vibrant">Resepsiyon</span></h3>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">Hızlı Karşılama Masası</p>
           </div>
        </div>
        <button 
          onClick={() => navigate("/rehber")}
          className="flex items-center gap-2 px-5 py-2.5 glass-card glass-card-hover text-[10px] font-black uppercase tracking-widest text-gray-400 group transition-all hover:text-white"
        >
          <span>Rehber'e Geç</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`} style={{ animationDelay: `${i * 100}ms` }}>
             <div className="flex flex-col gap-2 max-w-[85%]">
                <div className="flex items-center gap-2 px-2">
                   <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">
                      {m.role === "user" ? "Siz" : "Yaver Resepsiyon"}
                   </span>
                </div>
                <div className={`relative rounded-[24px] p-6 ${
                  m.role === "user" 
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-[0_10px_30px_rgba(79,70,229,0.2)]" 
                    : "glass-card bg-white/[0.03] text-gray-200 border-white/5 rounded-tl-none"
                }`}>
                  <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed font-medium">
                    {m.content}
                  </div>
                </div>
             </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
             <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-2">
                   <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">Yaver Resepsiyon</span>
                </div>
                <div className="glass-card bg-white/[0.03] p-5 rounded-[24px] rounded-tl-none border border-white/5 flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Input Area with Suggestion Chips */}
      <div className="p-4 md:p-6 bg-[#0a0b14]/40 border-t border-white/5 backdrop-blur-md">
        {/* Suggestion Chips - Only show if only welcome message */}
        {messages.length <= 1 && !loading && (
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {RECEPTION_CHIPS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(suggestion)}
                className="px-4 py-2 text-xs font-bold rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all hover:scale-105 active:scale-95"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input Field */}
        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-500/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center glass-card bg-[#0a0b14]/50 border-white/5 group-focus-within:border-indigo-500/30 transition-all rounded-[24px] overflow-hidden p-2">
            <div className="pl-3 text-gray-500">
               <HelpCircle className="w-5 h-5" />
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Nasıl yardımcı olabilirim?"
                className="flex-1 bg-transparent py-3 pl-4 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none font-medium"
                disabled={loading}
            />
            <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[16px] flex items-center justify-center transition-all shadow-lg active:scale-90 disabled:opacity-50 shrink-0"
            >
                <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

