import {
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  FileText,
  Calendar,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import type { DocumentAnalysisDto } from "../models/IDocument";

interface AnalysisResultProps {
  analysis: DocumentAnalysisDto;
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  const getRiskColor = (score: number) => {
    if (score <= 3)
      return {
        bg: "bg-green-500/20",
        border: "border-green-500/30",
        text: "text-green-400",
        icon: CheckCircle,
      };
    if (score <= 6)
      return {
        bg: "bg-yellow-500/20",
        border: "border-yellow-500/30",
        text: "text-yellow-400",
        icon: AlertTriangle,
      };
    return {
      bg: "bg-red-500/20",
      border: "border-red-500/30",
      text: "text-red-400",
      icon: AlertTriangle,
    };
  };

  const getRiskLabel = (score: number) => {
    if (score <= 3) return "Düşük Risk";
    if (score <= 6) return "Orta Risk";
    return "Yüksek Risk";
  };

  const riskColor = getRiskColor(analysis.riskScore);
  const RiskIcon = riskColor.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {analysis.originalFileName}
              </h3>
              <div className="flex items-center space-x-3 text-sm text-slate-400">
                <span className="px-2 py-1 bg-slate-700/50 rounded-full">
                  {analysis.documentType === "contract" && "Sözleşme"}
                  {analysis.documentType === "invoice" && "Fatura"}
                  {analysis.documentType === "agreement" && "Anlaşma"}
                </span>
                <span>•</span>
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDistanceToNow(new Date(analysis.createdAt), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Score Badge */}
          <div
            className={`flex items-center space-x-2 px-4 py-2 ${riskColor.bg} border ${riskColor.border} rounded-full`}
          >
            <RiskIcon className={`w-5 h-5 ${riskColor.text}`} />
            <div className="text-right">
              <p className={`text-sm font-bold ${riskColor.text}`}>
                {getRiskLabel(analysis.riskScore)}
              </p>
              <p className="text-xs text-slate-400">{analysis.riskScore}/10</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-slate-900/50 rounded-lg p-4">
          <p className="text-slate-300 leading-relaxed">
            {analysis.analysisSummary}
          </p>
        </div>
      </div>

      {/* Risk Progress Bar */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-white">Risk Seviyesi</h4>
          <span className={`font-bold ${riskColor.text}`}>
            {analysis.riskScore}/10
          </span>
        </div>
        <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              analysis.riskScore <= 3
                ? "bg-gradient-to-r from-green-500 to-green-400"
                : analysis.riskScore <= 6
                ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                : "bg-gradient-to-r from-red-500 to-red-400"
            }`}
            style={{ width: `${(analysis.riskScore / 10) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>Güvenli</span>
          <span>Riskli</span>
        </div>
      </div>

      {/* Key Points */}
      {analysis.keyPoints && analysis.keyPoints.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="font-semibold text-white text-lg">
              Önemli Noktalar
            </h4>
          </div>
          <ul className="space-y-3">
            {analysis.keyPoints.map((point, index) => (
              <li
                key={index}
                className="flex items-start space-x-3 p-3 bg-slate-900/50 rounded-lg"
              >
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <p className="text-slate-300 flex-1">{point}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {analysis.warnings && analysis.warnings.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h4 className="font-semibold text-white text-lg">
              Dikkat Edilmesi Gerekenler
            </h4>
          </div>
          <ul className="space-y-3">
            {analysis.warnings.map((warning, index) => (
              <li
                key={index}
                className="flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300 flex-1">{warning}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="font-semibold text-white text-lg">Öneriler</h4>
          </div>
          <ul className="space-y-3">
            {analysis.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start space-x-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg"
              >
                <Lightbulb className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300 flex-1">{suggestion}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-sm font-semibold text-yellow-400 mb-1">
              Önemli Uyarı
            </h5>
            <p className="text-sm text-slate-300">
              Bu analiz AI tarafından yapılmıştır ve bilgilendirme amaçlıdır.
              Hukuki işlem yapmadan önce mutlaka bir avukata danışmanız
              önerilir. Yaver AI, bu analiz sonucunda alınacak kararlardan
              sorumlu değildir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
