import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
export async function connect() {
    // the failure used to be caught and dropped here: every route then sat in Mongoose's
    // 10-second query buffer and answered late instead of saying the database is unreachable
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }

    await mongoose.connect(uri);
    return "Connected to MongoDB";
}