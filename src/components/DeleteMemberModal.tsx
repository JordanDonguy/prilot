"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Member } from "@/types/members";

type DeleteMemberModalProps = {
  member: Member | null;
  onClose: () => void;
  onConfirm: () => void;
  disabled?: boolean;
};

export function DeleteMemberModal({ member, onClose, onConfirm, disabled }: DeleteMemberModalProps) {
  if (!member) return null;

  return (
    <div className="fixed backdrop-blur-sm inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="pointer-events-auto w-full max-w-sm rounded-xl bg-white dark:bg-zinc-950/90 border border-gray-200 dark:border-gray-800 p-6 shadow-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">Remove member</h2>
          <button
            type="button"
            onClick={onClose}
            className="hover:opacity-70 hover:cursor-pointer transition"
          >
            <X />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to remove <strong>{member.username}</strong>?
          <br />
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 h-9 rounded-lg border border-gray-400 dark:border-gray-600 hover:cursor-pointer hover:opacity-80"
          >
            Cancel
          </button>

          <button
            disabled={disabled}
            type="button"
            onClick={onConfirm}
            className="px-4 h-9 rounded-lg bg-red-600 text-white hover:cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Remove
          </button>
        </div>
      </motion.div>
    </div>
  );
}
