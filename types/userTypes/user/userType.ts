import { ImageType } from "@/types/image/imageType";

export interface UserType {
  _id: string;
  username: string;
  email: string;
  bio: string;
  image: ImageType;
  createdAt: Date;
  posts: number;
  followers: number;
  following: number;
}

export interface AllowTypes {
  edit: boolean;
  follow: boolean;
  unfollow: boolean;
}
