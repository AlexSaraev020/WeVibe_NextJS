import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { ImageType } from "@/types/image/imageType";
import { NextResponse } from "next/server";
type UserUpdates = {
  username?: string;
  bio?: string;
  image?: ImageType;
};

type UpdatedFields = {
  usernameUpdated: boolean;
  bioUpdated: boolean;
  imageUpdated: boolean;
  image: ImageType;
  username: string;
};

export async function PATCH(req: Request) {
  if (req.method !== "PATCH") {
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
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { username, bio, image } = body;
    const updates: UserUpdates = {};
    if (!username && !bio && !image) {
      return NextResponse.json(
        { message: "Username, bio or image are required" },
        { status: 400 },
      );
    }
    if (username && username.trim() !== "") {
      updates.username = username.trim();
    } else if (username) {
      return NextResponse.json(
        { message: "Username cannot be empty" },
        { status: 400 },
      );
    }

    if (bio && bio.trim() !== "") {
      updates.bio = bio.trim();
    } else if (bio) {
      return NextResponse.json(
        { message: "Bio cannot be empty" },
        { status: 400 },
      );
    }

    if (image) {
      updates.image = image;
    }
    await connect();
    const loggedUser = await UserModel.findById(isLoggedIn);
    if (!loggedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const validateDataLength = validate__Fields__Length({
      username: updates.username || loggedUser.username,
      bio: updates.bio || loggedUser.bio,
    });
    if (validateDataLength) {
      return NextResponse.json(
        { message: validateDataLength },
        { status: 400 },
      );
    }
    let userNameUpdated = false;
    let bioUpdated = false;
    let imageUpdated = false;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          message: "No changes detected",
          usernameUpdated: userNameUpdated,
          bioUpdated: bioUpdated,
          imageUpdated: imageUpdated,
          image: loggedUser.image,
          username: loggedUser.username,
        },
        { status: 400 },
      );
    } else {
      if (updates.username && loggedUser.username !== updates.username) {
        loggedUser.username = updates.username;
        userNameUpdated = true;
      }
      if (updates.bio && loggedUser.bio !== updates.bio) {
        loggedUser.bio = updates.bio;
        bioUpdated = true;
      }
      if (updates.image && loggedUser.image.url !== updates.image.url) {
        loggedUser.image = updates.image;
        imageUpdated = true;
      }
    }
    if (!userNameUpdated && !bioUpdated && !imageUpdated) {
      return NextResponse.json(
        {
          message: "No changes detected",
          usernameUpdated: userNameUpdated,
          bioUpdated: bioUpdated,
          imageUpdated: imageUpdated,
          image: loggedUser.image,
          username: loggedUser.username,
        },
        { status: 400 },
      );
    }

    await loggedUser.save();

    return NextResponse.json(
      {
        message: "User updated successfully",
        userNameUpdated,
        bioUpdated,
        imageUpdated: imageUpdated,
        image: loggedUser.image,
        username: loggedUser.username,
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
