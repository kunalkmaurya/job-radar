import { Resend } from 'resend';

export interface SendPasswordResetParams {
  to: string;
  resetUrl: string;
  userName?: string;
}

export interface SendWelcomeEmailParams {
  to: string;
  userName?: string;
  dashboardUrl?: string;
}

export interface DigestJobItem {
  company: string;
  role: string;
  location?: string;
  link: string;
}

export interface SendJobDigestParams {
  to: string;
  userName?: string;
  frequency: 'weekly' | 'monthly';
  jobs: DigestJobItem[];
  dashboardUrl?: string;
}

function getResendClient(): { resend: Resend | null; fromAddress: string } {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromAddress = process.env.RESEND_FROM_EMAIL?.trim() || 'Job Radar <onboarding@resend.dev>';
  if (!apiKey) {
    return { resend: null, fromAddress };
  }
  return { resend: new Resend(apiKey), fromAddress };
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
  userName,
}: SendPasswordResetParams): Promise<{ success: boolean; error?: string; simulated?: boolean }> {
  const { resend, fromAddress } = getResendClient();

  if (!resend) {
    console.warn(
      `[Resend Simulation] RESEND_API_KEY not set. Password reset link for ${to}: ${resetUrl}`
    );
    return { success: true, simulated: true };
  }

  try {
    const displayName = userName || to.split('@')[0];

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0d1117; color: #e6edf3; border-radius: 8px; border: 1px solid #30363d;">
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #21262d;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #58a6ff; letter-spacing: 0.5px;">JOB RADAR</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #8b949e;">Career Board & Pipeline Tracker</p>
        </div>
        <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #f0f6fc;">Password Reset Request</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #c9d1d9; margin-bottom: 24px;">
          Hello ${displayName},<br/>
          We received a request to reset the password for your Job Radar account. Click the button below to choose a new password. This link is valid for 1 hour.
        </p>
        <div style="margin: 28px 0; text-align: left;">
          <a href="${resetUrl}" style="background-color: #238636; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Your Password
          </a>
        </div>
        <p style="font-size: 12px; line-height: 1.5; color: #8b949e; margin-top: 24px; word-break: break-all;">
          If the button above does not work, copy and paste this URL into your browser:<br/>
          <a href="${resetUrl}" style="color: #58a6ff; text-decoration: underline;">${resetUrl}</a>
        </p>
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #21262d; font-size: 11px; color: #6e7681;">
          If you did not request a password reset, you can safely ignore this email.
        </div>
      </div>
    `;

    const textContent = `
Job Radar - Password Reset

Hello ${displayName},
Use the link below to set a new password (valid for 1 hour):
${resetUrl}

If you did not request this, please ignore this email.
    `.trim();

    const result = await resend.emails.send({
      from: fromAddress,
      to,
      subject: 'Reset your Job Radar password',
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      console.error('[Resend Error]', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to send reset email';
    console.error('[Resend Exception]', errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function sendWelcomeEmail({
  to,
  userName,
  dashboardUrl = 'https://jobradar.app/dashboard',
}: SendWelcomeEmailParams): Promise<{ success: boolean; error?: string; simulated?: boolean }> {
  const { resend, fromAddress } = getResendClient();

  if (!resend) {
    console.warn(`[Resend Simulation] Welcome email simulated for ${to}`);
    return { success: true, simulated: true };
  }

  try {
    const displayName = userName || to.split('@')[0];

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background: #0d1117; color: #e6edf3; border-radius: 8px; border: 1px solid #30363d;">
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #21262d;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #58a6ff; letter-spacing: 0.5px;">JOB RADAR</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #8b949e;">Career Board & High-Speed Job Tracker</p>
        </div>
        <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #f0f6fc;">Welcome to Job Radar, ${displayName}!</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #c9d1d9; margin-bottom: 20px;">
          Your personal pipeline is ready. Job Radar helps you track applications from initial discovery through offers with zero friction.
        </p>

        <div style="margin: 20px 0; padding: 16px; background: #161b22; border: 1px solid #30363d; border-radius: 6px;">
          <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #58a6ff;">What you can do next:</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8; color: #c9d1d9;">
            <li><strong>Interactive Kanban:</strong> Drag-and-drop jobs across stages from Saved to Interviewing.</li>
            <li><strong>Curated Feed:</strong> Discover fresh high-signal tech roles added by the community.</li>
            <li><strong>Automated Ingestion:</strong> Capture jobs with the 1-click browser bookmarklet or Telegram bot.</li>
            <li><strong>Email Digests:</strong> Configure weekly or monthly opportunity digests in your Profile.</li>
          </ul>
        </div>

        <div style="margin: 28px 0; text-align: left;">
          <a href="${dashboardUrl}" style="background-color: #238636; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">
            Open Your Dashboard
          </a>
        </div>

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #21262d; font-size: 11px; color: #6e7681;">
          You received this email because you created an account on Job Radar. You can configure notification preferences anytime from your Profile settings.
        </div>
      </div>
    `;

    const textContent = `
Welcome to Job Radar, ${displayName}!

Your personal job pipeline is ready: ${dashboardUrl}

What you can do next:
- Interactive Kanban: Manage job applications across custom stages.
- Curated Feed: Discover high-signal roles.
- Email Digests: Configure weekly or monthly opportunity roundups in your Profile.

Open your dashboard: ${dashboardUrl}
    `.trim();

    const result = await resend.emails.send({
      from: fromAddress,
      to,
      subject: 'Welcome to Job Radar',
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      console.error('[Resend Welcome Error]', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to send welcome email';
    console.error('[Resend Welcome Exception]', errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function sendJobDigestEmail({
  to,
  userName,
  frequency,
  jobs,
  dashboardUrl = 'https://jobradar.app/dashboard',
}: SendJobDigestParams): Promise<{ success: boolean; error?: string; simulated?: boolean }> {
  const { resend, fromAddress } = getResendClient();

  if (!resend) {
    console.warn(`[Resend Simulation] Job digest email (${frequency}) simulated for ${to}`);
    return { success: true, simulated: true };
  }

  try {
    const displayName = userName || to.split('@')[0];
    const periodLabel = frequency === 'weekly' ? 'Weekly' : 'Monthly';

    const jobsHtml = jobs
      .map(
        (j) => `
        <div style="padding: 12px; margin-bottom: 8px; background: #161b22; border: 1px solid #30363d; border-radius: 6px;">
          <div style="font-size: 14px; font-weight: 600; color: #58a6ff;">
            <a href="${j.link}" style="color: #58a6ff; text-decoration: none;">${j.role}</a>
          </div>
          <div style="font-size: 12px; color: #c9d1d9; margin-top: 4px;">
            ${j.company} ${j.location ? `&bull; ${j.location}` : ''}
          </div>
        </div>
      `
      )
      .join('');

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background: #0d1117; color: #e6edf3; border-radius: 8px; border: 1px solid #30363d;">
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #21262d;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #58a6ff; letter-spacing: 0.5px;">JOB RADAR</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #8b949e;">Your ${periodLabel} Opportunities Digest</p>
        </div>
        <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #f0f6fc;">Hello ${displayName}, here are your top roles:</h3>
        
        <div style="margin: 20px 0;">
          ${jobsHtml}
        </div>

        <div style="margin: 28px 0; text-align: left;">
          <a href="${dashboardUrl}" style="background-color: #238636; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">
            View All in Dashboard
          </a>
        </div>

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #21262d; font-size: 11px; color: #6e7681;">
          You are receiving this ${frequency} digest based on your preferences. To modify or unsubscribe, visit your <a href="${dashboardUrl}/profile" style="color: #58a6ff;">Profile Settings</a>.
        </div>
      </div>
    `;

    const textContent = `
Job Radar - Your ${periodLabel} Opportunities Digest

Hello ${displayName}, here are your latest curated roles:

${jobs.map((j) => `- ${j.role} at ${j.company} (${j.link})`).join('\n')}

View all roles in your dashboard: ${dashboardUrl}
To change digest frequency, update your Profile: ${dashboardUrl}/profile
    `.trim();

    const result = await resend.emails.send({
      from: fromAddress,
      to,
      subject: `Job Radar: Your ${periodLabel} Job Opportunities Digest`,
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      console.error('[Resend Digest Error]', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to send digest email';
    console.error('[Resend Digest Exception]', errorMsg);
    return { success: false, error: errorMsg };
  }
}
