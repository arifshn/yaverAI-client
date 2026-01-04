import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { fetchCreditInfo } from "../slices/creditSlice";
import { Coins, Sparkles, Plus } from "lucide-react";

export default function CreditBadge() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);
  const { creditInfo, loading } = useAppSelector((state) => state.credit);

  useEffect(() => {
    if (user) {
      dispatch(fetchCreditInfo());
    }
  }, [dispatch, user]);

  if (!user || loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg animate-pulse">
        <div className="w-4 h-4 bg-gray-300 rounded-full" />
        <div className="w-12 h-4 bg-gray-300 rounded" />
      </div>
    );
  }

  const credits = creditInfo?.currentCredits ?? user.credits ?? 0;
  const isPremium = user.isPremium;

  // Premium kullanıcılar için günlük kredi hesaplama (basitleştirilmiş)
  // Gerçek hesaplama backend'de yapılıyor, burada sadece gösterim için
  const dailyCredits = isPremium ? Math.min(credits, 20) : credits;
  const extraCredits = isPremium && credits > 20 ? credits - 20 : 0;

  // Kredi durumuna göre renk
  const getColorClass = () => {
    if (isPremium)
      return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
    if (credits <= 5) return "bg-red-100 text-red-700 border border-red-300";
    if (credits <= 10)
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    return "bg-blue-100 text-blue-700 border border-blue-300";
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${getColorClass()}`}
      title={isPremium && extraCredits > 0 ? `Günlük: ${dailyCredits} | Ek: ${extraCredits}` : undefined}
    >
      {isPremium ? (
        <Sparkles className="w-4 h-4" />
      ) : (
        <Coins className="w-4 h-4" />
      )}
      <span className="text-sm font-semibold">{credits}</span>
      <span className="text-xs opacity-80">Kredi</span>
      {isPremium && (
        <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-white/20 rounded text-white font-bold">
          PRO
        </span>
      )}
      {isPremium && extraCredits > 0 && (
        <span className="ml-1 flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-white/30 rounded text-white font-bold">
          <Plus className="w-2.5 h-2.5" />
          {extraCredits}
        </span>
      )}
    </div>
  );
}
