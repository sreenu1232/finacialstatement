import React, { useState } from 'react';
import { Company } from '../types';
import { formatINR, calculateBSTotal, calculatePLTotal } from '../utils/formatters';
import { exportToWord } from '../utils/exportHelpers';
import { Download, FileText } from 'lucide-react';
import Notes from './Notes';

interface Props {
  company: Company;
}

const FullReport: React.FC<Props> = ({ company }) => {
  const [selectedSection, setSelectedSection] = useState<string>('full-report');
  const bsTotals = calculateBSTotal(company.balanceSheet);
  const plTotals = calculatePLTotal(company.profitLoss);

  const handleDownloadWord = async () => {
    const sectionName = selectedSection === 'full-report' ? 'Full_Report' : 
                       selectedSection === 'balance-sheet' ? 'Balance_Sheet' :
                       selectedSection === 'profit-loss' ? 'Profit_Loss' :
                       selectedSection === 'cash-flow' ? 'Cash_Flow' :
                       selectedSection === 'notes' ? 'Notes' : 'Report';
    const filename = `${company.name.replace(/\s+/g, '_')}_${sectionName}`;
    await exportToWord('full-report-content', filename);
  };

  const renderLogo = () => {
    if (company.settings?.template?.logo) {
      return (
        <div className="flex justify-center mb-6">
          <img
            src={company.settings.template.logo}
            alt={`${company.name} logo`}
            className="max-h-16 max-w-32 object-contain"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Controls */}
      <div className="bg-gray-50 border-b p-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="full-report">Full Report</option>
            <option value="balance-sheet">Balance Sheet</option>
            <option value="profit-loss">Profit & Loss</option>
            <option value="cash-flow">Cash Flow</option>
            <option value="notes">Notes</option>
          </select>
        </div>

        <button
          onClick={handleDownloadWord}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md font-medium"
        >
          <Download size={16} />
          Download Word
        </button>
      </div>

      {/* Report Content */}
      <div id="full-report-content" className="p-8 print:p-4">
      {/* Cover Page */}
      {(selectedSection === 'full-report' || selectedSection === 'cover-page') && (
        <div className="page-break-after mb-8">
          {renderLogo()}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">FINANCIAL STATEMENTS</h1>
            <h2 className="text-3xl font-semibold text-gray-700 mb-2">{company.name}</h2>
            <p className="text-lg text-gray-600 mb-4">{company.address}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>CIN: {company.cin}</p>
              <p>PAN: {company.pan}</p>
              <p>Sector: {company.sector} - {company.specifications}</p>
              <p>Financial Year: {company.financialYear}</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500">For the year ended {company.yearEnd}</p>
          </div>
        </div>
      )}

      {/* Balance Sheet */}
      {(selectedSection === 'full-report' || selectedSection === 'balance-sheet') && (
        <div className="page-break-after mb-8">
          {renderLogo()}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">BALANCE SHEET</h2>
            <p className="text-sm text-gray-600">As at {company.yearEnd}</p>
          </div>

        <table className="w-full border-collapse border text-sm mb-8">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left font-semibold">Particulars</th>
              <th className="border p-2 text-right font-semibold">{company.yearEnd}</th>
              <th className="border p-2 text-right font-semibold">{company.prevYearEnd}</th>
            </tr>
          </thead>
          <tbody>
            {/* 1️⃣ Equity and Liabilities */}
            <tr className="bg-gray-200 font-bold">
              <td className="border p-2" colSpan={3}>1️⃣ EQUITY AND LIABILITIES</td>
            </tr>
            
            {/* A. Shareholders' Funds */}
            <tr className="bg-blue-50 font-semibold">
              <td className="border p-2 pl-4">A. Shareholders' Funds</td>
              <td className="border p-2 text-right">{formatINR(bsTotals.equity)}</td>
              <td className="border p-2 text-right">{formatINR(bsTotals.equityPrev)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Share Capital</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.equity.equityShareCapital.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.equity.equityShareCapital.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Reserves and Surplus</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.equity.otherEquity.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.equity.otherEquity.previous)}</td>
            </tr>


            {/* C. Non-Current Liabilities */}
            <tr className="bg-blue-50 font-semibold">
              <td className="border p-2 pl-4">C. Non-Current Liabilities</td>
              <td className="border p-2 text-right">{formatINR(bsTotals.nonCurrentLiabilities)}</td>
              <td className="border p-2 text-right">{formatINR(bsTotals.nonCurrentLiabilitiesPrev)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Long-term borrowings</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentLiabilities.financialLiabilities.borrowings.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentLiabilities.financialLiabilities.borrowings.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Deferred tax liabilities (net)</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentLiabilities.deferredTaxLiabilities.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentLiabilities.deferredTaxLiabilities.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Other long-term liabilities</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentLiabilities.provisions.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentLiabilities.provisions.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Long-term provisions</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentLiabilities.otherNonCurrentLiabilities.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentLiabilities.otherNonCurrentLiabilities.previous)}</td>
            </tr>

            {/* D. Current Liabilities */}
            <tr className="bg-blue-50 font-semibold">
              <td className="border p-2 pl-4">D. Current Liabilities</td>
              <td className="border p-2 text-right">{formatINR(bsTotals.currentLiabilities)}</td>
              <td className="border p-2 text-right">{formatINR(bsTotals.currentLiabilitiesPrev)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Short-term borrowings</td>
              <td className="border p-2 text-right">{company.balanceSheet.currentLiabilities.financialLiabilities.borrowings.note}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentLiabilities.financialLiabilities.borrowings.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentLiabilities.financialLiabilities.borrowings.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Trade payables</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-12">(a) Total outstanding dues of micro and small enterprises</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-12">(b) Total outstanding dues of creditors other than micro and small enterprises</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentLiabilities.otherCurrentLiabilities.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentLiabilities.otherCurrentLiabilities.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Other current liabilities</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentLiabilities.otherCurrentLiabilities.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentLiabilities.otherCurrentLiabilities.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Short-term provisions</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentLiabilities.provisions.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentLiabilities.provisions.previous)}</td>
            </tr>

            {/* Total Liabilities */}
            <tr className="font-bold bg-green-100">
              <td className="border p-2">TOTAL</td>
              <td className="border p-2 text-right">{formatINR(bsTotals.totalLiabilities)}</td>
              <td className="border p-2 text-right">{formatINR(bsTotals.totalLiabilitiesPrev)}</td>
            </tr>

            {/* 2️⃣ Assets */}
            <tr className="bg-gray-200 font-bold">
              <td className="border p-2" colSpan={4}>2️⃣ ASSETS</td>
            </tr>
            
            {/* A. Non-Current Assets */}
            <tr className="bg-blue-50 font-semibold">
              <td className="border p-2 pl-4">A. Non-Current Assets</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatINR(bsTotals.nonCurrentAssets)}</td>
              <td className="border p-2 text-right">{formatINR(bsTotals.nonCurrentAssetsPrev)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Property, Plant and Equipment</td>
              <td className="border p-2 text-right">{company.balanceSheet.nonCurrentAssets.propertyPlantEquipment.note}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.propertyPlantEquipment.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.propertyPlantEquipment.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Intangible Assets</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.otherIntangibleAssets.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.otherIntangibleAssets.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Capital work-in-progress</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.capitalWorkInProgress.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.capitalWorkInProgress.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Intangible assets under development</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.intangibleAssetsUnderDevelopment.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.intangibleAssetsUnderDevelopment.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Non-current investments</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.financialAssets.investments.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.financialAssets.investments.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Deferred tax assets (net)</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.deferredTaxAssets.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.deferredTaxAssets.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Long-term loans and advances</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.financialAssets.loans.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.financialAssets.loans.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Other non-current assets</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.otherNonCurrentAssets.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.nonCurrentAssets.otherNonCurrentAssets.previous)}</td>
            </tr>

            {/* B. Current Assets */}
            <tr className="bg-blue-50 font-semibold">
              <td className="border p-2 pl-4">B. Current Assets</td>
              <td className="border p-2 text-right">{formatINR(bsTotals.currentAssets)}</td>
              <td className="border p-2 text-right">{formatINR(bsTotals.currentAssetsPrev)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Current investments</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentAssets.financialAssets.investments.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentAssets.financialAssets.investments.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Inventories</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentAssets.inventories.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentAssets.inventories.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Trade receivables</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentAssets.financialAssets.tradeReceivables.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentAssets.financialAssets.tradeReceivables.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Cash and cash equivalents</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentAssets.financialAssets.cashAndCashEquivalents.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentAssets.financialAssets.cashAndCashEquivalents.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Short-term loans and advances</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentAssets.financialAssets.loans.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentAssets.financialAssets.loans.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2 pl-8">Other current assets</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentAssets.otherCurrentAssets.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.balanceSheet.currentAssets.otherCurrentAssets.previous)}</td>
            </tr>

            {/* Total Assets */}
            <tr className="font-bold bg-green-100">
              <td className="border p-2">TOTAL</td>
              <td className="border p-2 text-right">{formatINR(bsTotals.totalAssets)}</td>
              <td className="border p-2 text-right">{formatINR(bsTotals.totalAssetsPrev)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      )}

      {/* Profit & Loss Statement */}
      {(selectedSection === 'full-report' || selectedSection === 'profit-loss') && (
        <div className="page-break-after mb-8">
          {renderLogo()}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">PROFIT & LOSS STATEMENT</h2>
            <p className="text-sm text-gray-600">For the year ended {company.yearEnd}</p>
          </div>

        <table className="w-full border-collapse border text-sm mb-8">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left font-semibold">Particulars</th>
              <th className="border p-2 text-right font-semibold">{company.yearEnd}</th>
              <th className="border p-2 text-right font-semibold">{company.prevYearEnd}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Revenue from Operations</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.revenueFromOperations.amount.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.revenueFromOperations.amount.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2">Other Income</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.otherIncome.amount.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.otherIncome.amount.previous)}</td>
            </tr>
            <tr className="font-bold bg-blue-50">
              <td className="border p-2">Total Revenue</td>
              <td className="border p-2 text-right">{formatINR(plTotals.totalIncome)}</td>
              <td className="border p-2 text-right">{formatINR(plTotals.totalIncomePrev)}</td>
            </tr>
            
            <tr>
              <td className="border p-2">Material Cost</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.expenses.costOfMaterialsConsumed.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.expenses.costOfMaterialsConsumed.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2">Employee Benefits</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.expenses.employeeBenefitsExpense.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.expenses.employeeBenefitsExpense.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2">Finance Costs</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.expenses.financeCosts.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.expenses.financeCosts.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2">Depreciation</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.expenses.depreciationAndAmortisation.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.expenses.depreciationAndAmortisation.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2">Other Expenses</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.expenses.otherExpenses.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.expenses.otherExpenses.previous)}</td>
            </tr>
            <tr className="font-bold bg-orange-50">
              <td className="border p-2">Total Expenses</td>
              <td className="border p-2 text-right">{formatINR(plTotals.totalExpenses)}</td>
              <td className="border p-2 text-right">{formatINR(plTotals.totalExpensesPrev)}</td>
            </tr>
            
            <tr className="font-bold bg-green-50">
              <td className="border p-2">Profit Before Tax</td>
              <td className="border p-2 text-right">{formatINR(plTotals.profitBeforeTax)}</td>
              <td className="border p-2 text-right">{formatINR(plTotals.profitBeforeTaxPrev)}</td>
            </tr>
            
            <tr>
              <td className="border p-2">Current Tax</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.taxExpense.currentTax.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.taxExpense.currentTax.previous)}</td>
            </tr>
            <tr>
              <td className="border p-2">Deferred Tax</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.taxExpense.deferredTax.current)}</td>
              <td className="border p-2 text-right">{formatINR(company.profitLoss.taxExpense.deferredTax.previous)}</td>
            </tr>
            
            <tr className="font-bold bg-green-100">
              <td className="border p-2">Profit After Tax (PAT)</td>
              <td className="border p-2 text-right">{formatINR(plTotals.profitForThePeriod)}</td>
              <td className="border p-2 text-right">{formatINR(plTotals.profitForThePeriodPrev)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      )}

      {/* Cash Flow Statement */}
      {(selectedSection === 'full-report' || selectedSection === 'cash-flow') && (
        <div className="page-break-after mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">CASH FLOW STATEMENT</h2>
            {renderLogo()}
            <p className="text-sm text-gray-600">For the year ended {company.yearEnd}</p>
          </div>

        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">Cash Flow Statement</p>
          <p className="text-sm">(To be implemented)</p>
        </div>
      </div>
      )}

      {/* Notes */}
      {(selectedSection === 'full-report' || selectedSection === 'notes') && (
        <div className="page-break-after mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">NOTES TO ACCOUNTS</h2>
            {renderLogo()}
            <p className="text-sm text-gray-600">For the year ended {company.yearEnd}</p>
          </div>

          <Notes company={company} />
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-16">
        <p>This report is generated on {new Date().toLocaleDateString()}</p>
        <p>Financial Statements prepared in accordance with Schedule III of the Companies Act, 2013</p>
      </div>
    </div>
  </div>
);
};

export default FullReport;
