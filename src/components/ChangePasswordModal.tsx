"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  if (!isOpen) return null;

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error("Passwords do not match");
    }
    toast.success("Password updated successfully");
    setPasswords({ current: "", new: "", confirm: "" });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-950/90 border border-gray-200 dark:border-gray-800 p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Change password</h2>
          <button
            type="button"
            onClick={onClose}
            className="hover:cursor-pointer hover:opacity-70 transition-colors"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="currentPassword">Current password</label>
            <input
              required
              id="currentPassword"
              type="password"
              placeholder="Current password"
              className="mt-2 w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-gray-300/40 dark:bg-gray-900/40 focus:outline-none"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword">New password</label>
            <input
              required
              id="newPassword"
              type="password"
              placeholder="New password"
              className="mt-2 w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-gray-300/40 dark:bg-gray-900/40 focus:outline-none"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              required
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              className="mt-2 w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-gray-300/40 dark:bg-gray-900/40 focus:outline-none"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full h-10 rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-black hover:cursor-pointer hover:opacity-90"
          >
            Update password
          </button>
        </form>
      </motion.div>
    </div>
  );
}
