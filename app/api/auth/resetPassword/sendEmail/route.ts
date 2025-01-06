import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateToken } from "@/actions/auth/jwtCreate";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  function generateRandomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  try {
    const cookieStore = await cookies();
    const existingMailInCookies = cookieStore.get("encryptedMail");
    const existingCodeInCookies = cookieStore.get("resetCode");

    if (existingMailInCookies && existingCodeInCookies) {
      return NextResponse.json(
        { message: "You have already sent a reset code" },
        { status: 400 },
      );
    }
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }

    const { email } = body;
    if (!email) {
      return NextResponse.json({ message: "Email not found" }, { status: 400 });
    }

    const validateEmail = validate__Fields__Length({ email });
    if (validateEmail) {
      return NextResponse.json({ message: validateEmail }, { status: 400 });
    }

    await connect();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "No account is associated with this email" },
        { status: 404 },
      );
    }
    const generatedResetCode = generateRandomCode();

    await sendMail({
      to: email,
      subject: "Password Reset Code",
      body: `Your password reset code is ${generatedResetCode}`,
    })
    
    const generatedResetCodeToken = await generateToken(generatedResetCode);
    const encryptedMail = await generateToken(email);
    (await cookies()).set({
      name: "resetCode",
      value: generatedResetCodeToken,
      maxAge: 10 * 60,
      httpOnly: true,
      sameSite: "strict",
    });

    (await cookies()).set({
      name: "encryptedMail",
      value: encryptedMail,
      maxAge: 10 * 60,
      httpOnly: true,
      sameSite: "strict",
    });

    return NextResponse.json({ message: "Email sent" }, { status: 200 });
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
