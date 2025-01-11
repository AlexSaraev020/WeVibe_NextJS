import { connect } from "@/db/mongo/db";
import { NextResponse } from "next/server";
import { PostModel } from "@/models/posts/post";
import { UserModel } from "@/models/user";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { validateFieldsTrim } from "@/actions/auth/validateFieldsTrim";
export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 },        
      );
    }
    const userLoggedIn = await UserModel.findOne({ _id: isLoggedIn }).exec();
    if (!userLoggedIn) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { title, description, image } = body;
    if (!image) {
      return NextResponse.json(
        { message: "Please upload an image" },
        { status: 400 },
      );
    }
    const validateTrim = validateFieldsTrim({ title, description });
    if (validateTrim.error || !validateTrim.fields) {
      return NextResponse.json(
        { message: validateTrim.error },
        { status: 400 },
      );
    }
    const trimmedTitle = validateTrim.fields.title;
    const trimmedDescription = validateTrim.fields.description;

    const validFields = validate__Fields__Length({
      title: trimmedTitle,
      description: trimmedDescription,
    });
    if (validFields) {
      return NextResponse.json({ message: validFields }, { status: 400 });
    }
    await connect();
    const newPost = await PostModel.create({
      title: trimmedTitle,
      description: trimmedDescription,
      image: {
        url: image.url,
        fileId: image.fileId,
      },
      createdBy: isLoggedIn,
    });

    if (!newPost) {
      return NextResponse.json(
        { message: "Post not created" },
        { status: 400 },
      );
    }

    await UserModel.updateOne(
      { _id: isLoggedIn },
      { $push: { posts: newPost._id } },
    );

    const post = await PostModel.findById(newPost._id)
      .populate({
        path: "createdBy",
        model: UserModel,
        select: "username image",
      })
      .select("_id title description image createdAt createdBy comments likes")
      .exec();

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Post created successfully!", post },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 },
    );
  }
}
