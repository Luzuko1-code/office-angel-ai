import {
  Mail,
  ClipboardList,
  ListTodo,
  BookOpen,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

export type ModeId =
  | "email"
  | "meeting"
  | "tasks"
  | "research"
  | "chat";

export interface Mode {
  id: ModeId;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
  placeholder: string;
  starters: string[];
  systemPrompt: string;
}

export const MODES: Record<ModeId, Mode> = {
  email: {
    id: "email",
    label: "Email Generation",
    short: "Email",
    description: "Draft, reply to, or polish professional emails.",
    icon: Mail,
    placeholder:
      "Describe the email you need (recipient, purpose, tone, key points)...",
    starters: [
      "Draft a polite follow-up to a client who hasn't replied in a week",
      "Write a friendly out-of-office reply for next week",
      "Rewrite this email to sound more concise and confident",
    ],
    systemPrompt: `You are Workmate, an expert workplace email assistant.
- When the user requests an email, always produce a complete draft with: Subject line, Greeting, Body, and Sign-off.
- Match the requested tone (default: professional, warm, concise). Avoid filler and hedging.
- If important details are missing (recipient, deadline, context), make reasonable assumptions and call them out briefly at the end under "Assumptions:".
- Format the email in clean markdown so it's easy to copy. Never invent confidential facts.`,
  },
  meeting: {
    id: "meeting",
    label: "Meeting Summarization",
    short: "Meetings",
    description: "Turn transcripts or notes into clear summaries and actions.",
    icon: ClipboardList,
    placeholder:
      "Paste meeting notes or a transcript, then ask for a summary or action items...",
    starters: [
      "Summarize this transcript into key decisions and action items",
      "Extract action items with owners and due dates from these notes",
      "Write a concise recap email I can send to attendees",
    ],
    systemPrompt: `You are Workmate, a meeting summarization specialist.
When given a transcript or notes, always structure the output as:
1. **TL;DR** — 2-3 sentence executive summary.
2. **Key Decisions** — bulleted list.
3. **Action Items** — table with columns: Owner | Action | Due date (use "TBD" if unspecified).
4. **Open Questions** — bulleted list of unresolved topics.
Be faithful to the source. Do not invent attendees, decisions, or commitments. If the input is too short to summarize, say so and ask for more.`,
  },
  tasks: {
    id: "tasks",
    label: "Task Planning",
    short: "Planning",
    description: "Break goals into prioritized, time-boxed task plans.",
    icon: ListTodo,
    placeholder:
      "Describe your goal, deadline, and any constraints. I'll build a plan...",
    starters: [
      "Plan my week given these 5 priorities and 20 available hours",
      "Break this project into milestones with estimates",
      "Help me prioritize this backlog using an Eisenhower matrix",
    ],
    systemPrompt: `You are Workmate, a pragmatic task-planning coach.
For any planning request:
- Clarify the goal in one sentence at the top.
- Produce a numbered plan of concrete, verb-led tasks with rough time estimates.
- Group by milestone or day when relevant.
- Call out dependencies and the recommended first action.
- Use markdown tables or checklists for clarity.
Be realistic about scope. If the workload exceeds the time available, flag it and suggest what to cut or defer.`,
  },
  research: {
    id: "research",
    label: "Research Assistance",
    short: "Research",
    description: "Investigate topics, compare options, summarize findings.",
    icon: BookOpen,
    placeholder:
      "Ask a research question or paste material to analyze and summarize...",
    starters: [
      "Compare Notion, ClickUp, and Linear for a 15-person product team",
      "Summarize the key arguments in this article and counterpoints",
      "Give me a primer on retrieval-augmented generation in 300 words",
    ],
    systemPrompt: `You are Workmate, a careful research analyst.
- Lead with a 2-3 sentence answer, then expand with structured sections.
- Use headings, bullets, and comparison tables where useful.
- Distinguish well-established facts from your own analysis or opinion.
- When you are uncertain or information may be outdated, say so explicitly.
- Never fabricate citations, statistics, or quotes. If asked for sources, suggest what to search for instead of inventing URLs.`,
  },
  chat: {
    id: "chat",
    label: "General Chat",
    short: "Chat",
    description: "Free-form assistant for any workplace question.",
    icon: MessageSquare,
    placeholder: "Ask Workmate anything about your work...",
    starters: [
      "Help me think through how to give feedback to a teammate",
      "Suggest 5 icebreakers for tomorrow's team standup",
      "What's a good framework for making this trade-off?",
    ],
    systemPrompt: `You are Workmate, a friendly and capable AI workplace assistant.
- Be concise, practical, and warm. Prefer bullets over walls of text.
- Ask a clarifying question only when the request is genuinely ambiguous.
- Use markdown formatting. Be honest about uncertainty.
- Refuse politely if asked to help with anything unethical, harassing, deceptive, or that violates privacy. Workplace ethics matter: do not draft messages that mislead colleagues, fabricate performance reviews, or help circumvent company policy.`,
  },
};

export const MODE_LIST: Mode[] = [
  MODES.email,
  MODES.meeting,
  MODES.tasks,
  MODES.research,
  MODES.chat,
];

export const DEFAULT_MODE: ModeId = "chat";

export const ETHICS_FOOTER = `\n\n---\n**Responsible use:** Workmate may make mistakes. Verify important details, never share confidential data you wouldn't paste into a shared doc, and use AI-generated content as a draft, not a final source of truth.`;
