import { useEffect, useState } from "react";
import {
  Settings,
  LogOut,
  User,
  Search,
  LayoutDashboard,
  Menu,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Map,
  Activity,
  CreditCard
} from "lucide-react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreditInfo } from "../features/account/slices/creditSlice";
import { logout } from "../features/account/slices/accountSlice";
import type { AppDispatch, RootState } from "../store/store";
import LegalDisclaimer from "../components/LegalDisclaimer";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.account);
  const { creditInfo } = useSelector((state: RootState) => state.credit);

  useEffect(() => {
    if (user) {
      dispatch(fetchCreditInfo());
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
     // Auto close sidebar on mobile route change
     if (mobileMenuOpen) setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
  };


  const navItems = [
    { icon: LayoutDashboard, label: "Kontrol Paneli", path: "/panel" },
    { icon: Map, label: "Yaver Rehber", path: "/rehber" },
    { icon: FileText, label: "Dilekçe Hazırla", path: "/dilekce" },
    { icon: Search, label: "Belge Analizi", path: "/belge/analiz" },
    { icon: CreditCard, label: "Kredi Paketleri", path: "/paketler" },
  ];

  {
    /* Yüzde hesaplama mantığı */
  }
  const calculateProgress = () => {
    if (!user) return 0;
    const currentCredits = creditInfo?.currentCredits ?? user.credits ?? 0;
    
    if (user.isPremium) {
      // Premium: Total kredi / 1520 (1500 başlangıç + 20 günlük)
      const maxCredits = 1520;
      return Math.min((currentCredits / maxCredits) * 100, 100);
    }
    // Ücretsiz: 0-20 arası
    return Math.min((currentCredits / 20) * 100, 100);
  };

  const progressWidth = calculateProgress();
  const currentCreditsDisplay = creditInfo?.currentCredits ?? user?.credits ?? 0;
  
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Brand / Logo */}
      <div className={`p-6 flex items-center ${!sidebarOpen && !isMobile ? "justify-center" : "justify-start"}`}>
          <Link to="/panel" className="group">
              {(sidebarOpen || isMobile) ? (
                 <div className="pl-2">
                    <h1 className="text-2xl font-black tracking-tighter leading-none bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent italic">
                       yaverAI
                    </h1>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1 pl-[2px]">Yaver Asistan</p>
                 </div>
              ) : (
                 // Minimized: Show Avatar
                 <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 relative group">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Me" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-indigo-600 flex items-center justify-center font-bold text-white italic">
                        {user?.firstName?.charAt(0) || "U"}
                      </div>
                    )}
                 </div>
              )}
          </Link>
      </div>

      {/* User Info Compact (Only Open) */}
      {(sidebarOpen || isMobile) && (
        <div className="px-6 mb-8">
           <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold overflow-hidden">
                 {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                    user?.firstName?.charAt(0) || "U"
                 )}
              </div>
              <div className="min-w-0">
                 <p className="text-xs font-bold text-white truncate">{user?.firstName || user?.username}</p>
                 <p className="text-[9px] text-gray-500 uppercase tracking-wider">{user?.isPremium ? 'Premium' : 'Standart'}</p>
              </div>
           </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/panel' && location.pathname.startsWith(item.path));
          
          if (!sidebarOpen && !isMobile) {
            return (
                 <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition-all relative group ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
                    title={item.label}
                 >
                    <Icon className="w-5 h-5" />
                 </Link>
            )
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all group relative ${
                isActive
                  ? "bg-white/[0.04] text-white border border-white/10"
                  : "text-gray-400 hover:bg-white/[0.02] hover:text-white border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-indigo-400"}`} />
              <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
              {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-l-full shadow-[0_0_10px_#6366f1]"></div>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/5 space-y-4">
        
        {/* Credits Display (Only Open) */}
        {(sidebarOpen || isMobile) && (
          <div className="p-4 rounded-xl bg-indigo-900/10 border border-indigo-500/10 group hover:border-indigo-500/20 transition-all">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Kredi Limiti</span>
               <span className="text-[10px] font-bold text-white">{currentCreditsDisplay} / {user?.isPremium ? '∞' : '20'}</span>
            </div>
            {/* Progress */}
             <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
               <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`flex gap-2 ${!sidebarOpen && !isMobile ? 'flex-col' : ''}`}>
            <button
              onClick={() => navigate("/profil")}
              className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/5 text-gray-400 hover:text-white transition-all ${!sidebarOpen && !isMobile ? 'w-10 h-10 aspect-square mx-auto' : ''}`}
              title="Ayarlar"
            >
              <User className="w-4 h-4" />
              {(sidebarOpen || isMobile) && <span className="text-[10px] font-bold uppercase tracking-wider">Profilim</span>}
            </button>

            <button
              onClick={handleLogout}
              className={`flex items-center justify-center gap-2 p-2 rounded-lg border border-red-500/10 bg-red-500/[0.02] hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all ${!sidebarOpen && !isMobile ? 'w-10 h-10 aspect-square mx-auto' : ''}`}
              title="Çıkış"
            >
              <LogOut className="w-4 h-4" />
            </button>
        </div>

        {/* Legal Disclaimer (Only Open) */}
        {(sidebarOpen || isMobile) && <LegalDisclaimer />}
      </div>
    </>
  );

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#0a0b14] via-[#0f1019] to-[#161826] text-white flex font-sans selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-gradient-to-b from-[#0a0b14] via-[#0a0b14]/80 to-[#0a0b14]/40 backdrop-blur-xl border-r border-white/5 transition-all duration-300 relative z-20 ${
          sidebarOpen ? "w-[320px]" : "w-24"
        }`}
      >
        <SidebarContent />
        
        {/* Toggle */}
         <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-9 w-6 h-6 bg-[#0a0b14] border border-white/10 text-gray-400 rounded-full flex items-center justify-center hover:text-white hover:border-indigo-500 transition-all z-30"
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] md:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-gradient-to-b from-[#1a1b2e] to-[#0a0b14] backdrop-blur-2xl border-r border-white/10 z-[100] transform transition-transform duration-300 ease-out md:hidden flex flex-col shadow-2xl ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-4 right-4 z-[110]">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 bg-black/50 hover:bg-white/10 rounded-full text-white border border-white/10 backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden pt-4 relative z-10">
            <SidebarContent isMobile />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-gradient-to-r from-[#0a0b14] to-[#111222] backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-20">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent italic">
             yaverAI
          </span>

          <div className="w-6" /> 
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-transparent relative scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
