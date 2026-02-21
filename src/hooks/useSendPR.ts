import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useRepoStore } from "@/stores/repoStore";

export function useSendPR(repoId: string, prId: string | null) {
	const router = useRouter();
	const [isSendingPr, setIsSendingPr] = useState(false);
	const [providerPrUrl, setProviderPrUrl] = useState<string | null>(null);

	const updateDraftPrCount = useRepoStore((s) => s.updateDraftPrCount);
	const updateSentPrCount = useRepoStore((s) => s.updateSentPrCount);
	const setRepoDisconnected = useRepoStore((s) => s.setRepoDisconnected);

	const sendPR = useCallback(async () => {
		if (!prId) return;
		setIsSendingPr(true);

		try {
			const res = await fetchWithAuth(
				`/api/repos/${repoId}/pull-requests/${prId}/send`,
				{
					method: "POST",
				},
			);

			if (res.ok) {
				const data: { url: string } = await res.json();
				setProviderPrUrl(data.url);

				// Update local PR counts
				updateDraftPrCount(repoId, -1);
				updateSentPrCount(repoId, +1);
				return;
			}

			// Handle repo access revoked (public repo with revoked installation)
			const body = await res.json().catch(() => null);
			if (body?.code === "REPO_ACCESS_REVOKED") {
				setRepoDisconnected(repoId);
				toast.error("Repository access has been revoked by the provider.");
				router.replace(`/dashboard/repo/${repoId}`);
				return;
			}

			toast.error(
				"An error has occurred while sending your PR... Please try again later.",
			);
		} catch (err) {
			console.error(err);
			toast.error(
				"An error has occurred while sending your PR... Please try again later.",
			);
		} finally {
			setIsSendingPr(false);
		}
	}, [
		repoId,
		prId,
		updateDraftPrCount,
		updateSentPrCount,
		setRepoDisconnected,
		router,
	]);

	return { isSendingPr, providerPrUrl, sendPR, setRepoDisconnected };
}
