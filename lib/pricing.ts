export type PricingPlan = {
  name: "Free" | "Solo" | "Pro" | "Business" | "Elite";
  monthly: string;
  yearly?: string;
  audience: string;
  description: string;
  features: string[];
  featured?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    monthly: "₹0",
    audience: "For testing.",
    description: "Start with a small, clear view of pending work.",
    features: [
      "3 clients",
      "3 active projects",
      "Basic cash desk",
      "Manual follow-ups",
      "Basic notes",
    ],
  },
  {
    name: "Solo",
    monthly: "₹499",
    yearly: "₹4,999/year",
    audience: "For freelancers and solo workers.",
    description: "Build a reliable payment follow-up habit.",
    features: [
      "25 clients",
      "25 projects",
      "Overdue reminders",
      "Promise tracker",
      "WhatsApp follow-up suggestions",
      "Basic proof uploads",
      "PDF payment summary",
    ],
  },
  {
    name: "Pro",
    monthly: "₹1,499",
    yearly: "₹14,999/year",
    audience: "For growing work-based businesses.",
    description: "A complete cashflow command center for growing work.",
    featured: true,
    features: [
      "Unlimited clients",
      "Unlimited projects",
      "Proof vault",
      "Dispute tracker",
      "Follow-up tones",
      "Client reliability score",
      "Monthly cashflow report",
      "Web + mobile",
      "2 team members",
    ],
  },
  {
    name: "Business",
    monthly: "₹2,999",
    yearly: "₹29,999/year",
    audience: "For small teams.",
    description: "Coordinate projects, staff, and cashflow with clarity.",
    features: [
      "Everything in Pro",
      "5 team members",
      "Role permissions",
      "Team activity log",
      "Advanced reports",
      "Project-wise cashflow",
      "Staff assignment",
      "Priority support",
    ],
  },
  {
    name: "Elite",
    monthly: "₹4,999",
    yearly: "₹49,999/year",
    audience: "For serious teams.",
    description: "More control for multi-branch and high-volume operations.",
    features: [
      "15 team members",
      "Branded reports",
      "Advanced analytics",
      "Multiple branches",
      "Custom reminder templates",
      "Onboarding support",
      "Export center",
      "Priority feature requests",
    ],
  },
];

export const setupFees = [
  { name: "Basic setup", price: "₹999" },
  { name: "Pro setup", price: "₹2,999" },
  { name: "Business setup", price: "₹4,999" },
];

export const pricingFaqs = [
  {
    question: "Is DueFlow a debt recovery app?",
    answer:
      "No. DueFlow is a cashflow command center that helps businesses organize pending payments, proof, promises, disputes, and follow-ups professionally.",
  },
  {
    question: "Does DueFlow message my clients automatically?",
    answer:
      "No. Suggested follow-ups are reviewed and approved by you before anything is sent.",
  },
  {
    question: "Can I use DueFlow without a team?",
    answer:
      "Yes. Free and Solo are designed for independent workers, while Pro also works well for a growing solo business.",
  },
  {
    question: "Is mobile included?",
    answer:
      "A mobile companion is planned. Plans that mention web + mobile describe the intended product experience for early access customers.",
  },
  {
    question: "What is the setup fee?",
    answer:
      "Optional setup helps businesses organize their starting client, project, and pending payment records. It is not required to use DueFlow.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. DueFlow is designed around simple subscriptions without a recovery fee or hidden commission.",
  },
  {
    question: "Is this accounting software?",
    answer:
      "No. DueFlow complements your accounting workflow by focusing on pending money, project proof, promises, and follow-up actions.",
  },
  {
    question: "What kind of businesses is DueFlow for?",
    answer:
      "DueFlow is designed for contractors, freelancers, agencies, photographers, repair teams, interior workers, and other work-based service businesses.",
  },
  {
    question: "Are messages sent automatically?",
    answer:
      "No. Every suggested message stays under your control and requires your approval before sending.",
  },
  {
    question: "Does DueFlow guarantee payment recovery?",
    answer:
      "No. DueFlow helps you keep better records and follow up consistently, but it cannot guarantee that a client will pay.",
  },
];
