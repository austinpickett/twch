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

export default RemoteButton;
