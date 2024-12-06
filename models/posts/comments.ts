import { Document, model, Model, models, Schema, Types } from "mongoose";

export interface Comment extends Document {
  _id: Types.ObjectId;
  comment: string;
  post: Types.ObjectId;
  user: Types.ObjectId;
  replies: Types.ObjectId[];
  likes: Types.ObjectId[];
  createdAt: Date;
}

const CommentsSchema = new Schema<Comment>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  comment: { type: String, required: true },
  replies: [{ type: Schema.Types.ObjectId, default: [], ref: "CommentReplies" }],
  likes: [{ type: Schema.Types.ObjectId, default: [], ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export const CommentsModel: Model<Comment> =
  models.Comment || model("Comment", CommentsSchema);
