import { Bot, User, FileText, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import type { MessageDto } from "../models/IChat";

interface MessageBubbleProps {
  message: MessageDto;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex items-start space-x-3 max-w-3xl ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isUser
              ? "bg-gradient-to-br from-blue-500 to-purple-500"
              : "bg-gradient-to-br from-green-500 to-teal-500"
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col space-y-2">
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? "bg-blue-600 text-white"
                : "bg-slate-700/50 text-slate-100"
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>

          {/* Files */}
          {message.files && message.files.length > 0 && (
            <div className="space-y-2">
              {message.files.map((file) => (
                <a
                  key={file.id}
                  href={`http://localhost:5239${file.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isUser
                      ? "bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30"
                      : "bg-slate-600/50 hover:bg-slate-600/70 border border-slate-600"
                  }`}
                >
                  <FileText className="w-5 h-5 text-slate-300" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.fileName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatFileSize(file.fileSize)}
                    </p>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <p
            className={`text-xs text-slate-500 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {formatDistanceToNow(new Date(message.createdAt), {
              addSuffix: true,
              locale: tr,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
