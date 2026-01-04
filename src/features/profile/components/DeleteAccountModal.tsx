import { X, AlertTriangle, Trash2 } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: DeleteAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity" style={{ zIndex: 9999 }}>
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-[340px] md:max-w-md bg-[#0a0b14] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10 z-10 disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center gap-6 mb-2">
             <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                <AlertTriangle className="w-10 h-10 text-red-500" />
             </div>
             <div>
                <h3 className="text-2xl font-black text-white leading-tight mb-3">Hesap <span className="text-red-500">Silme</span></h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  Hesabınızı silmek üzeresiniz. Bu işlem <span className="text-red-400 font-bold">geri alınamaz</span> ve tüm verileriniz (abonelikler, dilekçeler, krediler) kalıcı olarak silinecektir.
                </p>
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex flex-col-reverse md:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                <>
                    <Trash2 className="w-4 h-4" />
                    Evet, Hesabımı Sil
                </>
            )}
            
          </button>
        </div>
      </div>
    </div>
  );
}
