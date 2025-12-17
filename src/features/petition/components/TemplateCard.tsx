import {
  FileText,
  AlertCircle,
  Briefcase,
  Shield,
  ShoppingCart,
  ChevronRight,
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
      className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 hover:bg-slate-800/70 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Icon */}
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white group-hover:scale-110 transition-transform">
            {iconMap[template.icon] || <FileText className="w-8 h-8" />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {template.name}
            </h3>
            <p className="text-sm text-slate-400 mb-3 line-clamp-2">
              {template.description}
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span className="px-2 py-1 bg-slate-700/50 rounded-full">
                {template.category}
              </span>
              <span>•</span>
              <span>{template.fields.length} alan</span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
      </div>
    </div>
  );
}
