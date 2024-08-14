"use client";
import ChannelDisplay from "@/components/ChannelDisplay";
import Modal from "@/components/Modal";
import RemoteButton from "@/components/RemoteButton";
import useChannels from "@/hooks/useChannels";
import {
  ChevronDown,
  ChevronUp,
  Expand,
  Info,
  Minimize,
  Power,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
const Static = () => (
  <div className="w-full h-full bg-static-pattern bg-repeat fixed top-0 z-10" />
);

const Home: React.FC = () => {
  const staticRef = useRef<HTMLDivElement>(null);
  const [showStatic, setShowStatic] = useState<boolean>(false);
  const { channels, isLoading, error } = useChannels();
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [isRemoteExpanded, setIsRemoteExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const toggleRemoteExpansion = () => setIsRemoteExpanded(!isRemoteExpanded);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  if (isLoading) return <Static />;
  if (error) return <div>Error: {error}</div>;
  if (channels.length === 0) return <div>No channels available</div>;

  const currentChannel = channels[currentChannelIndex];

  return (
    <main className="w-full h-screen relative bg-black">
      {isPoweredOn && (
        <>
          <iframe
            className="w-full h-full"
            src={`https://player.twitch.tv/?channel=${currentChannel}&parent=${window.location.hostname}&muted=${isMuted}`}
            allowFullScreen
          ></iframe>
          <ChannelDisplay channelNumber={currentChannelIndex + 1} />
        </>
      )}

      {showStatic && <Static />}

      <div
        className={`absolute bottom-8 right-8 z-20 transition-all duration-300 ${
          isRemoteExpanded ? "scale-100 opacity-100" : "scale-75 opacity-75"
        }`}
      >
        <div className="grid grid-cols-2 gap-4">
          {isRemoteExpanded && (
            <>
              <RemoteButton
                onClick={togglePower}
                icon={<Power />}
                label="Power"
              />
              <RemoteButton
                onClick={() => handleChannelChange("up")}
                icon={<ChevronUp />}
                label="Channel Up"
              />
              <RemoteButton
                onClick={toggleMute}
                icon={isMuted ? <VolumeX /> : <Volume2 />}
                label="Toggle Mute"
              />
              <RemoteButton
                onClick={() => handleChannelChange("down")}
                icon={<ChevronDown />}
                label="Channel Down"
              />
            </>
          )}
          <RemoteButton
            onClick={toggleRemoteExpansion}
            icon={isRemoteExpanded ? <Minimize /> : <Expand />}
            label={isRemoteExpanded ? "Collapse Remote" : "Expand Remote"}
          />
          <RemoteButton
            onClick={toggleModal}
            icon={<Info />}
            label="Information"
          />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div className="mb-4">
          <h2 className="text-xl">Email</h2>
          <p>phragg@example.com</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl">Support</h2>
          <p>0x862bF52be02a2AbF96FdAeB22EA9089E821b0591</p>
        </div>

        <div>
          <h2 className="text-xl">Inspiration</h2>
          <p>https://ytch.xyz</p>
        </div>
      </Modal>
    </main>
  );
};

export default Home;
