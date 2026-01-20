import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useRepoStore } from "@/stores/repoStore";

export function useSendPR(repoId: string, prId: string | null) {
	const [isSendingPr, setIsSendingPr] = useState(false);
	const [providerPrUrl, setProviderPrUrl] = useState<string | null>(null);

	const updateDraftPrCount = useRepoStore((s) => s.updateDraftPrCount);
	const updateSentPrCount = useRepoStore((s) => s.updateSentPrCount);

	const sendPR = useCallback(async () => {
		if (!prId) return;
		setIsSendingPr(true);

		try {
			const res = await fetch(
				`/api/repos/${repoId}/pull-requests/${prId}/send`, {
          method: "POST"
        },
			);

			if (res.ok) {
				const data: { url: string } = await res.json();
				setProviderPrUrl(data.url);

				// Update local PR counts
				updateDraftPrCount(repoId, -1);
				updateSentPrCount(repoId, +1);
			}
		} catch (err) {
			console.error(err);
			toast.error("An error has occurred while sending your PR... Please try again later.");
		} finally {
			setIsSendingPr(false);
		}
	}, [repoId, prId, updateDraftPrCount, updateSentPrCount]);

	return { isSendingPr, providerPrUrl, sendPR };
}
