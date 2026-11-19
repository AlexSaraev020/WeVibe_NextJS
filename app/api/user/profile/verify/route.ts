import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

/* Verified is a badge the site hands out. An account can never set it on itself, so the
   route checks the caller's isAdmin before it touches another document. */
export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 400 });
  }
  try {
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) {
      return NextResponse.json({ message: "You are not logged in!" }, { status: 401 });
    }
    await connect();
    const caller = await UserModel.findOne({ _id: isLoggedIn }).select("_id isAdmin").lean().exec();
    if (!caller?.isAdmin) {
      return NextResponse.json({ message: "Only an admin can verify an account" }, { status: 403 });
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { query, verified } = body;
    if (!query || !Types.ObjectId.isValid(query)) {
      return NextResponse.json({ message: "No account id found" }, { status: 400 });
    }

    const target = await UserModel.findOne({ _id: query }).select("_id username verified").exec();
    if (!target) {
      return NextResponse.json({ message: "Account not found" }, { status: 404 });
    }

    target.verified = Boolean(verified);
    await target.save();

    return NextResponse.json(
      { message: target.verified ? "Account verified" : "Verification removed", verified: target.verified },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
