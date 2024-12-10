export interface KebabSectionProps {
  type: "post" | "comment" | "reply";
}

export type PostKebabSectionProps = {
  type: "post";
  userId: string;
  postId: string;
  imageUrl: string;
};

export type CommentKebabSectionProps = {
  type: "comment";
  userId: string;
  commentId: string;
  postId: string;
  setAddedCommentCounter: (
    updateCounter: (prevCounter: number) => number,
  ) => void;
};

export type ReplyKebabSectionProps = {
  type: "reply";
  userId: string;
  _id: string;
};

export type KebabSectionCombinedProps =
  | PostKebabSectionProps
  | CommentKebabSectionProps
  | ReplyKebabSectionProps;
