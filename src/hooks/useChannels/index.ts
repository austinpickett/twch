"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const useChannels = () => {
  const [channels, setChannels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/getTwitchChannels");
        setChannels(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching channels:", error);
        setError("Failed to fetch channels. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  return { channels, isLoading, error };
};

export default useChannels;
