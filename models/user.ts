import { ImageType } from "@/types/image/imageType";
import { Document, model, Model, models, Schema, Types } from "mongoose";

interface User extends Document {
  _id: Types.ObjectId;
  isAdmin: boolean;
  username: string;
  email: string;
  password: string;
  bio: string;
  image:ImageType
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  posts: Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema<User>({
  isAdmin: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  image: {
    url: {
      type: String,
      required: true,
      default: "https://ik.imagekit.io/xkk8kgegl/defaultuser.webp?updatedAt=1735907399967",
    },
    fileId: {
      type: String,
      required: true,
      default: "default",
    },
  },
  following: [{ type: Schema.Types.ObjectId, default: [], ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, default: [], ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  posts: [{ type: Schema.Types.ObjectId, default: [], ref: "Post" }],
});
delete models.User;
export const UserModel: Model<User> = models.User || model("User", UserSchema);
