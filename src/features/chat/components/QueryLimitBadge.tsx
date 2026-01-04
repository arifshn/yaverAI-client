import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Crown, Zap } from "lucide-react";
import { fetchQueryLimit } from "../slices/chatSlice";
import type { RootState, AppDispatch } from "../../../store/store";

export default function QueryLimitBadge() {
  const dispatch = useDispatch<AppDispatch>();
  const { queryLimit } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    dispatch(fetchQueryLimit());
  }, [dispatch]);

  if (!queryLimit) return null;

  if (queryLimit.isUnlimited) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
        <Crown className="w-5 h-5 text-yellow-400" />
        <span className="text-sm font-medium text-yellow-400">
          Premium - Sınırsız
        </span>
      </div>
    );
  }

  const percentage =
    (queryLimit.remainingQueries / queryLimit.maxQueries) * 100;
  const isLow = percentage < 30;

  return (
    <div
      className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
        isLow
          ? "bg-red-500/20 border border-red-500/30"
          : "bg-blue-500/20 border border-blue-500/30"
      }`}
    >
      <Zap className={`w-5 h-5 ${isLow ? "text-red-400" : "text-blue-400"}`} />
      <div className="flex flex-col">
        <span
          className={`text-sm font-medium ${
            isLow ? "text-red-400" : "text-blue-400"
          }`}
        >
          {queryLimit.remainingQueries} / {queryLimit.maxQueries} Sorgu Hakkı
        </span>
        {isLow && (
          <span className="text-xs text-red-300">
            Premium'a geçerek sınırsız kullanın
          </span>
        )}
      </div>
    </div>
  );
}
