"use client";
import axios from "axios";
import { ChevronDown, ChevronUp, Power, Volume2, VolumeX } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

type Channel = string;

// Custom hook for fetching channels
const useChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
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

interface ChannelDisplayProps {
  channelNumber: number;
}

const ChannelDisplay: React.FC<ChannelDisplayProps> = ({ channelNumber }) => (
  <div className="absolute top-4 left-4 z-20 font-mono text-2xl text-green-500 font-bold">
    <span>CH {channelNumber.toString().padStart(2, "0")}</span>
  </div>
);

interface RemoteButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const RemoteButton: React.FC<RemoteButtonProps> = ({
  onClick,
  icon,
  label,
}) => (
  <button
    onClick={onClick}
    className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
    aria-label={label}
  >
    {icon}
  </button>
);

const Home: React.FC = () => {
  const staticRef = useRef<HTMLDivElement>(null);
  const [showStatic, setShowStatic] = useState<boolean>(false);
  const { channels, isLoading, error } = useChannels();
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPoweredOn, setIsPoweredOn] = useState(true);

  const handleChannelChange = useCallback(
    (direction: "up" | "down") => {
      setShowStatic(true);
      setCurrentChannelIndex((prevIndex) => {
        const newIndex =
          direction === "up"
            ? (prevIndex + 1) % channels.length
            : (prevIndex - 1 + channels.length) % channels.length;
        return newIndex;
      });
      setTimeout(() => {
        setShowStatic(false);
      }, 500);
    },
    [channels.length]
  );

  const toggleMute = () => setIsMuted(!isMuted);
  const togglePower = () => setIsPoweredOn(!isPoweredOn);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (channels.length === 0) return <div>No channels available</div>;

  const currentChannel = channels[currentChannelIndex];

  return (
    <main className="w-full h-screen relative bg-black">
      {isPoweredOn && (
        <>
          <iframe
            className="w-full h-full"
            src={`https://player.twitch.tv/?channel=${currentChannel}&parent=embed.example.com&muted=${isMuted}`}
            allowFullScreen
          ></iframe>
          <ChannelDisplay channelNumber={currentChannelIndex + 1} />
        </>
      )}

      <div
        ref={staticRef}
        className={`w-full h-full bg-static-pattern bg-repeat fixed top-0 transition-opacity duration-300 ${
          showStatic ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="absolute bottom-8 right-8 flex flex-col space-y-4 z-20">
        <RemoteButton
          onClick={() => handleChannelChange("up")}
          icon={<ChevronUp />}
          label="Channel Up"
        />
        <RemoteButton
          onClick={() => handleChannelChange("down")}
          icon={<ChevronDown />}
          label="Channel Down"
        />
        <RemoteButton
          onClick={toggleMute}
          icon={isMuted ? <VolumeX /> : <Volume2 />}
          label="Toggle Mute"
        />
        <RemoteButton onClick={togglePower} icon={<Power />} label="Power" />
      </div>
    </main>
  );
};

export default Home;
