import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { validateFieldsTrim } from "@/actions/auth/validateFieldsTrim";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { CommentsModel } from "@/models/posts/comments";
import { PostModel } from "@/models/posts/post";
import { UserModel } from "@/models/user";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  if (req.method !== "PATCH") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  await connect();
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
    const { postId, comment } = body;
    if (!postId || !comment) {
      return NextResponse.json(
        { message: "Please fill the required fields" },
        { status: 400 },
      );
    }

    const trimValidation = validateFieldsTrim({ comment: comment });
    if (trimValidation.error || !trimValidation.fields) {
      return NextResponse.json({ message: trimValidation.error }, { status: 400 });
    }

    const trimmedComment = trimValidation.fields.comment;

    const validate = validate__Fields__Length({ comment: trimmedComment });
    if (validate) {
      return NextResponse.json({ message: validate }, { status: 400 });
    }

    const newComment = await CommentsModel.create({
      comment: trimmedComment,
      post: postId,
      user: isLoggedIn,
    });
    await PostModel.updateOne(
      { _id: postId },
      { $push: { comments: newComment._id } },
      { new: true },
    );

    const populatedNewComment = await CommentsModel.populate(newComment, {
      path: "user",
      model: UserModel,
      select: ["username", "image", "_id"],
    });

    return NextResponse.json(
      { message: "Comment added successfully", comment: populatedNewComment },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 },
      );
    }
    console.error("Unknown error:", error);
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 },
    );
  }
}
