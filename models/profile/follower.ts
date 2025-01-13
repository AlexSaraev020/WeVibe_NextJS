import { Model, model, models, Schema, Types } from "mongoose";

 interface Follower extends Document {
  user: Types.ObjectId;
  follower: Types.ObjectId;
  createdAt: Date;
}

const FollowerSchema = new Schema<Follower>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  follower: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export const FollowerModel: Model<Follower> =
  models.Follower || model("Follower", FollowerSchema);
