import axiosClient from "../../../shared/api/axiosClient";
import type {
  PetitionTemplateDto,
  CreatePetitionDto,
  PetitionPreviewDto,
  UserPetitionDto,
  PetitionLimitDto,
  CreatePetitionResponse,
} from "../models/IPetition";

export const petitionApi = {
  getTemplates: () =>
    axiosClient
      .get<Record<string, PetitionTemplateDto[]>>("/Petition/templates")
      .then((res) => res.data),

  getTemplate: (id: number) =>
    axiosClient
      .get<PetitionTemplateDto>(`/Petition/templates/${id}`)
      .then((res) => res.data),

  createPetition: (dto: CreatePetitionDto) =>
    axiosClient
      .post<CreatePetitionResponse>("/Petition/create", dto)
      .then((res) => res.data),

  getMyPetitions: () =>
    axiosClient
      .get<UserPetitionDto[]>("/Petition/my-petitions")
      .then((res) => res.data),

  getPetition: (id: number) =>
    axiosClient
      .get<PetitionPreviewDto>(`/Petition/${id}`)
      .then((res) => res.data),

  deletePetition: (id: number) =>
    axiosClient.delete(`/Petition/${id}`).then((res) => res.data),

  getPetitionLimit: () =>
    axiosClient
      .get<PetitionLimitDto>("/Petition/limit")
      .then((res) => res.data),

  downloadPetition: (id: number) =>
    axiosClient
      .get(`/Petition/download/${id}`, { responseType: "blob" })
      .then((res) => res.data),
};
