import { config } from "../../config";
import { resend } from "../client";
import { baseEmailTemplate } from "./baseEmailTemplate";

interface SendInvitationDeclinedParams {
  to: string;
  repoName: string;
  declinedBy: string;
}

export async function sendInvitationDeclinedEmail({
  to,
  repoName,
  declinedBy,
}: SendInvitationDeclinedParams) {
  const html = baseEmailTemplate({
    title: "Invitation declined",
    heading: "Invitation declined",
    body: `
      <p>
        <strong>${declinedBy}</strong> has declined your invitation to join
        the repository <strong>${repoName}</strong>.
      </p>

      <p style="margin-top:16px;">
        You can resend an invitation at any time or reach out to them
        directly if needed.
      </p>
    `,
  });

  return resend.emails.send({
    from: `${config.appName} <notify@${config.domainName}>`,
    to,
    subject: `${declinedBy} declined your invitation to ${repoName}`,
    html,
  });
}
