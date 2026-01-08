import Seo from "../components/Seo";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPage() {

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white overflow-hidden font-sans">
      <Seo 
        title="Gizlilik Politikası" 
        description="Yaver AI Gizlilik Politikası. Verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi edinin."
      />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header / Nav */}
      <div className="absolute top-0 left-0 w-full z-20">
        <div className="max-w-7xl mx-auto p-6 flex justify-between items-center">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 glass-card hover:bg-white/5 transition-all text-gray-400 hover:text-white group text-sm font-bold"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase tracking-wide">Ana Sayfa</span>
            </Link>

            <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tighter text-gradient-vibrant italic inline-block pb-1 pr-1">
                  yaverAI
                </span>
            </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 mb-20 whitespace-pre-wrap">
        {/* Title Section */}
        <div className="text-center mb-12 animate-fade-in-up">
           <h1 className="page-title">
              Gizlilik <span className="text-gradient-vibrant">Politikası</span>
           </h1>
           <p className="page-subtitle max-w-xl mx-auto">
             Verilerinizin güvenliği bizim için önemlidir. Şeffaflık ilkemiz gereği tüm süreçlerimizi aşağıda detaylandırdık.
           </p>
        </div>
        
        <div className="glass-card p-8 md:p-12 space-y-8 text-sm md:text-base leading-relaxed animate-fade-in-up animation-delay-200">
          <p className="text-gray-400 font-medium">Son Güncelleme: 03.01.2026</p>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">1. Giriş</h2>
            <p className="text-gray-300">
              Yaver AI ("Biz", "Platform"), kullanıcılarının gizliliğine büyük önem vermektedir. Bu Gizlilik Politikası, hizmetlerimizi kullanırken kişisel verilerinizin nasıl toplandığını, işlendiğini ve korunduğunu açıklamaktadır.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">2. Toplanan Veriler</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li><strong className="text-white">Kimlik Bilgileri:</strong> Google ile giriş yaparken sağladığınız ad, soyad ve e-posta adresi.</li>
              <li><strong className="text-white">Kullanım Verileri:</strong> Oluşturduğunuz dilekçeler, sistem etkileşimleri ve tercihleriniz.</li>
              <li><strong className="text-white">Teknik Veriler:</strong> IP adresi, tarayıcı türü, cihaz bilgileri ve çerezler.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">3. Verilerin Kullanımı</h2>
            <p className="text-gray-300">Topladığımız verileri şu amaçlarla kullanıyoruz:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Hizmetlerimizi sağlamak ve kişiselleştirmek.</li>
              <li>Dilekçe ve belge oluşturma işlemlerini gerçekleştirmek.</li>
              <li>Yasal yükümlülükleri yerine getirmek.</li>
              <li>Hizmet kalitesini artırmak için analizler yapmak.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">4. Veri Güvenliği</h2>
            <p className="text-gray-300">
              Verileriniz, endüstri standardı güvenlik önlemleri (SSL şifreleme, güvenli sunucular) ile korunmaktadır. Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">5. Haklarınız</h2>
            <p className="text-gray-300">
              KVKK kapsamında verilerinize erişme, düzeltme, silme ve işlenmesini kısıtlama hakkına sahipsiniz. Talepleriniz için <Link to="/iletisim" className="text-indigo-400 hover:underline font-bold">iletişim sayfamızdan</Link> bize ulaşabilirsiniz.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">6. Değişiklikler</h2>
            <p className="text-gray-300">
              Bu politikayı zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda sizi bilgilendireceğiz.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/5 bg-[#0a0b14]/50 backdrop-blur-xl py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.1em] text-gray-500">
           <span>© 2025 yaverAI</span>
           <div className="flex gap-8">
                <Link to="/gizlilik-politikasi" className="hover:text-indigo-400 transition-colors">Gizlilik</Link>
                <Link to="/kullanim-sartlari" className="hover:text-indigo-400 transition-colors">Şartlar</Link>
                <Link to="/iletisim" className="hover:text-indigo-400 transition-colors">İletişim</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
