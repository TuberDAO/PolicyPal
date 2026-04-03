import { ISSUE_TYPE_INTAKE_LABELS } from "@/constants";
import { ISSUE_TYPES } from "@/utils/validation";
import type { IssueType } from "@/types";

interface IssueSelectorProps {
  selected: IssueType[];
  onToggle: (issueType: IssueType) => void;
  onContinue: () => void;
}

export function IssueSelector({
  selected,
  onToggle,
  onContinue,
}: IssueSelectorProps) {
  const canContinue = selected.length > 0;

  return (
    <div className="w-full max-w-lg animate-slide-up">
      <h1 className="text-2xl font-semibold tracking-tight">
        What&rsquo;s going on?
      </h1>
      <p className="mt-2 text-sm text-muted">Select all that apply</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {ISSUE_TYPES.map((type) => {
          const isSelected = selected.includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => onToggle(type)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface text-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {ISSUE_TYPE_INTAKE_LABELS[type] ?? type}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        className="mt-8 w-full rounded-lg bg-cta px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}
