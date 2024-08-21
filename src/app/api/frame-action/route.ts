// app/api/frame-action/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { untrustedData } = body;

  if (untrustedData.buttonIndex === 1) {
    // Logic for "Next Channel" - redirect to /api/frame to get a new channel
    return NextResponse.redirect(new URL("/api/frame", request.url));
  } else if (untrustedData.buttonIndex === 2) {
    // Logic for "Watch on Twitch" - redirect to Twitch
    // Note: You'll need to pass the current channel somehow, perhaps through state or a database
    const currentChannel = "placeholder"; // Replace this with actual logic to get the current channel
    return NextResponse.redirect(`https://twitch.tv/${currentChannel}`);
  } else {
    return NextResponse.json(
      { error: "Invalid button index" },
      { status: 400 }
    );
  }
}
