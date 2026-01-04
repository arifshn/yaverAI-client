import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, Sparkles } from "lucide-react";
import { sendMessage, addUserMessage } from "../slices/chatSlice";
import type { RootState, AppDispatch } from "../../../store/store";

interface MessageInputProps {
  chatId: number;
}

export default function MessageInput({ chatId }: MessageInputProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { sendingMessage } = useSelector((state: RootState) => state.chat);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;

    const content = message.trim();

    dispatch(
      addUserMessage({
        content,
      })
    );

    setMessage("");

    await dispatch(
      sendMessage({
        chatId,
        content,
      })
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-800/50 bg-[#0a0b14]/80 backdrop-blur-md p-6">
      <div className="max-w-4xl mx-auto">
        {/* Input Area */}
        <div className="relative group">
           <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
          <div className="relative flex items-end gap-2 p-2 bg-gray-900/90 border border-gray-800 rounded-2xl">
            
            {/* Text Input */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message Yaver AI..."
              disabled={sendingMessage}
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed py-3 px-4 text-[15px] max-h-[150px] min-h-[50px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={sendingMessage || !message.trim()}
              className="p-3 mb-1 mr-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-700 disabled:to-gray-700 flex items-center justify-center shadow-lg shadow-purple-500/20"
            >
              {sendingMessage ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 mt-3 text-center">
          Yaver AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
