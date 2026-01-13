// INR formatter and simple totals calculators used across components

import { BalanceSheetData, ProfitLossData, CashFlowData, UnitOfMeasurement } from '../types';

// Unit conversion multipliers
const UNIT_MULTIPLIERS: { [key in UnitOfMeasurement]: number } = {
  'full-number': 1,
  'thousands': 1000,
  'ten-thousands': 10000,
  'lakhs': 100000,
  'crores': 10000000,
  'ten-crores': 100000000,
  'hundred-crores': 1000000000
};

// Unit labels
const UNIT_LABELS: { [key in UnitOfMeasurement]: string } = {
  'full-number': '₹ (Full Number)',
  'thousands': '₹ (Thousands)',
  'ten-thousands': '₹ (Ten Thousands)',
  'lakhs': '₹ (Lakhs)',
  'crores': '₹ (Crores)',
  'ten-crores': '₹ (Ten Crores)',
  'hundred-crores': '₹ (100 Crores)'
};

function formatWithCustomGrouping(integerPart: string, groupingPattern?: string): string {
  if (!groupingPattern) return integerPart;
  const groups = groupingPattern.split(',').map((g) => parseInt(g.trim(), 10)).filter((n) => !Number.isNaN(n) && n > 0);
  if (groups.length === 0) return integerPart;

  let result: string[] = [];
  let idx = integerPart.length;
  // Take the first group size from the right
  let firstGroup = groups[0];
  if (idx > firstGroup) {
    result.unshift(integerPart.slice(idx - firstGroup, idx));
    idx -= firstGroup;
  } else {
    result.unshift(integerPart);
    return result.join(',');
  }

  // Repeat last group size for the remaining
  const repeatGroup = groups[groups.length - 1];
  while (idx > 0) {
    const start = Math.max(0, idx - repeatGroup);
    result.unshift(integerPart.slice(start, idx));
    idx = start;
  }
  return result.join(',');
}

export function formatINR(
  value: number,
  unitOfMeasurement: UnitOfMeasurement = 'lakhs',
  decimalPoints: number = 0,
  numberStyle: 'indian' | 'international' | 'none' | 'custom' = 'indian',
  customNumberGrouping?: string
): string {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return '0';
  }
  
  // Convert to the selected unit
  const convertedValue = value / UNIT_MULTIPLIERS[unitOfMeasurement];
  
  // Format with specified decimal places
  const options: Intl.NumberFormatOptions = {
    maximumFractionDigits: decimalPoints,
    minimumFractionDigits: decimalPoints
  };

  const rounded = Math.round(convertedValue * Math.pow(10, decimalPoints)) / Math.pow(10, decimalPoints);

  if (numberStyle === 'none') {
    // No thousands separators
    return rounded.toFixed(decimalPoints);
  }

  if (numberStyle === 'international') {
    return new Intl.NumberFormat('en-US', options).format(rounded);
  }

  if (numberStyle === 'custom') {
    const [intPart, fracPart = ''] = rounded.toFixed(decimalPoints).split('.');
    const withGrouping = formatWithCustomGrouping(intPart, customNumberGrouping);
    return fracPart.length > 0 ? `${withGrouping}.${fracPart}` : withGrouping;
  }

  // Default: Indian
  return new Intl.NumberFormat('en-IN', options).format(rounded);
}

export function getUnitLabel(unitOfMeasurement: UnitOfMeasurement): string {
  return UNIT_LABELS[unitOfMeasurement];
}

