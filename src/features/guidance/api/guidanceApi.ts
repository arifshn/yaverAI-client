import axiosClient from "../../../shared/api/axiosClient";
import type { ChatDetailDto, MessageDto } from "../../chat/models/IChat";

export const guidanceApi = {
  // Yeni bir rehber sohbeti başlat
  startGuidance: (topic?: string, type: "Reception" | "Guidance" = "Guidance"): Promise<ChatDetailDto> =>
    axiosClient
      .post("/Chat", { title: topic || "Yaver Rehber", type: type })
      .then((res) => res.data),

  // Rehberde mesaj gönder
  sendMessage: (
    chatId: number, 
    content: string, 
    history?: MessageDto[]
  ): Promise<{ message: MessageDto; remainingCredits: number }> => {
    const formData = new FormData();
    formData.append("content", content);
    if (history) {
      formData.append("historyJson", JSON.stringify(history));
    }
    return axiosClient
      .post(`/Chat/${chatId}/message`, formData)
      .then((res) => res.data);
  },

  // Rehber sonucunu kaydet
  updateGuidanceResult: (chatId: number, issueTitle: string, redirectTarget: string): Promise<void> =>
    axiosClient.post(`/Chat/${chatId}/guidance-result`, { issueTitle, redirectTarget }).then((res) => res.data),

  // Sohbet geçmişini al
  getGuidanceDetail: (chatId: number): Promise<ChatDetailDto> =>
    axiosClient.get(`/Chat/${chatId}`).then((res) => res.data),
};
