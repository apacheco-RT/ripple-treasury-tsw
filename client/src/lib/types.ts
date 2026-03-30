import { processStage } from "./design-tokens";

export type ProcessStage = "Create" | "Anti Fraud" | "Approvals" | "Status" | "History";
export type TrayFilter = "all" | "overdue" | "high-risk";

export interface TxnAttachment {
  name: string;
  type: "pdf" | "image";
  url: string;
}

export interface Txn {
  id: string;
  payee: string;
  type: string;
  instType: string;
  modelId: string;
  amount: number;
  cur: string;
  trnDate: string;
  valDate: string;
  status: string;
  nextStatus: string;
  processStage: ProcessStage;
  risk: number;
  riskReason: string | null;
  riskFlag: string | null;
  verified: boolean;
  overdue: boolean;
  bank: string;
  legalEntity: string;
  approver: string;
  approvalLevel: number;
  operativeAcct: string;
  offsetNumber: string;
  attachment?: TxnAttachment;
  waterfallChain?: string;
  waterfallPosition?: number;
  waterfallTotal?: number;
  rlusdEligible?: boolean;
}

export const DEFAULT_FILTERS = {
  dateType: "Transaction date",
  dateFrom: "2025-01-01",
  dateTo: "2026-12-31",
  quickSearch: "",
  txnNum: "",
  payee: "",
  status: "",
  txnType: "",
  legalEntity: "",
  netting: "All",
  showMyItems: false,
  rowsPerPage: "25",
  datePreset: "",
  savedSearch: "",
  processStage: "",
};

export type Filters = typeof DEFAULT_FILTERS;

export type SummaryRowId = "approval-needed" | "pending-fraud-review" | "ready-to-extract" | "extracted" | "confirmed" | "completed" | "failed" | "void";

export interface SummaryRow {
  id: SummaryRowId;
  label: string;
  statusFilter: string;
  Icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  debits: number;
  credits: number;
  amount: number;
  count: number;
}

export interface FlaggedTxn {
  id: string;
  paymentNumber: string;
  vendor: string;
  corridor: string;
  currency: string;
  amount: number;
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskFactors: string[];
  recommendation: string;
}

export interface VerifAV {
  status: "pass" | "warning" | "fail";
  confidence: number;
  recommendation: string;
  checks: { label: string; passed: boolean }[];
}

export interface VerifKYB {
  risk: "low" | "medium" | "high";
  status: string;
  assessment: string;
  actions: string[];
}

export type FeatureFlags = {
  rlusdStrip: boolean;
  stablecoinRail: boolean;
  selectPaymentRail: boolean;
  riskColumn: boolean;
  fraudSpotlight?: boolean;
};

export const PROCESS_STAGES: { key: ProcessStage; color: string; bg: string; desc: string; cta?: string }[] = [
  { key: "Create", color: processStage.create.color, bg: processStage.create.bg, desc: "Transactions created and validated", cta: "New Payment" },
  { key: "Anti Fraud", color: processStage.antiFraud.color, bg: processStage.antiFraud.bg, desc: "Fraud screening and AML checks in progress", cta: "Review Flags" },
  { key: "Approvals", color: processStage.approvals.color, bg: processStage.approvals.bg, desc: "Awaiting authorised approver sign-off", cta: "Approve Queue" },
  { key: "Status", color: processStage.status.color, bg: processStage.status.bg, desc: "Sent for processing and settlement", cta: undefined },
  { key: "History", color: processStage.history.color, bg: processStage.history.bg, desc: "Completed and archived transactions", cta: undefined },
];

export const prototypeFeatures = [
  { key: "rlusdStrip", label: "RLUSD Eligible Strip", description: "Highlight transactions eligible for instant RLUSD settlement" },
  { key: "stablecoinRail", label: "Stablecoin Payment Rail", description: "Show stablecoin option in payment rail selection dialog" },
  { key: "selectPaymentRail", label: "Select Payment Rail Button", description: "Enable payment rail selection for RLUSD-eligible transactions" },
  { key: "riskColumn", label: "Risk Column", description: "Show inline risk score column in the transaction details table" },
  { key: "fraudSpotlight", label: "Fraud Protection Spotlight", description: "Show the fraud protection spotlight banner with flagged transactions" },
];
