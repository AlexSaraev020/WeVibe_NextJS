import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { UserModel } from "@/models/user";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) {
      return NextResponse.json(
        { message: "You are not logged in" },
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
    const { fileId } = body;
    if (!fileId) {
      return NextResponse.json(
        { message: "No image url found" },
        { status: 400 },
      );
    }
    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
      privateKey: process.env.PRIVATE_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
    });

    imagekit.deleteFile(fileId, function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    });

    return NextResponse.json({ message: "Image deleted" }, { status: 200 });
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
