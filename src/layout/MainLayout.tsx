import { useEffect, useState } from "react";
import {
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
  CreditCard
} from "lucide-react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreditInfo } from "../features/account/slices/creditSlice";
import { logout, logoutUser } from "../features/account/slices/accountSlice";
import { clearCurrentAnalysis } from "../features/document/slices/documentSlice";
import type { AppDispatch, RootState } from "../store/store";

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
    dispatch(logoutUser());
    dispatch(logout()); // Ensure local state is cleared immediately visually as well if needed, though thunk handles it.
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
      {/* User Info Compact (Only Open) */}
      {(sidebarOpen || isMobile) && (
        <div className="px-6 mb-6">
           <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-indigo-500/30 transition-all group shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                 {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                    <span className="text-xl">{user?.firstName?.charAt(0) || "U"}</span>
                 )}
              </div>
              <div className="min-w-0 flex-1">
                 <p className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">{user?.firstName || user?.username}</p>
                 <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">{user?.isPremium ? 'Premium Üye' : 'Standart Üye'}</p>
              </div>
           </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`${!isMobile && !sidebarOpen ? '' : 'px-4'} ${isMobile ? 'py-2 space-y-2' : 'flex-1 overflow-y-auto px-4 space-y-2 scrollbar-none py-2'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/panel' && location.pathname.startsWith(item.path));
          
          const handleClick = () => {
              if (item.path === '/belge/analiz') {
                  localStorage.removeItem('lastAnalysis');
                  dispatch(clearCurrentAnalysis());
              }
              if (item.path === '/rehber') {
                  localStorage.removeItem('lastRoadmap');
              }
          };

          if (!sidebarOpen && !isMobile) {
            return (
                 <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleClick}
                    className={`flex items-center justify-center w-12 h-12 mx-auto rounded-xl transition-all relative group ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
                    title={item.label}
                 >
                    <Icon className="w-6 h-6" />
                 </Link>
            )
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleClick}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all group relative ${
                isActive
                  ? "bg-white/[0.08] text-white border border-white/10 shadow-lg shadow-black/20"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-white border border-transparent"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-indigo-400"}`} />
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
              {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-l-full shadow-[0_0_15px_#6366f1]"></div>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={`p-4 border-t border-white/5 space-y-4 bg-black/20 ${!isMobile ? '' : 'pb-24'}`}>
        
        {/* Credits Display (Only Open) */}
        {(sidebarOpen || isMobile) && (
          <div className="mx-2 mb-2 p-5 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-[#0a0b14] border border-white/5 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <div className="flex items-center justify-between mb-2 relative z-10">
               <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                 <CreditCard className="w-3.5 h-3.5" />
                 Bakiye
               </span>
               {user?.isPremium && <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/20 shadow-sm shadow-amber-500/10">PREMIUM</span>}
            </div>

            <div className="flex items-end gap-2 relative z-10">
              <span className="text-3xl font-black text-white tracking-tighter">
                {currentCreditsDisplay}
              </span>
              <span className="text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{user?.isPremium ? 'Premium Kredi' : 'Kredi'}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`grid ${!sidebarOpen && !isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
            <button
              onClick={() => navigate("/profil")}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border border-white/5 bg-white/[0.04] hover:bg-white/10 text-gray-400 hover:text-white transition-all group ${!sidebarOpen && !isMobile ? 'w-12 h-12 aspect-square mx-auto' : ''}`}
              title="Profilim"
            >
              <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {(sidebarOpen || isMobile) && <span className="text-[10px] font-bold uppercase tracking-wider">Profilim</span>}
            </button>

            <button
              onClick={handleLogout}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border border-red-500/10 bg-red-500/[0.04] hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all group ${!sidebarOpen && !isMobile ? 'w-12 h-12 aspect-square mx-auto' : ''}`}
              title="Çıkış"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {(sidebarOpen || isMobile) && <span className="text-[10px] font-bold uppercase tracking-wider">Çıkış</span>}
            </button>
        </div>

        {/* Legal Disclaimer removed from here and moved to Dashboard */}
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
          sidebarOpen ? "w-[320px]" : "w-28"
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
        <div className="flex-1 overflow-y-auto pt-4 relative z-10 scrollbar-none">
            <SidebarContent isMobile />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-gradient-to-r from-[#0a0b14] to-[#111222] backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
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
