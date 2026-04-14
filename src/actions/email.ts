"use server";

import { getResend } from "@/lib/resend";
import { getServerEnv, getClientEnv } from "@/env";

/**
 * Send "more information needed" email.
 * Does not include sensitive case content — only a prompt to log in.
 */
export async function sendNeedMoreInfoEmail(
  customerEmail: string,
): Promise<void> {
  const resend = getResend();
  const { RESEND_FROM_EMAIL } = getServerEnv();
  const { NEXT_PUBLIC_SITE_URL } = getClientEnv();

  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: customerEmail,
    subject: "We need a bit more information for your PolicyPal case",
    text: `Hi,

We reviewed your case and need a bit more information before we can finish your plan.

Please log in to your PolicyPal account to view the request and reply in the platform.

${NEXT_PUBLIC_SITE_URL}/dashboard

PolicyPal`,
  });
}

/**
 * Send "case ready" email when playbook is published.
 * Does not include playbook content — only a prompt to log in.
 */
export async function sendCaseReadyEmail(
  customerEmail: string,
): Promise<void> {
  const resend = getResend();
  const { RESEND_FROM_EMAIL } = getServerEnv();
  const { NEXT_PUBLIC_SITE_URL } = getClientEnv();

  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: customerEmail,
    subject: "Your PolicyPal case is ready",
    text: `Hi,

Your PolicyPal case is ready to view.

Please log in to your account to read your plan.

If you have additional questions, you can add them through the platform.

${NEXT_PUBLIC_SITE_URL}/dashboard

PolicyPal`,
  });
}

/**
 * Send "case updated" email.
 * Does not include sensitive case content — only a prompt to log in.
 */
export async function sendCaseUpdatedEmail(
  customerEmail: string,
): Promise<void> {
  const resend = getResend();
  const { RESEND_FROM_EMAIL } = getServerEnv();
  const { NEXT_PUBLIC_SITE_URL } = getClientEnv();

  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: customerEmail,
    subject: "There is an update on your PolicyPal case",
    text: `Hi,

There is a new update on your PolicyPal case.

Please log in to your account to view it and reply if needed.

${NEXT_PUBLIC_SITE_URL}/dashboard

PolicyPal`,
  });
}
