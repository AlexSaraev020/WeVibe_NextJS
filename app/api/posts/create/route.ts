import { connect } from "@/db/mongo/db";
import { NextResponse } from "next/server";
import { PostModel } from "@/models/posts/post";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/userTypes/token/decoded";
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

    return NextResponse.json({ newPost }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}
