import mongoose, { Document, Model, Schema } from "mongoose";
export interface Post extends Document {
    title: string;
    description: string;
    image: string;
    createdAt: Date;
    createdBy: mongoose.Types.ObjectId;
    comments: mongoose.Types.ObjectId[];
    likes:number;
}

const postSchema = new Schema<Post>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: { type: Number, default: 0 },
});

export const PostModel: Model<Post> = mongoose.model("Post", postSchema)