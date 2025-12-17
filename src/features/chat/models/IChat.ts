export interface ChatDto {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: string;
}

export interface MessageDto {
  id: number;
  role: string;
  content: string;
  createdAt: string;
  files?: ChatFileDto[];
}

export interface ChatFileDto {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
}

export interface ChatDetailDto {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: MessageDto[];
}

export interface QueryLimitDto {
  remainingQueries: number;
  maxQueries: number;
  isUnlimited: boolean;
  resetDate: string;
}
