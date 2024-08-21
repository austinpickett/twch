import axios from "axios";

export async function getChannels(): Promise<string[]> {
  try {
    const response = await axios.get(
      "https://your-domain.com/api/getTwitchChannels"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching channels:", error);
    throw new Error("Failed to fetch channels. Please try again later.");
  }
}
