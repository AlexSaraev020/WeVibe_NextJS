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
    verified?: boolean;
    image: {
      url: string;
      fileId: string;
    }
  };
  likes: number;
  comments: number;
  /** /api/posts/get and getProfilePosts answer this for the signed-in user */
  likedByMe?: boolean;
}

