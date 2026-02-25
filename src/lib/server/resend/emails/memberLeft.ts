import { config } from "../../config";
import { escapeHtml } from "../../escapeHtml";
import { resend } from "../client";
import { baseEmailTemplate } from "./baseEmailTemplate";

interface SendMemberLeftParams {
  to: string;
  repoName: string;
  username: string;
}

export async function sendMemberLeftEmail({
  to,
  repoName,
  username,
}: SendMemberLeftParams) {
  const safeUsername = escapeHtml(username);
  const safeRepoName = escapeHtml(repoName);

  const html = baseEmailTemplate({
    title: "Member left repository",
    heading: "A member left your repository",
    body: `
      <p>
        <strong>${safeUsername}</strong> has left the repository
        <strong>${safeRepoName}</strong>.
      </p>
    `,
  });

  return resend.emails.send({
    from: `${config.appName} <notify@${config.domainName}>`,
    to,
    subject: `${safeUsername} left ${safeRepoName}`,
    html,
  });
}
