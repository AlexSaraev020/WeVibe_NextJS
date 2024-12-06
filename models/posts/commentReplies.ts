import { Document, model, Model, models, Schema, Types } from "mongoose";

export interface CommentReplies extends Document {
  _id: Types.ObjectId;
  commentId: Types.ObjectId;
  postId: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  likes: Types.ObjectId[];
  createdAt: Date;
}

export const CommentRepliesSchema = new Schema<CommentReplies>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  likes: [{ type: Schema.Types.ObjectId, default: [], ref: "User" }],
  content: { type: String, required: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now },
});

export const CommentRepliesModel: Model<CommentReplies> =
  models.CommentReplies || model("CommentReplies", CommentRepliesSchema);
