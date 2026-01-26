export type ViewType = 'dashboard' | 'add-company' | 'company-detail';

export type TabType = 'balance-sheet' | 'profit-loss' | 'cash-flow' | 'notes' | 'full-report';

export type ViewMode = 'edit' | 'preview' | 'report';

export type PaperSize = 'A4' | 'single-continuous';

export type UnitOfMeasurement = 'full-number' | 'thousands' | 'ten-thousands' | 'lakhs' | 'crores' | 'ten-crores' | 'hundred-crores';

export type TableDesign = 'classic' | 'modern' | 'minimal' | 'striped' | 'elegant' | 'material' | 'glass' | 'contrast';
export type TableAccent = 'blue' | 'emerald' | 'violet' | 'amber' | 'slate' | 'rose';
export type TableDensity = 'comfortable' | 'compact' | 'spacious';

export type FontStyle = 'arial' | 'times-new-roman' | 'calibri' | 'helvetica' | 'georgia';

export interface SignatureBlock {
  id: string;
  title: string;
  name: string;
  designation: string;
  showDSC: boolean;
}

export interface TemplateSettings {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  fontStyle: FontStyle;
  fontSize: number;
  paperSize: PaperSize;
}

export interface FormattingSettings {
  decimalPoints: number;
  unitOfMeasurement: UnitOfMeasurement;
  numberStyle: 'indian' | 'international' | 'none' | 'custom';
  customNumberGrouping?: string; // e.g., "3,2" (first group 3, then repeat 2)
  tableDesign: TableDesign;
  tableAccent: TableAccent;
  tableDensity: TableDensity;
  showSignatureBlocks: boolean;
  signatureBlocks: SignatureBlock[];
  showDSCSign: boolean;
}

export interface CashFlowOperatingActivities {
  profitBeforeTax: AmountWithNote;
  adjustments: {
    depreciationAndAmortisation: AmountWithNote;
    financeCosts: AmountWithNote;
    interestIncome: AmountWithNote;
    otherAdjustments: AmountWithNote;
  };
  changesInWorkingCapital: {
    tradeReceivables: AmountWithNote;
    inventories: AmountWithNote;
    tradePayables: AmountWithNote;
    otherWorkingCapitalChanges: AmountWithNote;
  };
  incomeTaxesPaid: AmountWithNote;
}

export interface CashFlowInvestingActivities {
  purchaseOfPropertyPlantAndEquipment: AmountWithNote;
  proceedsFromSaleOfPropertyPlantAndEquipment: AmountWithNote;
  purchaseOfInvestments: AmountWithNote;
  proceedsFromInvestments: AmountWithNote;
  otherInvestingCashFlows: AmountWithNote;
}

export interface CashFlowFinancingActivities {
  proceedsFromShareCapital: AmountWithNote;
  proceedsFromBorrowings: AmountWithNote;
  repaymentOfBorrowings: AmountWithNote;
  dividendsPaid: AmountWithNote;
  interestPaid: AmountWithNote;
  otherFinancingCashFlows: AmountWithNote;
}

export interface CashFlowData {
  operatingActivities: CashFlowOperatingActivities;
  investingActivities: CashFlowInvestingActivities;
  financingActivities: CashFlowFinancingActivities;
  cashAndCashEquivalentsAtBeginning: AmountWithNote;
  cashAndCashEquivalentsAtEnd: AmountWithNote;
}

export interface CompanySettings {
  template: TemplateSettings;
  formatting: FormattingSettings;
}

export interface User {
  email: string;
  name: string;
}

export interface AmountWithNote {
  current: number;
  previous: number;
  note?: string;
}

// Equity
export interface Equity {
  equityShareCapital: AmountWithNote;
  otherEquity: AmountWithNote;
}

// Non-Current Liabilities
export interface NonCurrentLiabilities {
  financialLiabilities: {
    borrowings: AmountWithNote;
    leaseLiabilities: AmountWithNote;
    tradePayables: {
      microSmallEnterprisesDues: AmountWithNote;
      otherCreditorsDues: AmountWithNote;
    };
    otherFinancialLiabilities: AmountWithNote;
  };
  provisions: AmountWithNote;
  deferredTaxLiabilities: AmountWithNote;
  otherNonCurrentLiabilities: AmountWithNote;
}

