import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  console.log("GET request received");
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  console.log("POST request received");
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  try {
    console.log("Fetching Twitch access token");
    const tokenResponse = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
    );
    const accessToken = tokenResponse.data.access_token;

    console.log("Fetching Twitch streams");
    const streamsResponse = await axios.get(
      "https://api.twitch.tv/helix/streams",
      {
        headers: {
          "Client-ID": TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          first: 100, // Fetch 100 streams
        },
      }
    );

    const channels = streamsResponse.data.data.map(
      (stream: any) => stream.user_login
    );
    const shuffledChannels = channels.sort(() => 0.5 - Math.random());

    console.log("Returning shuffled channels");
    return NextResponse.json(shuffledChannels);
  } catch (error) {
    console.error("Error fetching Twitch channels:", error);
    return NextResponse.json(
      { error: "Error fetching Twitch channels" },
      { status: 500 }
    );
  }
}
