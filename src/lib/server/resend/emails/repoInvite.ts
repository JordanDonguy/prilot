import { config } from "../../config";
import { resend } from "../client";
import { baseEmailTemplate } from "./baseEmailTemplate";

interface SendRepoInviteParams {
	to: string;
	repoName: string;
	owner: string;
	inviteUrl: string;
	declineUrl: string;
}

export async function sendRepoInviteEmail({
	to,
	repoName,
	owner,
	inviteUrl,
	declineUrl,
}: SendRepoInviteParams) {
	const body = `
    <p>Hello,</p>

    <p>
      <strong>${owner}</strong> has invited you to join the repository
      <strong>${repoName}</strong> on <strong>${config.appName}</strong>.
    </p>

    <p style="margin-top:16px;">Please choose an option below:</p>

    <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:24px auto;">
      <tr>
        <td style="padding-right:8px;">
          <a href="${inviteUrl}"
            style="display:inline-block; padding:12px 24px; background-color:#4f46e5;
                   color:#ffffff; text-decoration:none; font-weight:700; border-radius:6px;">
            Accept Invitation
          </a>
        </td>
        <td>
          <a href="${declineUrl}"
            style="display:inline-block; padding:12px 24px; background-color:#e5e7eb;
                   color:#374151; text-decoration:none; font-weight:700; border-radius:6px;">
            Decline Invitation
          </a>
        </td>
      </tr>
    </table>

    <p style="font-size:14px; color:#6b7280;">
      This invitation will expire in 7 days.
    </p>

    <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />

    <p style="font-size:12px; color:#9ca3af; text-align:center;">
      If you did not expect this invitation, you can safely ignore this email.
    </p>
  `;

	const html = baseEmailTemplate({
		title: "Repository Invitation",
		heading: "You’re Invited!",
		body,
	});

	return resend.emails.send({
		from: `${config.appName} <invite@${config.domainName}>`,
		to,
		subject: `You’ve been invited by ${owner} to join ${repoName}`,
		html,
	});
}
