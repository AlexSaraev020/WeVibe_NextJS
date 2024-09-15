import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
export async function connect() {
    try {
        if (!uri) {
            throw new Error('MONGODB_LINK environment variable is not defined');
        }
        
        await mongoose.connect(uri);
        return "Connected to MongoDB";
    } catch (error) {
        console.error('Could not connect to MongoDB', error);
    }
}