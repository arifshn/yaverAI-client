import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { calculateCost } from "../slices/creditSlice";
import type { CalculateCostRequest } from "../models/IUser";

interface CreditCheckResult {
  hasSufficientCredits: boolean;
  requiredCredits: number;
  currentCredits: number;
  missingCredits: number;
  costBreakdown: string;
}

export function useCreditCheck() {
  const dispatch = useAppDispatch();
  const { creditInfo } = useAppSelector((state) => state.credit);
  const { user } = useAppSelector((state) => state.account);
  const [checking, setChecking] = useState(false);

  const checkCredits = async (
    request: CalculateCostRequest
  ): Promise<CreditCheckResult | null> => {
    try {
      setChecking(true);
      const result = await dispatch(calculateCost(request)).unwrap();

      return {
        hasSufficientCredits: result.hasSufficientCredits,
        requiredCredits: result.estimatedCost,
        currentCredits: result.currentCredits,
        missingCredits: result.estimatedCost - result.currentCredits,
        costBreakdown: result.costBreakdown,
      };
    } catch (error) {
      console.error("Credit check failed:", error);
      return null;
    } finally {
      setChecking(false);
    }
  };

  const getCurrentCredits = () => {
    return creditInfo?.currentCredits ?? user?.credits ?? 0;
  };

  const hasCredits = (amount: number) => {
    return getCurrentCredits() >= amount;
  };

  return {
    checkCredits,
    getCurrentCredits,
    hasCredits,
    checking,
  };
}
