import { config } from "../../config";
import { escapeHtml } from "../../escapeHtml";
import { resend } from "../client";
import { baseEmailTemplate } from "./baseEmailTemplate";

interface SendMemberJoinedParams {
  to: string;
  repoName: string;
  username: string;
}

export async function sendMemberJoinedEmail({
  to,
  repoName,
  username,
}: SendMemberJoinedParams) {
  const safeUsername = escapeHtml(username);
  const safeRepoName = escapeHtml(repoName);

  const html = baseEmailTemplate({
    title: "New member joined",
    heading: "A new member joined your repository",
    body: `
      <p>
        <strong>${safeUsername}</strong> has accepted the invitation and joined
        the repository <strong>${safeRepoName}</strong>.
      </p>
    `,
  });

  return resend.emails.send({
    from: `${config.appName} <noreply@${config.domainName}>`,
    to,
    subject: `${safeUsername} joined ${safeRepoName}`,
    html,
  });
}
