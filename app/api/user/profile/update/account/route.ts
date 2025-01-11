import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { validateFieldsTrim } from "@/actions/auth/validateFieldsTrim";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  if (req.method !== "PATCH") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const userProfileId = req.nextUrl.searchParams.get("user");
    if (!userProfileId || !Types.ObjectId.isValid(userProfileId)) {
      return NextResponse.json(
        { message: "User profile id not found" },
        { status: 404 },
      );
    }
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { email, password } = body;
    const validateTrim = validateFieldsTrim({
      email: email,
      updatePassword: password,
    });
    if (validateTrim.error || !validateTrim.fields) {
      return NextResponse.json(
        { message: validateTrim.error },
        { status: 400 },
      );
    }
    
    const trimedEmail = validateTrim.fields.email;
    const trimedPassword = validateTrim.fields.updatePassword;
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
    const loggedUser = await UserModel.findById(isLoggedIn);
    if (!loggedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (userProfileId !== isLoggedIn && !loggedUser.isAdmin) {
      return NextResponse.json(
        { message: "You are not allowed to update this user" },
        { status: 401 },
      );
    }
    
    await connect();
    const userToBeModified = await UserModel.findById(userProfileId);
    if (!userToBeModified) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    let emailUpdated = false;
    let passwordUpdated = false;
    if (userToBeModified.email !== trimedEmail) {
      userToBeModified.email = trimedEmail;
      emailUpdated = true;
    }
    if (
      trimedPassword !== undefined &&
      trimedPassword !== null &&
      !(await bcrypt.compare(trimedPassword, userToBeModified.password))
    ) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(trimedPassword, salt);
      userToBeModified.password = hashedPassword;
      passwordUpdated = true;
    }

    if (emailUpdated || passwordUpdated) {
      await userToBeModified.save();
      return NextResponse.json(
        { message: "User updated successfully", email: trimedEmail },
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
