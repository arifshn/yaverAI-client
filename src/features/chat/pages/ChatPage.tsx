import ChatWindow from "../components/ChatWindow";

export default function ChatPage() {
  return (
    <div className="h-full bg-[#0a0b14] text-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
}