export function calculateBSTotal(bs: BalanceSheetData) {
  // Assets (calculated first)
  const nonCurrentAssets =
    bs.nonCurrentAssets.propertyPlantEquipment.current +
    bs.nonCurrentAssets.capitalWorkInProgress.current +
    bs.nonCurrentAssets.investmentProperty.current +
    bs.nonCurrentAssets.goodwill.current +
    bs.nonCurrentAssets.otherIntangibleAssets.current +
    bs.nonCurrentAssets.intangibleAssetsUnderDevelopment.current +
    bs.nonCurrentAssets.biologicalAssetsOtherThanBearerPlants.current +
    bs.nonCurrentAssets.financialAssets.investments.current +
    bs.nonCurrentAssets.financialAssets.tradeReceivables.current +
    bs.nonCurrentAssets.financialAssets.loans.current +
    bs.nonCurrentAssets.deferredTaxAssets.current +
    bs.nonCurrentAssets.otherNonCurrentAssets.current;
  const nonCurrentAssetsPrev =
    bs.nonCurrentAssets.propertyPlantEquipment.previous +
    bs.nonCurrentAssets.capitalWorkInProgress.previous +
    bs.nonCurrentAssets.investmentProperty.previous +
    bs.nonCurrentAssets.goodwill.previous +
    bs.nonCurrentAssets.otherIntangibleAssets.previous +
    bs.nonCurrentAssets.intangibleAssetsUnderDevelopment.previous +
    bs.nonCurrentAssets.biologicalAssetsOtherThanBearerPlants.previous +
    bs.nonCurrentAssets.financialAssets.investments.previous +
    bs.nonCurrentAssets.financialAssets.tradeReceivables.previous +
    bs.nonCurrentAssets.financialAssets.loans.previous +
    bs.nonCurrentAssets.deferredTaxAssets.previous +
    bs.nonCurrentAssets.otherNonCurrentAssets.previous;

  const currentAssets =
    bs.currentAssets.inventories.current +
    bs.currentAssets.financialAssets.investments.current +
    bs.currentAssets.financialAssets.tradeReceivables.current +
    bs.currentAssets.financialAssets.cashAndCashEquivalents.current +
    bs.currentAssets.financialAssets.bankBalancesOtherThanCash.current +
    bs.currentAssets.financialAssets.loans.current +
    bs.currentAssets.financialAssets.others.current +
    bs.currentAssets.currentTaxAssets.current +
    bs.currentAssets.otherCurrentAssets.current;
  const currentAssetsPrev =
    bs.currentAssets.inventories.previous +
    bs.currentAssets.financialAssets.investments.previous +
    bs.currentAssets.financialAssets.tradeReceivables.previous +
    bs.currentAssets.financialAssets.cashAndCashEquivalents.previous +
    bs.currentAssets.financialAssets.bankBalancesOtherThanCash.previous +
    bs.currentAssets.financialAssets.loans.previous +
    bs.currentAssets.financialAssets.others.previous +
    bs.currentAssets.currentTaxAssets.previous +
    bs.currentAssets.otherCurrentAssets.previous;

  const totalAssets = nonCurrentAssets + currentAssets;
  const totalAssetsPrev = nonCurrentAssetsPrev + currentAssetsPrev;

  // Equity and Liabilities
  const equity =
    bs.equity.equityShareCapital.current +
    bs.equity.otherEquity.current;
  const equityPrev =
    bs.equity.equityShareCapital.previous +
    bs.equity.otherEquity.previous;

  const nonCurrentLiabilities =
    bs.nonCurrentLiabilities.financialLiabilities.borrowings.current +
    bs.nonCurrentLiabilities.financialLiabilities.leaseLiabilities.current +
    bs.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current +
    bs.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current +
    bs.nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities.current +
    bs.nonCurrentLiabilities.provisions.current +
    bs.nonCurrentLiabilities.deferredTaxLiabilities.current +
    bs.nonCurrentLiabilities.otherNonCurrentLiabilities.current;
  const nonCurrentLiabilitiesPrev =
    bs.nonCurrentLiabilities.financialLiabilities.borrowings.previous +
    bs.nonCurrentLiabilities.financialLiabilities.leaseLiabilities.previous +
    bs.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.previous +
    bs.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.previous +
    bs.nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities.previous +
    bs.nonCurrentLiabilities.provisions.previous +
    bs.nonCurrentLiabilities.deferredTaxLiabilities.previous +
    bs.nonCurrentLiabilities.otherNonCurrentLiabilities.previous;

  const currentLiabilities =
    bs.currentLiabilities.financialLiabilities.borrowings.current +
    bs.currentLiabilities.financialLiabilities.leaseLiabilities.current +
    bs.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current +
    bs.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current +
    bs.currentLiabilities.financialLiabilities.otherFinancialLiabilities.current +
    bs.currentLiabilities.otherCurrentLiabilities.current +
    bs.currentLiabilities.provisions.current +
    bs.currentLiabilities.currentTaxLiabilities.current;
  const currentLiabilitiesPrev =
    bs.currentLiabilities.financialLiabilities.borrowings.previous +
    bs.currentLiabilities.financialLiabilities.leaseLiabilities.previous +
    bs.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.previous +
    bs.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.previous +
    bs.currentLiabilities.financialLiabilities.otherFinancialLiabilities.previous +
    bs.currentLiabilities.otherCurrentLiabilities.previous +
    bs.currentLiabilities.provisions.previous +
    bs.currentLiabilities.currentTaxLiabilities.previous;

  const totalLiabilities = equity + nonCurrentLiabilities + currentLiabilities;
  const totalLiabilitiesPrev = equityPrev + nonCurrentLiabilitiesPrev + currentLiabilitiesPrev;

  return {
    // Assets
    nonCurrentAssets,
    nonCurrentAssetsPrev,
    currentAssets,
    currentAssetsPrev,
    totalAssets,
    totalAssetsPrev,
    // Equity and Liabilities
    equity,
    equityPrev,
    nonCurrentLiabilities,
    nonCurrentLiabilitiesPrev,
    currentLiabilities,
    currentLiabilitiesPrev,
    totalLiabilities,
    totalLiabilitiesPrev
  };
}

