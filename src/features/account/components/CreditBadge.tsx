import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { fetchCreditInfo } from "../slices/creditSlice";
import { Coins, Sparkles } from "lucide-react";

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
      <div className="h-9 w-24 bg-white/5 rounded-full animate-pulse" />
    );
  }

  const credits = creditInfo?.currentCredits ?? user.credits ?? 0;
  const isPremium = user.isPremium;

  return (
    <div className={`
      relative group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
      ${isPremium 
        ? "bg-gradient-to-r from-amber-500/10 to-orange-600/10 border-amber-500/20 hover:border-amber-500/40" 
        : "bg-white/5 border-white/10 hover:border-indigo-500/30 hover:bg-white/10"
      }
    `}>
      {/* Glow Effect */}
      {isPremium && (
        <div className="absolute inset-0 bg-amber-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div className={`
        relative z-10 flex items-center justify-center w-5 h-5 rounded-full
        ${isPremium ? "bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/20" : "bg-indigo-500/20 text-indigo-400"}
      `}>
         {isPremium ? <Sparkles className="w-3 h-3 text-white" /> : <Coins className="w-3 h-3" />}
      </div>

      <div className="relative z-10 flex flex-col leading-none">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${isPremium ? "text-amber-500" : "text-gray-400"}`}>
            {isPremium ? 'Premium' : 'Kredi'}
        </span>
        <span className={`text-sm font-black tracking-tight ${isPremium ? "text-white" : "text-white"}`}>
            {credits}
        </span>
      </div>
    </div>
  );
}
