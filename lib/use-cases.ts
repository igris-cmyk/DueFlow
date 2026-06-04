import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  Building2,
  Camera,
  Drill,
  Hammer,
  Paintbrush,
} from "lucide-react";

export type UseCase = {
  slug: string;
  name: string;
  heroTitle: string;
  shortDescription: string;
  detailTitle: string;
  pain: string;
  stuck: string[];
  tracks: string[];
  mobileValue: string;
  workflowTitle: string;
  workflow: string[];
  ctaTitle: string;
  icon: LucideIcon;
};

export const useCases: UseCase[] = [
  {
    slug: "contractors",
    name: "Contractors",
    heroTitle:
      "Keep contractor payments, site proof, and client promises clear.",
    shortDescription:
      "Track partial payments, overdue balances, site proof, extra work approvals, and client promises across active projects.",
    detailTitle:
      "Completed site work should not leave the balance buried in calls and chat promises.",
    pain:
      "Site work moves quickly, but running bills, partial payments, overdue balances, photos, and client promises often live in separate places.",
    stuck: [
      "Running bills and partial payments",
      "Overdue balances across active sites",
      "Extra work approvals",
      "Promises made after a client call",
    ],
    tracks: [
      "Project value, received amount, and balance",
      "Site proof by project",
      "Extra work approval proof",
      "Client promise dates",
    ],
    mobileValue:
      "Add site proof when the work happens, then review balances and reports from the web command center.",
    workflowTitle:
      "From site work to received balance, keep each payment step recorded.",
    workflow: [
      "Add client",
      "Add project value",
      "Record partial payment",
      "Attach site photos and invoice",
      "Record promise date",
      "Follow up when due",
      "Mark payment received",
    ],
    ctaTitle:
      "Give every contractor balance a project record and a next action.",
    icon: Hammer,
  },
  {
    slug: "freelancers",
    name: "Freelancers",
    heroTitle:
      "Keep freelance milestones, approvals, and invoice follow-ups clear.",
    shortDescription:
      "Keep milestone payments, revision approvals, invoice follow-ups, and polite reminders from falling through the cracks.",
    detailTitle:
      "Delivered work should not turn into a revision dispute or a forgotten invoice.",
    pain:
      "Client work can be approved and delivered while revision history, milestone balances, and the remaining invoice wait inside email or chat threads.",
    stuck: [
      "Milestone payments",
      "Revision and scope disputes",
      "Client approval and final delivery proof",
      "Invoice follow-ups after delivery",
    ],
    tracks: [
      "Invoice and project balance",
      "Revision and approval screenshots",
      "Promised payment dates",
      "Respectful reminder history",
    ],
    mobileValue:
      "Record a promise after a call and check the day's follow-ups without reopening every old conversation.",
    workflowTitle:
      "Keep each milestone clear from client approval to final payment.",
    workflow: [
      "Add client and engagement",
      "Record fee and milestones",
      "Attach approval proof",
      "Log invoice and due date",
      "Review suggested follow-up",
      "Record client promise",
      "Close the balance when paid",
    ],
    ctaTitle:
      "Give every freelance invoice the approval history and next action it needs.",
    icon: BriefcaseBusiness,
  },
  {
    slug: "agencies",
    name: "Agencies",
    heroTitle:
      "Keep agency retainers, project invoices, and team follow-ups clear.",
    shortDescription:
      "Give account and finance teams one clear view of retainers, project invoices, payment timelines, approvals, and team follow-ups.",
    detailTitle:
      "Pending agency revenue needs one owner, one timeline, and one clear record.",
    pain:
      "When delivery, client communication, and finance sit with different people, retainer renewals and project invoices lose a clear owner and payment timeline.",
    stuck: [
      "Retainer renewals",
      "Campaign and project invoices",
      "Client approval and payment timelines",
      "Team follow-ups with no clear owner",
    ],
    tracks: [
      "Client and project ledgers",
      "Team follow-up activity",
      "Approval proof",
      "Project-wise cashflow",
    ],
    mobileValue:
      "Account managers can log client context on the move while the team reviews the full cashflow picture on web.",
    workflowTitle:
      "Move each retainer and project invoice through a visible team workflow.",
    workflow: [
      "Create client ledger",
      "Add active projects",
      "Record invoices and retainers",
      "Attach client approvals",
      "Assign next follow-up",
      "Review overdue patterns",
      "Update received payments",
    ],
    ctaTitle:
      "Give every agency invoice a clear owner, timeline, and next action.",
    icon: Building2,
  },
  {
    slug: "photographers",
    name: "Photographers",
    heroTitle:
      "Keep booking advances, delivery proof, and final balances clear.",
    shortDescription:
      "Keep booking advances, event proof, album approvals, and final balances tied to the right client.",
    detailTitle:
      "The event can be over while album approval and the final balance are still pending.",
    pain:
      "The event may be complete, but album approvals, final delivery, and the last payment can stretch across weeks.",
    stuck: [
      "Booking advances",
      "Event completion proof",
      "Album and edit approvals",
      "Final delivery balance",
    ],
    tracks: [
      "Package value and advances",
      "Approval screenshots",
      "Delivery proof",
      "Balance follow-ups",
    ],
    mobileValue:
      "Capture event and delivery proof on mobile, then keep every pending balance visible from the desk.",
    workflowTitle:
      "Keep the payment story clear from booking advance to final delivery.",
    workflow: [
      "Add booking",
      "Record advance",
      "Attach event proof",
      "Log album approval",
      "Record final due date",
      "Send approved reminder",
      "Mark balance received",
    ],
    ctaTitle:
      "Give every photography balance its booking, proof, approval, and next action.",
    icon: Camera,
  },
  {
    slug: "repair-teams",
    name: "Repair Teams",
    heroTitle:
      "Keep service proof, parts bills, and unpaid repair balances clear.",
    shortDescription:
      "Connect service visits, parts bills, completion photos, and unpaid balances before the next job begins.",
    detailTitle:
      "Small service balances are easy to forget once the team moves to the next job.",
    pain:
      "Small service jobs create many small balances, and each one can be easy to forget once the team moves on.",
    stuck: [
      "Parts bills",
      "Completion photos",
      "Technician notes",
      "Small unpaid balances",
    ],
    tracks: [
      "Job value and payment status",
      "Service proof",
      "Client notes",
      "Daily follow-up queue",
    ],
    mobileValue:
      "Technicians can add completion proof from the field while owners review pending jobs centrally.",
    workflowTitle:
      "Turn each service visit into a complete payment record before the next job.",
    workflow: [
      "Add service job",
      "Record estimate",
      "Attach parts bill",
      "Add completion photo",
      "Record amount received",
      "Follow up on balance",
      "Close job",
    ],
    ctaTitle:
      "Give every repair balance its service proof and next action.",
    icon: Drill,
  },
  {
    slug: "interior-workers",
    name: "Interior Workers",
    heroTitle:
      "Keep stage payments, change approvals, and site proof clear.",
    shortDescription:
      "Track stage payments, material bills, change approvals, and site proof across long-running work.",
    detailTitle:
      "Long-running interior work needs every stage payment and change approval recorded.",
    pain:
      "Long projects collect many changes, site conversations, and stage payments before the final balance is due.",
    stuck: [
      "Stage payments",
      "Material bills",
      "Change requests",
      "Site completion proof",
    ],
    tracks: [
      "Project value and stages",
      "Bills and site photos",
      "Extra work approvals",
      "Promise and follow-up history",
    ],
    mobileValue:
      "Keep site updates attached to the project as they happen, with a full payment record ready on web.",
    workflowTitle:
      "Keep each stage, material bill, and change approval tied to the balance.",
    workflow: [
      "Add client and site",
      "Record project value",
      "Set payment stages",
      "Attach bills and photos",
      "Log change approvals",
      "Record promise dates",
      "Close the final balance",
    ],
    ctaTitle:
      "Give every interior project balance a stage, proof record, and next action.",
    icon: Paintbrush,
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return useCases.find((useCase) => useCase.slug === slug);
}
