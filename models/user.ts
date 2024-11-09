import { Document, model, Model, models, Schema, Types } from "mongoose";

export interface User extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  bio: string;
  image: string;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  posts: Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String , default: "" },
  image: {
    type: String,
    default:
      "https://utfs.io/f/0Ow274erzkuprXsskPX5iHvEWP0IfbBAOy328zVgFMk5Lcxe",
  },
  following: [{ type: Schema.Types.ObjectId, default: [], ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, default: [], ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  posts: [{ type: Schema.Types.ObjectId, default: [], ref: "Post" }],
});
delete models.User;
export const UserModel: Model<User> = models.User || model("User", UserSchema);
