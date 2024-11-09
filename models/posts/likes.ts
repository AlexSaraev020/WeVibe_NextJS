import { model, Model, models, Schema, Types } from "mongoose";

export interface Likes extends Document {
  _id: Types.ObjectId;
  post: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
}

const LikesSchema = new Schema<Likes>({
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export const LikesModel: Model<Likes> =
  models.Likes || model("Likes", LikesSchema);
