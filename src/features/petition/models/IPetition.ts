export interface PetitionFieldDto {
  id: number;
  fieldName: string;
  label: string;
  fieldType: string;
  isRequired: boolean;
  placeholder?: string;
  options?: string[];
  order: number;
}

export interface PetitionTemplateDto {
  id: number;
  category: string;
  name: string;
  description: string;
  icon: string;
  fields: PetitionFieldDto[];
}

export interface PetitionPreviewDto {
  id: number;
  templateName: string;
  generatedContent: string;
  createdAt: string;
}

export interface UserPetitionDto {
  id: number;
  templateName: string;
  category: string;
  createdAt: string;
  pdfPath?: string;
}

export interface PetitionLimitDto {
  remainingPetitions: number;
  maxPetitions: number;
  isUnlimited: boolean;
  resetDate: string;
}

export interface CreatePetitionDto {
  templateId: number;
  formData: Record<string, string>;
}
