import { X, Coins, Sparkles, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InsufficientCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits: number;
  currentCredits: number;
  missingCredits: number;
  actionName: string; // "mesaj göndermek", "dilekçe oluşturmak", "dosya analiz etmek"
}

export default function InsufficientCreditModal({
  isOpen,
  onClose,
  requiredCredits,
  currentCredits,
  missingCredits,
}: InsufficientCreditModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate("/paketler"); // Premium satın alma sayfasına yönlendir
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" style={{ zIndex: 9999 }}>
      {/* 
          Mobile: max-w-[340px] prevents it from touching edges on small screens.
          Desktop: max-w-md standard width.
      */}
      <div className="relative w-full max-w-[340px] md:max-w-md bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-5 md:p-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-2">
             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
             </div>
             <div>
                <h3 className="text-lg font-black text-gray-900 leading-tight">Yetersiz Kredi</h3>
                <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed">
                  Bu işlem için <span className="text-red-600 font-bold">{missingCredits} kredi</span> daha gerekiyor.
                </p>
             </div>
          </div>

          {/* Desktop Detailed View (Hidden on Mobile) */}
          <div className="hidden md:block mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Mevcut / Gerekli</span>
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <Coins className="w-4 h-4 text-gray-400" />
                  <span>{currentCredits} / {requiredCredits}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 md:p-6 pt-0 flex flex-col-reverse md:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-bold text-sm transition-colors"
          >
            Vazgeç
          </button>
          <button
            onClick={handleUpgrade}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Premium'a Geç
          </button>
        </div>
      </div>
    </div>
  );
}
