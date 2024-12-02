import { PostType } from "../post/postType";
import { UserType } from "../userTypes/user/userType";

export interface LikesType {
    _id: string;
    user: UserType;
    post: PostType;
    createdAt: Date;
}