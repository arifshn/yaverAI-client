import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Crown,
  Shield,
  Sparkles,
} from "lucide-react";
import {
  getUser,
  logout
} from "../../account/slices/accountSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import SubscriptionManagement from "../../payment/components/SubscriptionManagement";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { accountApi } from "../../account/api/accountApi";
import DeleteAccountModal from "../components/DeleteAccountModal";
import { Trash2 } from "lucide-react";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await accountApi.deleteAccount();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Hesap silinirken hata:", error);
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0b14]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
         {/* Page Header */}
         <div className="mb-12 animate-fade-in-up">
            <h1 className="page-title">
               Profil <span className="text-gradient-vibrant inline-block pb-1 pr-1">Yönetimi</span>
            </h1>
            <p className="page-subtitle !mx-0">
               Profil bilgilerinizi, abonelik durumunuzu ve güvenlik ayarlarınızı buradan yönetebilirsiniz.
            </p>
         </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - User Info & Navigation */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* User Profile Card (Read-Only) */}
            <div className="bg-[#1c1d2e]/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-500/10 transition-colors"></div>
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="relative mb-6">
                  <div className="relative p-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-[#0a0b14]">
                        {user?.avatarUrl ? (
                            <img
                            src={user.avatarUrl}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-3xl font-black text-white">
                                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
                                </span>
                            </div>
                        )}
                    </div>
                  </div>
                   {user?.isPremium && (
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-yellow-400 to-orange-500 text-black p-2 rounded-full border-2 border-[#0a0b14] shadow-lg">
                        <Crown className="w-4 h-4 fill-current" />
                      </div>
                   )}
                </div>

                <h2 className="text-2xl font-black text-white mb-1">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.username || "Kullanıcı"}
                </h2>
                <p className="text-sm text-gray-500 mb-6 truncate w-full px-2 font-medium">
                  {user?.email}
                </p>

                {user?.isPremium ? (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[11px] font-black text-purple-400 uppercase tracking-widest">
                      PREMIUM ÜYE
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                    <Shield className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">
                      STANDART PLAN
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Menu (Simplified) */}
            <nav className="bg-[#1c1d2e]/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden p-2">
              <div className="pt-2">
                <button
                    onClick={() => navigate("/paketler")}
                    className="w-full flex items-center gap-3 p-4 text-purple-400/80 hover:text-purple-400 hover:bg-purple-500/10 rounded-2xl transition-all mb-2"
                >
                    <Crown className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-wide">Paket Satın Al</span>
                </button>

                <div className="my-2 border-t border-white/5 mx-4"></div>

                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full flex items-center gap-3 p-4 text-red-600/60 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all group/delete"
                >
                    <Trash2 className="w-5 h-5 group-hover/delete:text-red-500" />
                    <span className="font-bold text-sm uppercase tracking-wide">Hesabımı Sil</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Delete Account Modal */}
          <DeleteAccountModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteAccount}
            loading={deleteLoading}
          />

          {/* Right Content */}
          <div className="lg:col-span-8">
            <div className="bg-[#1c1d2e]/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl min-h-[600px] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="animate-fade-in">
                   <h2 className="text-2xl font-bold mb-6">Abonelik Yönetimi</h2>
                   <SubscriptionManagement />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
