import { Document, model, Model, models, Schema, Types } from "mongoose";
import { Comment } from "./comments";
import { Likes } from "./likes";
export interface Post extends Document {
  title: string;
  description: string;
  image: string;
  createdAt: Date;
  createdBy: Types.ObjectId;
  comments: Comment[];
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
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "Likes" }],
});

export const PostModel: Model<Post> = models.Post || model("Post", postSchema);
