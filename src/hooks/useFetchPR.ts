import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { PRLanguage } from "@/types/languages";
import type { IPullRequest } from "@/types/pullRequests";

interface IDraftPR extends IPullRequest {
	description: string;
	language: PRLanguage;
	mode: "fast" | "deep";
}

export function useFetchPR({
	repoId,
	prId,
	skipNextFetch
}: {
	repoId: string;
	prId: string | null;
	skipNextFetch: React.RefObject<boolean>
}) {
	const router = useRouter();
	const [pullRequest, setPullRequest] = useState<IDraftPR | null>();

	const [loading, setLoading] = useState(!!prId);

	useEffect(() => {
		if (!prId || pullRequest) return;

		const fetchPR = async () => {
			if (skipNextFetch.current) {
				skipNextFetch.current = false;
				return;
			}
			setLoading(true);

			try {
				const res = await fetch(`/api/repos/${repoId}/pull-requests/${prId}`);
				if (!res.ok) throw new Error("Failed to fetch PR");
				const data = await res.json();

				// Redirect to repo page if trying to edit an already sent PR
				if (data.status === "sent") {
					toast.info("You can't edit an already sent PR");
					return router.replace(`/dashboard/repo/${repoId}`);
				}

				setPullRequest(data);
			} catch (err) {
				console.error(err);
				toast.error("Failed to load draft PR");
			} finally {
				setLoading(false);
			}
		};

		fetchPR();
	}, [prId, repoId, router.replace, pullRequest, skipNextFetch]);

	return { pullRequest, loading, skipNextFetch };
}
