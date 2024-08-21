import { getChannels, getStreamInfo } from "@/app/utils/twitchUtils";
import { NextRequest, NextResponse } from "next/server";

async function generateFrameHtml(channel: string, streamTitle: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Twitch Channel Frame</title>
      <meta property="fc:frame" content="vNext">
      <meta property="fc:frame:image" content="https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel}-640x360.jpg">
      <meta property="fc:frame:button:1" content="Next Channel">
      <meta property="fc:frame:button:2" content="Watch on Twitch">
      <meta property="fc:frame:button:2:action" content="link">
      <meta property="fc:frame:button:2:target" content="https://twitch.tv/${channel}">
      <meta property="fc:frame:post_url" content="https://twch.xyz/api/frame-action">
      <meta property="fc:frame:state" content="${channel}">
    </head>
    <body>
      <h1>Channel: ${channel}</h1>
      <p>Stream Title: ${streamTitle}</p>
    </body>
    </html>
  `;
}

export async function GET(request: NextRequest) {
  try {
    const channels = await getChannels();
    if (channels.length === 0) {
      return new NextResponse("No channels available", { status: 404 });
    }
    const channelIndex = Math.floor(Math.random() * channels.length);
    const currentChannel = channels[channelIndex];
    const streamInfo = await getStreamInfo(currentChannel);
    const html = await generateFrameHtml(currentChannel, streamInfo.title);
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error fetching channel info:", error);
    return new NextResponse("Error fetching channel info", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
