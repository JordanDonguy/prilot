import { CircleCheck, PlugZap } from "lucide-react";

type ConnectButtonProps = {
  providerName: string;
  connected: boolean;
  onConnect: () => void;
  icon: React.ReactNode;
  className?: string;
};

export function ConnectButton({ providerName, connected, onConnect, icon, className }: ConnectButtonProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span>{providerName}</span>
      </div>

      {connected ? (
        <span className="h-10 flex justify-center items-center gap-2 bg-gray-300 dark:bg-gray-700 rounded-lg">
          <CircleCheck size={20} className="text-green-600 dark:text-green-500" />
          Connected
        </span>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          className="flex justify-center items-center gap-2 h-10 px-3 rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-black hover:cursor-pointer hover:opacity-90"
        >
          <PlugZap size={20} />
          Connect
        </button>
      )}
    </div>
  );
}
