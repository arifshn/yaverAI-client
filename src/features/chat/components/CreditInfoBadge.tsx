import { useSelector } from "react-redux";
import { Coins, Crown } from "lucide-react";
import type { RootState } from "../../../store/store";

export default function CreditInfoBadge() {
  const { creditInfo } = useSelector((state: RootState) => state.credit);
  const { user } = useSelector((state: RootState) => state.account);

  // If user is premium, show premium badge
  if (user?.isPremium) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full backdrop-blur-md shadow-lg shadow-amber-500/10">
        <Crown className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-bold text-amber-100">Premium</span>
      </div>
    );
  }

  const currentCredits = creditInfo?.currentCredits ?? user?.credits ?? 0;
  const isLow = currentCredits < 50;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 ${
        isLow
          ? "bg-red-500/20 border-red-500/30 shadow-red-500/10"
          : "bg-indigo-500/20 border-indigo-500/30 shadow-indigo-500/10"
      }`}
    >
      <Coins
        className={`w-4 h-4 ${isLow ? "text-red-400" : "text-indigo-400"}`}
      />
      <span
        className={`text-xs font-bold ${
          isLow ? "text-red-100" : "text-indigo-100"
        }`}
      >
        {currentCredits} <span className="opacity-70 font-normal">Kredi</span>
      </span>
    </div>
  );
}
