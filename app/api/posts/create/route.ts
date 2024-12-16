import { connect } from "@/db/mongo/db";
import { NextResponse } from "next/server";
import { PostModel } from "@/models/posts/post";
import { UserModel } from "@/models/user";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
export async function POST(req: Request) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 400 },
      );
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { title, description, image } = body;
    if (!image || !title) {
      return NextResponse.json(
        { message: "Please fill the required fields" },
        { status: 400 },
      );
    }

    const validFields = validate__Fields__Length({ title, description });
    if (validFields) {
      return NextResponse.json({ message: validFields }, { status: 400 });
    }

    const userId = await checkUserLoggedIn();
    if (!userId) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 },
      );
    }
    await connect();
    const newPost = await PostModel.create({
      title,
      description,
      image: {
        url: image.url,
        fileId: image.fileId,
      },
      createdBy: userId,
    });
    console.log(newPost);

    if (!newPost) {
      return NextResponse.json(
        { message: "Post not created" },
        { status: 400 },
      );
    }

    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { posts: newPost._id } },
    );

    return NextResponse.json(
      { message: "Post created successfully!" },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: "An error occurred", error }, { status: 500 });
  }
}
