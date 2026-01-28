import { Company } from '../types';

export interface ResolvedNote {
  originalNote: string;
  number: string;
  title: string;
  bsPath?: string;
}

export interface NoteIndex {
  map: Record<string, string | undefined>;
  list: ResolvedNote[];
}

export const getFinancialPath = (noteId: string): string | undefined => {
  const mapping: Record<string, string> = {
    // Balance Sheet
    '1': 'nonCurrentAssets.propertyPlantEquipment',
    '2': 'nonCurrentAssets.capitalWorkInProgress',
    '3': 'nonCurrentAssets.investmentProperty',
    '4': 'nonCurrentAssets.goodwill',
    '5': 'nonCurrentAssets.otherIntangibleAssets',
    '6': 'nonCurrentAssets.intangibleAssetsUnderDevelopment',
    '7': 'nonCurrentAssets.biologicalAssetsOtherThanBearerPlants',
    '8': 'nonCurrentAssets.financialAssets.investments',
    '9': 'nonCurrentAssets.financialAssets.tradeReceivables',
    '10': 'nonCurrentAssets.financialAssets.loans',
    '11': 'nonCurrentAssets.deferredTaxAssets',
    '12': 'nonCurrentAssets.otherNonCurrentAssets',
    '13': 'currentAssets.inventories',
    '14': 'currentAssets.financialAssets.investments',
    '15': 'currentAssets.financialAssets.tradeReceivables',
    '16': 'currentAssets.financialAssets.cashAndCashEquivalents',
    '17': 'currentAssets.financialAssets.bankBalancesOtherThanCash',
    '18': 'currentAssets.financialAssets.loans',
    '19': 'currentAssets.financialAssets.others',
    '20': 'currentAssets.currentTaxAssets',
    '21': 'currentAssets.otherCurrentAssets',
    '22': 'equity.equityShareCapital',
    '23': 'equity.otherEquity',
    '24': 'nonCurrentLiabilities.financialLiabilities.borrowings',
    '25': 'nonCurrentLiabilities.financialLiabilities.leaseLiabilities',
    '26': 'nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues',
    '27': 'nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues',
    '28': 'nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities',
    '29': 'nonCurrentLiabilities.provisions',
    '30': 'nonCurrentLiabilities.deferredTaxLiabilities',
    '31': 'nonCurrentLiabilities.otherNonCurrentLiabilities',
    '32': 'currentLiabilities.financialLiabilities.borrowings',
    '33': 'currentLiabilities.financialLiabilities.leaseLiabilities',
    '34': 'currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues',
    '35': 'currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues',
    '36': 'currentLiabilities.financialLiabilities.otherFinancialLiabilities',
    '37': 'currentLiabilities.otherCurrentLiabilities',
    '38': 'currentLiabilities.provisions',
    '39': 'currentLiabilities.currentTaxLiabilities',

    // Profit & Loss
    '40': 'revenueFromOperations.amount',
    '41': 'otherIncome.amount',
    '42': 'expenses.costOfMaterialsConsumed',
    '43': 'expenses.purchasesOfStockInTrade',
    '44': 'expenses.changesInInventories',
    '45': 'expenses.employeeBenefitsExpense',
    '46': 'expenses.financeCosts',
    '47': 'expenses.depreciationAndAmortisation',
    '48': 'expenses.otherExpenses',
    '49': 'exceptionalItems.amount',
    '50': 'taxExpense.currentTax',
    '51': 'taxExpense.deferredTax',
    '52': 'profitLossFromContinuingOperations',
    '53': 'profitLossFromDiscontinuedOperations',
    '54': 'taxExpensesOfDiscontinuedOperations',
    '55': 'profitLossFromDiscontinuedOperationsAfterTax',
    '56': 'profitLossForThePeriod',
    '57': 'otherComprehensiveIncome.itemsNotReclassified.remeasurementOfNetDefinedBenefit',
    '58': 'otherComprehensiveIncome.itemsNotReclassified.equityInstrumentsThroughOCI',
    '59': 'otherComprehensiveIncome.itemsNotReclassified.incomeTaxNotReclassified',
    '60': 'otherComprehensiveIncome.itemsReclassified.exchangeDifferences',
    '61': 'otherComprehensiveIncome.itemsReclassified.debtInstrumentsThroughOCI',
    '62': 'otherComprehensiveIncome.itemsReclassified.incomeTaxReclassified',
    '63': 'totalComprehensiveIncomeForThePeriod',
    '64': 'earningsPerShareContinuing.basic',
    '65': 'earningsPerShareContinuing.diluted',
    '66': 'earningsPerShareDiscontinued.basic',
    '67': 'earningsPerShareDiscontinued.diluted',
    '68': 'earningsPerShareTotal.basic',
    '69': 'earningsPerShareTotal.diluted',
    // Cash Flow notes removed (previously notes 70-92)
  };
  return mapping[noteId];
};

