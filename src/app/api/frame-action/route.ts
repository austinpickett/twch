import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData, state } = body;

    if (untrustedData.buttonIndex === 1) {
      return NextResponse.redirect(new URL("/api/frame", request.url));
    } else if (untrustedData.buttonIndex === 2) {
      if (!state) {
        return NextResponse.json(
          { error: "No channel information available" },
          { status: 400 }
        );
      }
      return NextResponse.redirect(`https://twitch.tv/${state}`);
    } else {
      return NextResponse.json(
        { error: "Invalid button index" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing frame action:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
