import { ObjectId, Schema } from "mongoose";

export interface Comments extends Document {
  comment: string;
  post: ObjectId;
  user: ObjectId;
  createdAt: Date;
}

const commentsSchema = new Schema<Comments>({
  
})