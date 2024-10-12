import { Document, model, Model, models, Schema, Types } from "mongoose";
export interface Post extends Document {
  title: string;
  description: string;
  image: string;
  createdAt: Date;
  createdBy: Types.ObjectId;
  comments: Types.ObjectId[] | null;
  likes: Types.ObjectId[] | null;
}

const PostSchema = new Schema<Post>({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, default: "", maxlength: 500 },
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
  comments: [{ type: Schema.Types.ObjectId, default: null, ref: "Comment" }],
  likes: [{ type: Schema.Types.ObjectId, default: null, ref: "Likes" }],
});

export const PostModel: Model<Post> = models.Post || model("Post", PostSchema);
