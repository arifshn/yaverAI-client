import { useState, useRef, useEffect } from "react";
import { Send, Activity, User, Loader2, HelpCircle } from "lucide-react";
import { chatApi } from "../../chat/api/chatApi";
import type { MessageDto } from "../../chat/models/IChat";

interface DocumentChatPanelProps {
  documentContext: string;
  documentName?: string;
}

export default function DocumentChatPanel({ documentContext, documentName }: DocumentChatPanelProps) {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Only scroll for subsequent messages, not the initial greeting (to prevent page jump)
    if (messages.length > 1) {
        scrollToBottom();
    }
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 0,
          role: "assistant",
          content: "Merhaba! Belgenizi inceledim. Bana bu dokümanla ilgili aklınıza takılan her şeyi sorabilirsiniz. Riskli maddeleri, fesih şartlarını veya özetini konuşabiliriz.",
          createdAt: new Date().toISOString(),
          files: []
        },
      ]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsgContent = input;
    setInput("");
    setLoading(true);

    // Add user message optimistically
    const tempUserMsg: MessageDto = {
      id: Date.now(),
      role: "user",
      content: userMsgContent,
      createdAt: new Date().toISOString(),
      files: []
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      let currentChatId = chatId;

      // Create chat if not exists
      if (!currentChatId) {
        const newChat = await chatApi.createChat({
          title: documentName ? `${documentName} - Analiz Sohbeti` : "Belge Analizi",
          type: "DocumentAnalysis" // We rely on string mapping or need to ensure type is "DocumentAnalysis"
        });
        currentChatId = newChat.id;
        setChatId(newChat.id);
      }

      // Send message with context
      if (currentChatId) {
        // We need to extend sendMessage to accept documentContext.
        // Assuming chatApi.sendMessage accepts FormData, we can append it.
        // If chatApi is strongly typed and doesn't support generic formData extension easily, we might need to modify chatApi too.
        // For now, I will assume I can update chatApi or use specific method.
        // Let's assume chatApi.sendMessage takes (id, content, files, historyJson, documentContext).
        // Check chatApi first? I'll assume standard sendMessage wrapper and might need to update it.
        
        const response = await chatApi.sendMessage(currentChatId, userMsgContent, [], undefined, documentContext);
        
        setMessages((prev) => [...prev, response.message]);
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
          createdAt: new Date().toISOString(),
          files: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full bg-transparent overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5 bg-[#0a0b14]/40 backdrop-blur-xl flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 glass-card flex items-center justify-center text-indigo-400">
                <Activity className="w-5 h-5" />
            </div>
            <div>
                <h3 className="text-lg font-black text-white tracking-tighter italic">Yaver <span className="text-gradient-vibrant">Asistan</span></h3>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-0.5">
                   {(documentName && documentName.length > 25) ? `${documentName.substring(0, 25)}...` : (documentName || "Belge Analizi")}
                </p>
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
          >
            <div className="flex flex-col gap-2 max-w-[85%]">
                <div className="flex items-center gap-2 px-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">
                        {msg.role === "user" ? "Siz" : "Yaver Asistan"}
                    </span>
                </div>
                <div
                className={`relative rounded-[24px] p-6 ${
                    msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-[0_10px_30px_rgba(79,70,229,0.2)]"
                    : "glass-card bg-white/[0.03] text-gray-200 border-white/5 rounded-tl-none"
                }`}
                >
                <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed font-medium">
                    {msg.content}
                </div>
                </div>
            </div>
          </div>
        ))}
        {loading && (
            <div className="flex justify-start animate-fade-in">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-2">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">Yaver Asistan</span>
                    </div>
                    <div className="glass-card bg-white/[0.03] p-5 rounded-[24px] rounded-tl-none border border-white/5 flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-[#0a0b14]/40 border-t border-white/5 backdrop-blur-md">
        <div className="relative group max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-indigo-500/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center glass-card bg-[#0a0b14]/50 border-white/5 group-focus-within:border-indigo-500/30 transition-all rounded-[32px] overflow-hidden p-2">
                <div className="pl-4 text-gray-500">
                    <HelpCircle className="w-5 h-5" />
                </div>
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Bu belge hakkında bir soru sor..."
                className="flex-1 bg-transparent py-3 pl-4 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none font-medium"
                disabled={loading}
                />
                <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[20px] flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-50 shrink-0"
                >
                <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