export function calculatePLTotal(pl: ProfitLossData) {
  // III. Total income (I + II)
  const totalIncome = pl.revenueFromOperations.amount.current + pl.otherIncome.amount.current;
  const totalIncomePrev = pl.revenueFromOperations.amount.previous + pl.otherIncome.amount.previous;
  
  // Total expenses (IV) = (a + b + c + d + e + f + g)
  const totalExpenses = pl.expenses.costOfMaterialsConsumed.current + 
    pl.expenses.purchasesOfStockInTrade.current + 
    pl.expenses.changesInInventories.current + 
    pl.expenses.employeeBenefitsExpense.current + 
    pl.expenses.financeCosts.current + 
    pl.expenses.depreciationAndAmortisation.current + 
    pl.expenses.otherExpenses.current;
    
  const totalExpensesPrev = pl.expenses.costOfMaterialsConsumed.previous + 
    pl.expenses.purchasesOfStockInTrade.previous + 
    pl.expenses.changesInInventories.previous + 
    pl.expenses.employeeBenefitsExpense.previous + 
    pl.expenses.financeCosts.previous + 
    pl.expenses.depreciationAndAmortisation.previous + 
    pl.expenses.otherExpenses.previous;
  
  // V. Profit before exceptional items and tax (III – IV)
  const profitBeforeExceptionalItemsAndTax = totalIncome - totalExpenses;
  const profitBeforeExceptionalItemsAndTaxPrev = totalIncomePrev - totalExpensesPrev;
  
  // VII. Profit before tax (V – VI)
  const profitBeforeTax = profitBeforeExceptionalItemsAndTax - pl.exceptionalItems.amount.current;
  const profitBeforeTaxPrev = profitBeforeExceptionalItemsAndTaxPrev - pl.exceptionalItems.amount.previous;
  
  // IX. Profit for the period (VII – VIII)
  const totalTax = pl.taxExpense.currentTax.current + pl.taxExpense.deferredTax.current;
  const totalTaxPrev = pl.taxExpense.currentTax.previous + pl.taxExpense.deferredTax.previous;
  
  const profitForThePeriod = profitBeforeTax - totalTax;
  const profitForThePeriodPrev = profitBeforeTaxPrev - totalTaxPrev;
  
  // X. Other Comprehensive Income (OCI)
  const otherComprehensiveIncome = 
    pl.otherComprehensiveIncome.itemsNotReclassified.remeasurementOfNetDefinedBenefit.current +
    pl.otherComprehensiveIncome.itemsNotReclassified.equityInstrumentsThroughOCI.current +
    pl.otherComprehensiveIncome.itemsNotReclassified.incomeTaxNotReclassified.current +
    pl.otherComprehensiveIncome.itemsReclassified.exchangeDifferences.current +
    pl.otherComprehensiveIncome.itemsReclassified.debtInstrumentsThroughOCI.current +
    pl.otherComprehensiveIncome.itemsReclassified.incomeTaxReclassified.current;
    
  const otherComprehensiveIncomePrev = 
    pl.otherComprehensiveIncome.itemsNotReclassified.remeasurementOfNetDefinedBenefit.previous +
    pl.otherComprehensiveIncome.itemsNotReclassified.equityInstrumentsThroughOCI.previous +
    pl.otherComprehensiveIncome.itemsNotReclassified.incomeTaxNotReclassified.previous +
    pl.otherComprehensiveIncome.itemsReclassified.exchangeDifferences.previous +
    pl.otherComprehensiveIncome.itemsReclassified.debtInstrumentsThroughOCI.previous +
    pl.otherComprehensiveIncome.itemsReclassified.incomeTaxReclassified.previous;
  
  // XII. Profit/(loss) from Discontinued operations (after tax) (X-XI)
  const profitLossFromDiscontinuedOperationsAfterTax = pl.profitLossFromDiscontinuedOperations.current - pl.taxExpensesOfDiscontinuedOperations.current;
  const profitLossFromDiscontinuedOperationsAfterTaxPrev = pl.profitLossFromDiscontinuedOperations.previous - pl.taxExpensesOfDiscontinuedOperations.previous;
  
  // XIII. Profit/(loss) for the period (IX+XII)
  const profitLossForThePeriod = profitForThePeriod + profitLossFromDiscontinuedOperationsAfterTax;
  const profitLossForThePeriodPrev = profitForThePeriodPrev + profitLossFromDiscontinuedOperationsAfterTaxPrev;
  
  // XV. Total Comprehensive Income for the period (XIII+XIV)
  const totalComprehensiveIncome = profitLossForThePeriod + otherComprehensiveIncome;
  const totalComprehensiveIncomePrev = profitLossForThePeriodPrev + otherComprehensiveIncomePrev;
  
  return {
    totalIncome,
    totalIncomePrev,
    totalExpenses,
    totalExpensesPrev,
    profitBeforeExceptionalItemsAndTax,
    profitBeforeExceptionalItemsAndTaxPrev,
    profitBeforeTax,
    profitBeforeTaxPrev,
    profitForThePeriod,
    profitForThePeriodPrev,
    profitLossFromDiscontinuedOperationsAfterTax,
    profitLossFromDiscontinuedOperationsAfterTaxPrev,
    profitLossForThePeriod,
    profitLossForThePeriodPrev,
    otherComprehensiveIncome,
    otherComprehensiveIncomePrev,
    totalComprehensiveIncome,
    totalComprehensiveIncomePrev
  };
}

