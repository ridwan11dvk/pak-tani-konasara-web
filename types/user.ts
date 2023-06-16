import { UserDataInterface } from "@/hooks/useLogin";

export type UserApiResponse = {
  status: boolean;
  message: string;
  data: UserDataInterface[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PostUserApiResponse = {
  status: true;
  message: string;
  data: AddUserType;
};

export type AddUserType = {
  id_user_creator?: string;
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: string;
  _id?: string;
};
