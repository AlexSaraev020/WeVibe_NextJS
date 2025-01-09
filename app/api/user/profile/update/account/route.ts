import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  if (req.method !== "PATCH") {
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
    if (email.trim() === "") {
      return NextResponse.json(
        { message: "Email cannot be empty" },
        { status: 400 },
      );
    }
    if (password.length > 0 && password.trim() === "") {
      return NextResponse.json(
        { message: "Password cannot be empty" },
        { status: 400 },
      );
    }
    const trimedEmail = email.trim();
    const trimedPassword = password.trim();
    const validateDataLength = validate__Fields__Length({
      email: trimedEmail,
      password: trimedPassword,
    });
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
    if (loggedUser.email !== trimedEmail) {
      loggedUser.email = trimedEmail;
      emailUpdated = true;
    }
    if (
      password !== undefined &&
      password !== null &&
      !(await bcrypt.compare(trimedPassword, loggedUser.password))
    ) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(trimedPassword, salt);
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
        { message: "Your email or password cannot be the same" },
        { status: 400 },
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
