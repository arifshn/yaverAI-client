import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, Paperclip, X, FileText } from "lucide-react";
import { sendMessage, addUserMessage } from "../slices/chatSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import { toast } from "react-toastify";

interface MessageInputProps {
  chatId: number;
}

export default function MessageInput({ chatId }: MessageInputProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { sendingMessage } = useSelector((state: RootState) => state.chat);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const oversizedFiles = selectedFiles.filter(
      (f) => f.size > 10 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.error("Dosya boyutu 10MB'dan büyük olamaz");
      return;
    }

    if (files.length + selectedFiles.length > 5) {
      toast.error("En fazla 5 dosya yükleyebilirsiniz");
      return;
    }

    setFiles([...files, ...selectedFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!message.trim() && files.length === 0) return;

    const content = message.trim();

    dispatch(
      addUserMessage({
        content,
        files: files.map((f) => ({
          id: Date.now(),
          fileName: f.name,
          filePath: "",
          fileType: f.type,
          fileSize: f.size,
        })),
      })
    );

    setMessage("");
    setFiles([]);

    await dispatch(
      sendMessage({
        chatId,
        content,
        files: files.length > 0 ? files : undefined,
      })
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="border-t border-slate-700/50 bg-slate-800/30 p-4">
      {/* Files Preview */}
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <div className="flex flex-col">
                <span className="text-sm text-white truncate max-w-[150px]">
                  {file.name}
                </span>
                <span className="text-xs text-slate-400">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <button
                onClick={() => handleRemoveFile(index)}
                className="ml-2 p-1 hover:bg-slate-600 rounded transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end space-x-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={sendingMessage}
          className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Dosya ekle (PDF, Word, Resim)"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Yaver'a sorunuzu yazın..."
          disabled={sendingMessage}
          rows={1}
          className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: "48px", maxHeight: "150px" }}
        />

        <button
          onClick={handleSend}
          disabled={sendingMessage || (!message.trim() && files.length === 0)}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {sendingMessage ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-2">
        Enter ile gönder • Shift+Enter ile yeni satır • En fazla 5 dosya (10MB)
      </p>
    </div>
  );
}
