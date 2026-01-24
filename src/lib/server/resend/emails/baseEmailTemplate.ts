import { config } from "../../config";

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
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="background:linear-gradient(to bottom, #e0f0ff 0%, #ffffff 35%, #ffffff 100%);
                 border-radius:8px;
                 overflow:hidden;
                 border:1px solid #e0f0ff;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:32px;">
              <img src="${logoUrl}" alt="${config.appName}" style="height:48px; margin-bottom:24px;" />
              <h1 style="margin:0; font-size:24px; font-weight:700; color:#111827;">
                ${heading}
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
            <td style="background-color:#eff6ff; text-align:center; font-size:12px; color:#9ca3af; padding:16px;">
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
