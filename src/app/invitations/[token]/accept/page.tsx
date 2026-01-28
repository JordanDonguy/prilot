import { InvitationActionPage } from "@/components/InvitationActionPage";

export default function AcceptInvitationPage() {
	return (
		<InvitationActionPage
			title="Accept Invitation"
			apiEndpoint="/api/invitations/accept"
			successMessage="Repository added to your dashboard 🎉"
			notLoggedInMessage={
				<>
					Please log in using the{" "}
					<strong className="text-gray-700 dark:text-gray-300">
						same email address
					</strong>{" "}
					that received this invitation.
				</>
			}
		/>
	);
}
