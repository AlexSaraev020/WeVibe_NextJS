import { UserType } from "@/types/userTypes/user/userType";

export interface CommentType {
    _id: string;
    comment: string;
    user: UserType;
    replies: number;
    likes: number;
    createdAt: string;
  }
  