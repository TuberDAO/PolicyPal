"use server";

/**
 * Email server actions — all transactional email senders.
 *
 * Launch email set:
 * - sendPaymentConfirmation: after Stripe webhook confirms payment
 * - sendCaseSubmitted: alongside payment confirmation
 * - sendNeedMoreInfo: when reviewer requests additional information
 * - sendPlaybookReady: when reviewer sends the playbook
 * - sendCaseUpdated: when customer responds to an info request (notifies reviewer)
 *
 * Magic link email is handled by Supabase Auth (not here).
 * All emails use Resend. Content is a link back to the case — no PHI in email body.
 *
 * Implementation will be added in the email phase.
 */
