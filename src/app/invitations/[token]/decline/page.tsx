import { InvitationActionPage } from "@/components/ui/InvitationActionPage";

export default function DeclineInvitationPage() {
	return (
		<InvitationActionPage
			title="Decline Invitation"
			apiEndpoint="/api/invitations/decline"
			successMessage="Invitation declined"
			loadingMessage="Declining invitation…"
			notLoggedInMessage={
				<>
					Please log in using the{" "}
					<strong className="text-gray-700 dark:text-gray-300">
						same email address
					</strong>{" "}
					that received this invitation in order to decline it.
				</>
			}
		/>
	);
}
