import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { fetchTransactions } from "../slices/creditSlice";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ensureUtc } from "../../../utils/date";

export default function CreditTransactionList() {
  const dispatch = useAppDispatch();
  const { transactions, loading } = useAppSelector((state) => state.credit);

  useEffect(() => {
    dispatch(fetchTransactions({ page: 1, pageSize: 20 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!transactions || transactions.transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Henüz işlem geçmişi yok</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "dailyreset":
      case "monthlygrant":
      case "purchase":
      case "admingrant":
      case "refund":
        return <ArrowUpCircle className="w-5 h-5 text-green-600" />;
      case "chatusage":
      case "petitionusage":
      case "documentusage":
        return <ArrowDownCircle className="w-5 h-5 text-red-600" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      dailyreset: "Günlük Yenileme",
      monthlygrant: "Aylık Premium",
      purchase: "Kredi Satın Alma",
      chatusage: "Chat Kullanımı",
      petitionusage: "Dilekçe Oluşturma",
      documentusage: "Dosya Analizi",
      admingrant: "Admin Hediyesi",
      refund: "İade",
    };
    return typeMap[type.toLowerCase()] || type;
  };

  return (
    <div className="space-y-3">
      {transactions.transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              {getIcon(transaction.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">
                    {getTypeText(transaction.type)}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                    {transaction.description}
                  </p>
                </div>
                <span
                  className={`font-bold text-lg whitespace-nowrap ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount}
                </span>
              </div>
                <p className="text-xs text-gray-400 mt-2">
                {format(ensureUtc(transaction.createdAt), "d MMMM yyyy, HH:mm", {
                  locale: tr,
                })}
                </p>
            </div>
          </div>
        </div>
      ))}

      {transactions.hasNextPage && (
        <button
          onClick={() =>
            dispatch(
              fetchTransactions({
                page: transactions.currentPage + 1,
                pageSize: transactions.pageSize,
              })
            )
          }
          className="w-full py-2.5 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          Daha fazla göster
        </button>
      )}
    </div>
  );
}
