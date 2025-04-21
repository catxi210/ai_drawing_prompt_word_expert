import { NextRequest, NextResponse } from "next/server";
import ky from "ky";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Forward the request to the actual API
    const response = await ky
      .post("https://302.ai/api/upload", {
        body: formData,
      })
      .json();

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in upload API route:", error);
    return NextResponse.json(
      {
        code: -1,
        msg: "Upload failed",
        data: null,
      },
      { status: 500 }
    );
  }
}
