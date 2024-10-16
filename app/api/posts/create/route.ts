import { connect } from "@/db/mongo/db";
import { NextResponse } from "next/server";
import { PostModel } from "@/models/posts/post";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/userTypes/token/decoded";
import { UserModel } from "@/models/user";
export async function POST(req: Request) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 400 }
      );
    }
    await connect();
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { title, description, image } = body;
    if (!image || !title) {
      return NextResponse.json(
        { message: "Please fill the required fields" },
        { status: 400 }
      );
    }
    
    const cookieStore = cookies();
    const token = cookieStore.get("authToken");
    if (!token) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 400 }
      );
    }

    const userId = jwtDecode(token.value) as DecodedToken;
    const newPost = await PostModel.create({
      title,
      description,
      image,
      createdBy: userId.userId,
    });

    if (!newPost) {
      return NextResponse.json({ message: "Post not created" }, { status: 400 });
    }
    
    await UserModel.findOneAndUpdate(
      { _id: userId.userId },
      { $push: { posts: newPost._id } }
    );

    return NextResponse.json({ newPost }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
