import axiosClient from "../../../shared/api/axiosClient";
import type {
  ChatDto,
  ChatDetailDto,
  MessageDto,
  QueryLimitDto,
} from "../models/IChat";

export const chatApi = {
  getChats: () => axiosClient.get<ChatDto[]>("/Chat").then((res) => res.data),

  createChat: (title?: string) =>
    axiosClient.post<ChatDetailDto>("/Chat", { title }).then((res) => res.data),

  getChat: (chatId: number) =>
    axiosClient.get<ChatDetailDto>(`/Chat/${chatId}`).then((res) => res.data),

  sendMessage: (chatId: number, content: string, files?: File[]) => {
    const formData = new FormData();
    formData.append("content", content);

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    return axiosClient
      .post<MessageDto>(`/Chat/${chatId}/message`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);
  },

  deleteChat: (chatId: number) =>
    axiosClient.delete(`/Chat/${chatId}`).then((res) => res.data),

  getQueryLimit: () =>
    axiosClient.get<QueryLimitDto>("/Chat/limit").then((res) => res.data),
};
