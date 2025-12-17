import { useState } from "react";
import { Send, AlertCircle } from "lucide-react";
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
        newErrors[field.fieldName] = `${field.label} zorunludur`;
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
      "w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

    const errorClasses = errors[field.fieldName]
      ? "border-red-500"
      : "border-slate-700";

    switch (field.fieldType) {
      case "textarea":
        return (
          <textarea
            value={formData[field.fieldName] || ""}
            onChange={(e) => handleChange(field.fieldName, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`${commonClasses} ${errorClasses} resize-none`}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={formData[field.fieldName] || ""}
            onChange={(e) => handleChange(field.fieldName, e.target.value)}
            className={`${commonClasses} ${errorClasses}`}
          />
        );

      case "select":
        return (
          <select
            value={formData[field.fieldName] || ""}
            onChange={(e) => handleChange(field.fieldName, e.target.value)}
            className={`${commonClasses} ${errorClasses}`}
          >
            <option value="">Seçiniz...</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            value={formData[field.fieldName] || ""}
            onChange={(e) => handleChange(field.fieldName, e.target.value)}
            placeholder={field.placeholder}
            className={`${commonClasses} ${errorClasses}`}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {template.fields.map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {field.label}
            {field.isRequired && <span className="text-red-400 ml-1">*</span>}
          </label>
          {renderField(field)}
          {errors[field.fieldName] && (
            <div className="mt-2 flex items-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors[field.fieldName]}</span>
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between pt-6 border-t border-slate-700">
        <p className="text-sm text-slate-400">
          <span className="text-red-400">*</span> Zorunlu alanlar
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              <span>Oluşturuluyor...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Dilekçe Oluştur</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
