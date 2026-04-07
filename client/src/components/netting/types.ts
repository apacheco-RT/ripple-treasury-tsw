// client/src/components/netting/types.ts

export type Currency = "USD" | "EUR" | "GBP";
export type EntityCode = "SA" | "LTD" | "INC" | "BVI" | "BFS" | "ASIA";
export type TxType =
  | "Trade settlement" | "Creditcard settlement" | "Ripple settlement"
  | "Deposit settlement" | "OTC trade settlement" | "Derivatives settlement"
  | "Derivatives IF claim" | "Derivatives IF premium" | "Derivatives FEE sweep"
  | "Derivatives liquidation" | "Derivatives" | "Account transfers" | "Withdrawals";

export type ActionStatus =
  | "submitted" | "in_payments" | "first_approval" | "second_approval"
  | "sent_to_bank" | "bank_confirmed" | "failed";

export type FreshnessState = "fresh" | "watch" | "stale";

export interface TxBreakdown {
  type: TxType;
  amount: number;
}

export interface EntityPairing {
  id: string;
  from: EntityCode;
  to: EntityCode;
  currency: Currency;
  grossExposure: number;
  settled: number;
  open: number;
  breakdown: TxBreakdown[];
  lastSettled: string;
  freshnessMinutes: number;
}

export interface Action {
  id: string;
  pairingId: string;
  from: EntityCode;
  to: EntityCode;
  currency: Currency;
  amount: number;
  status: ActionStatus;
  accountFrom: string;
  accountTo: string;
  createdAt: string;
  updatedAt: string;
  failureReason?: string;
  requiresManualRelease: boolean;
}

export interface BankAccount {
  id: string;
  entity: EntityCode;
  bank: string;
  currency: Currency;
  label: string;
  balance: number;
}

export const SETTLEMENT_TYPES: TxType[] = [
  "Trade settlement", "Creditcard settlement", "Ripple settlement",
  "Deposit settlement", "OTC trade settlement", "Derivatives settlement",
  "Derivatives IF claim", "Derivatives IF premium", "Derivatives FEE sweep",
  "Derivatives liquidation", "Derivatives", "Account transfers", "Withdrawals",
];

export const MOCK_PAIRINGS: EntityPairing[] = [
  {
    id: "SA-LTD-EUR",
    from: "SA", to: "LTD", currency: "EUR",
    grossExposure: 480, settled: 340, open: 140,
    breakdown: [
      { type: "Trade settlement", amount: 310 },
      { type: "Deposit settlement", amount: 30 },
    ],
    lastSettled: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    freshnessMinutes: 2,
  },
  {
    id: "SA-LTD-GBP",
    from: "SA", to: "LTD", currency: "GBP",
    grossExposure: 120, settled: 40, open: 80,
    breakdown: [
      { type: "Trade settlement", amount: 120 },
    ],
    lastSettled: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    freshnessMinutes: 5,
  },
  {
    id: "SA-INC-USD",
    from: "SA", to: "INC", currency: "USD",
    grossExposure: 620, settled: 420, open: 200,
    breakdown: [
      { type: "Trade settlement", amount: 380 },
      { type: "OTC trade settlement", amount: 40 },
    ],
    lastSettled: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    freshnessMinutes: 8,
  },
  {
    id: "SA-BVI-USD",
    from: "SA", to: "BVI", currency: "USD",
    grossExposure: 180, settled: 80, open: 100,
    breakdown: [
      { type: "Trade settlement", amount: 80 },
    ],
    lastSettled: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    freshnessMinutes: 18,
  },
  {
    id: "INC-BVI-USD",
    from: "INC", to: "BVI", currency: "USD",
    grossExposure: 95, settled: 95, open: 0,
    breakdown: [
      { type: "Trade settlement", amount: 95 },
    ],
    lastSettled: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    freshnessMinutes: 1,
  },
];

export const MOCK_ACTIONS: Action[] = [
  {
    id: "ACT-004", pairingId: "SA-LTD-GBP",
    from: "SA", to: "LTD", currency: "GBP", amount: 40,
    status: "submitted",
    accountFrom: "LHV Frankfurt - GBP", accountTo: "LHV London - GBP",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    requiresManualRelease: true,
  },
  {
    id: "ACT-001", pairingId: "SA-LTD-EUR",
    from: "SA", to: "LTD", currency: "EUR", amount: 160,
    status: "in_payments",
    accountFrom: "LHV Frankfurt - EUR", accountTo: "LHV London - EUR",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    requiresManualRelease: false,
  },
  {
    id: "ACT-002", pairingId: "SA-INC-USD",
    from: "SA", to: "INC", currency: "USD", amount: 120,
    status: "sent_to_bank",
    accountFrom: "Customers Bank SA - USD", accountTo: "Customers Bank INC - USD",
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    requiresManualRelease: false,
  },
  {
    id: "ACT-003", pairingId: "SA-INC-USD",
    from: "SA", to: "INC", currency: "USD", amount: 80,
    status: "failed",
    accountFrom: "Bank Frick SA - USD", accountTo: "Customers Bank INC - USD",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    failureReason: "Insufficient balance on Bank Frick SA - USD",
    requiresManualRelease: false,
  },
];

export const MOCK_COMPLETED_ACTIONS: Action[] = [
  {
    id: "ACT-C001", pairingId: "SA-LTD-EUR",
    from: "SA", to: "LTD", currency: "EUR", amount: 340,
    status: "bank_confirmed",
    accountFrom: "LHV Frankfurt - EUR", accountTo: "LHV London - EUR",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    requiresManualRelease: false,
  },
  {
    id: "ACT-C002", pairingId: "SA-INC-USD",
    from: "SA", to: "INC", currency: "USD", amount: 420,
    status: "bank_confirmed",
    accountFrom: "Customers Bank SA - USD", accountTo: "Customers Bank INC - USD",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    requiresManualRelease: false,
  },
];

export const MOCK_ACCOUNTS: BankAccount[] = [
  { id: "LHV-SA-EUR", entity: "SA", bank: "LHV", currency: "EUR", label: "LHV Frankfurt - EUR", balance: 280 },
  { id: "LHV-LTD-EUR", entity: "LTD", bank: "LHV", currency: "EUR", label: "LHV London - EUR", balance: 120 },
  { id: "LHV-SA-GBP", entity: "SA", bank: "LHV", currency: "GBP", label: "LHV Frankfurt - GBP", balance: 95 },
  { id: "LHV-LTD-GBP", entity: "LTD", bank: "LHV", currency: "GBP", label: "LHV London - GBP", balance: 48 },
  { id: "CB-SA-USD", entity: "SA", bank: "Customers Bank", currency: "USD", label: "Customers Bank SA - USD", balance: 310 },
  { id: "CB-INC-USD", entity: "INC", bank: "Customers Bank", currency: "USD", label: "Customers Bank INC - USD", balance: 180 },
  { id: "CB-BVI-USD", entity: "BVI", bank: "Customers Bank", currency: "USD", label: "Customers Bank BVI - USD", balance: 75 },
  { id: "BF-SA-USD", entity: "SA", bank: "Bank Frick", currency: "USD", label: "Bank Frick SA - USD", balance: 12 },
];

export function getFreshnessState(minutes: number): FreshnessState {
  if (minutes < 3) return "fresh";
  if (minutes <= 15) return "watch";
  return "stale";
}

export function formatAmount(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = { USD: "$", EUR: "€", GBP: "£" };
  return `${symbols[currency]}${amount}M`;
}
