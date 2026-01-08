import Seo from "../components/Seo";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsPage() {

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white overflow-hidden font-sans">
      <Seo
        title="Kullanım Şartları"
        description="Yaver AI Kullanım Şartları ve Hizmet Sözleşmesi. Hizmet kullanım koşulları hakkında detaylı bilgi."
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

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 mb-20">
         {/* Title Section */}
        <div className="text-center mb-12 animate-fade-in-up">
           <h1 className="page-title">
              Kullanım <span className="text-gradient-vibrant">Şartları</span>
           </h1>
           <p className="page-subtitle max-w-xl mx-auto">
             Platform kullanımı ile ilgili yasal çerçeve ve sorumlulukla ilgili detaylı bilgiler.
           </p>
        </div>

        <div className="glass-card p-8 md:p-12 space-y-8 text-sm md:text-base leading-relaxed animate-fade-in-up animation-delay-200">
          <p className="text-gray-400 font-medium">Son Güncelleme: 03.01.2026</p>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              1. Hizmetin Kabulü
            </h2>
            <p className="text-gray-300">
              Yaver AI hizmetlerini kullanarak, bu Kullanım Şartlarını ve
              Gizlilik Politikamızı kabul etmiş sayılırsınız. Eğer bu şartları
              kabul etmiyorsanız, lütfen hizmetlerimizi kullanmayınız.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              2. Hizmetin Niteliği
            </h2>
            <p className="text-gray-300">
              Yaver AI, yapay zeka destekli bir e-dilekçe ve hukuki rehberlik
              asistanıdır.{" "}
              <strong className="text-white">Hizmetlerimiz hukuki tavsiye niteliği taşımaz.</strong>{" "}
              Üretilen tüm belgeler taslak niteliğindedir ve resmi kullanımdan
              önce bir hukuk uzmanı tarafından gözden geçirilmesi önerilir.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              3. Kullanıcı Sorumlulukları
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Hesap güvenliğinizi sağlamak sizin sorumluluğunuzdadır.</li>
              <li>Hizmeti yasa dışı amaçlarla kullanamazsınız.</li>
              <li>
                Sisteme zarar verecek yazılım veya işlemlerden kaçınmalısınız.
              </li>
              <li>Girdiğiniz verilerin doğruluğundan siz sorumlusunuz.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              4. Fikri Mülkiyet
            </h2>
            <p className="text-gray-300">
              Yaver AI arayüzü, yazılımı ve markası Platform sağlayıcısına
              aittir. İzinsiz kopyalanması veya ticari amaçla çoğaltılması
              yasaktır. Ancak, oluşturduğunuz dilekçelerin içeriği üzerindeki
              haklar size aittir.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              5. Sorumluluk Reddi
            </h2>
            <p className="text-gray-300">
              Yaver AI, üretilen belgelerin hukuki sonuçlarından sorumlu
              tutulamaz. Yazılımımız "olduğu gibi" sunulmaktadır ve kesintisiz
              veya hatasız çalışacağı garantisi verilmemektedir.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              6. Abonelik ve İptal
            </h2>
            <p className="text-gray-300">
              Premium üyelikler, belirtilen periyotlarda yenilenir.
              Aboneliğinizi dilediğiniz zaman panel üzerinden iptal
              edebilirsiniz.
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
