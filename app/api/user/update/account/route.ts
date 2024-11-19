import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    if (req.method !== "PUT") {
        return NextResponse.json(
            { message: "Method not allowed" },
            { status: 400 },
        );
    }
}