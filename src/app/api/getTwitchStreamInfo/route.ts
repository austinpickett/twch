import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

async function getAccessToken() {
  const response = await axios.post(
    `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
  );
  return response.data.access_token;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const channel = searchParams.get("channel");

  if (!channel) {
    return NextResponse.json(
      { error: "Channel parameter is required" },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `https://api.twitch.tv/helix/streams?user_login=${channel}`,
      {
        headers: {
          "Client-ID": TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const streamData = response.data.data[0];

    if (streamData) {
      return NextResponse.json({ title: streamData.title });
    } else {
      return NextResponse.json({ title: "Channel is offline" });
    }
  } catch (error) {
    console.error("Error fetching Twitch stream info:", error);
    return NextResponse.json(
      { error: "Failed to fetch stream info" },
      { status: 500 }
    );
  }
}
