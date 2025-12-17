import { useEffect, useState } from "react";
import {
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  ChevronDown,
  User,
  MessageSquare,
  Clock,
  Trash2,
  FileText,
  FileSearch,
} from "lucide-react";
import { useNavigate, Outlet } from "react-router";
import { useLocation } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChats,
  createChat,
  fetchChatDetail,
  deleteChat,
} from "../features/chat/slices/chatSlice";
import type { AppDispatch, RootState } from "../store/store";

const UserMenu = ({
  userMenuOpen,
  setUserMenuOpen,
  handleLogout,
  isSidebarOpen,
  isMobile = false,
}: {
  userMenuOpen: boolean;
  setUserMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
  isSidebarOpen: boolean;
  isMobile?: boolean;
}) => {
  const { user } = useSelector((state: RootState) => state.account);

  const UserButtonContent = (
    <>
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="Avatar"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User className="w-5 h-5" />
        )}
      </div>
      {isSidebarOpen && (
        <>
          <span className="text-sm font-medium truncate">
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.username || "Kullanıcı"}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </>
      )}
    </>
  );

  return (
    <div className="relative w-full overflow-visible">
      <button
        onClick={() => {
          if (!isSidebarOpen) {
            setUserMenuOpen(false);
            return;
          }
          setUserMenuOpen(!userMenuOpen);
        }}
        className={`w-full flex items-center px-3 py-2 hover:bg-slate-700/50 rounded-lg transition-colors ${
          isSidebarOpen ? "justify-between space-x-2" : "justify-center"
        }`}
      >
        {isSidebarOpen ? (
          UserButtonContent
        ) : (
          <div className="p-0.5">{UserButtonContent}</div>
        )}
      </button>

      {userMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setUserMenuOpen(false)}
          />
          <div
            className={`absolute z-20 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 ${
              isSidebarOpen && !isMobile
                ? "bottom-full left-0 mb-2"
                : "right-0 bottom-full mb-2"
            } ${isMobile ? "left-0" : ""}`}
          >
            <div className="px-4 py-3 border-b border-slate-700">
              <p className="text-sm font-medium">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            </div>
            <button className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors text-left">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-sm">Profil</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors text-left">
              <Settings className="w-4 h-4 text-slate-400" />
              <span className="text-sm">Ayarlar</span>
            </button>
            <div className="border-t border-slate-700 my-1" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors text-left text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Çıkış Yap</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default function MainLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();
  const { chats, currentChat, loading } = useSelector(
    (state: RootState) => state.chat
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleNewChat = async () => {
    const result = await dispatch(createChat(undefined));
    if (createChat.fulfilled.match(result)) {
      dispatch(fetchChats());
    }
  };

  const handleSelectChat = (chatId: number) => {
    dispatch(fetchChatDetail(chatId));
  };

  const handleDeleteChat = async (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Bu sohbeti silmek istediğinize emin misiniz?")) return;

    setDeletingId(chatId);
    await dispatch(deleteChat(chatId));
    setDeletingId(null);
    dispatch(fetchChats());
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-900 text-white flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 flex-shrink-0 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Header */}
        <div className="p-3 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-bold">Yaver</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors mx-auto"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* New Chat */}
        <div className="p-3 flex-shrink-0">
          <button
            onClick={handleNewChat}
            disabled={loading}
            className={`w-full flex items-center justify-center px-3 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
              sidebarOpen ? "space-x-2" : ""
            }`}
            title={sidebarOpen ? "" : "Yeni Sohbet"}
          >
            <Plus className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Yeni Sohbet</span>}
          </button>
        </div>
        <button
          onClick={() => navigate("/petition")}
          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <FileText className="w-5 h-5" />
          {sidebarOpen && <span>Dilekçe Oluştur</span>}
        </button>

        <button
          onClick={() => navigate("/document/analyze")}
          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <FileSearch className="w-5 h-5" />
          {sidebarOpen && <span>Doküman Analizi</span>}
        </button>

        {/*  Scrollable Chat History */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-2 scrollbar-hide">
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>

          {loading && chats.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              {sidebarOpen && <p className="mt-2 text-sm">Yükleniyor...</p>}
            </div>
          ) : chats.length === 0 ? (
            sidebarOpen && (
              <div className="text-center text-slate-400 py-8">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Henüz sohbet yok</p>
                <p className="text-xs mt-1 text-slate-500">
                  Yeni sohbet başlatın
                </p>
              </div>
            )
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`group relative rounded-lg cursor-pointer transition-all ${
                  currentChat?.id === chat.id
                    ? "bg-blue-600/20 border border-blue-500/30"
                    : "bg-slate-700/30 hover:bg-slate-700/50 border border-transparent"
                } ${sidebarOpen ? "p-3" : "p-2"}`}
                title={sidebarOpen ? "" : chat.title}
              >
                {sidebarOpen ? (
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate text-sm">
                        {chat.title}
                      </h3>
                      {chat.lastMessage && (
                        <p className="text-xs text-slate-400 truncate mt-1">
                          {chat.lastMessage}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(chat.updatedAt), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </span>
                        <span>•</span>
                        <span>{chat.messageCount}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      disabled={deletingId === chat.id}
                      className="ml-2 p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {deletingId === chat.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-red-400"></div>
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        currentChat?.id === chat.id
                          ? "bg-blue-500"
                          : "bg-slate-600"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer - User Info */}
        <div className="p-3 border-t border-slate-700/50 flex-shrink-0">
          <UserMenu
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
            handleLogout={handleLogout}
            isSidebarOpen={sidebarOpen}
          />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-800/95 backdrop-blur-xl border-r border-slate-700/50 z-50 transform transition-transform duration-300 md:hidden flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold">Yaver</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* New Chat */}
        <div className="p-4 flex-shrink-0">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Yeni Sohbet</span>
          </button>
        </div>

        {/* Scrollable Chat History */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2 scrollbar-hide">
          {chats.length === 0 ? (
            <div className="px-3 py-8 text-center text-slate-500 text-sm">
              Henüz sohbet yok
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  handleSelectChat(chat.id);
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 cursor-pointer"
              >
                <h3 className="font-medium text-white truncate text-sm">
                  {chat.title}
                </h3>
                <p className="text-xs text-slate-400 truncate mt-1">
                  {chat.lastMessage}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer - User Info */}
        <div className="p-3 border-t border-slate-700/50 flex-shrink-0">
          <UserMenu
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
            handleLogout={handleLogout}
            isSidebarOpen={true}
            isMobile={true}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - Mobile Menu Button */}
        <div className="md:hidden h-14 bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="font-bold">Yaver</span>
          </div>
          <div className="w-10" />
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