export function calculateCFTotal(cf: CashFlowData) {
  const adjustmentsCurrent =
    cf.operatingActivities.adjustments.depreciationAndAmortisation.current +
    cf.operatingActivities.adjustments.financeCosts.current +
    cf.operatingActivities.adjustments.interestIncome.current +
    cf.operatingActivities.adjustments.otherAdjustments.current;
  const adjustmentsPrevious =
    cf.operatingActivities.adjustments.depreciationAndAmortisation.previous +
    cf.operatingActivities.adjustments.financeCosts.previous +
    cf.operatingActivities.adjustments.interestIncome.previous +
    cf.operatingActivities.adjustments.otherAdjustments.previous;

  const workingCapitalCurrent =
    cf.operatingActivities.changesInWorkingCapital.tradeReceivables.current +
    cf.operatingActivities.changesInWorkingCapital.inventories.current +
    cf.operatingActivities.changesInWorkingCapital.tradePayables.current +
    cf.operatingActivities.changesInWorkingCapital.otherWorkingCapitalChanges.current;
  const workingCapitalPrevious =
    cf.operatingActivities.changesInWorkingCapital.tradeReceivables.previous +
    cf.operatingActivities.changesInWorkingCapital.inventories.previous +
    cf.operatingActivities.changesInWorkingCapital.tradePayables.previous +
    cf.operatingActivities.changesInWorkingCapital.otherWorkingCapitalChanges.previous;

  const cashGeneratedFromOperationsCurrent =
    cf.operatingActivities.profitBeforeTax.current + adjustmentsCurrent + workingCapitalCurrent;
  const cashGeneratedFromOperationsPrevious =
    cf.operatingActivities.profitBeforeTax.previous + adjustmentsPrevious + workingCapitalPrevious;

  const netCashFromOperatingActivitiesCurrent =
    cashGeneratedFromOperationsCurrent + cf.operatingActivities.incomeTaxesPaid.current;
  const netCashFromOperatingActivitiesPrevious =
    cashGeneratedFromOperationsPrevious + cf.operatingActivities.incomeTaxesPaid.previous;

  const netCashFromInvestingActivitiesCurrent =
    cf.investingActivities.purchaseOfPropertyPlantAndEquipment.current +
    cf.investingActivities.proceedsFromSaleOfPropertyPlantAndEquipment.current +
    cf.investingActivities.purchaseOfInvestments.current +
    cf.investingActivities.proceedsFromInvestments.current +
    cf.investingActivities.otherInvestingCashFlows.current;
  const netCashFromInvestingActivitiesPrevious =
    cf.investingActivities.purchaseOfPropertyPlantAndEquipment.previous +
    cf.investingActivities.proceedsFromSaleOfPropertyPlantAndEquipment.previous +
    cf.investingActivities.purchaseOfInvestments.previous +
    cf.investingActivities.proceedsFromInvestments.previous +
    cf.investingActivities.otherInvestingCashFlows.previous;

  const netCashFromFinancingActivitiesCurrent =
    cf.financingActivities.proceedsFromShareCapital.current +
    cf.financingActivities.proceedsFromBorrowings.current +
    cf.financingActivities.repaymentOfBorrowings.current +
    cf.financingActivities.dividendsPaid.current +
    cf.financingActivities.interestPaid.current +
    cf.financingActivities.otherFinancingCashFlows.current;
  const netCashFromFinancingActivitiesPrevious =
    cf.financingActivities.proceedsFromShareCapital.previous +
    cf.financingActivities.proceedsFromBorrowings.previous +
    cf.financingActivities.repaymentOfBorrowings.previous +
    cf.financingActivities.dividendsPaid.previous +
    cf.financingActivities.interestPaid.previous +
    cf.financingActivities.otherFinancingCashFlows.previous;

  const netIncreaseInCashCurrent =
    netCashFromOperatingActivitiesCurrent +
    netCashFromInvestingActivitiesCurrent +
    netCashFromFinancingActivitiesCurrent;
  const netIncreaseInCashPrevious =
    netCashFromOperatingActivitiesPrevious +
    netCashFromInvestingActivitiesPrevious +
    netCashFromFinancingActivitiesPrevious;

  const calculatedClosingCurrent = cf.cashAndCashEquivalentsAtBeginning.current + netIncreaseInCashCurrent;
  const calculatedClosingPrevious =
    cf.cashAndCashEquivalentsAtBeginning.previous + netIncreaseInCashPrevious;

  return {
    adjustmentsCurrent,
    adjustmentsPrevious,
    workingCapitalCurrent,
    workingCapitalPrevious,
    cashGeneratedFromOperationsCurrent,
    cashGeneratedFromOperationsPrevious,
    netCashFromOperatingActivitiesCurrent,
    netCashFromOperatingActivitiesPrevious,
    netCashFromInvestingActivitiesCurrent,
    netCashFromInvestingActivitiesPrevious,
    netCashFromFinancingActivitiesCurrent,
    netCashFromFinancingActivitiesPrevious,
    netIncreaseInCashCurrent,
    netIncreaseInCashPrevious,
    calculatedClosingCurrent,
    calculatedClosingPrevious
  };
}


