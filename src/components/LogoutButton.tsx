"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@/contexts/UserContext";

type LogoutButtonProps = {
  /** Extra Tailwind/CSS classes for the button */
  className?: string;
  /** Optional text to display next to the icon */
  showText?: boolean;
  /** Custom text label, defaults to "Logout" */
  text?: string;
  /** Icon size, default to 24 */
  size?: number;
  /** Visual variant for different contexts */
  variant?: "default" | "icon";
};

export default function LogoutButton({
  className = "",
  showText = false,
  text = "Logout",
  size = 24,
  variant = "default",
}: LogoutButtonProps) {
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      toast.success("Successfully logged out! See you soon 👋")
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("An error has occured when logging you out. Please try again later.")
    }
  };

  const baseStyles = "flex items-center gap-2 transition-colors hover:cursor-pointer";
  const variantStyles = variant === "icon"
    ? "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    : "rounded-full p-2 bg-gray-200/90 dark:bg-gray-800 hover:bg-gray-300 hover:dark:bg-gray-700";

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`${baseStyles} ${variantStyles} ${className}`}
      aria-label="Logout"
    >
      <LogOut size={size} />
      {showText && (
        <span className={variant === "icon" ? "text-base font-medium" : "mx-auto w-full"}>
          {text}
        </span>
      )}
    </button>
  );
}
