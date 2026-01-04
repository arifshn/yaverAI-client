import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Crown } from "lucide-react";
import { fetchPetitionLimit } from "../slices/petitionSlice";
import type { RootState, AppDispatch } from "../../../store/store";

export default function PetitionLimitBadge() {
  const dispatch = useDispatch<AppDispatch>();
  const { petitionLimit } = useSelector((state: RootState) => state.petition);

  useEffect(() => {
    dispatch(fetchPetitionLimit());
  }, [dispatch]);

  if (!petitionLimit || !petitionLimit.isUnlimited) return null;

  return (
    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full shadow-lg shadow-yellow-500/5 backdrop-blur-sm">
      <Crown className="w-5 h-5 text-yellow-400 animate-pulse" />
      <span className="text-sm font-semibold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
        Premium Üye
      </span>
    </div>
  );
}
