export interface User {
  firstName: string;
  lastName: string;
  username: string;
  token: string;
  name: string;
  isPremium: boolean;
  id: string;
  email: string;
  premiumEndDate: string | null;
  avatarUrl: string;
  phoneNumber: string;
}

export interface UserProfile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isPremium: boolean;
  avatarUrl: string;
}

export interface UpdateProfileDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
