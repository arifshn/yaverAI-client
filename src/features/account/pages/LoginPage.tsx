import { useNavigate } from "react-router";
import { useAppDispatch } from "../../../store/store";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../slices/accountSlice";
import { Sparkles, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function submitForm(data: any) {
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Sol Taraf - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center text-white space-y-6">
          <div className="flex items-center space-x-3 mb-8">
            <Sparkles className="w-10 h-10 text-blue-400" />
            <h1 className="text-5xl font-bold">Yaver</h1>
          </div>
          <p className="text-xl text-slate-300 text-center max-w-md">
            Akıllı dijital asistanınız ile üretkenliğin geleceğini
            basitleştirin.
          </p>
          <div className="relative w-full max-w-md h-96 mt-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_50%)]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Form */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700/50">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Hesabınıza Hoş Geldiniz
            </h2>
            <p className="text-slate-400">
              Devam etmek için giriş yapın veya yeni bir hesap oluşturun.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-6 bg-slate-900/50 rounded-lg p-1">
            <button
              type="button"
              className="flex-1 py-2.5 rounded-md transition-all font-medium bg-slate-700 text-white"
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="flex-1 py-2.5 rounded-md transition-all font-medium text-slate-400 hover:text-white"
            >
              Kayıt Ol
            </button>
          </div>

          <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
            {/* Kullanıcı Adı */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Kullanıcı adınızı giriniz"
                {...register("username", {
                  required: "Kullanıcı adı zorunludur.",
                })}
              />
              {errors.username && (
                <p className="mt-1.5 text-sm text-red-400">
                  {errors.username?.message}
                </p>
              )}
            </div>

            {/* Şifre */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Şifre
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Şifremi Unuttum?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                  placeholder="Şifrenizi girin"
                  {...register("password", {
                    required: "Parola zorunludur.",
                  })}
                />
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-400">
                  {errors.password?.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Giriş Yapılıyor...</span>
                </>
              ) : (
                <span>Giriş Yap</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