// Current Liabilities
export interface CurrentLiabilities {
  financialLiabilities: {
    borrowings: AmountWithNote;
    leaseLiabilities: AmountWithNote;
    tradePayables: {
      microSmallEnterprisesDues: AmountWithNote;
      otherCreditorsDues: AmountWithNote;
    };
    otherFinancialLiabilities: AmountWithNote;
  };
  otherCurrentLiabilities: AmountWithNote;
  provisions: AmountWithNote;
  currentTaxLiabilities: AmountWithNote;
}

// A. Non-Current Assets
export interface NonCurrentAssets {
  propertyPlantEquipment: AmountWithNote;
  capitalWorkInProgress: AmountWithNote;
  investmentProperty: AmountWithNote;
  goodwill: AmountWithNote;
  otherIntangibleAssets: AmountWithNote;
  intangibleAssetsUnderDevelopment: AmountWithNote;
  biologicalAssetsOtherThanBearerPlants: AmountWithNote;
  financialAssets: {
    investments: AmountWithNote;
    tradeReceivables: AmountWithNote;
    loans: AmountWithNote;
  };
  deferredTaxAssets: AmountWithNote;
  otherNonCurrentAssets: AmountWithNote;
}

// B. Current Assets
export interface CurrentAssets {
  inventories: AmountWithNote;
  financialAssets: {
    investments: AmountWithNote;
    tradeReceivables: AmountWithNote;
    cashAndCashEquivalents: AmountWithNote;
    bankBalancesOtherThanCash: AmountWithNote;
    loans: AmountWithNote;
    others: AmountWithNote;
  };
  currentTaxAssets: AmountWithNote;
  otherCurrentAssets: AmountWithNote;
}

export interface BalanceSheetData {
  // Assets (shown first)
  nonCurrentAssets: NonCurrentAssets;
  currentAssets: CurrentAssets;
  // Equity and Liabilities
  equity: Equity;
  nonCurrentLiabilities: NonCurrentLiabilities;
  currentLiabilities: CurrentLiabilities;
}

// I. Revenue from operations
export interface RevenueFromOperations {
  amount: AmountWithNote;
}

// II. Other income
export interface OtherIncome {
  amount: AmountWithNote;
}

// IV. Expenses
export interface ProfitLossExpenses {
  costOfMaterialsConsumed: AmountWithNote;
  purchasesOfStockInTrade: AmountWithNote;
  changesInInventories: AmountWithNote;
  employeeBenefitsExpense: AmountWithNote;
  financeCosts: AmountWithNote;
  depreciationAndAmortisation: AmountWithNote;
  otherExpenses: AmountWithNote;
}

// VI. Exceptional items
export interface ExceptionalItems {
  amount: AmountWithNote;
}

// VIII. Tax expense
export interface TaxExpense {
  currentTax: AmountWithNote;
  deferredTax: AmountWithNote;
}

// X. Other Comprehensive Income (OCI)
export interface OtherComprehensiveIncome {
  itemsNotReclassified: {
    remeasurementOfNetDefinedBenefit: AmountWithNote;
    equityInstrumentsThroughOCI: AmountWithNote;
    incomeTaxNotReclassified: AmountWithNote;
  };
  itemsReclassified: {
    exchangeDifferences: AmountWithNote;
    debtInstrumentsThroughOCI: AmountWithNote;
    incomeTaxReclassified: AmountWithNote;
  };
}

// XII. Earnings per equity share
export interface EarningsPerShare {
  weightedAverageShares: number;
  dilutivePotentialShares: number;
}

