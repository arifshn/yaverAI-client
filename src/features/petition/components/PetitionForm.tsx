import { useState } from "react";
import { Send, AlertCircle, ChevronDown, Calendar, AlignLeft, Type } from "lucide-react";
import type { PetitionTemplateDto } from "../models/IPetition";

interface PetitionFormProps {
  template: PetitionTemplateDto;
  onSubmit: (formData: Record<string, string>) => void;
  isSubmitting: boolean;
}

export default function PetitionForm({
  template,
  onSubmit,
  isSubmitting,
}: PetitionFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (fieldName: string, value: string) => {
    setFormData({ ...formData, [fieldName]: value });
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    template.fields.forEach((field) => {
      if (field.isRequired && !formData[field.fieldName]?.trim()) {
        newErrors[field.fieldName] = `${field.label} alanı zorunludur`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: any) => {
    const commonClasses =
      "w-full px-5 py-4 bg-[#13141f] border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transition-all font-medium text-[15px]";

    const errorClasses = errors[field.fieldName]
      ? "border-red-500/50 focus:border-red-500"
      : "border-white/10 focus:border-slate-500";

    switch (field.fieldType) {
      case "textarea":
        return (
          <div className="relative group">
            <textarea
              value={formData[field.fieldName] || ""}
              onChange={(e) => handleChange(field.fieldName, e.target.value)}
              placeholder={field.placeholder}
              rows={5}
              className={`${commonClasses} ${errorClasses} resize-none pl-12`}
            />
            <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
          </div>
        );

      case "date":
        return (
          <div className="relative group">
            <input
              type="date"
              value={formData[field.fieldName] || ""}
              onChange={(e) => handleChange(field.fieldName, e.target.value)}
              className={`${commonClasses} ${errorClasses} pl-12`}
            />
             <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
          </div>
        );

      case "select":
        return (
          <div className="relative group">
            <select
              value={formData[field.fieldName] || ""}
              onChange={(e) => handleChange(field.fieldName, e.target.value)}
              className={`${commonClasses} ${errorClasses} appearance-none pl-12 cursor-pointer`}
            >
              <option value="">Seçiniz</option>
              {field.options?.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none group-focus-within:text-purple-400 transition-colors" />
            <AlignLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
          </div>
        );

      default:
        return (
          <div className="relative group">
            <input
              type="text"
              value={formData[field.fieldName] || ""}
              onChange={(e) => handleChange(field.fieldName, e.target.value)}
              placeholder={field.placeholder}
              className={`${commonClasses} ${errorClasses} pl-12`}
            />
            <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        {template.fields.map((field) => (
            <div key={field.id} className="animate-fade-in-up">
            <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
                {field.label}
                {field.isRequired && <span className="text-red-400 ml-1">*</span>}
            </label>
            {renderField(field)}
            {errors[field.fieldName] && (
                <div className="mt-2 flex items-center space-x-2 text-red-400 text-xs font-medium ml-1 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors[field.fieldName]}</span>
                </div>
            )}
            </div>
        ))}
      </div>

      <div className="pt-8 border-t border-white/5">
        <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
             <span className="text-red-400">*</span> Zorunlu alanları doldurunuz.
            </p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Oluşturuluyor...</span>
            </>
          ) : (
            <>
              <span>Dilekçe Oluştur</span>
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
