import { Company, CashFlowData } from '../types';

// Helper to safely get number values
const getVal = (val: number | undefined) => val || 0;

export const generateCashFlowData = (company: Company): CashFlowData => {
    const { balanceSheet, profitLoss, cashFlow } = company;

    // 1. Calculate Profit Before Tax (PBT)
    // PBT = Revenue + Other Income - Expenses - Exceptional Items
    // Alternatively, if we trust the P&L "Profit from Continuing Operations" is PAT, we can add back tax.
    // But let's calculate from top down for accuracy.

    const revenue = getVal(profitLoss.revenueFromOperations.amount.current);
    const otherIncome = getVal(profitLoss.otherIncome.amount.current);
    const totalIncome = revenue + otherIncome;

    const costMaterials = getVal(profitLoss.expenses.costOfMaterialsConsumed.current);
    const purchases = getVal(profitLoss.expenses.purchasesOfStockInTrade.current);
    const changesInventories = getVal(profitLoss.expenses.changesInInventories.current);
    const empBenefits = getVal(profitLoss.expenses.employeeBenefitsExpense.current);
    const financeCosts = getVal(profitLoss.expenses.financeCosts.current);
    const depAmort = getVal(profitLoss.expenses.depreciationAndAmortisation.current);
    const otherExp = getVal(profitLoss.expenses.otherExpenses.current);

    const totalExpenses = costMaterials + purchases + changesInventories + empBenefits + financeCosts + depAmort + otherExp;

    const exceptional = getVal(profitLoss.exceptionalItems.amount.current);

    const pbtCurrent = totalIncome - totalExpenses - exceptional;

    // 2. Adjustments for Non-Cash Items
    // Depreciation (already fetched)

    // Finance Costs (already fetched)

    // Interest Income - Deduct
    // We assume it's part of 'Other Income'. For now, we don't have a specific field for Interest Income 
    // inside Other Income in our type definition. We will leave it as 0 to avoid incorrect deduction.
    const interestIncomeCurrent = 0;

    // 3. Working Capital Changes

    // Trade Receivables (Current -> Financial Assets -> Trade Receivables)
    const trCurrent = getVal(balanceSheet.currentAssets.financialAssets.tradeReceivables.current);
    const trPrevious = getVal(balanceSheet.currentAssets.financialAssets.tradeReceivables.previous);
    const changeInTRCurrent = -(trCurrent - trPrevious); // Increase is outflow (-)

    // Inventories (Current -> Inventories)
    const invCurrent = getVal(balanceSheet.currentAssets.inventories.current);
    const invPrevious = getVal(balanceSheet.currentAssets.inventories.previous);
    const changeInInvCurrent = -(invCurrent - invPrevious);

    // Trade Payables (Current -> Financial Liabilities -> Trade Payables -> MSME + Others)
    const tpCurrent = getVal(balanceSheet.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current) +
        getVal(balanceSheet.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current);
    const tpPrevious = getVal(balanceSheet.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.previous) +
        getVal(balanceSheet.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.previous);
    const changeInTPCurrent = tpCurrent - tpPrevious; // Increase is inflow (+)

    // Other Current Assets
    const ocaCurrent = getVal(balanceSheet.currentAssets.otherCurrentAssets.current);
    const ocaPrevious = getVal(balanceSheet.currentAssets.otherCurrentAssets.previous);
    // Also include 'Current -> Financial Assets -> Others' and 'Loans'
    const otherFinAssetsCurrent = getVal(balanceSheet.currentAssets.financialAssets.others.current) +
        getVal(balanceSheet.currentAssets.financialAssets.loans.current);
    const otherFinAssetsPrevious = getVal(balanceSheet.currentAssets.financialAssets.others.previous) +
        getVal(balanceSheet.currentAssets.financialAssets.loans.previous);

    const changeInOCACurrent = -((ocaCurrent + otherFinAssetsCurrent) - (ocaPrevious + otherFinAssetsPrevious));

    // Other Current Liabilities
    const oclCurrent = getVal(balanceSheet.currentLiabilities.otherCurrentLiabilities.current);
    const oclPrevious = getVal(balanceSheet.currentLiabilities.otherCurrentLiabilities.previous);
    // Also include 'Current -> Financial Liabilities -> Other Financial Liabilities'
    const otherFinLiabCurrent = getVal(balanceSheet.currentLiabilities.financialLiabilities.otherFinancialLiabilities.current);
    const otherFinLiabPrevious = getVal(balanceSheet.currentLiabilities.financialLiabilities.otherFinancialLiabilities.previous);

    const changeInOCLCurrent = (oclCurrent + otherFinLiabCurrent) - (oclPrevious + otherFinLiabPrevious);

    // Provisions (Current)
    const provCurrent = getVal(balanceSheet.currentLiabilities.provisions.current);
    const provPrevious = getVal(balanceSheet.currentLiabilities.provisions.previous);
    const changeInProvCurrent = provCurrent - provPrevious;

    // 4. Income Taxes Paid
    // Tax Paid = Opening Provision + Tax Expense - Closing Provision
    // Opening Provision = Previous Current Tax Liabilities
    // Closing Provision = Current Current Tax Liabilities
    // Tax Expense = Current Tax (from P&L)
    const taxLiabilityCurrent = getVal(balanceSheet.currentLiabilities.currentTaxLiabilities.current);
    const taxLiabilityPrevious = getVal(balanceSheet.currentLiabilities.currentTaxLiabilities.previous);
    const taxExpenseCurrent = getVal(profitLoss.taxExpense.currentTax.current);

    const taxPaidCurrent = taxLiabilityPrevious + taxExpenseCurrent - taxLiabilityCurrent;

    // Construct the new Cash Flow object
    const newCashFlow: CashFlowData = {
        ...cashFlow,
        operatingActivities: {
            ...cashFlow.operatingActivities,
            profitBeforeTax: {
                ...cashFlow.operatingActivities.profitBeforeTax,
                current: pbtCurrent
            },
            adjustments: {
                ...cashFlow.operatingActivities.adjustments,
                depreciationAndAmortisation: {
                    ...cashFlow.operatingActivities.adjustments.depreciationAndAmortisation,
                    current: depAmort
                },
                financeCosts: {
                    ...cashFlow.operatingActivities.adjustments.financeCosts,
                    current: financeCosts
                },
                interestIncome: {
                    ...cashFlow.operatingActivities.adjustments.interestIncome,
                    current: interestIncomeCurrent
                },
                otherAdjustments: {
                    ...cashFlow.operatingActivities.adjustments.otherAdjustments,
                    current: 0
                }
            },
            changesInWorkingCapital: {
                ...cashFlow.operatingActivities.changesInWorkingCapital,
                tradeReceivables: {
                    ...cashFlow.operatingActivities.changesInWorkingCapital.tradeReceivables,
                    current: changeInTRCurrent
                },
                inventories: {
                    ...cashFlow.operatingActivities.changesInWorkingCapital.inventories,
                    current: changeInInvCurrent
                },
                tradePayables: {
                    ...cashFlow.operatingActivities.changesInWorkingCapital.tradePayables,
                    current: changeInTPCurrent
                },
                otherWorkingCapitalChanges: {
                    ...cashFlow.operatingActivities.changesInWorkingCapital.otherWorkingCapitalChanges,
                    current: changeInOCACurrent + changeInOCLCurrent + changeInProvCurrent
                }
            },
            incomeTaxesPaid: {
                ...cashFlow.operatingActivities.incomeTaxesPaid,
                current: -Math.max(0, taxPaidCurrent) // Outflow is negative
            }
        },
        investingActivities: cashFlow.investingActivities,
        financingActivities: cashFlow.financingActivities,
        cashAndCashEquivalentsAtBeginning: {
            ...cashFlow.cashAndCashEquivalentsAtBeginning,
            current: getVal(balanceSheet.currentAssets.financialAssets.cashAndCashEquivalents.previous)
        },
        cashAndCashEquivalentsAtEnd: {
            ...cashFlow.cashAndCashEquivalentsAtEnd,
            current: getVal(balanceSheet.currentAssets.financialAssets.cashAndCashEquivalents.current)
        }
    };

    return newCashFlow;
};
