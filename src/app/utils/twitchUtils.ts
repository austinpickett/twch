import axios from "axios";

export async function getChannels(): Promise<string[]> {
  try {
    const response = await axios.get("https://twch.xyz/api/getTwitchChannels");
    return response.data;
  } catch (error) {
    console.error("Error fetching channels:", error);
    throw new Error("Failed to fetch channels. Please try again later.");
  }
}

export async function getStreamInfo(
  channel: string
): Promise<{ title: string }> {
  try {
    // Replace this with your actual API call to get stream info
    const response = await axios.get(
      `https://twch.xyz/api/getTwitchStreamInfo?channel=${channel}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching stream info:", error);
    return { title: "Stream information unavailable" };
  }
}
