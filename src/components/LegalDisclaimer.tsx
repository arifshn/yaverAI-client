import { ShieldAlert } from "lucide-react";

export default function LegalDisclaimer() {
  return (
    <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5 mx-2">
      <div className="flex gap-3">
        <ShieldAlert className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Yasal Uyarı</p>
          <p className="legal-text">
            Yaver AI bir avukat veya hukuk bürosu değildir. Üretilen tüm belgeler ve rehberlik içerikleri, verdiğiniz bilgiler doğrultusunda oluşturulan <span className="text-gray-400 font-bold">otomatik taslaklardır</span> ve hukuki tavsiye yerine geçmez. 
            <br/><br/>
            Resmi makamlara başvurularınızı <span className="text-gray-400 font-bold">şahsen veya yetkili vekiliniz aracılığıyla</span> yapmanız gerekmektedir.
          </p>
        </div>
      </div>
    </div>
  );
}
