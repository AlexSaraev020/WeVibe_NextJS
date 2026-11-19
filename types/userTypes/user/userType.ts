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
  /** only an admin can set it; see /api/user/profile/verify */
  verified?: boolean;
  /** the people routes answer this for whoever is signed in */
  followedBy?: boolean;
}

export interface AllowTypes {
  edit: boolean;
  follow: boolean;
  unfollow: boolean;
}
