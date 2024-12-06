import { CommentType } from "./comments/commentsType";

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

