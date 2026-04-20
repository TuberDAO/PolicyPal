import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy for AppealSupportPro</h1>
        <p className="text-sm text-muted">Effective Date: [INSERT DATE]</p>
        <p className="text-sm text-muted">Last Updated: [INSERT DATE]</p>
      </div>

      <p>
        AppealSupportPro, operated by [LEGAL ENTITY NAME] (&ldquo;AppealSupportPro,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), provides a U.S.&#8209;focused service that helps people understand, organize, and respond to health insurance and medical billing issues. This Privacy Policy explains how we collect, use, disclose, retain, and protect personal information when you visit our website, create an account, submit or save a case, upload documents, purchase services, contact us, or otherwise use AppealSupportPro.
      </p>
      <p>
        Because AppealSupportPro may involve insurance, billing, and health&#8209;related materials, some of the information we handle may be sensitive personal information and, in some states, consumer health data.
      </p>

      <Section title="1. Scope">
        <p>This Privacy Policy applies to personal information we collect through:</p>
        <ul>
          <li>our website and web application</li>
          <li>account creation, sign&#8209;in, and authentication</li>
          <li>case intake, draft saving, and case updates</li>
          <li>document upload and storage features</li>
          <li>checkout and payment flows</li>
          <li>service emails and case status communications</li>
          <li>support and troubleshooting interactions</li>
        </ul>
        <p>
          This Privacy Policy does not apply to third&#8209;party websites, payment processors, authentication providers, insurers, providers, government agencies, or other outside services that have their own privacy notices.
        </p>
      </Section>

      <Section title="2. Who may use AppealSupportPro">
        <p>
          AppealSupportPro is intended for people in the United States who are using the service for themselves or acting for another person as a parent, guardian, caregiver, family member, or other authorized representative.
        </p>
        <p>
          If you use AppealSupportPro for another person, you represent that you have authority to provide information to us and to act on that person&rsquo;s behalf.
        </p>
        <p>AppealSupportPro is not intended for children under 18 acting on their own.</p>
      </Section>

      <Section title="3. Information we collect">
        <Subsection title="A. Information you provide directly">
          <p>Depending on how you use AppealSupportPro, you may provide:</p>
          <ul>
            <li>your name</li>
            <li>your email address</li>
            <li>your state</li>
            <li>insurer, provider, or hospital information you choose to enter</li>
            <li>written descriptions of your issue</li>
            <li>case updates and replies you submit through the platform</li>
            <li>uploaded documents and files</li>
            <li>communications with us</li>
          </ul>
        </Subsection>

        <Subsection title="B. Documents and case materials">
          <p>You may upload or submit documents such as:</p>
          <ul>
            <li>bills</li>
            <li>explanations of benefits</li>
            <li>denial letters</li>
            <li>plan documents</li>
            <li>prior authorization notices</li>
            <li>provider or insurer correspondence</li>
            <li>payment notices or collections&#8209;related documents</li>
            <li>other case&#8209;related materials</li>
          </ul>
          <p>
            These materials may contain health, treatment, insurance, billing, or other sensitive information. Please upload only what is reasonably needed for your case. Where practical, we strongly encourage you to remove unnecessary identifiers before upload, such as full date of birth, Social Security number, or unrelated medical details.
          </p>
        </Subsection>

        <Subsection title="C. Account and authentication information">
          <p>When you create or access an account, we may collect information needed to manage authentication and account security, such as:</p>
          <ul>
            <li>your email address</li>
            <li>sign&#8209;in and session metadata</li>
            <li>email magic link metadata</li>
            <li>Google sign&#8209;in information if you choose Google login</li>
            <li>account settings and activity history</li>
          </ul>
        </Subsection>

        <Subsection title="D. Payment information">
          <p>
            Payments are processed by a third&#8209;party payment processor such as Stripe. We receive limited transaction&#8209;related information needed to support the purchase and the service, such as:
          </p>
          <ul>
            <li>payment status</li>
            <li>transaction or checkout identifiers</li>
            <li>purchase details</li>
            <li>limited billing&#8209;related metadata made available by the processor</li>
          </ul>
          <p>We do not store full payment card numbers ourselves.</p>
        </Subsection>

        <Subsection title="E. Usage, device, and technical information">
          <p>We and our service providers may collect technical and usage information such as:</p>
          <ul>
            <li>IP address</li>
            <li>browser and device information</li>
            <li>operating system</li>
            <li>approximate location derived from IP</li>
            <li>pages viewed</li>
            <li>referral source</li>
            <li>timestamps</li>
            <li>session and feature usage data</li>
            <li>logs, diagnostics, and security&#8209;related information</li>
          </ul>
        </Subsection>

        <Subsection title="F. Cookies, browser storage, and analytics">
          <p>
            We use cookies and similar technologies to operate the service, maintain sessions, support security, and understand how the service is used.
          </p>
          <p>
            We may also use browser storage, including local storage and session storage, to support service functionality, draft persistence, and attribution. For example, we may store source information such as referral data, landing page, and campaign parameters so we can understand which channels lead to account creation, case submission, or purchase.
          </p>
          <p>We do not use uploaded document contents or private case text for advertising analytics.</p>
        </Subsection>

        <Subsection title="G. Communications information">
          <p>
            If you contact us, receive service emails, submit support requests, or communicate with us through a case thread, we may store those messages and related metadata.
          </p>
        </Subsection>
      </Section>

      <Section title="4. Sensitive information and consumer health data">
        <p>
          Because of the nature of AppealSupportPro&rsquo;s services, we may collect and process sensitive information and, in some jurisdictions, consumer health data. This may include information about:
        </p>
        <ul>
          <li>insurance coverage</li>
          <li>claims and denials</li>
          <li>appeals and reviews</li>
          <li>prior authorization issues</li>
          <li>billing disputes and collections&#8209;related issues</li>
          <li>providers involved in a case</li>
          <li>dates of service</li>
          <li>treatment&#8209;related details contained in uploaded materials</li>
          <li>other information that may reasonably reveal health&#8209;related circumstances</li>
        </ul>
        <p>
          We use this information only for the purposes described in this Privacy Policy, to provide and support the service you requested, to secure and improve AppealSupportPro, and to comply with applicable law.
        </p>
      </Section>

      <Section title="5. How we use personal information">
        <p>We may use personal information to:</p>
        <ul>
          <li>create and manage your account</li>
          <li>authenticate users and maintain account security</li>
          <li>let you create, save, edit, resume, and manage cases</li>
          <li>review uploaded documents and case details</li>
          <li>prepare and deliver your case plan and related service outputs</li>
          <li>respond to questions and support requests</li>
          <li>send transactional messages, reminders, and case status notifications</li>
          <li>process payments and maintain transaction records</li>
          <li>detect, prevent, and investigate fraud, abuse, misuse, or security incidents</li>
          <li>maintain, monitor, debug, and improve the service</li>
          <li>understand which channels are producing useful visits, case submissions, or paid services</li>
          <li>comply with legal obligations</li>
          <li>enforce our agreements and protect our rights, users, and business</li>
        </ul>
        <p>We may also create aggregated or de&#8209;identified information where permitted by law.</p>
      </Section>

      <Section title="6. Human review and service delivery">
        <p>
          At launch, AppealSupportPro includes human review as part of paid case handling. Your case materials may be accessed by employees, contractors, or service providers who need access to deliver the service, provide support, maintain systems, prevent fraud, or comply with legal obligations.
        </p>
        <p>We aim to limit access to case information to people with a legitimate business need to know.</p>
      </Section>

      <Section title="7. When we disclose personal information">
        <p>We may disclose personal information in the following circumstances:</p>

        <Subsection title="A. Service providers">
          <p>We may disclose information to vendors and service providers that help us operate AppealSupportPro, such as providers of:</p>
          <ul>
            <li>hosting and infrastructure</li>
            <li>authentication</li>
            <li>database and file storage</li>
            <li>email delivery</li>
            <li>payment processing</li>
            <li>analytics</li>
            <li>customer support tooling</li>
            <li>security and monitoring</li>
          </ul>
        </Subsection>

        <Subsection title="B. Review and operations support">
          <p>
            We may disclose case information to authorized personnel, reviewers, contractors, or support providers who help us deliver the services you request, subject to confidentiality and access controls.
          </p>
        </Subsection>

        <Subsection title="C. Legal, compliance, and protection purposes">
          <p>We may disclose information if we reasonably believe it is necessary to:</p>
          <ul>
            <li>comply with law, regulation, legal process, or government request</li>
            <li>protect the rights, safety, or property of users, AppealSupportPro, or others</li>
            <li>investigate fraud, abuse, misuse, or security issues</li>
            <li>enforce our terms and other agreements</li>
          </ul>
        </Subsection>

        <Subsection title="D. Corporate transactions">
          <p>
            If AppealSupportPro is involved in a merger, financing, acquisition, reorganization, sale of assets, bankruptcy, or similar transaction, personal information may be disclosed as part of that process, subject to applicable confidentiality and legal requirements.
          </p>
        </Subsection>

        <Subsection title="E. At your direction">
          <p>
            We may disclose information when you ask us to do so or clearly direct us to interact with a third party on your behalf.
          </p>
        </Subsection>
      </Section>

      <Section title="8. What we do not do by default">
        <p>Unless we clearly state otherwise before a change takes effect:</p>
        <ul>
          <li>we do not sell personal information for money</li>
          <li>we do not sell consumer health data</li>
          <li>we do not use case file data for targeted advertising</li>
          <li>we do not share private case materials with advertisers</li>
          <li>we do not publicly post private case information</li>
        </ul>
      </Section>

      <Section title="9. Communications">
        <p>We may send you:</p>
        <ul>
          <li>account and sign&#8209;in messages</li>
          <li>purchase confirmations</li>
          <li>case submitted confirmations</li>
          <li>case status updates</li>
          <li>requests for more information</li>
          <li>playbook ready notices</li>
          <li>support responses</li>
          <li>other service&#8209;related communications</li>
        </ul>
        <p>
          You cannot opt out of messages that are necessary to provide the service you requested, such as security notices or essential case status communications.
        </p>
      </Section>

      <Section title="10. Data retention">
        <p>
          We keep personal information for as long as reasonably necessary for the purposes described in this Privacy Policy, including to provide services, maintain account history, resolve disputes, prevent fraud, enforce agreements, and comply with legal obligations.
        </p>
        <p>Our general retention approach is:</p>
        <ul>
          <li><strong>account data:</strong> while your account remains active and for a reasonable period afterward for security, fraud prevention, and compliance</li>
          <li><strong>case files and uploaded materials:</strong> for a reasonable period after the last substantive case activity, unless a longer period is required or justified for legal, tax, accounting, fraud prevention, dispute resolution, backup integrity, or security purposes</li>
          <li><strong>payment&#8209;related records:</strong> as required for tax, accounting, compliance, and dispute handling</li>
          <li><strong>support communications and logs:</strong> for a reasonable period consistent with operations and security needs</li>
        </ul>
        <p>Deletion from backups may not be immediate except where applicable law requires otherwise.</p>
      </Section>

      <Section title="11. Your choices and rights">
        <p>Depending on where you live and subject to applicable law, you may be able to:</p>
        <ul>
          <li>access, review, or update certain account information</li>
          <li>request access to personal information we hold about you</li>
          <li>request correction of inaccurate information</li>
          <li>request deletion of your account or certain personal information</li>
          <li>opt out of marketing communications, if any</li>
          <li>appeal certain decisions about privacy requests</li>
          <li>exercise additional rights relating to sensitive data or consumer health data where provided by law</li>
        </ul>
        <p>
          If you submit a request, we may take reasonable steps to verify your identity or authority before acting on it. If you act for another person, we may ask for proof of authorization.
        </p>
        <p>You may submit privacy requests to: [PRIVACY EMAIL]</p>
        <p>
          If we deny your request, you may appeal by contacting us at [PRIVACY EMAIL] with the subject line <em>Privacy Appeal</em>.
        </p>
      </Section>

      <Section title="12. Additional Washington consumer health data notice">
        <p>If Washington&rsquo;s My Health My Data Act applies to your information, this section provides additional notice.</p>
        <p>We may collect categories of consumer health data such as:</p>
        <ul>
          <li>information about claims, denials, appeals, prior authorization, billing disputes, collections&#8209;related issues, providers involved in a case, dates of service, and health&#8209;related details contained in case materials</li>
          <li>information that may reasonably identify an individual&rsquo;s health&#8209;related circumstances based on the documents and details submitted through the service</li>
          <li>inferences we draw from the information you provide in order to organize and manage your case</li>
        </ul>
        <p>We may collect this information:</p>
        <ul>
          <li>directly from you</li>
          <li>from documents you upload</li>
          <li>from your use of the platform</li>
          <li>from payment and authentication providers</li>
          <li>from device, browser, and related technical information associated with your use of the service</li>
        </ul>
        <p>We may use and disclose this information to:</p>
        <ul>
          <li>provide and support the service</li>
          <li>maintain and secure the platform</li>
          <li>process payments</li>
          <li>respond to requests and case updates</li>
          <li>comply with law</li>
          <li>work with service providers and authorized reviewers who support the service</li>
        </ul>
        <p>
          Where required by law, you may have rights to confirm whether we collect, share, or sell consumer health data, access such data, withdraw consent, and request deletion. If applicable law requires deletion from our network, we will process qualifying requests in accordance with that law.
        </p>
        <p>To submit a Washington consumer health data request, contact: [PRIVACY EMAIL]</p>
      </Section>

      <Section title="13. California privacy rights">
        <p>If California law applies to your information, you may have rights that include:</p>
        <ul>
          <li>knowing what categories of personal information we collect</li>
          <li>knowing the purposes for which we use that information</li>
          <li>requesting access to specific pieces of personal information</li>
          <li>requesting correction of inaccurate information</li>
          <li>requesting deletion of certain personal information</li>
          <li>opting out of sale or sharing where applicable</li>
          <li>limiting certain uses of sensitive personal information where applicable</li>
          <li>not being discriminated against for exercising privacy rights</li>
        </ul>
        <p>We do not sell personal information for money and do not use private case file data for targeted advertising.</p>
        <p>To submit a California privacy request, contact: [PRIVACY EMAIL]</p>
        <p>We may verify your identity before processing a request, and we may deny or limit requests where permitted by law.</p>
      </Section>

      <Section title="14. Nevada consumer health data notice">
        <p>
          If Nevada law applies to your information, we may collect, use, and disclose consumer health data described in this Privacy Policy to provide the service, maintain and secure the platform, process payments, respond to requests, and comply with legal obligations.
        </p>
        <p>
          Where applicable, Nevada residents may have rights relating to access, deletion, and control over certain disclosures of consumer health data. To submit a Nevada privacy request, contact: [PRIVACY EMAIL]
        </p>
      </Section>

      <Section title="15. Connecticut consumer health data notice">
        <p>
          If Connecticut law applies to your information, we may collect and process health&#8209;related personal data described in this Privacy Policy to provide the service you requested, manage and secure the platform, communicate with you about your case, process transactions, and comply with law.
        </p>
        <p>
          Where applicable, Connecticut residents may have rights to access, correct, delete, and obtain a copy of certain personal data, as well as rights to appeal certain decisions about privacy requests. To submit a Connecticut privacy request, contact: [PRIVACY EMAIL]
        </p>
      </Section>

      <Section title="16. Other U.S. state privacy rights">
        <p>
          Depending on your state of residence and applicable law, you may have rights that include access, correction, deletion, portability, appeal, and limits on certain uses or disclosures of sensitive information.
        </p>
        <p>To submit a privacy request under applicable state law, contact: [PRIVACY EMAIL]</p>
        <p>We may verify your identity before processing a request, and we may deny or limit requests where permitted by law.</p>
      </Section>

      <Section title="17. Security">
        <p>
          We use reasonable administrative, technical, and organizational safeguards designed to protect personal information. These may include:
        </p>
        <ul>
          <li>encryption in transit</li>
          <li>authentication controls</li>
          <li>role&#8209;based access restrictions</li>
          <li>access controls for vendors and service providers</li>
          <li>logging and monitoring</li>
          <li>secure storage practices</li>
          <li>need&#8209;to&#8209;know limits for case information</li>
        </ul>
        <p>
          No system can guarantee absolute security. You are responsible for maintaining the confidentiality of your login credentials and notifying us promptly if you suspect unauthorized access to your account.
        </p>
        <p>
          If we learn of a security incident involving personal information, we will investigate, respond, and provide notice as required by applicable law.
        </p>
      </Section>

      <Section title="18. International processing">
        <p>
          AppealSupportPro is intended for U.S. users. We aim to use U.S.&#8209;based processing where practical, but some service providers may process data outside your state or outside the United States depending on their infrastructure and service model.
        </p>
      </Section>

      <Section title="19. Third party services">
        <p>We may rely on third parties for services such as:</p>
        <ul>
          <li>hosting and infrastructure</li>
          <li>authentication</li>
          <li>database and file storage</li>
          <li>payment processing</li>
          <li>email delivery</li>
          <li>analytics and monitoring</li>
        </ul>
        <p>Their handling of information may also be governed by their own privacy notices when they act independently.</p>
      </Section>

      <Section title="20. Children">
        <p>
          AppealSupportPro is not intended for children under 18 acting on their own. If you believe a child has provided personal information in violation of applicable law, contact us and we will review and respond appropriately.
        </p>
      </Section>

      <Section title="21. Changes to this Privacy Policy">
        <p>
          We may update this Privacy Policy from time to time. If we make material changes, we may notify you by updating the date at the top of the policy, posting a notice in the service, emailing you, or using another appropriate method where required.
        </p>
      </Section>

      <Section title="22. Contact us">
        <p>If you have questions, concerns, or privacy requests, contact us at:</p>
        <address className="not-italic space-y-1">
          <p>AppealSupportPro</p>
          <p>[LEGAL ENTITY NAME]</p>
          <p>[BUSINESS ADDRESS]</p>
          <p>[PRIVACY EMAIL]</p>
        </address>
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

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 pt-2">
      <h3 className="text-base font-medium">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