export const buildNoteIndex = (company: Company): NoteIndex => {
  const notes: Array<{ note?: string; title: string; hasValue: boolean }> = [];

  // Always include all possible notes, regardless of whether they have amounts
  // Balance Sheet: Non-current assets
  notes.push(
    { note: '1', title: '(a) Property, Plant and Equipment', hasValue: true },
    { note: '2', title: '(b) Capital work-in-progress', hasValue: true },
    { note: '3', title: '(c) Investment Property', hasValue: true },
    { note: '4', title: '(d) Goodwill', hasValue: true },
    { note: '5', title: '(e) Other Intangible assets', hasValue: true },
    { note: '6', title: '(f) Intangible assets under development', hasValue: true },
    { note: '7', title: '(g) Biological Assets other than bearer plants', hasValue: true },
    { note: '8', title: '(h)(i) Financial Assets - Investments', hasValue: true },
    { note: '9', title: '(h)(ii) Financial Assets - Trade receivables', hasValue: true },
    { note: '10', title: '(h)(iii) Financial Assets - Loans', hasValue: true },
    { note: '11', title: '(i) Deferred tax assets (net)', hasValue: true },
    { note: '12', title: '(j) Other non-current assets', hasValue: true }
  );

  // Balance Sheet: Current assets
  notes.push(
    { note: '13', title: '(a) Inventories', hasValue: true },
    { note: '14', title: '(b)(i) Financial Assets - Investments', hasValue: true },
    { note: '15', title: '(b)(ii) Financial Assets - Trade receivables', hasValue: true },
    { note: '16', title: '(b)(iii) Financial Assets - Cash and cash equivalents', hasValue: true },
    { note: '17', title: '(b)(iv) Financial Assets - Bank balances other than (iii) above', hasValue: true },
    { note: '18', title: '(b)(v) Financial Assets - Loans', hasValue: true },
    { note: '19', title: '(b)(vi) Financial Assets - Others', hasValue: true },
    { note: '20', title: '(c) Current Tax Assets (Net)', hasValue: true },
    { note: '21', title: '(d) Other current assets', hasValue: true }
  );

  // Balance Sheet: Equity
  notes.push(
    { note: '22', title: 'Equity - Equity Share capital', hasValue: true },
    { note: '23', title: 'Equity - Other Equity', hasValue: true }
  );

  // Balance Sheet: Non-current liabilities
  notes.push(
    { note: '24', title: 'Non-current liabilities - Financial Liabilities - Borrowings', hasValue: true },
    { note: '25', title: 'Non-current liabilities - Financial Liabilities - Lease liabilities', hasValue: true },
    { note: '26', title: 'Non-current liabilities - Trade Payables (Micro & Small Enterprises)', hasValue: true },
    { note: '27', title: 'Non-current liabilities - Trade Payables (Other creditors)', hasValue: true },
    { note: '28', title: 'Non-current liabilities - Other financial liabilities', hasValue: true },
    { note: '29', title: 'Non-current liabilities - Provisions', hasValue: true },
    { note: '30', title: 'Non-current liabilities - Deferred tax liabilities (Net)', hasValue: true },
    { note: '31', title: 'Non-current liabilities - Other non-current liabilities', hasValue: true }
  );

  // Balance Sheet: Current liabilities
  notes.push(
    { note: '32', title: 'Current liabilities - Financial Liabilities - Borrowings', hasValue: true },
    { note: '33', title: 'Current liabilities - Financial Liabilities - Lease liabilities', hasValue: true },
    { note: '34', title: 'Current liabilities - Trade Payables (Micro & Small Enterprises)', hasValue: true },
    { note: '35', title: 'Current liabilities - Trade Payables (Other creditors)', hasValue: true },
    { note: '36', title: 'Current liabilities - Other financial liabilities', hasValue: true },
    { note: '37', title: 'Current liabilities - Other current liabilities', hasValue: true },
    { note: '38', title: 'Current liabilities - Provisions', hasValue: true },
    { note: '39', title: 'Current liabilities - Current Tax Liabilities (Net)', hasValue: true }
  );

  // Profit & Loss
  notes.push(
    { note: '40', title: 'Revenue from Operations', hasValue: true },
    { note: '41', title: 'Other Income', hasValue: true },
    { note: '42', title: 'Cost of materials consumed', hasValue: true },
    { note: '43', title: 'Purchases of Stock-in-Trade', hasValue: true },
    { note: '44', title: 'Changes in inventories of finished goods, stock-in-trade and WIP', hasValue: true },
    { note: '45', title: 'Employee benefits expense', hasValue: true },
    { note: '46', title: 'Finance costs', hasValue: true },
    { note: '47', title: 'Depreciation and amortisation expense', hasValue: true },
    { note: '48', title: 'Other expenses', hasValue: true },
    { note: '49', title: 'Exceptional Items', hasValue: true },
    { note: '50', title: 'Tax Expense - Current tax', hasValue: true },
    { note: '51', title: 'Tax Expense - Deferred tax', hasValue: true },
    { note: '52', title: 'Profit/(Loss) for the period from continuing operations', hasValue: true },
    { note: '53', title: 'Profit/(loss) from discontinued operations', hasValue: true },
    { note: '54', title: 'Tax expenses of discontinued operations', hasValue: true },
    { note: '55', title: 'Profit/(loss) from discontinued operations (after tax)', hasValue: true },
    { note: '56', title: 'Profit/(loss) for the period', hasValue: true },
    { note: '57', title: 'OCI - Items not reclassified: Remeasurement of net defined benefit plans', hasValue: true },
    { note: '58', title: 'OCI - Items not reclassified: Equity instruments through OCI', hasValue: true },
    { note: '59', title: 'OCI - Items not reclassified: Income tax', hasValue: true },
    { note: '60', title: 'OCI - Items reclassified: Exchange differences', hasValue: true },
    { note: '61', title: 'OCI - Items reclassified: Debt instruments through OCI', hasValue: true },
    { note: '62', title: 'OCI - Items reclassified: Income tax', hasValue: true },
    { note: '63', title: 'Total Comprehensive Income for the period', hasValue: true },
    { note: '64', title: 'EPS (Continuing) - Basic', hasValue: true },
    { note: '65', title: 'EPS (Continuing) - Diluted', hasValue: true },
    { note: '66', title: 'EPS (Discontinued) - Basic', hasValue: true },
    { note: '67', title: 'EPS (Discontinued) - Diluted', hasValue: true },
    { note: '68', title: 'EPS (Total) - Basic', hasValue: true },
    { note: '69', title: 'EPS (Total) - Diluted', hasValue: true }
  );

  // Cash Flow Statement - All cash flow notes removed (previously notes 70-92)

  // Static Notes
  notes.unshift(
    { note: 'corporate-info', title: 'Corporate Information', hasValue: true },
    { note: 'accounting-policies', title: 'Significant Accounting Policies', hasValue: true }
  );

  const map: Record<string, string | undefined> = {};
  const resolved: ResolvedNote[] = [];
  let counter = 1;

  notes.forEach((item) => {
    if (!item.note) return;
    // Always include notes now, regardless of hasValue
    const number = String(counter++);
    map[item.note] = number;
    resolved.push({
      originalNote: item.note,
      number,
      title: item.title,
      bsPath: getFinancialPath(item.note)
    });
  });

  return { map, list: resolved };
};