export interface ProfitLossData {
  revenueFromOperations: RevenueFromOperations;
  otherIncome: OtherIncome;
  expenses: ProfitLossExpenses;
  exceptionalItems: ExceptionalItems;
  taxExpense: TaxExpense;
  // IX. Profit (Loss) for the period from continuing operations (VII - VIII)
  profitLossFromContinuingOperations: AmountWithNote;
  // X. Profit/(loss) from discontinued operations
  profitLossFromDiscontinuedOperations: AmountWithNote;
  // XI. Tax expenses of discontinued operations
  taxExpensesOfDiscontinuedOperations: AmountWithNote;
  // XII. Profit/(loss) from Discontinued operations (after tax) (X-XI)
  profitLossFromDiscontinuedOperationsAfterTax: AmountWithNote;
  // XIII. Profit/(loss) for the period (IX+XII)
  profitLossForThePeriod: AmountWithNote;
  // XIV. Other Comprehensive Income
  otherComprehensiveIncome: OtherComprehensiveIncome;
  // XV. Total Comprehensive Income for the period (XIII+XIV)
  totalComprehensiveIncomeForThePeriod: AmountWithNote;
  // XVI. Earnings per equity share (for continuing operation)
  earningsPerShareContinuing: {
    basic: AmountWithNote;
    diluted: AmountWithNote;
  };
  // XVII. Earnings per equity share (for discontinued operation)
  earningsPerShareDiscontinued: {
    basic: AmountWithNote;
    diluted: AmountWithNote;
  };
  // XVIII. Earning per equity share (for discontinued & continuing operation)
  earningsPerShareTotal: {
    basic: AmountWithNote;
    diluted: AmountWithNote;
  };
}

export interface BreakdownItem {
  id: string;
  description: string;
  current: number;
  previous: number;
}

export interface PPEBreakdownItem {
  id: string;
  description: string;
  grossBlock: number;
  depreciation: number;
}

export interface ShareCapitalItem {
  id: string;
  description: string;
  currentAmount: number;
  previousAmount: number;
}

export interface ReconciliationItem {
  id: string;
  description: string;
  currentCount: number;
  currentAmount: number;
  previousCount: number;
  previousAmount: number;
}

export interface ShareholderItem {
  id: string;
  name: string;
  currentCount: number;
  currentPercentage: number;
  previousCount: number;
  previousPercentage: number;
}

export interface PromoterItem {
  id: string;
  name: string;
  currentCount: number;
  currentPercentage: number;
  changePercentage: number;
}

export interface ShareCapitalData {
  authorised: ShareCapitalItem[];
  issued: ShareCapitalItem[];
  reconciliation: ReconciliationItem[];
  shareholders: ShareholderItem[];
  promoters: PromoterItem[];
}

export interface BorrowingItem {
  id: string;
  description: string;
  currentAmount: number;
  previousAmount: number;
}

export interface BorrowingsData {
  secured: BorrowingItem[];
  unsecured: BorrowingItem[];
  securityDetails: string;
}

export interface TradePayableItem {
  id: string;
  description: string;
  lessThan1Year: number;
  oneToTwoYears: number;
  twoToThreeYears: number;
  moreThan3Years: number;
  notDue: number;
}

export interface TradePayablesData {
  msme: TradePayableItem[];
  others: TradePayableItem[];
  disputedMsme: TradePayableItem[];
  disputedOthers: TradePayableItem[];
  disclosures: string;
}

export interface Company {
  id: number;
  name: string;
  address: string;
  cin: string;
  sector: 'Primary' | 'Secondary' | 'Tertiary' | 'Quaternary';
  specifications: string;
  pan: string;
  financialYear: string;
  yearEnd: string;
  prevYearEnd: string;
  balanceSheet: BalanceSheetData;
  profitLoss: ProfitLossData;
  cashFlow: CashFlowData;
  noteDetails: Record<string, string>;
  breakdowns: Record<string, BreakdownItem[]>;
  ppeBreakdowns?: Record<string, PPEBreakdownItem[]>;
  shareCapitalDetails?: Record<string, ShareCapitalData>;
  borrowingsDetails?: Record<string, BorrowingsData>;
  tradePayablesDetails?: Record<string, TradePayablesData>;
  settings: CompanySettings;
}


