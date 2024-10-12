import { model, Model, models, ObjectId, Schema } from "mongoose";

export interface Likes extends Document {
  post: ObjectId;
  user: ObjectId;
  createdAt: Date;
}

const LikesSchema = new Schema<Likes>({
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export const LikesModel: Model<Likes> =
  models.Likes || model("Likes", LikesSchema);
