/**
 * Structured playbook content — stored as JSON in the playbooks.content column.
 *
 * v2 uses an ordered mixed-block model instead of separate steps/wording arrays.
 * The parser auto-migrates old v1 data (steps + draftWording) into blocks on read.
 */

export type PlaybookBlockType =
  | "action_step"
  | "phone_script"
  | "email_script"
  | "portal_message"
  | "letter_wording"
  | "guidance_note";

export type PlaybookBlock = {
  id: string;
  type: PlaybookBlockType;
  trackCompletion: boolean;
  label: string;
  content: string;
  whoToContact?: string;
  whatToSay?: string;
  whyItMatters?: string;
  timing?: string;
  contactField?: string;
};

export type SourceItem = {
  id: string;
  label: string;
  url?: string;
  detail?: string;
};

export type PlaybookContent = {
  summary: string;
  planSummary: string;
  blocks: PlaybookBlock[];
  sources: SourceItem[];
};

/** Legacy types kept only for migration during parse */
type LegacyStep = {
  id: string;
  title: string;
  whatToDo: string;
  whoToContact?: string;
  whatToSay?: string;
  whyItMatters?: string;
  timing?: string;
};

type LegacyWording = {
  id: string;
  label: string;
  type: "phone" | "email" | "letter";
  content: string;
};

const WORDING_TYPE_MAP: Record<string, PlaybookBlockType> = {
  phone: "phone_script",
  email: "email_script",
  letter: "letter_wording",
};

export const BLOCK_TYPE_LABELS: Record<PlaybookBlockType, string> = {
  action_step: "Action step",
  phone_script: "Phone script",
  email_script: "Email script",
  portal_message: "Portal message",
  letter_wording: "Letter wording",
  guidance_note: "Guidance note",
};

export function emptyPlaybook(): PlaybookContent {
  return {
    summary: "",
    planSummary: "",
    blocks: [],
    sources: [],
  };
}

function migrateStepToBlock(s: LegacyStep): PlaybookBlock {
  return {
    id: s.id,
    type: "action_step",
    trackCompletion: true,
    label: s.title,
    content: s.whatToDo,
    whoToContact: s.whoToContact,
    whatToSay: s.whatToSay,
    whyItMatters: s.whyItMatters,
    timing: s.timing,
  };
}

function migrateWordingToBlock(w: LegacyWording): PlaybookBlock {
  return {
    id: w.id,
    type: WORDING_TYPE_MAP[w.type] ?? "phone_script",
    trackCompletion: false,
    label: w.label,
    content: w.content,
  };
}

export function parsePlaybookContent(raw: string): PlaybookContent {
  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
      return {
        summary: parsed.summary ?? "",
        planSummary: parsed.planSummary ?? "",
        blocks: parsed.blocks,
        sources: Array.isArray(parsed.sources) ? parsed.sources : [],
      };
    }

    const blocks: PlaybookBlock[] = [];

    if (Array.isArray(parsed.steps)) {
      for (const s of parsed.steps) {
        blocks.push(migrateStepToBlock(s));
      }
    }
    if (Array.isArray(parsed.draftWording)) {
      for (const w of parsed.draftWording) {
        blocks.push(migrateWordingToBlock(w));
      }
    }

    return {
      summary: parsed.summary ?? "",
      planSummary: parsed.planSummary ?? "",
      blocks,
      sources: Array.isArray(parsed.sources) ? parsed.sources : [],
    };
  } catch {
    return emptyPlaybook();
  }
}
