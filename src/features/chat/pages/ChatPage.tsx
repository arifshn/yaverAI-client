import ChatWindow from "../components/ChatWindow";
import QueryLimitBadge from "../components/QueryLimitBadge";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Top Bar */}
      <div className="h-16 bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold">Y</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Yaver AI</h1>
            <p className="text-xs text-slate-400">Resmi İşlem Asistanı</p>
          </div>
        </div>

        <QueryLimitBadge />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
}
