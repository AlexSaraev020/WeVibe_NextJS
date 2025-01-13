import { Document, model, Model, models, Schema, Types } from "mongoose";
 interface Post extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  image:{
    url: string;
    fileId: string
  };
  createdAt: Date;
  createdBy: Types.ObjectId;
  comments: Types.ObjectId[];
  likes: Types.ObjectId[];
}

const PostSchema = new Schema<Post>({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, default: "", maxlength: 500 },
  image: {
    url: { type: String, required: true },
    fileId: { type: String , required: true },
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [{ type: Schema.Types.ObjectId, default: [], ref: "Comment" }],
  likes: [{ type: Schema.Types.ObjectId, default: [], ref: "User" }],
});

export const PostModel: Model<Post> = models.Post || model("Post", PostSchema);
