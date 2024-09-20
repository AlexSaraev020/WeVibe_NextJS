import { connect } from "@/db/mongo/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
    await connect();
    if (req.method !== "POST") {
        return NextResponse.json(
          { message: "Method not allowed" },
          { status: 400 }
        );
      }
    
} catch (error: unknown) {
    
}
}