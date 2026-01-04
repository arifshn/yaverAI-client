import {
  AlertTriangle,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import type { DocumentAnalysisDto } from "../models/IDocument";

interface AnalysisResultProps {
  analysis: DocumentAnalysisDto;
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <div className="space-y-8 p-8">
      
      {/* Key Points */}
      {analysis.keyPoints && analysis.keyPoints.length > 0 && (
        <div className="glass-card p-6 border-blue-500/20 bg-blue-500/5 group hover:bg-blue-500/10 transition-colors">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 glass-card flex items-center justify-center border-blue-500/30 text-blue-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black text-white tracking-tight italic">
              Önemli <span className="text-blue-400">Noktalar</span>
            </h4>
          </div>
          <ul className="space-y-4">
            {analysis.keyPoints.map((point, index) => (
              <li
                key={index}
                className="flex items-start space-x-4 p-4 rounded-xl bg-[#0a0b14]/40 border border-white/5 hover:border-blue-500/30 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-500/30">
                  <span className="text-xs font-bold text-blue-400">
                    {index + 1}
                  </span>
                </div>
                <p className="text-gray-300 flex-1 leading-relaxed font-medium text-sm">{point}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {analysis.warnings && analysis.warnings.length > 0 && (
        <div className="glass-card p-6 border-red-500/20 bg-red-500/5 group hover:bg-red-500/10 transition-colors">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 glass-card flex items-center justify-center border-red-500/30 text-red-500 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black text-white tracking-tight italic">
              Riskli <span className="text-red-500">Alanlar</span>
            </h4>
          </div>
          <ul className="space-y-4">
            {analysis.warnings.map((warning, index) => (
              <li
                key={index}
                className="flex items-start space-x-4 p-4 rounded-xl bg-[#0a0b14]/40 border border-red-500/10 hover:border-red-500/30 transition-colors"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 flex-1 leading-relaxed font-medium text-sm">{warning}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="glass-card p-6 border-purple-500/20 bg-purple-500/5 group hover:bg-purple-500/10 transition-colors">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 glass-card flex items-center justify-center border-purple-500/30 text-purple-400 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black text-white tracking-tight italic">
              Yaver <span className="text-purple-400">Önerileri</span>
            </h4>
          </div>
          <ul className="space-y-4">
            {analysis.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start space-x-4 p-4 rounded-xl bg-[#0a0b14]/40 border border-purple-500/10 hover:border-purple-500/30 transition-colors"
              >
                <Lightbulb className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 flex-1 leading-relaxed font-medium text-sm">{suggestion}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="glass-card p-4 border-yellow-500/10 bg-yellow-500/5">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500/80 flex-shrink-0 mt-1" />
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-yellow-500/80 mb-2">
              Yasal Uyarı
            </h5>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Bu analiz yapay zeka tarafından oluşturulmuştur ve hukuki tavsiye niteliği taşımaz. 
              Karar almadan önce mutlaka bir hukuk uzmanına danışmanız önerilir, Yaver süreçlerden sorumlu tutulamaz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
