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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages, sendingMessage]);

  if (!currentChat && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Yaver'e Hoş Geldiniz
          </h2>
          <p className="text-slate-400 mb-6">
            Türkiye'deki resmi işlemler ve devlet kurumlarıyla ilgili
            sorularınızı sorarak başlayın. Size yardımcı olmaktan mutluluk
            duyarım!
          </p>
          <div className="space-y-2 text-left bg-slate-800/50 p-4 rounded-lg">
            <p className="text-sm text-slate-300">
              <span className="text-blue-400 font-medium">💡 İpucu:</span> Sol
              taraftan yeni sohbet başlatın
            </p>
            <p className="text-sm text-slate-300">
              <span className="text-green-400 font-medium">📎</span> Dosya (PDF,
              Word, resim) ekleyebilirsiniz
            </p>
            <p className="text-sm text-slate-300">
              <span className="text-purple-400 font-medium">✨</span> Dilekçe
              şablonları yakında eklenecek
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Sohbet yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {currentChat?.title}
            </h2>
            <p className="text-sm text-slate-400">
              {currentChat?.messages.length || 0} mesaj
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {currentChat?.messages && currentChat.messages.length > 0 ? (
          <>
            {currentChat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* AI düşünüyor... */}
            {sendingMessage && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start space-x-3 max-w-3xl">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="px-4 py-3 bg-slate-700/50 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Henüz mesaj yok</p>
              <p className="text-sm mt-1">İlk mesajınızı gönderin</p>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      {currentChat && <MessageInput chatId={currentChat.id} />}
    </div>
  );
}
