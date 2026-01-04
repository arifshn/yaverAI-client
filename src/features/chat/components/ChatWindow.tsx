import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { MessageSquare, Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import type { RootState } from "../../../store/store";

export default function ChatWindow() {
  const { currentChat, loading, sendingMessage } = useSelector(
    (state: RootState) => state.chat
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const now = new Date();

  const timeString = now.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages, sendingMessage]);

  if (!currentChat && !loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#0a0b14] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none"></div>

        <div className="z-10 text-center space-y-8 max-w-2xl px-6 -mt-20">
          {/* Logo */}
          <div className="relative w-24 h-24 mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <div className="relative w-full h-full bg-[#13141f] border border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl shadow-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Greeting */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Size nasıl yardımcı olabilirim?
            </h2>
            <p className="text-lg text-gray-400 font-medium">
              Yaver AI ile dilekçe hazırlayın, hukuki sorularınızı sorun.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0b14]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-purple-400 animate-pulse" />
          </div>
          <p className="text-gray-400 font-medium tracking-wide">Sohbet yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0a0b14] h-full relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 custom-scrollbar relative z-10">
        {currentChat?.messages && currentChat.messages.length > 0 ? (
          <div className="max-w-4xl mx-auto pb-4">
            {/* Date Header */}
            <div className="flex items-center justify-center mb-8 sticky top-0 z-20">
              <span className="px-3 py-1 bg-gray-900/80 backdrop-blur border border-gray-800 text-gray-400 text-xs rounded-full shadow-lg">
                Bugün, {timeString}
              </span>
            </div>

            {currentChat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* AI thinking indicator */}
            {sendingMessage && (
              <div className="flex justify-start mb-6">
                <div className="flex items-start gap-3 max-w-3xl">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg border border-blue-500/30">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="px-5 py-4 bg-gray-800/80 rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-lg rounded-tl-none">
                    <div className="flex space-x-1.5 items-center h-5">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="w-20 h-20 bg-gray-800/30 rounded-3xl flex items-center justify-center mx-auto mb-6 ring-1 ring-white/5">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl font-medium text-white mb-2">Henüz mesaj yok</p>
              <p className="text-sm text-gray-400">Sohbeti başlatmak için aşağıya bir mesaj yazın</p>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      {currentChat && (
        <div className="relative z-20">
          <MessageInput chatId={currentChat.id} />
        </div>
      )}
    </div>
  );
}
