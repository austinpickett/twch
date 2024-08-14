interface ChannelDisplayProps {
  channelNumber: number;
}

const ChannelDisplay: React.FC<ChannelDisplayProps> = ({ channelNumber }) => (
  <div className="absolute top-4 left-4 z-20 font-mono text-2xl text-green-500 font-bold">
    <span>CH {channelNumber.toString().padStart(2, "0")}</span>
  </div>
);

export default ChannelDisplay;
