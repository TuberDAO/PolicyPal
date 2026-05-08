import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Terms of Service for WinYourAppeal</h1>
        <p className="text-sm text-muted">Effective Date: April 29, 2026</p>
        <p className="text-sm text-muted">Last Updated: April 29, 2026</p>
      </div>

      <p>
        These Terms of Service govern your access to and use of WinYourAppeal, operated by Path Ltd (&ldquo;WinYourAppeal,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By visiting the site, creating an account, submitting a case, purchasing a service, uploading materials, contacting us, or otherwise using WinYourAppeal, you agree to these Terms.
      </p>
      <p>If you do not agree to these Terms, do not use WinYourAppeal.</p>

      <Section title="1. What WinYourAppeal is">
        <p>
          WinYourAppeal is a paid U.S.&#8209;focused service that helps people understand, organize, and respond to health insurance and medical billing problems. Depending on the case, this may include denied claims, medical bill disputes, prior authorization problems, coverage issues, EOB confusion, network or provider billing issues, eligibility issues, and related administrative problems.
        </p>
        <p>
          At launch, WinYourAppeal is a manual, human&#8209;reviewed service. The main customer&#8209;facing deliverable is a practical written action plan or playbook that explains recommended next steps for the user&rsquo;s case.
        </p>
      </Section>

      <Section title="2. What WinYourAppeal is not">
        <p>WinYourAppeal is not:</p>
        <ul>
          <li>a law firm</li>
          <li>a medical provider</li>
          <li>an insurer</li>
          <li>an emergency service</li>
          <li>a substitute for urgent medical care</li>
          <li>a substitute for legal advice from a licensed attorney</li>
          <li>a substitute for medical advice from a licensed clinician</li>
        </ul>
        <p>
          WinYourAppeal does not represent users in court, provide legal representation, diagnose conditions, prescribe treatment, or guarantee any insurance or billing outcome.
        </p>
      </Section>

      <Section title="3. Eligibility">
        <p>
          You may use WinYourAppeal only if you are at least 18 years old and legally able to enter into a binding agreement, or if you are acting on behalf of another person as a parent, guardian, caregiver, family member, or other authorized representative.
        </p>
        <p>
          If you use WinYourAppeal for another person, you represent that you have authority to provide information to us and to act on that person&rsquo;s behalf.
        </p>
      </Section>

      <Section title="4. Accounts and access">
        <p>
          You may need to create an account to use certain parts of the service. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.
        </p>
        <p>
          You must provide accurate information when creating or using your account. You must promptly update your account information if it changes.
        </p>
        <p>
          We may suspend or terminate access if we reasonably believe your account is being used in violation of these Terms, for fraud, abuse, security concerns, or other harmful activity.
        </p>
      </Section>

      <Section title="5. Services and deliverables">
        <p>
          After you submit your information and complete payment, WinYourAppeal will review your case and, where appropriate, provide a written playbook or action plan through the platform. Depending on the case, the playbook may include:
        </p>
        <ul>
          <li>a summary of the issue</li>
          <li>a summary of the recommended plan and why</li>
          <li>step&#8209;by&#8209;step actions</li>
          <li>suggested contact order</li>
          <li>suggested wording for calls, emails, portal messages, or letters</li>
          <li>source details or official guidance links where relevant</li>
        </ul>
        <p>The exact contents of a playbook will vary by case. Not every case will include every type of content.</p>
      </Section>

      <Section title="6. No guarantee of results">
        <p>WinYourAppeal does not guarantee:</p>
        <ul>
          <li>reversal of a denial</li>
          <li>reduction or elimination of a bill</li>
          <li>insurance approval</li>
          <li>reimbursement</li>
          <li>debt forgiveness</li>
          <li>success on appeal</li>
          <li>success within a specific time period</li>
          <li>any specific financial or medical outcome</li>
        </ul>
        <p>
          Outcomes depend on many factors outside WinYourAppeal&rsquo;s control, including insurer decisions, provider actions, deadlines, documentation, applicable law, plan language, and facts specific to the case.
        </p>
      </Section>

      <Section title="7. Pricing and payment">
        <p>
          Pricing is shown before payment. By purchasing a service, you agree to pay the displayed price and any applicable taxes or fees.
        </p>
        <p>
          Payment is processed through a third&#8209;party processor such as Stripe. We do not store full payment card numbers ourselves.
        </p>
        <p>If payment is not successfully completed, your case may not be submitted for review.</p>
      </Section>

      <Section title="8. Refunds and corrections">
        <p>
          If a case is clearly outside scope before substantive work begins, we may issue a refund at our discretion.
        </p>
        <p>
          If a delivered playbook contains a material error based on the information you provided, we may correct or clarify it at no additional charge.
        </p>
        <p>
          Except as stated above, purchases are generally final once substantive work has begun. WinYourAppeal does not offer refunds simply because the customer dislikes the outcome, the insurer does not agree, or the user chooses not to follow the plan.
        </p>
      </Section>

      <Section title="9. Turnaround times">
        <p>
          Any turnaround times shown on the site are targets, not guarantees. Standard reviews are generally delivered within the stated timeframe, and rush reviews are delivered faster only when operationally realistic.
        </p>
        <p>Turnaround may be delayed if:</p>
        <ul>
          <li>we need more information</li>
          <li>you submit important updates after review begins</li>
          <li>documents are incomplete or hard to read</li>
          <li>the case is unusually complex</li>
          <li>there are operational, technical, or legal issues outside normal workflow</li>
        </ul>
      </Section>

      <Section title="10. User responsibilities">
        <p>
          You are responsible for the accuracy, completeness, and lawfulness of the information and materials you submit.
        </p>
        <p>You agree not to upload or submit content that:</p>
        <ul>
          <li>you do not have authority to provide</li>
          <li>infringes someone else&rsquo;s rights</li>
          <li>contains malware or harmful code</li>
          <li>is fraudulent, misleading, or intentionally incomplete</li>
          <li>is unlawful to possess or share</li>
        </ul>
        <p>We strongly encourage you to remove unnecessary personal identifiers from uploaded documents where practical.</p>
      </Section>

      <Section title="11. Acting for another person">
        <p>
          If you submit a case for another person, you are responsible for ensuring you have appropriate authority to do so. We may rely on your representation of authority unless we have reason to believe otherwise.
        </p>
      </Section>

      <Section title="12. Communications and updates">
        <p>By using WinYourAppeal, you agree to receive service&#8209;related communications, including:</p>
        <ul>
          <li>account and sign&#8209;in messages</li>
          <li>purchase confirmations</li>
          <li>case submitted confirmations</li>
          <li>requests for more information</li>
          <li>case updates</li>
          <li>playbook ready notices</li>
          <li>support responses</li>
        </ul>
        <p>
          These communications are part of the service and cannot be opted out of while you are actively using WinYourAppeal for a case.
        </p>
      </Section>

      <Section title="13. Follow up questions">
        <p>
          After a playbook is delivered, WinYourAppeal may allow follow&#8209;up questions through the platform. This feature is intended to help clarify the delivered plan, not to create an unlimited new engagement or a new case without charge.
        </p>
        <p>We may set reasonable limits on follow&#8209;up messages, timing, or scope.</p>
      </Section>

      <Section title="14. Cases outside scope">
        <p>WinYourAppeal is not appropriate for every situation. Cases may be outside scope, including:</p>
        <ul>
          <li>emergencies or urgent medical treatment decisions</li>
          <li>cases already being handled by a lawyer</li>
          <li>situations involving alleged fraud or criminal accusations</li>
          <li>same&#8209;day hard deadlines that cannot realistically be addressed</li>
          <li>requests for medical diagnosis or treatment decisions rather than insurance or billing guidance</li>
        </ul>
        <p>
          We may refuse, cancel, or limit service where a case is outside scope or otherwise inappropriate for the platform.
        </p>
      </Section>

      <Section title="15. Third party services">
        <p>
          WinYourAppeal relies on third&#8209;party providers for services such as authentication, payment processing, storage, hosting, email delivery, and analytics. We are not responsible for outages, delays, or failures caused by third&#8209;party services beyond our reasonable control.
        </p>
      </Section>

      <Section title="16. Intellectual property">
        <p>
          The WinYourAppeal website, software, branding, layout, and original content are owned by WinYourAppeal or its licensors and are protected by law.
        </p>
        <p>
          Subject to your compliance with these Terms, you may use the service and any delivered playbook for your own personal, internal use in connection with your case.
        </p>
        <p>
          You may not copy, resell, republish, or exploit the service or site content except as permitted by law or with our written permission.
        </p>
      </Section>

      <Section title="17. Your content">
        <p>
          You retain rights in the materials you upload or submit, subject to the rights you grant us to operate the service.
        </p>
        <p>
          By submitting content to WinYourAppeal, you grant us a limited license to store, review, use, reproduce, and process that content as needed to provide the service, maintain the platform, comply with law, prevent fraud, and enforce these Terms.
        </p>
      </Section>

      <Section title="18. Privacy">
        <p>
          Your use of WinYourAppeal is also subject to our Privacy Policy, which explains how we collect, use, disclose, and protect personal information.
        </p>
      </Section>

      <Section title="19. Service availability">
        <p>
          We may change, suspend, or discontinue any part of the service at any time, with or without notice, where reasonably necessary for maintenance, security, operational needs, legal reasons, or product changes.
        </p>
        <p>We do not guarantee uninterrupted or error&#8209;free service.</p>
      </Section>

      <Section title="20. Disclaimers">
        <p>
          WinYourAppeal is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis to the fullest extent permitted by law. To the fullest extent permitted by law, we disclaim warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non&#8209;infringement.
        </p>
        <p>We do not warrant that:</p>
        <ul>
          <li>the service will always be available</li>
          <li>the service will be error free</li>
          <li>the information provided will produce a particular outcome</li>
          <li>third parties will act in accordance with the playbook</li>
        </ul>
      </Section>

      <Section title="21. Limitation of liability">
        <p>
          To the fullest extent permitted by law, WinYourAppeal and its affiliates, officers, employees, contractors, and service providers will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of profits, revenue, data, goodwill, coverage, reimbursement, or opportunity arising out of or related to your use of the service.
        </p>
        <p>
          To the fullest extent permitted by law, our total liability for any claim arising out of or relating to the service will not exceed the amount you paid to WinYourAppeal for the specific service giving rise to the claim.
        </p>
        <p>Nothing in these Terms excludes liability that cannot be excluded under applicable law.</p>
      </Section>

      <Section title="22. Indemnification">
        <p>
          You agree to defend, indemnify, and hold harmless WinYourAppeal and its affiliates, officers, employees, contractors, and service providers from and against claims, liabilities, damages, losses, and expenses arising out of or related to:
        </p>
        <ul>
          <li>your use of the service</li>
          <li>your submitted content</li>
          <li>your violation of these Terms</li>
          <li>your violation of law</li>
          <li>your lack of authority to act for another person</li>
        </ul>
      </Section>

      <Section title="23. Termination">
        <p>
          We may suspend or terminate your access to WinYourAppeal at any time if we reasonably believe you have violated these Terms, misused the service, created security or legal risk, or otherwise acted in a way that could harm WinYourAppeal or others.
        </p>
        <p>
          You may stop using the service at any time, but termination does not entitle you to a refund except as expressly stated in these Terms.
        </p>
      </Section>

      <Section title="24. Governing law and disputes">
        <p>
          These Terms are governed by the laws of [INSERT STATE], without regard to conflict of laws rules.
        </p>
        <p>
          Any dispute arising out of or relating to these Terms or the service shall be brought exclusively in the state or federal courts located in [INSERT COUNTY, STATE], unless applicable law requires otherwise. You consent to personal jurisdiction and venue in those courts.
        </p>
      </Section>

      <Section title="25. Entire agreement">
        <p>
          These Terms, together with the Privacy Policy and any additional terms clearly presented for a specific service or feature, form the entire agreement between you and WinYourAppeal regarding your use of the service.
        </p>
      </Section>

      <Section title="26. Severability">
        <p>
          If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will remain in full force and effect to the fullest extent permitted by law.
        </p>
      </Section>

      <Section title="27. No waiver">
        <p>
          If we do not enforce a provision of these Terms, that does not mean we waive our right to enforce it later.
        </p>
      </Section>

      <Section title="28. Changes to these Terms">
        <p>
          We may update these Terms from time to time. If we make material changes, we may notify you by updating the date at the top of the Terms, posting notice in the service, emailing you, or using another appropriate method where required.
        </p>
        <p>Your continued use of WinYourAppeal after changes take effect means you accept the updated Terms.</p>
      </Section>

      <Section title="29. Contact">
        <p>If you have questions about these Terms, contact us at:</p>
        <address className="not-italic space-y-1">
          <p>WinYourAppeal</p>
          <p>Email: sill.namson@gmx.com</p>
        </address>
        <p>WinYourAppeal is a trading name of Path Ltd, a company registered in England and Wales.</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}
