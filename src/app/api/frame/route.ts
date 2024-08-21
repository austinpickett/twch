import { NextRequest, NextResponse } from "next/server";

// Replace this with your actual method of fetching channels
async function getChannels() {
  // This is a placeholder. Implement your actual channel fetching logic here.
  return ["shroud", "summit1g", "xqcow", "lirik", "ninja"];
}

export async function GET(request: NextRequest) {
  try {
    const channels = await getChannels();

    if (channels.length === 0) {
      return new NextResponse("No channels available", { status: 404 });
    }

    const channelIndex = Math.floor(Math.random() * channels.length);
    const currentChannel = channels[channelIndex];

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Twitch Channel Frame</title>
        <meta property="fc:frame" content="vNext">
        <meta property="fc:frame:image" content="https://static-cdn.jtvnw.net/previews-ttv/live_user_${currentChannel}-640x360.jpg">
        <meta property="fc:frame:button:1" content="Next Channel">
        <meta property="fc:frame:button:2" content="Watch on Twitch">
        <meta property="fc:frame:post_url" content="https://twch.xyz/api/frame-action">
      </head>
      <body>
        <h1>Current Twitch Channel: ${currentChannel}</h1>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error fetching channels:", error);
    return new NextResponse("Error fetching channels", { status: 500 });
  }
}
