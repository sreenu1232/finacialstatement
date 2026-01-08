import { Company, BalanceSheetData, CashFlowData } from '../types';

export interface ValidationResult {
    id: string;
    type: 'error' | 'warning' | 'success';
    message: string;
    details?: string;
}

const getVal = (val: number | undefined) => val || 0;

export const validateBalanceSheet = (bs: BalanceSheetData): ValidationResult[] => {
    const results: ValidationResult[] = [];

    // 1. Total Assets
    const nonCurrentAssets =
        getVal(bs.nonCurrentAssets.propertyPlantEquipment.current) +
        getVal(bs.nonCurrentAssets.capitalWorkInProgress.current) +
        getVal(bs.nonCurrentAssets.investmentProperty.current) +
        getVal(bs.nonCurrentAssets.goodwill.current) +
        getVal(bs.nonCurrentAssets.otherIntangibleAssets.current) +
        getVal(bs.nonCurrentAssets.intangibleAssetsUnderDevelopment.current) +
        getVal(bs.nonCurrentAssets.biologicalAssetsOtherThanBearerPlants.current) +
        getVal(bs.nonCurrentAssets.financialAssets.investments.current) +
        getVal(bs.nonCurrentAssets.financialAssets.tradeReceivables.current) +
        getVal(bs.nonCurrentAssets.financialAssets.loans.current) +
        getVal(bs.nonCurrentAssets.deferredTaxAssets.current) +
        getVal(bs.nonCurrentAssets.otherNonCurrentAssets.current);

    const currentAssets =
        getVal(bs.currentAssets.inventories.current) +
        getVal(bs.currentAssets.financialAssets.investments.current) +
        getVal(bs.currentAssets.financialAssets.tradeReceivables.current) +
        getVal(bs.currentAssets.financialAssets.cashAndCashEquivalents.current) +
        getVal(bs.currentAssets.financialAssets.bankBalancesOtherThanCash.current) +
        getVal(bs.currentAssets.financialAssets.loans.current) +
        getVal(bs.currentAssets.financialAssets.others.current) +
        getVal(bs.currentAssets.currentTaxAssets.current) +
        getVal(bs.currentAssets.otherCurrentAssets.current);

    const totalAssets = nonCurrentAssets + currentAssets;

    // 2. Total Equity & Liabilities
    const equity =
        getVal(bs.equity.equityShareCapital.current) +
        getVal(bs.equity.otherEquity.current);

    const nonCurrentLiabilities =
        getVal(bs.nonCurrentLiabilities.financialLiabilities.borrowings.current) +
        getVal(bs.nonCurrentLiabilities.financialLiabilities.leaseLiabilities.current) +
        getVal(bs.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current) +
        getVal(bs.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current) +
        getVal(bs.nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities.current) +
        getVal(bs.nonCurrentLiabilities.provisions.current) +
        getVal(bs.nonCurrentLiabilities.deferredTaxLiabilities.current) +
        getVal(bs.nonCurrentLiabilities.otherNonCurrentLiabilities.current);

    const currentLiabilities =
        getVal(bs.currentLiabilities.financialLiabilities.borrowings.current) +
        getVal(bs.currentLiabilities.financialLiabilities.leaseLiabilities.current) +
        getVal(bs.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current) +
        getVal(bs.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current) +
        getVal(bs.currentLiabilities.financialLiabilities.otherFinancialLiabilities.current) +
        getVal(bs.currentLiabilities.otherCurrentLiabilities.current) +
        getVal(bs.currentLiabilities.provisions.current) +
        getVal(bs.currentLiabilities.currentTaxLiabilities.current);

    const totalEquityAndLiabilities = equity + nonCurrentLiabilities + currentLiabilities;

    const diff = Math.abs(totalAssets - totalEquityAndLiabilities);

    if (diff > 1) { // Allow small rounding error
        results.push({
            id: 'bs-balance',
            type: 'error',
            message: 'Balance Sheet Mismatch',
            details: `Assets (${totalAssets.toFixed(2)}) ≠ Equity & Liabilities (${totalEquityAndLiabilities.toFixed(2)}). Diff: ${diff.toFixed(2)}`
        });
    } else {
        results.push({
            id: 'bs-balance',
            type: 'success',
            message: 'Balance Sheet Balanced',
            details: 'Total Assets match Total Equity & Liabilities'
        });
    }

    return results;
};

export const validateCashFlow = (cf: CashFlowData, bs: BalanceSheetData): ValidationResult[] => {
    const results: ValidationResult[] = [];

    // 1. Check Closing Cash Balance vs Balance Sheet
    const cfClosing = getVal(cf.cashAndCashEquivalentsAtEnd.current);
    const bsCash = getVal(bs.currentAssets.financialAssets.cashAndCashEquivalents.current);

    const diff = Math.abs(cfClosing - bsCash);

    if (diff > 1) {
        results.push({
            id: 'cf-bs-match',
            type: 'error',
            message: 'Cash Flow Closing Balance Mismatch',
            details: `CF Closing (${cfClosing.toFixed(2)}) ≠ BS Cash (${bsCash.toFixed(2)})`
        });
    } else {
        results.push({
            id: 'cf-bs-match',
            type: 'success',
            message: 'Cash Flow Matches Balance Sheet',
            details: 'Closing Cash Balance matches Balance Sheet figure'
        });
    }

    return results;
};

export const runAllValidations = (company: Company): ValidationResult[] => {
    const bsResults = validateBalanceSheet(company.balanceSheet);
    const cfResults = validateCashFlow(company.cashFlow, company.balanceSheet);

    return [...bsResults, ...cfResults];
};
