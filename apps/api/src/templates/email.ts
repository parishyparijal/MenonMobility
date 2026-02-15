// ---------------------------------------------------------------------------
// Email Templates
// ---------------------------------------------------------------------------

const BRAND = "Menon Mobility";
const SITE_URL = process.env.CLIENT_URL || "https://menonmobility.com";
const ACCENT = "#F26522";
const PRIMARY = "#1E3A5F";

function layout(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:${PRIMARY};padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">${BRAND}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background:#f9fafb;text-align:center;color:#6b7280;font-size:12px;">
              <p style="margin:0 0 8px;">&copy; ${new Date().getFullYear()} ${BRAND}. All rights reserved.</p>
              <p style="margin:0;">
                <a href="${SITE_URL}" style="color:${ACCENT};text-decoration:none;">${SITE_URL}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(text: string, url: string): string {
  return `
<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td style="background:${ACCENT};border-radius:6px;padding:12px 28px;">
      <a href="${url}" style="color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">${text}</a>
    </td>
  </tr>
</table>`;
}

// ---------------------------------------------------------------------------

export const emailTemplates = {
  welcome(data: { name: string }) {
    return {
      subject: `Welcome to ${BRAND}!`,
      html: layout(`
        <h2 style="color:${PRIMARY};margin:0 0 16px;">Welcome, ${data.name}!</h2>
        <p style="color:#374151;line-height:1.6;margin:0 0 16px;">
          Thank you for joining ${BRAND} — Europe's premier marketplace for commercial vehicles.
        </p>
        <p style="color:#374151;line-height:1.6;margin:0 0 16px;">
          You can now browse thousands of trucks, trailers, and construction equipment from verified dealers across Europe.
        </p>
        ${button("Explore Listings", `${SITE_URL}/search`)}
        <p style="color:#6b7280;font-size:13px;margin:16px 0 0;">
          If you have any questions, feel free to reach us at <a href="${SITE_URL}/contact" style="color:${ACCENT};">our contact page</a>.
        </p>
      `),
    };
  },

  passwordReset(data: { name: string; resetUrl: string }) {
    return {
      subject: `Reset your ${BRAND} password`,
      html: layout(`
        <h2 style="color:${PRIMARY};margin:0 0 16px;">Password Reset</h2>
        <p style="color:#374151;line-height:1.6;margin:0 0 16px;">
          Hi ${data.name}, we received a request to reset your password.
        </p>
        ${button("Reset Password", data.resetUrl)}
        <p style="color:#6b7280;font-size:13px;margin:16px 0 0;">
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
      `),
    };
  },

  listingApproved(data: { name: string; listingTitle: string; listingSlug: string }) {
    return {
      subject: `Your listing "${data.listingTitle}" is now live!`,
      html: layout(`
        <h2 style="color:${PRIMARY};margin:0 0 16px;">Listing Approved</h2>
        <p style="color:#374151;line-height:1.6;margin:0 0 16px;">
          Hi ${data.name}, great news! Your listing <strong>"${data.listingTitle}"</strong> has been approved and is now visible to buyers.
        </p>
        ${button("View Your Listing", `${SITE_URL}/listings/${data.listingSlug}`)}
      `),
    };
  },

  listingRejected(data: { name: string; listingTitle: string; reason?: string }) {
    return {
      subject: `Your listing "${data.listingTitle}" was not approved`,
      html: layout(`
        <h2 style="color:${PRIMARY};margin:0 0 16px;">Listing Not Approved</h2>
        <p style="color:#374151;line-height:1.6;margin:0 0 16px;">
          Hi ${data.name}, unfortunately your listing <strong>"${data.listingTitle}"</strong> was not approved.
        </p>
        ${data.reason ? `<p style="color:#374151;line-height:1.6;margin:0 0 16px;"><strong>Reason:</strong> ${data.reason}</p>` : ""}
        <p style="color:#374151;line-height:1.6;margin:0 0 16px;">
          Please review the listing details and resubmit after making the necessary changes.
        </p>
        ${button("Edit Listing", `${SITE_URL}/seller/listings`)}
      `),
    };
  },

  newMessage(data: { name: string; senderName: string; listingTitle: string; messagePreview: string }) {
    return {
      subject: `New message from ${data.senderName} about "${data.listingTitle}"`,
      html: layout(`
        <h2 style="color:${PRIMARY};margin:0 0 16px;">New Message</h2>
        <p style="color:#374151;line-height:1.6;margin:0 0 16px;">
          Hi ${data.name}, you have a new message from <strong>${data.senderName}</strong> about <strong>"${data.listingTitle}"</strong>:
        </p>
        <div style="background:#f3f4f6;border-left:4px solid ${ACCENT};padding:16px;border-radius:0 4px 4px 0;margin:16px 0;">
          <p style="color:#374151;margin:0;font-style:italic;">"${data.messagePreview}"</p>
        </div>
        ${button("Reply Now", `${SITE_URL}/messages`)}
      `),
    };
  },

  subscriptionConfirmed(data: { name: string; planName: string }) {
    return {
      subject: `Subscription confirmed — ${data.planName} plan`,
      html: layout(`
        <h2 style="color:${PRIMARY};margin:0 0 16px;">Subscription Confirmed</h2>
        <p style="color:#374151;line-height:1.6;margin:0 0 16px;">
          Hi ${data.name}, your <strong>${data.planName}</strong> subscription is now active. Thank you for choosing ${BRAND}!
        </p>
        <p style="color:#374151;line-height:1.6;margin:0 0 16px;">
          You can manage your subscription and billing from your account settings.
        </p>
        ${button("Manage Subscription", `${SITE_URL}/account/subscription`)}
      `),
    };
  },

  contactForm(data: { name: string; email: string; subject: string; message: string }) {
    return {
      subject: `[Contact Form] ${data.subject}`,
      html: layout(`
        <h2 style="color:${PRIMARY};margin:0 0 16px;">New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px 0;color:#6b7280;width:80px;"><strong>Name:</strong></td><td style="color:#374151;">${data.name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;"><strong>Email:</strong></td><td style="color:#374151;">${data.email}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;"><strong>Subject:</strong></td><td style="color:#374151;">${data.subject}</td></tr>
        </table>
        <div style="background:#f3f4f6;padding:16px;border-radius:4px;margin:16px 0;">
          <p style="color:#374151;margin:0;white-space:pre-wrap;">${data.message}</p>
        </div>
      `),
    };
  },
};
