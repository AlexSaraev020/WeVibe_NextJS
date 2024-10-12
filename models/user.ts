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

const UserSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  image: {
    type: String,
    default:
      "https://utfs.io/f/0Ow274erzkuprXsskPX5iHvEWP0IfbBAOy328zVgFMk5Lcxe",
  },
  createdAt: { type: Date, default: Date.now },
  posts: [{ type: Schema.Types.ObjectId, default: null, ref: "Post" }],
});
delete models.User;
export const UserModel: Model<User> = models.User || model("User", UserSchema);
