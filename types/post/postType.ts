import { ImageType } from "../image/imageType";
import { CommentType } from "./comments/commentsType";

export interface PostType {
  _id: string;
  title: string;
  description: string;
  image: ImageType;
  createdAt: string;
  createdBy: {
    _id: string;
    username: string;
    image: {
      url: string;
      fileId: string;
    }
  };
  likes: [];
  comments: CommentType[];
}


export { CommentType };
