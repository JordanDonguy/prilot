import { config } from "../../config";
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
  const html = baseEmailTemplate({
    title: "Access removed",
    heading: "You’ve been removed from a repository",
    body: `
      <p>
        You have been removed from the repository
        <strong>${repoName}</strong> by <strong>${removedBy}</strong>.
      </p>

      <p style="margin-top:16px;">
        If you believe this was a mistake, you can contact the repository
        owner for clarification.
      </p>
    `,
  });

  return resend.emails.send({
    from: `${config.appName} <notify@${config.domainName}>`,
    to,
    subject: `Removed from ${repoName}`,
    html,
  });
}
