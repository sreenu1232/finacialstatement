import { Company, AmountWithNote } from '../types';

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

const hasAmount = (entry?: AmountWithNote) => {
  if (!entry) return false;
  const current = entry.current ?? 0;
  const previous = entry.previous ?? 0;
  return current !== 0 || previous !== 0;
};

const toDefinition = (entry: AmountWithNote | undefined, title: string) => ({
  note: entry?.note,
  title,
  hasValue: hasAmount(entry),
});

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
    '69': 'earningsPerShareTotal.diluted'
  };
  return mapping[noteId];
};

export const buildNoteIndex = (company: Company): NoteIndex => {
  const notes: Array<{ note?: string; title: string; hasValue: boolean }> = [];

  const bs = company.balanceSheet;
  const pl = company.profitLoss;
  const cf = company.cashFlow;

  // Balance Sheet: Non-current assets
  notes.push(
    toDefinition(bs.nonCurrentAssets.propertyPlantEquipment, '(a) Property, Plant and Equipment'),
    toDefinition(bs.nonCurrentAssets.capitalWorkInProgress, '(b) Capital work-in-progress'),
    toDefinition(bs.nonCurrentAssets.investmentProperty, '(c) Investment Property'),
    toDefinition(bs.nonCurrentAssets.goodwill, '(d) Goodwill'),
    toDefinition(bs.nonCurrentAssets.otherIntangibleAssets, '(e) Other Intangible assets'),
    toDefinition(bs.nonCurrentAssets.intangibleAssetsUnderDevelopment, '(f) Intangible assets under development'),
    toDefinition(bs.nonCurrentAssets.biologicalAssetsOtherThanBearerPlants, '(g) Biological Assets other than bearer plants'),
    toDefinition(bs.nonCurrentAssets.financialAssets.investments, '(h)(i) Financial Assets - Investments'),
    toDefinition(bs.nonCurrentAssets.financialAssets.tradeReceivables, '(h)(ii) Financial Assets - Trade receivables'),
    toDefinition(bs.nonCurrentAssets.financialAssets.loans, '(h)(iii) Financial Assets - Loans'),
    toDefinition(bs.nonCurrentAssets.deferredTaxAssets, '(i) Deferred tax assets (net)'),
    toDefinition(bs.nonCurrentAssets.otherNonCurrentAssets, '(j) Other non-current assets')
  );

  // Balance Sheet: Current assets
  notes.push(
    toDefinition(bs.currentAssets.inventories, '(a) Inventories'),
    toDefinition(bs.currentAssets.financialAssets.investments, '(b)(i) Financial Assets - Investments'),
    toDefinition(bs.currentAssets.financialAssets.tradeReceivables, '(b)(ii) Financial Assets - Trade receivables'),
    toDefinition(bs.currentAssets.financialAssets.cashAndCashEquivalents, '(b)(iii) Financial Assets - Cash and cash equivalents'),
    toDefinition(bs.currentAssets.financialAssets.bankBalancesOtherThanCash, '(b)(iv) Financial Assets - Bank balances other than (iii) above'),
    toDefinition(bs.currentAssets.financialAssets.loans, '(b)(v) Financial Assets - Loans'),
    toDefinition(bs.currentAssets.financialAssets.others, '(b)(vi) Financial Assets - Others'),
    toDefinition(bs.currentAssets.currentTaxAssets, '(c) Current Tax Assets (Net)'),
    toDefinition(bs.currentAssets.otherCurrentAssets, '(d) Other current assets')
  );

  // Balance Sheet: Equity
  notes.push(
    toDefinition(bs.equity.equityShareCapital, 'Equity - Equity Share capital'),
    toDefinition(bs.equity.otherEquity, 'Equity - Other Equity')
  );

  // Balance Sheet: Non-current liabilities
  notes.push(
    toDefinition(bs.nonCurrentLiabilities.financialLiabilities.borrowings, 'Non-current liabilities - Financial Liabilities - Borrowings'),
    toDefinition(bs.nonCurrentLiabilities.financialLiabilities.leaseLiabilities, 'Non-current liabilities - Financial Liabilities - Lease liabilities'),
    toDefinition(bs.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues, 'Non-current liabilities - Trade Payables (Micro & Small Enterprises)'),
    toDefinition(bs.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues, 'Non-current liabilities - Trade Payables (Other creditors)'),
    toDefinition(bs.nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities, 'Non-current liabilities - Other financial liabilities'),
    toDefinition(bs.nonCurrentLiabilities.provisions, 'Non-current liabilities - Provisions'),
    toDefinition(bs.nonCurrentLiabilities.deferredTaxLiabilities, 'Non-current liabilities - Deferred tax liabilities (Net)'),
    toDefinition(bs.nonCurrentLiabilities.otherNonCurrentLiabilities, 'Non-current liabilities - Other non-current liabilities')
  );

  // Balance Sheet: Current liabilities
  notes.push(
    toDefinition(bs.currentLiabilities.financialLiabilities.borrowings, 'Current liabilities - Financial Liabilities - Borrowings'),
    toDefinition(bs.currentLiabilities.financialLiabilities.leaseLiabilities, 'Current liabilities - Financial Liabilities - Lease liabilities'),
    toDefinition(bs.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues, 'Current liabilities - Trade Payables (Micro & Small Enterprises)'),
    toDefinition(bs.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues, 'Current liabilities - Trade Payables (Other creditors)'),
    toDefinition(bs.currentLiabilities.financialLiabilities.otherFinancialLiabilities, 'Current liabilities - Other financial liabilities'),
    toDefinition(bs.currentLiabilities.otherCurrentLiabilities, 'Current liabilities - Other current liabilities'),
    toDefinition(bs.currentLiabilities.provisions, 'Current liabilities - Provisions'),
    toDefinition(bs.currentLiabilities.currentTaxLiabilities, 'Current liabilities - Current Tax Liabilities (Net)')
  );

  // Profit & Loss
  notes.push(
    toDefinition(pl.revenueFromOperations.amount, 'Revenue from Operations'),
    toDefinition(pl.otherIncome.amount, 'Other Income'),
    toDefinition(pl.expenses.costOfMaterialsConsumed, 'Cost of materials consumed'),
    toDefinition(pl.expenses.purchasesOfStockInTrade, 'Purchases of Stock-in-Trade'),
    toDefinition(pl.expenses.changesInInventories, 'Changes in inventories of finished goods, stock-in-trade and WIP'),
    toDefinition(pl.expenses.employeeBenefitsExpense, 'Employee benefits expense'),
    toDefinition(pl.expenses.financeCosts, 'Finance costs'),
    toDefinition(pl.expenses.depreciationAndAmortisation, 'Depreciation and amortisation expense'),
    toDefinition(pl.expenses.otherExpenses, 'Other expenses'),
    toDefinition(pl.exceptionalItems.amount, 'Exceptional Items'),
    toDefinition(pl.taxExpense.currentTax, 'Tax Expense - Current tax'),
    toDefinition(pl.taxExpense.deferredTax, 'Tax Expense - Deferred tax'),
    toDefinition(pl.profitLossFromContinuingOperations, 'Profit/(Loss) for the period from continuing operations'),
    toDefinition(pl.profitLossFromDiscontinuedOperations, 'Profit/(loss) from discontinued operations'),
    toDefinition(pl.taxExpensesOfDiscontinuedOperations, 'Tax expenses of discontinued operations'),
    toDefinition(pl.profitLossFromDiscontinuedOperationsAfterTax, 'Profit/(loss) from discontinued operations (after tax)'),
    toDefinition(pl.profitLossForThePeriod, 'Profit/(loss) for the period'),
    toDefinition(pl.otherComprehensiveIncome.itemsNotReclassified.remeasurementOfNetDefinedBenefit, 'OCI - Items not reclassified: Remeasurement of net defined benefit plans'),
    toDefinition(pl.otherComprehensiveIncome.itemsNotReclassified.equityInstrumentsThroughOCI, 'OCI - Items not reclassified: Equity instruments through OCI'),
    toDefinition(pl.otherComprehensiveIncome.itemsNotReclassified.incomeTaxNotReclassified, 'OCI - Items not reclassified: Income tax'),
    toDefinition(pl.otherComprehensiveIncome.itemsReclassified.exchangeDifferences, 'OCI - Items reclassified: Exchange differences'),
    toDefinition(pl.otherComprehensiveIncome.itemsReclassified.debtInstrumentsThroughOCI, 'OCI - Items reclassified: Debt instruments through OCI'),
    toDefinition(pl.otherComprehensiveIncome.itemsReclassified.incomeTaxReclassified, 'OCI - Items reclassified: Income tax'),
    toDefinition(pl.totalComprehensiveIncomeForThePeriod, 'Total Comprehensive Income for the period'),
    toDefinition(pl.earningsPerShareContinuing.basic, 'EPS (Continuing) - Basic'),
    toDefinition(pl.earningsPerShareContinuing.diluted, 'EPS (Continuing) - Diluted'),
    toDefinition(pl.earningsPerShareDiscontinued.basic, 'EPS (Discontinued) - Basic'),
    toDefinition(pl.earningsPerShareDiscontinued.diluted, 'EPS (Discontinued) - Diluted'),
    toDefinition(pl.earningsPerShareTotal.basic, 'EPS (Total) - Basic'),
    toDefinition(pl.earningsPerShareTotal.diluted, 'EPS (Total) - Diluted')
  );

  // Cash Flow Statement
  notes.push(
    toDefinition(cf.operatingActivities.profitBeforeTax, 'Cash Flow - Profit before tax'),
    toDefinition(cf.operatingActivities.adjustments.depreciationAndAmortisation, 'Cash Flow - Adjustments: Depreciation and amortisation'),
    toDefinition(cf.operatingActivities.adjustments.financeCosts, 'Cash Flow - Adjustments: Finance costs'),
    toDefinition(cf.operatingActivities.adjustments.interestIncome, 'Cash Flow - Adjustments: Interest income'),
    toDefinition(cf.operatingActivities.adjustments.otherAdjustments, 'Cash Flow - Adjustments: Other adjustments'),
    toDefinition(cf.operatingActivities.changesInWorkingCapital.tradeReceivables, 'Cash Flow - Changes in working capital: Trade receivables'),
    toDefinition(cf.operatingActivities.changesInWorkingCapital.inventories, 'Cash Flow - Changes in working capital: Inventories'),
    toDefinition(cf.operatingActivities.changesInWorkingCapital.tradePayables, 'Cash Flow - Changes in working capital: Trade payables'),
    toDefinition(cf.operatingActivities.changesInWorkingCapital.otherWorkingCapitalChanges, 'Cash Flow - Changes in working capital: Other assets / liabilities'),
    toDefinition(cf.operatingActivities.incomeTaxesPaid, 'Cash Flow - Income taxes paid'),
    toDefinition(cf.investingActivities.purchaseOfPropertyPlantAndEquipment, 'Cash Flow - Purchase of property, plant and equipment'),
    toDefinition(cf.investingActivities.proceedsFromSaleOfPropertyPlantAndEquipment, 'Cash Flow - Proceeds from sale of property, plant and equipment'),
    toDefinition(cf.investingActivities.purchaseOfInvestments, 'Cash Flow - Purchase of investments'),
    toDefinition(cf.investingActivities.proceedsFromInvestments, 'Cash Flow - Proceeds from investments'),
    toDefinition(cf.investingActivities.otherInvestingCashFlows, 'Cash Flow - Other investing cash flows'),
    toDefinition(cf.financingActivities.proceedsFromShareCapital, 'Cash Flow - Proceeds from issue of share capital'),
    toDefinition(cf.financingActivities.proceedsFromBorrowings, 'Cash Flow - Proceeds from borrowings'),
    toDefinition(cf.financingActivities.repaymentOfBorrowings, 'Cash Flow - Repayment of borrowings'),
    toDefinition(cf.financingActivities.dividendsPaid, 'Cash Flow - Dividends paid'),
    toDefinition(cf.financingActivities.interestPaid, 'Cash Flow - Interest paid'),
    toDefinition(cf.financingActivities.otherFinancingCashFlows, 'Cash Flow - Other financing cash flows'),
    toDefinition(cf.cashAndCashEquivalentsAtBeginning, 'Cash Flow - Cash and cash equivalents at the beginning of the year'),
    toDefinition(cf.cashAndCashEquivalentsAtEnd, 'Cash Flow - Cash and cash equivalents at the end of the year')
  );

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
    if (item.hasValue) {
      const number = String(counter++);
      map[item.note] = number;
      resolved.push({
        originalNote: item.note,
        number,
        title: item.title,
        bsPath: getFinancialPath(item.note)
      });
    } else {
      map[item.note] = undefined;
    }
  });

  return { map, list: resolved };
};
