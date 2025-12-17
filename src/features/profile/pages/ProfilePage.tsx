import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  X,
  Crown,
  Shield,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  getUser,
  updateProfile,
  updateEmail,
  updateUsername,
  changePassword,
  uploadAvatar,
  deleteAvatar,
} from "../../account/slices/accountSlice";
import type { RootState, AppDispatch } from "../../../store/store";

type TabType = "info" | "security" | "settings";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.account);
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { isSubmitting: isSubmittingProfile },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
  });

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors, isSubmitting: isSubmittingEmail },
    reset: resetEmail,
  } = useForm({
    defaultValues: {
      newEmail: "",
    },
  });

  const {
    register: registerUsername,
    handleSubmit: handleSubmitUsername,
    formState: { errors: usernameErrors, isSubmitting: isSubmittingUsername },
    reset: resetUsername,
  } = useForm({
    defaultValues: {
      newUsername: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setAvatarPreview(user.avatarUrl);
      resetProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user, resetProfile]);

  const handleProfileUpdate = async (data: any) => {
    await dispatch(updateProfile(data));
  };

  const handleEmailUpdate = async (data: any) => {
    const result = await dispatch(updateEmail(data));
    if (updateEmail.fulfilled.match(result)) {
      resetEmail();
    }
  };

  const handleUsernameUpdate = async (data: any) => {
    const result = await dispatch(updateUsername(data));
    if (updateUsername.fulfilled.match(result)) {
      resetUsername();
    }
  };

  const handlePasswordChange = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      return;
    }

    const result = await dispatch(
      changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
    );

    if (changePassword.fulfilled.match(result)) {
      resetPassword();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append("file", file);
      await dispatch(uploadAvatar(formData));
    } catch (error) {
      setAvatarPreview(user?.avatarUrl || null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    const result = await dispatch(deleteAvatar());
    if (deleteAvatar.fulfilled.match(result)) {
      setAvatarPreview(null);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Kullanıcı Profilim</h1>
          <p className="text-slate-400">
            Temel profil bilgilerinizi güncelleyin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 sticky top-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {uploadingAvatar ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <Camera className="w-8 h-8 text-white" />
                    )}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <button
                  onClick={handleDeleteAvatar}
                  className="mt-3 text-sm text-slate-400 hover:text-red-400 transition-colors"
                >
                  Fotoğrafı Sil
                </button>
              </div>

              {/* User Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-1">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.username}
                </h2>
                <p className="text-slate-400 text-sm mb-3">{user?.email}</p>
                {user?.isPremium ? (
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">
                      Premium Account
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded-full">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-400">
                      Free Account
                    </span>
                  </div>
                )}
              </div>

              {/* Side Navigation */}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "info"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-700/50 text-slate-300"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Kişisel Bilgiler</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "security"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-700/50 text-slate-300"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">Hesap Güvenliği</span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "settings"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-700/50 text-slate-300"
                  }`}
                >
                  <SettingsIcon className="w-5 h-5" />
                  <span className="font-medium">Ayarlar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2">
            {activeTab === "info" && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-6">Kişisel Bilgiler</h3>
                <form
                  onSubmit={handleSubmitProfile(handleProfileUpdate)}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Ad
                      </label>
                      <input
                        type="text"
                        {...registerProfile("firstName")}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Adınız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Soyad
                      </label>
                      <input
                        type="text"
                        {...registerProfile("lastName")}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Soyadınız"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Telefon Numarası (Opsiyonel)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        {...registerProfile("phoneNumber")}
                        className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Telefon numaranızı girin"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => resetProfile()}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all flex items-center space-x-2"
                    >
                      <X className="w-5 h-5" />
                      <span>İptal</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingProfile || loading}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSubmittingProfile || loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Değişiklikleri Kaydet</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Account Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                {/* Changing Email */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-bold mb-4">E-posta Değiştir</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Mevcut e-posta: <strong>{user?.email}</strong>
                  </p>
                  <form
                    onSubmit={handleSubmitEmail(handleEmailUpdate)}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Yeni E-posta Adresi
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          {...registerEmail("newEmail", {
                            required: "E-posta zorunludur.",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Geçerli bir e-posta giriniz.",
                            },
                          })}
                          className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="yeni@email.com"
                        />
                      </div>
                      {emailErrors.newEmail && (
                        <p className="mt-1.5 text-sm text-red-400">
                          {emailErrors.newEmail.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingEmail || loading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingEmail || loading
                        ? "Güncelleniyor..."
                        : "E-posta Değiştir"}
                    </button>
                  </form>
                </div>

                {/* Changing Username */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-bold mb-4">
                    Kullanıcı Adı Değiştir
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Mevcut kullanıcı adı: <strong>{user?.username}</strong>
                  </p>
                  <form
                    onSubmit={handleSubmitUsername(handleUsernameUpdate)}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Yeni Kullanıcı Adı
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          {...registerUsername("newUsername", {
                            required: "Kullanıcı adı zorunludur.",
                            minLength: {
                              value: 3,
                              message: "En az 3 karakter olmalıdır.",
                            },
                            maxLength: {
                              value: 20,
                              message: "En fazla 20 karakter olabilir.",
                            },
                          })}
                          className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="yenikullaniciadi"
                        />
                      </div>
                      {usernameErrors.newUsername && (
                        <p className="mt-1.5 text-sm text-red-400">
                          {usernameErrors.newUsername.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingUsername || loading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingUsername || loading
                        ? "Güncelleniyor..."
                        : "Kullanıcı Adı Değiştir"}
                    </button>
                  </form>
                </div>

                {/* Changing Password */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-bold mb-4">Şifre Değiştir</h3>
                  <form
                    onSubmit={handleSubmitPassword(handlePasswordChange)}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Mevcut Şifre
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="password"
                          {...registerPassword("currentPassword", {
                            required: "Mevcut şifre zorunludur.",
                          })}
                          className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Mevcut şifreniz"
                        />
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="mt-1.5 text-sm text-red-400">
                          {passwordErrors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Yeni Şifre
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="password"
                          {...registerPassword("newPassword", {
                            required: "Yeni şifre zorunludur.",
                            minLength: {
                              value: 6,
                              message: "En az 6 karakter olmalıdır.",
                            },
                          })}
                          className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Yeni şifreniz"
                        />
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="mt-1.5 text-sm text-red-400">
                          {passwordErrors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Yeni Şifre (Tekrar)
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="password"
                          {...registerPassword("confirmPassword", {
                            required: "Şifre tekrarı zorunludur.",
                          })}
                          className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Yeni şifrenizi tekrar girin"
                        />
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1.5 text-sm text-red-400">
                          {passwordErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingPassword || loading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingPassword || loading
                        ? "Değiştiriliyor..."
                        : "Şifreyi Değiştir"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-6">Ayarlar</h3>
                <div className="text-center py-12 text-slate-400">
                  <SettingsIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Ayarlar bölümü yakında eklenecek.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
