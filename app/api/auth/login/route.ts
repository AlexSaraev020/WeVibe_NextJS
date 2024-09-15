import { connect } from "@/db/mongo/db";
import { NextResponse } from "next/server";
import { UserModel } from "@/models/user";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { generateToken } from "@/actions/auth/jwt";
import { ObjectId } from "mongoose";

export async function POST(req: Request) {
    try {
        await connect();
        if (req.method !== "POST") {
            return NextResponse.json({ message: "Method not allowed" }, { status: 400 });
        }

        const body = await req.json();

        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 401 });
        }

        const existingUser = await UserModel.findOne({ email }) as { _id: ObjectId, password: string };

        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({ message: "Incorrect password" }, { status: 402 });
        }

        cookies().set({ name: "authToken", value: generateToken(existingUser._id.toString()), maxAge: 7 * 24 * 60 * 60 });

        return NextResponse.json({ message: "Login successful" }, { status: 200 });
    } catch (error) {

    }
}