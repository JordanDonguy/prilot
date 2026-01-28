import { config } from "../../config";
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
  const html = baseEmailTemplate({
    title: "New member joined",
    heading: "A new member joined your repository",
    body: `
      <p>
        <strong>${username}</strong> has accepted the invitation and joined
        the repository <strong>${repoName}</strong>.
      </p>
    `,
  });

  return resend.emails.send({
    from: `${config.appName} <notify@${config.domainName}>`,
    to,
    subject: `${username} joined ${repoName}`,
    html,
  });
}
