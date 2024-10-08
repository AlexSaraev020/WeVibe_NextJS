import { Document, model, Model, models, ObjectId, Schema } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  bio: string;
  image: string;
  createdAt: Date;
  posts: ObjectId[];
}

const userSchema = new Schema<User>({
  username: { type: String, required: true , unique: true},
  email: { type: String, required: true , unique: true},
  password: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

export const UserModel: Model<User> = models.User || model("User", userSchema);
