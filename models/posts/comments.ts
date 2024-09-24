import { Document, model, Model, models, Schema, Types } from "mongoose";

export interface Comment extends Document {
  comment: string;
  post: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
}

const commentsSchema = new Schema<Comment>({
  comment: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export const CommentsModel: Model<Comment> =
  models.Comment || model("Comment", commentsSchema);