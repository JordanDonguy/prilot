import { config } from "../../config";
import { escapeHtml } from "../../escapeHtml";

interface BaseEmailTemplateParams {
  title: string;        // <title> tag
  heading: string;      // H1 title
  body: string;         // HTML body (already escaped / trusted)
}

export function baseEmailTemplate({
  title,
  heading,
  body,
}: BaseEmailTemplateParams) {
  const logoUrl = config.logoUrl;
  const safeTitle = escapeHtml(title);
  const safeHeading = escapeHtml(heading);
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${safeTitle}</title>
</head>
<body style="margin:0; padding:32px; background-color:#dbe1ed; font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="background-color: white; overflow:hidden; border-radius: 16px;
            border-left: 1px solid #aca9be; border-right: 1px solid #aca9be;
        ">
          <!-- Header -->
          <tr>
            <td align="left" style="padding:32px 32px 16px 32px;">
              <img src="${logoUrl}" alt="${config.appName}" style="height:48px; margin-bottom:24px;" />
              <h1 style="margin:0; font-size:32px; font-weight:700; color:#111827;">
                ${safeHeading}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:0 32px 24px; font-size:16px; line-height:1.6; color:#111827;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #dae1ed; text-align:center; font-size:12px; color:#9ca3af; padding:16px;">
              &copy; ${year} ${config.appName}. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
