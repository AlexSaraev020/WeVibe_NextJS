import mongoose, { Document, Model, Schema } from "mongoose";
export interface Post extends Document {
  title: string;
  description: string;
  image: string;
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId;
  comments: Comment[];
  likes: number;
}

interface Comment extends Document {
  comment: string;
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
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
  likes: { type: Number, default: 0 },
});

export const PostModel: Model<Post> =
  mongoose.models.Post || mongoose.model("Post", postSchema);
