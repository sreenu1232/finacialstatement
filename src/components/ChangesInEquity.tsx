import React from 'react';
import { Company } from '../types';
import { useApp } from '../context/AppContext';
import { formatINR, getUnitLabel, calculatePLTotal } from '../utils/formatters';
import { getTableDesignClasses } from '../utils/tableDesign';

interface Props {
  company: Company;
  modeOverride?: 'edit' | 'view' | 'report';
}

const ChangesInEquity: React.FC<Props> = ({ company, modeOverride }) => {
  const { viewMode, updateCompany } = useApp();
  const effectiveViewMode = modeOverride ?? viewMode;
  const isEditable = effectiveViewMode === 'edit';
  
  const { unitOfMeasurement, decimalPoints, numberStyle, customNumberGrouping, tableDesign, tableAccent, tableDensity, showSignatureBlocks, signatureBlocks } = company.settings.formatting;
  const { fontStyle, fontSize, primaryColor, secondaryColor } = company.settings.template;

  const formatValue = (value: number) => formatINR(value, unitOfMeasurement, decimalPoints, numberStyle, customNumberGrouping);
  const unitLabel = getUnitLabel(unitOfMeasurement);

  const { tableClassName, theadClassName, accentSoftRowClass, accentStrongRowClass } = getTableDesignClasses(tableDesign, tableAccent, tableDensity);

  // Get values from balance sheet
  const equityShareCapitalCurrent = company.balanceSheet.equity.equityShareCapital.current;
  const equityShareCapitalPrevious = company.balanceSheet.equity.equityShareCapital.previous;
  const otherEquityCurrent = company.balanceSheet.equity.otherEquity.current;
  const otherEquityPrevious = company.balanceSheet.equity.otherEquity.previous;

  // Calculate profit for the period from P&L
  const plTotals = calculatePLTotal(company.profitLoss);
  const profitForPeriod = plTotals.profitLossForThePeriod;
  const profitForPeriodPrev = plTotals.profitLossForThePeriodPrev;
  const ociForPeriod = plTotals.otherComprehensiveIncome;
  const ociForPeriodPrev = plTotals.otherComprehensiveIncomePrev;
  const totalComprehensiveIncome = plTotals.totalComprehensiveIncome;
  const totalComprehensiveIncomePrev = plTotals.totalComprehensiveIncomePrev;

  // Calculate totals
  const totalEquityCurrent = equityShareCapitalCurrent + otherEquityCurrent;
  const totalEquityPrevious = equityShareCapitalPrevious + otherEquityPrevious;

  // Assumed opening balances (previous year's closing = current year's opening)
  const openingShareCapital = equityShareCapitalPrevious;
  const openingOtherEquity = otherEquityPrevious - profitForPeriodPrev - ociForPeriodPrev;
  const openingTotalEquity = openingShareCapital + openingOtherEquity;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${effectiveViewMode === 'report' ? 'text-center mb-6' : ''}`}>
        <h2 className={`text-xl font-bold ${effectiveViewMode === 'report' ? 'text-2xl' : ''}`} style={{ color: primaryColor }}>
          {effectiveViewMode === 'edit' ? 'Edit Statement of Changes in Equity' : 'Statement of Changes in Equity'}
        </h2>
        {effectiveViewMode !== 'edit' && (
          <p className="text-sm text-gray-600 mt-1">
            for the year ended {company.yearEnd}
          </p>
        )}
      </div>

      {/* A. Equity Share Capital */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4" style={{ color: primaryColor }}>
          A. Equity Share Capital
        </h3>
        <table className={`w-full border-collapse text-sm ${tableClassName}`}>
          <thead className={theadClassName}>
            <tr>
              <th className="border p-2 text-left">Particulars</th>
              <th className="border p-2 text-right w-40">
                <div>{company.yearEnd}</div>
                <div className="text-xs font-normal">₹ ({unitLabel})</div>
              </th>
              <th className="border p-2 text-right w-40">
                <div>{company.prevYearEnd}</div>
                <div className="text-xs font-normal">₹ ({unitLabel})</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Balance at the beginning of the reporting period</td>
              <td className="border p-2 text-right">{formatValue(equityShareCapitalPrevious)}</td>
              <td className="border p-2 text-right">{formatValue(openingShareCapital)}</td>
            </tr>
            <tr>
              <td className="border p-2">Changes in equity share capital during the year</td>
              <td className="border p-2 text-right">{formatValue(equityShareCapitalCurrent - equityShareCapitalPrevious)}</td>
              <td className="border p-2 text-right">{formatValue(equityShareCapitalPrevious - openingShareCapital)}</td>
            </tr>
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">Balance at the end of the reporting period</td>
              <td className="border p-2 text-right">{formatValue(equityShareCapitalCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(equityShareCapitalPrevious)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* B. Other Equity */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4" style={{ color: primaryColor }}>
          B. Other Equity
        </h3>
        <table className={`w-full border-collapse text-sm ${tableClassName}`}>
          <thead className={theadClassName}>
            <tr>
              <th className="border p-2 text-left" rowSpan={2}>Particulars</th>
              <th className="border p-2 text-center" colSpan={3}>Reserves and Surplus</th>
              <th className="border p-2 text-center" rowSpan={2}>Other Comprehensive Income</th>
              <th className="border p-2 text-center" rowSpan={2}>Total Other Equity</th>
            </tr>
            <tr>
              <th className="border p-2 text-center">Securities Premium</th>
              <th className="border p-2 text-center">Retained Earnings</th>
              <th className="border p-2 text-center">Other Reserves</th>
            </tr>
          </thead>
          <tbody>
            {/* For Current Year */}
            <tr className="bg-gray-100 font-semibold">
              <td className="border p-2" colSpan={6}>For the year ended {company.yearEnd}</td>
            </tr>
            <tr>
              <td className="border p-2">Balance at the beginning of the year</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(otherEquityPrevious)}</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(otherEquityPrevious)}</td>
            </tr>
            <tr>
              <td className="border p-2">Profit for the year</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(profitForPeriod)}</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(profitForPeriod)}</td>
            </tr>
            <tr>
              <td className="border p-2">Other Comprehensive Income for the year</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(ociForPeriod)}</td>
              <td className="border p-2 text-right">{formatValue(ociForPeriod)}</td>
            </tr>
            <tr>
              <td className="border p-2">Dividends paid</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(-(company.cashFlow?.financingActivities?.dividendsPaid?.current || 0))}</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(-(company.cashFlow?.financingActivities?.dividendsPaid?.current || 0))}</td>
            </tr>
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">Balance at the end of the year</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(otherEquityCurrent)}</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(ociForPeriod)}</td>
              <td className="border p-2 text-right">{formatValue(otherEquityCurrent)}</td>
            </tr>

            {/* For Previous Year */}
            <tr className="bg-gray-100 font-semibold">
              <td className="border p-2" colSpan={6}>For the year ended {company.prevYearEnd}</td>
            </tr>
            <tr>
              <td className="border p-2">Balance at the beginning of the year</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(openingOtherEquity)}</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(openingOtherEquity)}</td>
            </tr>
            <tr>
              <td className="border p-2">Profit for the year</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(profitForPeriodPrev)}</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(profitForPeriodPrev)}</td>
            </tr>
            <tr>
              <td className="border p-2">Other Comprehensive Income for the year</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(ociForPeriodPrev)}</td>
              <td className="border p-2 text-right">{formatValue(ociForPeriodPrev)}</td>
            </tr>
            <tr>
              <td className="border p-2">Dividends paid</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(-(company.cashFlow?.financingActivities?.dividendsPaid?.previous || 0))}</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(-(company.cashFlow?.financingActivities?.dividendsPaid?.previous || 0))}</td>
            </tr>
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">Balance at the end of the year</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(otherEquityPrevious)}</td>
              <td className="border p-2 text-right">-</td>
              <td className="border p-2 text-right">{formatValue(ociForPeriodPrev)}</td>
              <td className="border p-2 text-right">{formatValue(otherEquityPrevious)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4" style={{ color: primaryColor }}>
          Total Equity Summary
        </h3>
        <table className={`w-full border-collapse text-sm ${tableClassName}`}>
          <thead className={theadClassName}>
            <tr>
              <th className="border p-2 text-left">Particulars</th>
              <th className="border p-2 text-right w-40">
                <div>{company.yearEnd}</div>
                <div className="text-xs font-normal">₹ ({unitLabel})</div>
              </th>
              <th className="border p-2 text-right w-40">
                <div>{company.prevYearEnd}</div>
                <div className="text-xs font-normal">₹ ({unitLabel})</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Equity Share Capital</td>
              <td className="border p-2 text-right">{formatValue(equityShareCapitalCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(equityShareCapitalPrevious)}</td>
            </tr>
            <tr>
              <td className="border p-2">Other Equity</td>
              <td className="border p-2 text-right">{formatValue(otherEquityCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(otherEquityPrevious)}</td>
            </tr>
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">Total Equity</td>
              <td className="border p-2 text-right">{formatValue(totalEquityCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(totalEquityPrevious)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signature Blocks */}
      {showSignatureBlocks && signatureBlocks && signatureBlocks.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="flex justify-between flex-wrap gap-8">
            {signatureBlocks.map((block) => (
              <div key={block.id} className="text-center min-w-[150px]">
                {block.showDSC && (
                  <div className="text-xs text-gray-500 mb-2">[Digitally Signed]</div>
                )}
                <div className="border-t border-gray-400 pt-2 mt-8">
                  <div className="font-semibold">{block.name}</div>
                  <div className="text-sm text-gray-600">{block.designation}</div>
                  <div className="text-xs text-gray-500">{block.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes reference */}
      <div className="text-sm text-gray-600 mt-6">
        <p>The accompanying notes are an integral part of these financial statements.</p>
      </div>
    </div>
  );
};

export default ChangesInEquity;
