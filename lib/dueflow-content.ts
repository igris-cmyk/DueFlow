import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarClock,
  Camera,
  CircleAlert,
  FileQuestion,
  FolderCheck,
  Handshake,
  History,
  Landmark,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";

export type ContentCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const problems: ContentCard[] = [
  {
    title: "Pending balances get forgotten",
    description:
      "A finished job becomes a vague memory once the next site, client, or deadline takes over.",
    icon: WalletCards,
  },
  {
    title: "Client promises slip past",
    description:
      '"I will pay Friday" stays inside a chat, with no reminder when Friday quietly passes.',
    icon: CalendarClock,
  },
  {
    title: "Proof lives everywhere",
    description:
      "Invoices, work photos, approvals, and screenshots are scattered across WhatsApp and the gallery.",
    icon: Camera,
  },
  {
    title: "Follow-ups feel awkward",
    description:
      "When the history is unclear, even a fair payment reminder can feel uncomfortable or too late.",
    icon: MessageSquareText,
  },
  {
    title: "Disputes become messy",
    description:
      "Extra work, partial payments, and approval history are hard to explain without one clean record.",
    icon: FileQuestion,
  },
  {
    title: "Risky clients get credit again",
    description:
      "Without a reliability history, the same late payer can receive more work before old money is clear.",
    icon: CircleAlert,
  },
];

export const productModules: ContentCard[] = [
  {
    title: "Today's Cash Desk",
    description:
      "Open the day with the payments, promises, proof gaps, and follow-ups that need attention.",
    icon: Landmark,
  },
  {
    title: "Project Ledger",
    description:
      "See project value, partial payments, pending balance, proof, and next action together.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Client Ledger",
    description:
      "Keep every client's payment history, promises, and reliability clear before accepting more work.",
    icon: UserRoundCheck,
  },
  {
    title: "Proof Vault",
    description:
      "Store invoices, work photos, WhatsApp screenshots, bills, approvals, and delivery proof against the right project.",
    icon: FolderCheck,
  },
  {
    title: "Promise Tracker",
    description:
      "Record what a client said, the promised date, and whether that promise was kept.",
    icon: Handshake,
  },
  {
    title: "Suggested Follow-Ups",
    description:
      "Write respectful, context-aware reminders that stay fully under your approval.",
    icon: MessageSquareText,
  },
  {
    title: "Reports",
    description:
      "Review pending money, received payments, overdue patterns, and project-wise cashflow.",
    icon: BarChart3,
  },
];

export const cashDeskQuestions = [
  "Who owes money?",
  "What is overdue?",
  "What did clients promise?",
  "What proof is missing?",
  "What should be followed up today?",
];

export const followUpTones = [
  "Polite",
  "Firm",
  "Short WhatsApp",
  "Professional",
  "Relationship-safe",
  "Final reminder",
];

export const webCapabilities = [
  "Full cashflow command center",
  "Reports and analytics",
  "Proof review",
  "Team management",
  "Pricing and billing",
];

export const mobileCapabilities = [
  "Add a proof photo",
  "Record a client promise",
  "Check today's follow-ups",
  "Mark payment received",
  "Copy a WhatsApp reminder",
  "Receive alerts",
];

export const trustDoes: ContentCard[] = [
  {
    title: "Organize money records",
    description:
      "Keep balances, partial payments, promises, and project context clear.",
    icon: ReceiptText,
  },
  {
    title: "Store real proof",
    description:
      "Attach the documents and photos your business already relies on.",
    icon: FolderCheck,
  },
  {
    title: "Show what needs action",
    description:
      "Make overdue payments, missed promises, and proof gaps hard to forget.",
    icon: History,
  },
  {
    title: "Support professional follow-up",
    description:
      "Suggest respectful language while keeping every message user-approved.",
    icon: ShieldCheck,
  },
];

export const trustDoesNot = [
  "Act as a debt collector",
  "Send threats or legal notices",
  "Message clients without approval",
  "Replace accounting software or legal advice",
  "Fake proof or invent payment facts",
  "Guarantee payment recovery",
];
