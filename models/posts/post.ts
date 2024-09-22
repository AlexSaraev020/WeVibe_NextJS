import mongoose, { Document, Model, Schema } from "mongoose";
import { Comments } from "./comments";
import { Likes } from "./likes";
export interface Post extends Document {
  title: string;
  description: string;
  image: string;
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId;
  comments: Comments[];
  likes: Likes[];
}

const postSchema = new Schema<Post>({
  title: { type: String, required: true, maxlength: 100, minlength: 5 },
  description: { type: String, required: true, minlength: 10, maxlength: 500 },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^https?:\/\/.+/.test(v),
      message: "Invalid URL format",
    },
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Likes" }],
});

export const PostModel: Model<Post> =
  mongoose.models.Post || mongoose.model("Post", postSchema);
