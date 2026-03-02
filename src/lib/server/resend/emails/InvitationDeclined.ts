import { config } from "../../config";
import { escapeHtml } from "../../escapeHtml";
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
  const safeDeclinedBy = escapeHtml(declinedBy);
  const safeRepoName = escapeHtml(repoName);

  const html = baseEmailTemplate({
    title: "Invitation declined",
    heading: "Invitation declined",
    body: `
      <p>
        <strong>${safeDeclinedBy}</strong> has declined your invitation to join
        the repository <strong>${safeRepoName}</strong>.
      </p>

      <p style="margin-top:16px;">
        You can resend an invitation at any time or reach out to them
        directly if needed.
      </p>
    `,
  });

  return resend.emails.send({
    from: `${config.appName} <noreply@${config.domainName}>`,
    to,
    subject: `${safeDeclinedBy} declined your invitation to ${safeRepoName}`,
    html,
  });
}
