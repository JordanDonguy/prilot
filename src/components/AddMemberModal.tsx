"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

type AddMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => void;
};

export function AddMemberModal({ isOpen, onClose, onInvite }: AddMemberModalProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(email);
    setEmail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed backdrop-blur-sm inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800/90 p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Invite member</h2>
          <button
            className="hover:cursor-pointer hover:opacity-70 transition-colors"
            type="button"
            onClick={onClose}
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="email"
            placeholder="user@email.com"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-zinc-950 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full h-9 rounded-lg bg-gray-900 text-white dark:bg-gray-200 dark:text-black hover:cursor-pointer hover:opacity-90"
          >
            Send invite
          </button>
        </form>
      </motion.div>
    </div>
  );
}
