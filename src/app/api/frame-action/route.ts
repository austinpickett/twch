import { getChannels } from "@/app/utils/twitchUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData } = body;

    if (untrustedData.buttonIndex === 1) {
      return NextResponse.redirect(new URL("/api/frame", request.url));
    } else if (untrustedData.buttonIndex === 2) {
      const channels = await getChannels();
      if (channels.length === 0) {
        return NextResponse.json(
          { error: "No channels available" },
          { status: 404 }
        );
      }
      const randomChannel =
        channels[Math.floor(Math.random() * channels.length)];
      return NextResponse.redirect(`https://twitch.tv/${randomChannel}`);
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
