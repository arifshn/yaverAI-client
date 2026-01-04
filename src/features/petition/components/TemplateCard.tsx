import {
  FileText,
  AlertCircle,
  Briefcase,
  Shield,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import type { PetitionTemplateDto } from "../models/IPetition";

interface TemplateCardProps {
  template: PetitionTemplateDto;
  onClick: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-8 h-8" />,
  AlertCircle: <AlertCircle className="w-8 h-8" />,
  Briefcase: <Briefcase className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  ShoppingCart: <ShoppingCart className="w-8 h-8" />,
};

export default function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#1c1d2e]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Hover Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-purple-600 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/25">
             {iconMap[template.icon] || <FileText className="w-6 h-6" />}
          </div>
          <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs font-medium text-gray-400 group-hover:border-purple-500/30 group-hover:text-purple-300 transition-colors">
            {template.category}
          </span>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
            {template.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mb-4 group-hover:text-gray-300 transition-colors">
            {template.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-xs text-gray-500">
            {template.fields.length} alan
          </span>
          
          <div className="flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
            Oluştur
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
