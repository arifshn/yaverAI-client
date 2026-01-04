import { User, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import type { MessageDto } from "../models/IChat";
import { ensureUtc } from "../../../utils/date";

interface MessageBubbleProps {
  message: MessageDto;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`flex items-start gap-3 max-w-3xl ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
            isUser
              ? "bg-gradient-to-br from-purple-500 to-pink-500 border border-purple-500/30"
              : "bg-gradient-to-br from-blue-500 to-cyan-500 border border-blue-500/30"
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Sparkles className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col space-y-1.5 flex-1 min-w-0">
          {/* Role Label */}
          <div
            className={`flex items-center gap-2 ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            <span className="text-xs font-semibold text-gray-400">
              {isUser ? "Sen" : "Yaver AI"}
            </span>
            <span className="text-[10px] text-gray-600">
              {formatDistanceToNow(
                ensureUtc(message.createdAt),
                {
                  addSuffix: true,
                  locale: tr,
                }
              )}
            </span>
          </div>

          <div
            className={`px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm ${
              isUser
                ? "bg-gradient-to-br from-purple-600/90 to-purple-800/90 text-white rounded-tr-none border border-purple-500/30"
                : "bg-gray-800/80 text-gray-100 rounded-tl-none border border-gray-700/50"
            }`}
          >
            <p className="whitespace-pre-wrap break-words leading-relaxed text-[15px]">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
