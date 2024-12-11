import { UserType } from "@/types/userTypes/user/userType";

export interface RepliesType {
  _id: string;
  content: string;
  user: UserType;
  createdAt: string;
  commentId: string;
  likes: number;
}
