import { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle, Shield, FileText, CreditCard, Zap, Activity } from "lucide-react";

const faqs = [
  {
    category: "Genel",
    icon: <HelpCircle className="w-5 h-5 text-indigo-400" />,
    question: "YaverAI hukuk danışmanlığı mı veriyor?",
    answer: "Hayır, YaverAI bir hukuk bürosu veya avukat değildir. Yapay zeka teknolojisi ile hukuki süreçlerinizde size rehberlik eder, taslak belgeler oluşturur ve karmaşık metinleri analiz etmenize yardımcı olur. Nihai hukuki tavsiye ve işlemleriniz için her zaman bir avukata danışmanız önerilir."
  },
  {
    category: "Dilekçe",
    icon: <FileText className="w-5 h-5 text-purple-400" />,
    question: "Oluşturulan dilekçeler resmi kurumlarda geçerli midir?",
    answer: "Evet, YaverAI tarafından oluşturulan dilekçeler, ilgili kurumların (Mahkemeler, Belediyeler, vb.) kabul ettiği genel formatlara ve usullere uygun olarak hazırlanır. Ancak, her dava veya durum kendine has özellikler taşıyabilir, bu yüzden dilekçenizi teslim etmeden önce gözden geçirmeniz (veya bir uzmana inceletmeniz) faydalı olacaktır."
  },
  {
    category: "Analiz",
    icon: <Activity className="w-5 h-5 text-pink-400" />,
    question: "Belge analizi özelliği ne kadar güvenilir?",
    answer: "YaverAI, yüklediğiniz sözleşme veya belgeleri gelişmiş doğal dil işleme modelleriyle tarar. Size önemli tarihleri, potansiyel riskleri ve kritik maddeleri özetler. Bu analiz %100 doğruluk garantisi vermez ancak insan gözünden kaçabilecek detayları yakalamanızda büyük kolaylık sağlar."
  },
  {
    category: "Güvenlik",
    icon: <Shield className="w-5 h-5 text-emerald-400" />,
    question: "Verilerim ve yüklediğim belgeler güvende mi?",
    answer: "Kesinlikle. Yüklediğiniz belgeler ve kişisel verileriniz, endüstri standardı şifreleme yöntemleriyle korunur. Belgeleriniz analiz süreci haricinde üçüncü taraflarla paylaşılmaz ve izniniz olmadan kullanılmaz."
  },
  {
    category: "Ödeme",
    icon: <CreditCard className="w-5 h-5 text-amber-400" />,
    question: "Kredi sistemi nasıl çalışıyor?",
    answer: "Uygulama içerisindeki her işlem (Dilekçe oluşturma, belge analizi, rehber sohbeti) belirli bir kredi maliyetine sahiptir. Ücretsiz planda sınırlı, Premium planda ise her ay yenilenen geniş bir kredi havuzunuz olur. Ayrıca ihtiyacınıza göre ek kredi paketleri satın alabilirsiniz."
  },
  {
    category: "Abonelik",
    icon: <Zap className="w-5 h-5 text-cyan-400" />,
    question: "Aboneliğimi istediğim zaman iptal edebilir miyim?",
    answer: "Evet, Premium aboneliğinizi profil sayfanız üzerinden dilediğiniz zaman iptal edebilirsiniz. İptal işlemi sonrasında, mevcut fatura döneminizin sonuna kadar Premium özelliklerden yararlanmaya devam edersiniz."
  },
  {
    category: "Ödeme",
    icon: <CreditCard className="w-5 h-5 text-amber-400" />,
    question: "Kullanmadığım krediler bir sonraki aya devreder mi?",
    answer: "Abonelik kapsamında verilen aylık yenilenen krediler (ör. Premium 1500 kredi) bir sonraki aya devretmez, her ay başında yenilenir. Ancak, paket olarak (ör. 500 Kredi Paketi) satın aldığınız ek krediler süresizdir ve hesabınızda kalır."
  },
  {
    category: "Kullanım",
    icon: <MessageCircle className="w-5 h-5 text-blue-400" />,
    question: "Telefondan veya tabletten kullanabilir miyim?",
    answer: "Evet, YaverAI tüm mobil cihazlarla tam uyumludur. İster telefonunuzdan ister tabletinizden web tarayıcısı üzerinden tüm özelliklere (dilekçe, analiz, sohbet) erişebilirsiniz."
  },
  {
    category: "Dilekçe",
    icon: <FileText className="w-5 h-5 text-purple-400" />,
    question: "Oluşturduğum dilekçeyi sonradan düzenleyebilir miyim?",
    answer: "Evet, oluşturduğunuz dilekçeler arşivinize kaydedilir. 'Dilekçe Arşivim' sayfasından dilediğiniz zaman belgenize ulaşabilir, üzerinde değişiklik yapabilir ve tekrar indirebilirsiniz."
  },
  {
    category: "Genel",
    icon: <HelpCircle className="w-5 h-5 text-indigo-400" />,
    question: "Ücretsiz olarak neleri yapabilirim?",
    answer: "Standart (Ücretsiz) planımızla Yaver Rehber ile temel süreçleri öğrenebilir ve sınırlı sayıda sohbet gerçekleştirebilirsiniz. Dilekçe oluşturma ve detaylı belge analizi gibi özellikler için Premium üyelik veya kredi gereklidir."
  },
  {
    category: "Abonelik",
    icon: <Zap className="w-5 h-5 text-cyan-400" />,
    question: "Kurumsal üyelik veya çoklu kullanım var mı?",
    answer: "Şu an için bireysel kullanıcılara odaklanıyoruz. Ancak avukatlık büroları veya şirketler için özel API ve toplu kullanım çözümlerimiz üzerinde çalışıyoruz. Detaylı bilgi için bizimle iletişime geçebilirsiniz."
  },
  {
    category: "Destek",
    icon: <MessageCircle className="w-5 h-5 text-blue-400" />,
    question: "Bir sorunla karşılaşırsam ne yapmalıyım?",
    answer: "Herhangi bir teknik sorun veya sorunuz için iletişim sayfamızdan, 'destek@yaverapp.com.tr' adresinden veya uygulama içi geri bildirim formundan bize ulaşabilirsiniz. Ekibimiz en kısa sürede dönüş yapacaktır."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative overflow-hidden" id="faq">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 italic">
              Akıldaki <span className="text-gradient-vibrant">Sorular</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
              YaverAI hakkında merak ettiğiniz her şeyi burada bulabilirsiniz. Şeffaf, net ve anlaşılır.
            </p>
        </div>

        <div className="space-y-4">
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
                className="w-full text-left p-5 md:p-6 flex items-start md:items-center gap-4"
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
      </div>
    </section>
  );
}
