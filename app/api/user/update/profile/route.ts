import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  if (req.method !== "PUT") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  console.log("method passed");
  try {
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 },
      );
    }
    console.log("user logged in");
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { username, bio, image } = body;
    console.log("body parsed" + username + bio + image);
    if (!username && !bio && !image) {
      return NextResponse.json(
        { message: "Username, bio or image are required" },
        { status: 400 },
      );
    }

    await connect();
    console.log("db connected");
    const loggedUser = await UserModel.findById(isLoggedIn);
    console.log("user found " + loggedUser?.username);
    if (!loggedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const validateDataLength = validate__Fields__Length({ username, bio });
    if (validateDataLength) {
      return NextResponse.json(
        { message: validateDataLength },
        { status: 400 },
      );
    }
    console.log("validated data length");
    let userNameUpdated = false;
    let bioUpdated = false;
    let imageUpdated = false;

    if (loggedUser.username !== username) {
      loggedUser.username = username;
      userNameUpdated = true;
    }
    if (loggedUser.bio !== bio) {
      loggedUser.bio = bio;
      bioUpdated = true;
    }
    if (loggedUser.image !== image) {
      loggedUser.image = image;
      imageUpdated = true;
    }
    if (!userNameUpdated && !bioUpdated && !imageUpdated) {
      return NextResponse.json(
        {
          message: "No changes detected",
          usernameUpdated: userNameUpdated,
          bioUpdated: bioUpdated,
          imageUpdated: imageUpdated,
        },
        { status: 400 },
      );
    }
    console.log("user updated");
    await loggedUser.save();
    return NextResponse.json(
      {
        message: "User updated successfully",
        usernameUpdated: userNameUpdated,
        bioUpdated: bioUpdated,
        imageUpdated: imageUpdated,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
