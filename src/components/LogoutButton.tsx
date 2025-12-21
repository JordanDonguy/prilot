"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type LogoutButtonProps = {
  /** Extra Tailwind/CSS classes for the button */
  className?: string;
  /** Optional text to display next to the icon */
  showText?: boolean;
  /** Icon size, default to 24 */
  size?: number;
};

export default function LogoutButton({
  className = "",
  showText = false,
  size = 24,
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      toast.success("Successfully logged out! See you later 👋")
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("An error has occured when logging you out. Please try again later.")
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`flex items-center justify-center gap-2 rounded-full p-2 bg-gray-300 dark:bg-cyan-900
        hover:cursor-pointer hover:bg-gray-400/70 hover:dark:bg-cyan-500/70 transition-colors ${className}`}
      aria-label="Logout"
    >
      <LogOut size={size} className={`${showText ? "absolute ml-2" : ""}`} />
      {showText && (
        <span className="mx-auto w-full">
          Déconnexion
        </span>
      )}
    </button>
  );
}
