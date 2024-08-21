import { NextRequest, NextResponse } from "next/server";

interface FrameRequest {
  untrustedData: {
    buttonIndex: number;
  };
  state?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FrameRequest = await request.json();
    console.log("Received POST body:", JSON.stringify(body, null, 2));

    const { untrustedData, state } = body;
    console.log("Extracted untrustedData:", untrustedData);
    console.log("Extracted state:", state);

    if (!untrustedData) {
      return NextResponse.json(
        { error: "Missing untrustedData" },
        { status: 400 }
      );
    }

    if (untrustedData.buttonIndex === 1) {
      console.log("Redirecting to /api/frame for next channel");
      return NextResponse.redirect(new URL("/api/frame", request.url));
    } else if (untrustedData.buttonIndex === 2) {
      if (!state) {
        console.log("No state (channel) information available");
        return NextResponse.json(
          { error: "No channel information available" },
          { status: 400 }
        );
      }
      console.log(`Redirecting to Twitch channel: ${state}`);
      return NextResponse.redirect(`https://twitch.tv/${state}`);
    } else {
      console.log(`Invalid button index: ${untrustedData.buttonIndex}`);
      return NextResponse.json(
        { error: "Invalid button index" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("Error processing frame action:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Internal server error",
          details: "An unknown error occurred",
        },
        { status: 500 }
      );
    }
  }
}
