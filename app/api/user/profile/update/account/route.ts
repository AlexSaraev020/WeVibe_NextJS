import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  if (req.method !== "PUT") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { email, password } = body;
    if (!email && !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }
    const validateDataLength = validate__Fields__Length({ email, password });
    if (validateDataLength) {
      return NextResponse.json(
        { message: validateDataLength },
        { status: 400 },
      );
    }
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 },
      );
    }
    await connect();
    const loggedUser = await UserModel.findById(isLoggedIn);
    if (!loggedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    let emailUpdated = false;
    let passwordUpdated = false;
    if (loggedUser.email !== email) {
      loggedUser.email = email;
      emailUpdated = true;
    }
    if (
      password !== undefined &&
      password !== null &&
      !(await bcrypt.compare(password, loggedUser.password))
    ) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      loggedUser.password = hashedPassword;
      passwordUpdated = true;
    }

    if (emailUpdated || passwordUpdated) {
      await loggedUser.save();
      return NextResponse.json(
        { message: "User updated successfully" },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: "No changes detected" },
        { status: 200 },
      );
    }
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
