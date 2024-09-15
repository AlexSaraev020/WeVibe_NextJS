import mongoose, { Document, Model, Schema } from "mongoose";

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    bio: string;
    image: string;
    createdAt: Date;
    posts: mongoose.Types.ObjectId[]
}

const userSchema = new Schema<User>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

export const UserModel: Model<User> = mongoose.models.User || mongoose.model("User", userSchema)