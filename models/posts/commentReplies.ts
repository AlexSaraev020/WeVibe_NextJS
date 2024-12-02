import { Document, model, Model, models, Schema, Types } from "mongoose";

export interface CommentReplies extends Document {
  _id: Types.ObjectId;
  commentId: Types.ObjectId;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  reply: string;
  createdAt: Date;
}

export const CommentRepliesSchema = new Schema<CommentReplies>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  reply: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const CommentRepliesModel: Model<CommentReplies> =
  models.CommentReplies || model("CommentReplies", CommentRepliesSchema);