import debounce from "lodash.debounce";
import { useEffect, useMemo } from "react";

export function useAutoSavePR({
  prId,
  repoId,
  title,
  description,
  startAutoSave,
}: {
  prId: string | null;
  repoId: string;
  title: string;
  description: string;
  startAutoSave: React.RefObject<boolean>;
}) {
  const saveDraft = useMemo(
    () =>
      // Use debounce function to trigger save every seconds
      debounce(async (title: string, description: string) => {
        if (!prId || !startAutoSave.current) return;
        try {
          await fetch(`/api/repos/${repoId}/pull-requests/${prId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prTitle: title, prBody: description }),
          });
        } catch (err) {
          console.error("Failed to save draft", err);
        }
      }, 1000),
    [prId, repoId, startAutoSave.current]
  );

  useEffect(() => {
    if (startAutoSave.current) saveDraft(title, description);
  }, [title, description, saveDraft, startAutoSave.current]);

  useEffect(() => () => saveDraft.cancel(), [saveDraft]);
}
