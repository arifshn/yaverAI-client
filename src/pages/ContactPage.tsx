import {
  Mail,
  MapPin,
  Send,
  MessageSquare,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../shared/api/axiosClient";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Genel Sorular",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.warning("Lütfen tüm alanları doldurunuz.");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post("/contact/send", formData);
      toast.success(
        "Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağız."
      );
      setFormData({
        name: "",
        email: "",
        subject: "Genel Sorular",
        message: "",
      });
    } catch (error: any) {
      if (error.response?.status === 429) {
        toast.error("Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.");
      } else {
        toast.error("Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyiniz.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header / Nav */}
      <div className="absolute top-0 left-0 w-full p-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 glass-card hover:bg-white/5 transition-all text-gray-400 hover:text-white group text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-wide">Ana Sayfa</span>
        </Link>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        {/* Title Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="page-title">
            Bize <span className="text-gradient-vibrant">Ulaşın</span>
          </h1>
          <p className="page-subtitle max-w-xl mx-auto">
            Teknik destek, iş birliği veya sadece merhaba demek için... Ekibimiz
            sizinle iletişime geçmekten mutluluk duyar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start animate-fade-in-up animation-delay-200">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass-card p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all"></div>

              <h3 className="text-xl font-black mb-8 flex items-center gap-3 italic">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                </div>
                İletişim Kanalları
              </h3>

              <div className="space-y-8">
                <div className="flex items-start gap-4 group/item">
                  <div className="w-12 h-12 glass-card flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                      E-posta
                    </p>
                    <a
                      href="mailto:destek@yaverdilekce.com"
                      className="text-lg font-bold text-white hover:text-indigo-400 transition-colors"
                    >
                      destek@yaverdilekce.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group/item">
                  <div className="w-12 h-12 glass-card flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                      Adres
                    </p>
                    <p className="text-lg font-bold text-white">
                      Mersin, Türkiye
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-10 bg-[#0a0b14]/50">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">
                    İsim Soyisim
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">
                  Konu
                </label>
                <div className="relative">
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium appearance-none"
                  >
                    <option className="bg-[#0a0b14]">Genel Sorular</option>
                    <option className="bg-[#0a0b14]">Teknik Destek</option>
                    <option className="bg-[#0a0b14]">Üyelik ve Ödeme</option>
                    <option className="bg-[#0a0b14]">
                      Öneri / Geri Bildirim
                    </option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">
                  Mesajınız
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none font-medium"
                  placeholder="Size nasıl yardımcı olabiliriz?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Mesajı Gönder
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
