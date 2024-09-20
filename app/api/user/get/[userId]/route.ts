import { connect } from "@/db/mongo/db";
import { User, UserModel } from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    if (req.method !== "GET") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 400 }
      );
    }
    const { userId } = params;
    await connect();
    if (!userId) {
      return NextResponse.json({ message: "Token not found" }, { status: 400 });
    }

    const user = (await UserModel.findOne({ _id: userId })) as User;
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
