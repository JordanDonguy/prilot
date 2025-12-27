"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

type DeleteMemberModalProps = {
  member: { first_name: string; last_name: string } | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteMemberModal({ member, onClose, onConfirm }: DeleteMemberModalProps) {
  if (!member) return null;

  return (
    <div className="fixed backdrop-blur-sm inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800/90 p-6"
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
          Are you sure you want to remove <strong>{member.first_name} {member.last_name}</strong>?
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
            type="button"
            onClick={onConfirm}
            className="px-4 h-9 rounded-lg bg-red-600 text-white hover:cursor-pointer hover:opacity-90"
          >
            Remove
          </button>
        </div>
      </motion.div>
    </div>
  );
}
