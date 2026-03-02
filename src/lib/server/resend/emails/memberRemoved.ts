import { config } from "../../config";
import { escapeHtml } from "../../escapeHtml";
import { resend } from "../client";
import { baseEmailTemplate } from "./baseEmailTemplate";

interface SendMemberRemovedParams {
  to: string;
  repoName: string;
  removedBy: string;
}

export async function sendMemberRemovedEmail({
  to,
  repoName,
  removedBy,
}: SendMemberRemovedParams) {
  const safeRepoName = escapeHtml(repoName);
  const safeRemovedBy = escapeHtml(removedBy);

  const html = baseEmailTemplate({
    title: "Access removed",
    heading: "You’ve been removed from a repository",
    body: `
      <p>
        You have been removed from the repository
        <strong>${safeRepoName}</strong> by <strong>${safeRemovedBy}</strong>.
      </p>

      <p style="margin-top:16px;">
        If you believe this was a mistake, you can contact the repository
        owner for clarification.
      </p>
    `,
  });

  return resend.emails.send({
    from: `${config.appName} <noreply@${config.domainName}>`,
    to,
    subject: `Removed from ${safeRepoName}`,
    html,
  });
}
