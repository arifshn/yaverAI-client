import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle, MessageCircle, Shield, FileText, CreditCard, Zap, Activity, ArrowLeft } from "lucide-react";
import Seo from "../components/Seo";
import PageBackground from "../components/PageBackground";

const faqs = [
  {
    category: "Yasal Uyarı",
    icon: <Shield className="w-5 h-5 text-red-400" />,
    question: "YaverAI bir hukuk danışmanı veya avukat mıdır?",
    answer: "Hayır. YaverAI, yapay zeka destekli bir 'Dilekçe ve Metin Oluşturma Asistanı'dır. Sunduğu hiçbir içerik hukuki tavsiye niteliği taşımaz. YaverAI sadece taslak metinler oluşturmanıza ve belgelerinizi düzenlemenize yardımcı olur. Hukuki sonuç doğuracak işlemleriniz için mutlaka bir uzmana danışmalısınız."
  },
  {
    category: "Dilekçe",
    icon: <FileText className="w-5 h-5 text-purple-400" />,
    question: "Oluşturulan belgeler resmi formatlara uygun mu?",
    answer: "YaverAI, dilekçelerinizi genel kabul görmüş resmi yazışma kurallarına, hitap şekillerine ve şablonlara sadık kalarak hazırlar. Ancak her kurumun veya durumun kendine has gereklilikleri olabilir. Bu nedenle oluşturulan taslağı kullanmadan önce dikkatlice okumanız ve gerekiyorsa düzenlemeniz önerilir."
  },
  {
    category: "Analiz",
    icon: <Activity className="w-5 h-5 text-pink-400" />,
    question: "Belge analizi özelliği bir hukuki inceleme midir?",
    answer: "Hayır. Belge analizi, yüklediğiniz metinlerdeki önemli tarihleri, tutarları ve dikkat çeken ifadeleri yapay zeka ile özetleyen bir araçtır. Bu özellik, karmaşık metinleri daha hızlı taramanız için geliştirilmiştir ve bir hukukçu incelemesinin yerini tutmaz."
  },
  {
    category: "Güvenlik",
    icon: <Shield className="w-5 h-5 text-emerald-400" />,
    question: "Yüklediğim belgeler başkalarıyla paylaşılıyor mu?",
    answer: "Kesinlikle hayır. Yüklediğiniz belgeler ve girdiğiniz bilgiler, endüstri standardı şifreleme ile korunur. Belgeleriniz sadece analiz işlemi sırasında işlenir ve izniniz olmadan asla üçüncü şahıslarla veya kurumlarla paylaşılmaz."
  },
  {
    category: "Ödeme",
    icon: <CreditCard className="w-5 h-5 text-amber-400" />,
    question: "Kredi sistemi ve geçerlilik süresi nasıl çalışıyor?",
    answer: "Sistemimizde iki tür kredi cüzdanı bulunur: 1) Günlük/Abonelik Kredileri: Ücretsiz planda her gün yenilenir, Premium'da birikir. 2) Ek Krediler: Satın aldığınız paketler buraya eklenir ve ASLA silinmez. Harcamalarınızda sistem öncelikle günlük kredilerinizi kullanır, böylece satın aldığınız krediler her zaman güvende kalır."
  },
  {
    category: "Abonelik",
    icon: <Zap className="w-5 h-5 text-cyan-400" />,
    question: "Aboneliğimi iptal edersem kredilerim silinir mi?",
    answer: "Hayır. Satın aldığınız ek kredi paketleri 'Ek Kredi Cüzdanınızda' tutulur ve abonelik durumunuzdan tamamen bağımsızdır; ömür boyu hesabınızda kalır. Sadece abonelik kapsamında verilen ve kullanılmayan aylık/günlük krediler, abonelik sonlandığında sıfırlanabilir."
  },
  {
    category: "Kullanım",
    icon: <MessageCircle className="w-5 h-5 text-blue-400" />,
    question: "Uygulamayı telefondan kullanabilir miyim?",
    answer: "Evet, YaverAI tüm mobil cihazlar ve tabletlerle tam uyumludur. Herhangi bir uygulama indirmeden, telefonunuzun tarayıcısı üzerinden dilekçe oluşturabilir, belgelerinizi görüntüleyebilir ve indirebilirsiniz."
  },
  {
    category: "Dilekçe",
    icon: <FileText className="w-5 h-5 text-purple-400" />,
    question: "Dilekçemi oluşturduktan sonra üzerinde değişiklik yapabilir miyim?",
    answer: "Hayır. Şu an için oluşturulan dilekçeler üzerinde sistem üzerinden sonradan düzenleme yapılamamaktadır. Ancak oluşturduğunuz tüm dilekçeler 'Dilekçe Arşivim' bölümünde saklanır. Buradan dilekçenizi görüntüleyebilir, indirebilir veya silebilirsiniz."
  },
  {
    category: "Destek",
    icon: <HelpCircle className="w-5 h-5 text-indigo-400" />,
    question: "Teknik bir sorun yaşarsam ne yapmalıyım?",
    answer: "Herhangi bir sorunla karşılaşırsanız veya öneriniz varsa, 'İletişim' sayfasındaki formu doldurabilir veya doğrudan destek@yaverapp.com.tr adresine e-posta gönderebilirsiniz. Destek ekibimiz en kısa sürede size dönüş yapacaktır."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white overflow-x-hidden flex flex-col">
      <Seo 
        title="Sıkça Sorulan Sorular - YaverAI" 
        description="YaverAI hakkında merak edilenler, ödeme, abonelik, güvenlik ve kullanım detayları."
      />
      
      <PageBackground />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-50">
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

      <main className="flex-grow py-20 relative z-10 px-6">
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-16 animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 italic">
                Sıkça Sorulan <span className="text-gradient-vibrant">Sorular</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                   Aklınızdaki tüm soru işaretlerini gidermek için buradayız.
                </p>
            </div>

            <div className="space-y-4 animate-fade-in-up animation-delay-200">
            {faqs.map((faq, index) => (
                <div 
                key={index}
                className={`group rounded-2xl border transition-all duration-300 ${
                    openIndex === index 
                    ? "bg-white/[0.04] border-indigo-500/30 shadow-lg shadow-indigo-500/10" 
                    : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.03]"
                }`}
                >
                <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-6 flex items-start md:items-center gap-4"
                >
                    <div className={`p-2 rounded-xl transition-colors ${openIndex === index ? "bg-white/10" : "bg-white/5"} shrink-0`}>
                    {faq.icon}
                    </div>
                    
                    <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{faq.category}</span>
                    </div>
                    <h3 className={`font-bold text-base md:text-lg transition-colors ${openIndex === index ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                        {faq.question}
                    </h3>
                    </div>

                    <div className={`p-1 rounded-full border border-white/10 transition-transform duration-300 ${openIndex === index ? "rotate-180 bg-white/10" : ""}`}>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                </button>

                <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="p-6 pt-0 pl-[4.5rem] pr-6 md:pr-12">
                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                        {faq.answer}
                    </p>
                    </div>
                </div>
                </div>
            ))}
            </div>

            <div className="mt-20 text-center animate-fade-in-up animation-delay-400">
                <p className="text-gray-400 font-medium mb-6">Aradığınız cevabı bulamadınız mı?</p>
                <Link to="/iletisim" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all hover:scale-105">
                    <MessageCircle className="w-5 h-5" />
                    <span>Bize Ulaşın</span>
                </Link>
            </div>
        </div>
      </main>

      {/* Footer (Simplified) */}
      <footer className="relative border-t border-white/5 bg-[#0a0b14]/50 backdrop-blur-xl py-8">
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
