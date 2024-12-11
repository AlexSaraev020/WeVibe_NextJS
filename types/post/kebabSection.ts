export interface KebabSectionProps {
  type: "post" | "comment" | "reply";
}

export type PostKebabSectionProps = KebabSectionProps & {
  type: "post";
  userId: string;
  postId: string;
  imageUrl: string;
};

export type CommentKebabSectionProps = KebabSectionProps & {
  type: "comment";
  userId: string;
  commentId: string;
  postId: string;
  setAddedCommentCounter: (
    updateCounter: (prevCounter: number) => number,
  ) => void;
};

export type ReplyKebabSectionProps = KebabSectionProps & {
  type: "reply";
  userId: string;
  commentId: string;
  _id: string;
  setAddedReplyCounter: (
    updateCounter: (prevCounter: number) => number,
  ) => void;
};

export type KebabSectionCombinedProps =
  | PostKebabSectionProps
  | CommentKebabSectionProps
  | ReplyKebabSectionProps;
