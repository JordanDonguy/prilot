import { config } from "../../config";
import { resend } from "../client";
import { baseEmailTemplate } from "./baseEmailTemplate";

interface SendPasswordResetParams {
	to: string;
	resetUrl: string;
}

export async function sendPasswordResetEmail({
	to,
	resetUrl,
}: SendPasswordResetParams) {
	const body = `
    <p>Hello,</p>

    <p>
      We received a request to reset your password on <strong>${config.appName}</strong>.
    </p>

    <p style="margin-top:16px;">Click the button below to set a new password:</p>

    <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:24px auto;">
      <tr>
        <td>
          <a href="${resetUrl}"
            style="display:inline-block; padding:12px 24px; background-color:#4f46e5;
                   color:#ffffff; text-decoration:none; font-weight:700; border-radius:6px;">
            Reset Password
          </a>
        </td>
      </tr>
    </table>

    <p style="font-size:14px; color:#6b7280;">
      This link will expire in 10 minutes.
    </p>

    <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />

    <p style="font-size:12px; color:#9ca3af; text-align:center;">
      If you did not request a password reset, you can safely ignore this email.
    </p>
  `;

	const html = baseEmailTemplate({
		title: "Password Reset",
		heading: "Reset Your Password",
		body,
	});

	return resend.emails.send({
		from: `${config.appName} <security@${config.domainName}>`,
		to,
		subject: "Reset your password",
		html,
	});
}
