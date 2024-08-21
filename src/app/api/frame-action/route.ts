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
      console.log(`Opening Twitch channel: ${state}`);
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta property="fc:frame" content="vNext">
          <meta property="fc:frame:image" content="https://static-cdn.jtvnw.net/previews-ttv/live_user_${state}-640x360.jpg">
          <meta property="fc:frame:button:1" content="Open Twitch Stream">
          <meta property="fc:frame:button:1:action" content="link">
          <meta property="fc:frame:button:1:target" content="https://twitch.tv/${state}">
        </head>
        <body>
          <h1>Watch ${state} on Twitch</h1>
          <p>Click the button below to open the stream for ${state}</p>
        </body>
        </html>
      `;
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html" },
      });
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
