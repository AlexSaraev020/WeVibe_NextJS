import { ImageType } from "../image/imageType";
import { CommentType } from "./comments/commentsType";
import { RepliesType } from "./comments/replies/repliesType";
import { PostType } from "./postType";

export interface KebabSectionProps {
  type: "post" | "comment" | "reply";
}

export type PostKebabSectionProps = KebabSectionProps & {
  type: "post";
  userId: string;
  setShowPostFullScreen?: (showPostFullScreen: boolean) => void;
  postId: string;
  image:ImageType;
  setPosts:(updatePosts: (prevPosts: PostType[]) => PostType[]) => void;
};

export type CommentKebabSectionProps = KebabSectionProps & {
  type: "comment";
  userId: string;
  commentId: string;
  postId: string;
  setComments:(updateComments: (prevComments: CommentType[]) => CommentType[]) => void;
};

export type ReplyKebabSectionProps = KebabSectionProps & {
  type: "reply";
  userId: string;
  commentId: string;
  _id: string;
  setReplies:(updateReplies: (prevReplies: RepliesType[]) => RepliesType[]) => void;
};

export type KebabSectionCombinedProps =
  | PostKebabSectionProps
  | CommentKebabSectionProps
  | ReplyKebabSectionProps;
