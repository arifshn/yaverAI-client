import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Crown, FileText } from "lucide-react";
import { fetchPetitionLimit } from "../slices/petitionSlice";
import type { RootState, AppDispatch } from "../../../store/store";

export default function PetitionLimitBadge() {
  const dispatch = useDispatch<AppDispatch>();
  const { petitionLimit } = useSelector((state: RootState) => state.petition);

  useEffect(() => {
    dispatch(fetchPetitionLimit());
  }, [dispatch]);

  if (!petitionLimit) return null;

  if (petitionLimit.isUnlimited) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
        <Crown className="w-5 h-5 text-yellow-400" />
        <span className="text-sm font-medium text-yellow-400">
          Sınırsız Dilekçe
        </span>
      </div>
    );
  }

  const percentage =
    (petitionLimit.remainingPetitions / petitionLimit.maxPetitions) * 100;
  const isLow = percentage < 40;

  return (
    <div
      className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
        isLow
          ? "bg-red-500/20 border border-red-500/30"
          : "bg-blue-500/20 border border-blue-500/30"
      }`}
    >
      <FileText
        className={`w-5 h-5 ${isLow ? "text-red-400" : "text-blue-400"}`}
      />
      <div className="flex flex-col">
        <span
          className={`text-sm font-medium ${
            isLow ? "text-red-400" : "text-blue-400"
          }`}
        >
          {petitionLimit.remainingPetitions} / {petitionLimit.maxPetitions}{" "}
          Dilekçe Hakkı
        </span>
        <span className="text-xs text-slate-400">
          Sıfırlanma: {petitionLimit.resetDate}
        </span>
      </div>
    </div>
  );
}
