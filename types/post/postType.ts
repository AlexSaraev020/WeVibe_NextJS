import { UserType } from "../userTypes/user/userType";

export interface PostType {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  createdBy: {
    _id: string;
    username: string;
    image: string;
  };
  likes: [];
  comments: CommentType[];
}

export interface CommentType {
  _id: string;
  comment: string;
  user: UserType;
  replies: string[];
  likes: UserType[];
  createdAt: string;
}
