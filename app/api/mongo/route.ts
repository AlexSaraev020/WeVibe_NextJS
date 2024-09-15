import { connect } from "@/db/mongo/db";
import { NextResponse } from "next/server";
export async function GET() {
    const db = await connect();
    return new NextResponse(JSON.stringify(db));
}