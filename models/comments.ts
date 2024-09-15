import mongoose, { Document, Model, Schema } from "mongoose";

export interface Comment extends Document {
    comment: string;
    post: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
}

const commentsSchema = new Schema<Comment>({
    comment: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
});

export const CommentsModel: Model<Comment> = mongoose.model("Comment", commentsSchema)