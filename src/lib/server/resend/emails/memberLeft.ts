import { config } from "../../config";
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
  const html = baseEmailTemplate({
    title: "Member left repository",
    heading: "A member left your repository",
    body: `
      <p>
        <strong>${username}</strong> has left the repository
        <strong>${repoName}</strong>.
      </p>
    `,
  });

  return resend.emails.send({
    from: `${config.appName} <notify@${config.domainName}>`,
    to,
    subject: `${username} left ${repoName}`,
    html,
  });
}
