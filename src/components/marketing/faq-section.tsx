"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// Edit all FAQ copy here. Answers may be a single string or an array of
// strings — each array entry renders as a separate paragraph.
// ---------------------------------------------------------------------------
const FAQS: { question: string; answer: string | string[] }[] = [
  {
    question: "What does WinYourAppeal help with?",
    answer:
      "WinYourAppeal helps with denied claims, medical bills that seem wrong or too high, prior authorization problems, coverage issues, EOB confusion, network and provider billing problems, and other health insurance issues. If you are not sure what category your problem fits into, you can still submit your case.",
  },
  {
    question: "What do I actually get?",
    answer: [
      "You get a tailored action plan built around your specific case. It is designed to help you move quickly, avoid dead ends, and take the strongest next step for your denial, billing issue, or insurance problem.",
      "We review your account of what happened, the documents you provide, the medical or billing issues involved, and the rules that may apply to your plan or claim. Your case pack can include the best next steps, who to contact, what order to do things in, what to ask for, ready to use phone scripts, email drafts, letters, or portal wording where needed, and when escalation may make sense.",
      "Where relevant, we also look at supporting medical guidance, policy language, and official rules to help strengthen your position. That may include showing why requested care is supported, where a bill or denial may need closer review, or whether the process followed by the insurer appears inconsistent with the documents and rules that govern the case.",
      "The goal is to give you a practical plan that is clear, well structured, and easier to act on under stress. Instead of leaving you to figure things out alone, we help turn a confusing problem into a step by step route forward.",
    ],
  },
  {
    question: "Is this only for appeals?",
    answer:
      "No. Some people come with one urgent question, while others are dealing with a much bigger problem. Appeals are one important use case, but we also help with billing disputes, coverage problems, prior authorization issues, and other insurance or administrative issues.",
  },
  {
    question: "How much does WinYourAppeal cost?",
    answer:
      "Pricing is shown clearly before payment. You will see the cost before you pay, with no surprise paywall.",
  },
  {
    question: "How long does it take?",
    answer:
      "Most standard reviews are delivered within 3 business days, often sooner. Rush reviews are delivered within 1 business day when that is operationally realistic. The full time to resolve the underlying issue can vary depending on the case and whether more information is needed.",
  },
  {
    question: "Do I need to upload documents?",
    answer:
      "You can begin even if you do not have every document yet, and you can upload more later if needed. Documents are not always required, but they often help us build a stronger plan. We also strongly encourage you to remove unnecessary personal details before uploading anything.",
  },
  {
    question: "What documents are most useful?",
    answer:
      "The most helpful documents are usually bills, EOBs, denial letters, plan documents, and any written messages that explain what happened. In some cases, a doctor's supporting letter or claim file can also help.",
  },
  {
    question: "Will you contact my insurer, hospital, or employer for me?",
    answer:
      "No. WinYourAppeal does not contact insurers, providers, or employers on your behalf. We give you a clear plan for what to do next, including who to contact and what to say.",
  },
  {
    question: "Can this reduce or remove my bill?",
    answer:
      "It can improve your position, but no outcome is guaranteed. In some cases, the right next steps can reduce a bill, overturn a denial, correct an error, or even bring the amount owed down to zero. Every case is different, and your plan is tailored to your situation.",
  },
  {
    question: "What if you need more information from me?",
    answer:
      "If we need more information, your case will show that action is needed. You will also get an email letting you know there is an update. You can log in, read the request, and reply directly in the platform so we can continue the review.",
  },
  {
    question: "How do I know when my case is ready?",
    answer:
      "We will send you an email when your case is ready. Your completed plan will also appear in your account so you can log in and view it there.",
  },
  {
    question: "Is this legal advice or medical advice?",
    answer:
      "No. WinYourAppeal is not a law firm, medical provider, or emergency service. We provide practical guidance to help you deal with insurance and billing problems, but we do not replace a lawyer, doctor, or urgent medical care.",
  },
  {
    question: "Is my information private and secure?",
    answer:
      "We handle your documents and case details privately and only use them for your case review. Access should be limited to the people working on your case, and files should be stored securely. We also strongly encourage you to anonymize documents before uploading them where possible.",
  },
];

// ---------------------------------------------------------------------------

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 20 20"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 7.5l5 5 5-5" />
    </svg>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20"
      aria-label="Frequently asked questions"
    >
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Quick answers about how WinYourAppeal works
        </p>

        {/* Accordion list */}
        <div className="mt-8 divide-y divide-border">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const paragraphs = Array.isArray(faq.answer)
              ? faq.answer
              : [faq.answer];

            return (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-base font-medium text-foreground sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronIcon open={isOpen} />
                </button>

                {isOpen && (
                  <div className="pb-6 pt-0">
                    {paragraphs.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className={`text-base leading-relaxed text-muted ${pIdx > 0 ? "mt-4" : ""}`}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
