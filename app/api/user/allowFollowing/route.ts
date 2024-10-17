import { connect } from "@/db/mongo/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 }
    );
  }
  await connect();

  try {
    const query = req.nextUrl.searchParams.get("q");
    if (!query) {
      return NextResponse.json({ message: "Query not found" }, { status: 404 });
    }
  } catch (error) {
    
  }
}
