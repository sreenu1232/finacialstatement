import React from 'react';
import { Company, ViewMode } from '../types';
import { useApp } from '../context/AppContext';
import { formatINR, calculateCFTotal, getUnitLabel } from '../utils/formatters';
import { getTableDesignClasses } from '../utils/tableDesign';
import { buildNoteIndex } from '../utils/noteHelpers';
import { generateCashFlowData } from '../utils/cashFlowHelpers';

interface Props {
  company: Company;
  modeOverride?: ViewMode;
}

const CashFlow: React.FC<Props> = ({ company, modeOverride }) => {
  const { viewMode, updateCompanyCF, updateCompany, setActiveTab } = useApp();
  const effectiveViewMode = modeOverride ?? viewMode;
  const isEditable = effectiveViewMode === 'edit';
  const totals = calculateCFTotal(company.cashFlow);
  const noteIndex = buildNoteIndex(company);
  const { unitOfMeasurement, decimalPoints, numberStyle, customNumberGrouping, tableDesign, tableAccent, tableDensity } = company.settings.formatting;
  const { fontStyle, fontSize, primaryColor, secondaryColor } = company.settings.template;

  const formatValue = (value: number) =>
    formatINR(value, unitOfMeasurement, decimalPoints, numberStyle, customNumberGrouping);
  const unitLabel = getUnitLabel(unitOfMeasurement);

  const { tableClassName, theadClassName } = getTableDesignClasses(tableDesign, tableAccent, tableDensity);

  const renderNoteCell = (note?: string) => {
    const resolved = note ? noteIndex.map[note] : undefined;
    return (
      <td className="border p-2 text-right text-xs sm:text-sm">
        {resolved ?? '-'}
      </td>
    );
  };

  const handleNoteClick = (noteNumber: string) => {
    setActiveTab('notes');
    setTimeout(() => {
      const el = document.getElementById(`note-${noteNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const renderInputField = (currentValue: number, previousValue: number, path: string, note?: string) => {
    const resolvedNote = note ? noteIndex.map[note] : undefined;

    // If there is a linked note, CY is calculated from notes, PY is manually editable
    if (resolvedNote) {
      return (
        <>
          <td className="border p-2 text-right bg-blue-50">
            <div className="flex items-center justify-end gap-2">
              <span className="font-medium">{formatValue(currentValue)}</span>
              <button
                type="button"
                onClick={() => handleNoteClick(resolvedNote)}
                className="text-xs text-blue-600 hover:text-blue-800"
                title="View Note Details"
              >
                📊
              </button>
            </div>
          </td>
          <td className="border p-2">
            <input
              type="text"
              key={`${path}-prev-${unitOfMeasurement}-${decimalPoints}-${numberStyle}-${customNumberGrouping || ''}`}
              defaultValue={formatValue(previousValue)}
              onFocus={(e) => {
                e.target.value = previousValue.toString();
                e.target.type = 'number';
              }}
              onBlur={(e) => {
                const raw = e.target.value === '' ? 0 : Number(e.target.value);
                const safeValue = Number.isFinite(raw) ? raw : 0;
                updateCompanyCF(company.id, `${path}.previous`, safeValue);
                e.target.type = 'text';
                e.target.value = formatValue(safeValue);
              }}
              className="w-full px-2 py-1 border rounded text-right bg-yellow-50"
              title="Previous Year - Manual Entry"
            />
          </td>
        </>
      );
    }

    // No linked note - both PY and CY are manually editable
    return (
      <>
        <td className="border p-2">
          <input
            type="text"
            key={`${path}-cur-${unitOfMeasurement}-${decimalPoints}-${numberStyle}-${customNumberGrouping || ''}`}
            defaultValue={formatValue(currentValue)}
            onFocus={(e) => {
              e.target.value = currentValue.toString();
              e.target.type = 'number';
            }}
            onBlur={(e) => {
              const raw = e.target.value === '' ? 0 : Number(e.target.value);
              const safeValue = Number.isFinite(raw) ? raw : 0;
              updateCompanyCF(company.id, `${path}.current`, safeValue);
              e.target.type = 'text';
              e.target.value = formatValue(safeValue);
            }}
            className="w-full px-2 py-1 border rounded text-right"
            title="Current Year - Manual Entry"
          />
        </td>
        <td className="border p-2">
          <input
            type="text"
            key={`${path}-prev-${unitOfMeasurement}-${decimalPoints}-${numberStyle}-${customNumberGrouping || ''}`}
            defaultValue={formatValue(previousValue)}
            onFocus={(e) => {
              e.target.value = previousValue.toString();
              e.target.type = 'number';
            }}
            onBlur={(e) => {
              const raw = e.target.value === '' ? 0 : Number(e.target.value);
              const safeValue = Number.isFinite(raw) ? raw : 0;
              updateCompanyCF(company.id, `${path}.previous`, safeValue);
              e.target.type = 'text';
              e.target.value = formatValue(safeValue);
            }}
            className="w-full px-2 py-1 border rounded text-right"
            title="Previous Year - Manual Entry"
          />
        </td>
      </>
    );
  };

  const renderDisplayField = (currentValue: number, previousValue: number) => (
    <>
      <td className="border p-2 text-right">{formatValue(currentValue)}</td>
      <td className="border p-2 text-right">{formatValue(previousValue)}</td>
    </>
  );

  const renderRow = (
    label: string,
    note: string | undefined,
    currentValue: number,
    previousValue: number,
    path: string,
    labelClassName = ''
  ) => (
    <tr>
      <td className={`border p-2 ${labelClassName}`}>{label}</td>
      {renderNoteCell(note)}
      {isEditable
        ? renderInputField(currentValue, previousValue, path)
        : renderDisplayField(currentValue, previousValue)}
    </tr>
  );

  return (
    <div style={{ fontFamily: fontStyle, fontSize: `${fontSize}px` }}>
      <h3 className="text-lg font-bold mb-2" style={{ color: primaryColor }}>
        Cash Flow Statement
      </h3>
      <p className="text-sm mb-4" style={{ color: secondaryColor }}>
        For the year ended {company.yearEnd}
      </p>

      {isEditable && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => {
              if (window.confirm('This will overwrite the current year values in the Cash Flow Statement based on Balance Sheet and P&L data. Are you sure?')) {
                const newCF = generateCashFlowData(company);
                // We need to update the whole cashFlow object. 
                // Since updateCompanyCF only updates single fields, we might need a new method or update field by field.
                // Actually, AppContext has updateCompany which takes Partial<Company>.
                // We should use that.
                // But wait, CashFlow component only receives 'company', it doesn't have 'updateCompany' from props, 
                // but it uses 'useApp'.
                // Let's check useApp destructuring.
                updateCompany(company.id, { cashFlow: newCF });
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <span className="text-lg">⚡</span>
            Auto-Populate from BS & P&L
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className={tableClassName} style={{ fontSize: `${fontSize}px` }}>
          <thead className={theadClassName}>
            <tr>
              <th className="border p-2 text-left">Particulars</th>
              <th className="border p-2 text-right">Note No.</th>
              <th className="border p-2 text-right">
                {company.yearEnd}
                <br />
                <span className="text-xs" style={{ color: secondaryColor }}>
                  {unitLabel}
                </span>
              </th>
              <th className="border p-2 text-right">
                {company.prevYearEnd}
                <br />
                <span className="text-xs" style={{ color: secondaryColor }}>
                  {unitLabel}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-blue-50 font-semibold">
              <td className="border p-2" colSpan={4}>
                A. Cash Flow from Operating Activities
              </td>
            </tr>

            {renderRow(
              'Profit before tax',
              company.cashFlow.operatingActivities.profitBeforeTax.note,
              company.cashFlow.operatingActivities.profitBeforeTax.current,
              company.cashFlow.operatingActivities.profitBeforeTax.previous,
              'operatingActivities.profitBeforeTax'
            )}

            <tr className="bg-gray-50 font-semibold">
              <td className="border p-2 pl-4" colSpan={4}>
                Adjustments for:
              </td>
            </tr>

            {renderRow(
              'Depreciation and amortisation',
              company.cashFlow.operatingActivities.adjustments.depreciationAndAmortisation.note,
              company.cashFlow.operatingActivities.adjustments.depreciationAndAmortisation.current,
              company.cashFlow.operatingActivities.adjustments.depreciationAndAmortisation.previous,
              'operatingActivities.adjustments.depreciationAndAmortisation',
              'pl-8'
            )}
            {renderRow(
              'Finance costs',
              company.cashFlow.operatingActivities.adjustments.financeCosts.note,
              company.cashFlow.operatingActivities.adjustments.financeCosts.current,
              company.cashFlow.operatingActivities.adjustments.financeCosts.previous,
              'operatingActivities.adjustments.financeCosts',
              'pl-8'
            )}
            {renderRow(
              'Interest income',
              company.cashFlow.operatingActivities.adjustments.interestIncome.note,
              company.cashFlow.operatingActivities.adjustments.interestIncome.current,
              company.cashFlow.operatingActivities.adjustments.interestIncome.previous,
              'operatingActivities.adjustments.interestIncome',
              'pl-8'
            )}
            {renderRow(
              'Other adjustments',
              company.cashFlow.operatingActivities.adjustments.otherAdjustments.note,
              company.cashFlow.operatingActivities.adjustments.otherAdjustments.current,
              company.cashFlow.operatingActivities.adjustments.otherAdjustments.previous,
              'operatingActivities.adjustments.otherAdjustments',
              'pl-8'
            )}

            <tr className="font-semibold bg-blue-100">
              <td className="border p-2 pl-8">Total adjustments</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.adjustmentsCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(totals.adjustmentsPrevious)}</td>
            </tr>

            <tr className="bg-gray-50 font-semibold">
              <td className="border p-2 pl-4" colSpan={4}>
                Changes in working capital:
              </td>
            </tr>

            {renderRow(
              'Trade receivables',
              company.cashFlow.operatingActivities.changesInWorkingCapital.tradeReceivables.note,
              company.cashFlow.operatingActivities.changesInWorkingCapital.tradeReceivables.current,
              company.cashFlow.operatingActivities.changesInWorkingCapital.tradeReceivables.previous,
              'operatingActivities.changesInWorkingCapital.tradeReceivables',
              'pl-8'
            )}
            {renderRow(
              'Inventories',
              company.cashFlow.operatingActivities.changesInWorkingCapital.inventories.note,
              company.cashFlow.operatingActivities.changesInWorkingCapital.inventories.current,
              company.cashFlow.operatingActivities.changesInWorkingCapital.inventories.previous,
              'operatingActivities.changesInWorkingCapital.inventories',
              'pl-8'
            )}
            {renderRow(
              'Trade payables',
              company.cashFlow.operatingActivities.changesInWorkingCapital.tradePayables.note,
              company.cashFlow.operatingActivities.changesInWorkingCapital.tradePayables.current,
              company.cashFlow.operatingActivities.changesInWorkingCapital.tradePayables.previous,
              'operatingActivities.changesInWorkingCapital.tradePayables',
              'pl-8'
            )}
            {renderRow(
              'Other assets / liabilities',
              company.cashFlow.operatingActivities.changesInWorkingCapital.otherWorkingCapitalChanges.note,
              company.cashFlow.operatingActivities.changesInWorkingCapital.otherWorkingCapitalChanges.current,
              company.cashFlow.operatingActivities.changesInWorkingCapital.otherWorkingCapitalChanges.previous,
              'operatingActivities.changesInWorkingCapital.otherWorkingCapitalChanges',
              'pl-8'
            )}

            <tr className="font-semibold bg-blue-100">
              <td className="border p-2 pl-8">Total changes in working capital</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.workingCapitalCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(totals.workingCapitalPrevious)}</td>
            </tr>

            <tr className="font-semibold bg-green-50">
              <td className="border p-2">Cash generated from operations</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.cashGeneratedFromOperationsCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(totals.cashGeneratedFromOperationsPrevious)}</td>
            </tr>

            {renderRow(
              'Income taxes paid',
              company.cashFlow.operatingActivities.incomeTaxesPaid.note,
              company.cashFlow.operatingActivities.incomeTaxesPaid.current,
              company.cashFlow.operatingActivities.incomeTaxesPaid.previous,
              'operatingActivities.incomeTaxesPaid'
            )}

            <tr className="font-bold bg-green-100">
              <td className="border p-2">Net cash from operating activities (A)</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.netCashFromOperatingActivitiesCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(totals.netCashFromOperatingActivitiesPrevious)}</td>
            </tr>

            <tr className="bg-blue-50 font-semibold">
              <td className="border p-2" colSpan={4}>
                B. Cash Flow from Investing Activities
              </td>
            </tr>

            {renderRow(
              'Purchase of property, plant and equipment',
              company.cashFlow.investingActivities.purchaseOfPropertyPlantAndEquipment.note,
              company.cashFlow.investingActivities.purchaseOfPropertyPlantAndEquipment.current,
              company.cashFlow.investingActivities.purchaseOfPropertyPlantAndEquipment.previous,
              'investingActivities.purchaseOfPropertyPlantAndEquipment'
            )}
            {renderRow(
              'Proceeds from sale of property, plant and equipment',
              company.cashFlow.investingActivities.proceedsFromSaleOfPropertyPlantAndEquipment.note,
              company.cashFlow.investingActivities.proceedsFromSaleOfPropertyPlantAndEquipment.current,
              company.cashFlow.investingActivities.proceedsFromSaleOfPropertyPlantAndEquipment.previous,
              'investingActivities.proceedsFromSaleOfPropertyPlantAndEquipment'
            )}
            {renderRow(
              'Purchase of investments',
              company.cashFlow.investingActivities.purchaseOfInvestments.note,
              company.cashFlow.investingActivities.purchaseOfInvestments.current,
              company.cashFlow.investingActivities.purchaseOfInvestments.previous,
              'investingActivities.purchaseOfInvestments'
            )}
            {renderRow(
              'Proceeds from investments',
              company.cashFlow.investingActivities.proceedsFromInvestments.note,
              company.cashFlow.investingActivities.proceedsFromInvestments.current,
              company.cashFlow.investingActivities.proceedsFromInvestments.previous,
              'investingActivities.proceedsFromInvestments'
            )}
            {renderRow(
              'Other investing cash flows',
              company.cashFlow.investingActivities.otherInvestingCashFlows.note,
              company.cashFlow.investingActivities.otherInvestingCashFlows.current,
              company.cashFlow.investingActivities.otherInvestingCashFlows.previous,
              'investingActivities.otherInvestingCashFlows'
            )}

            <tr className="font-bold bg-green-100">
              <td className="border p-2">Net cash (used in)/from investing activities (B)</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.netCashFromInvestingActivitiesCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(totals.netCashFromInvestingActivitiesPrevious)}</td>
            </tr>

            <tr className="bg-blue-50 font-semibold">
              <td className="border p-2" colSpan={4}>
                C. Cash Flow from Financing Activities
              </td>
            </tr>

            {renderRow(
              'Proceeds from issue of share capital',
              company.cashFlow.financingActivities.proceedsFromShareCapital.note,
              company.cashFlow.financingActivities.proceedsFromShareCapital.current,
              company.cashFlow.financingActivities.proceedsFromShareCapital.previous,
              'financingActivities.proceedsFromShareCapital'
            )}
            {renderRow(
              'Proceeds from borrowings',
              company.cashFlow.financingActivities.proceedsFromBorrowings.note,
              company.cashFlow.financingActivities.proceedsFromBorrowings.current,
              company.cashFlow.financingActivities.proceedsFromBorrowings.previous,
              'financingActivities.proceedsFromBorrowings'
            )}
            {renderRow(
              'Repayment of borrowings',
              company.cashFlow.financingActivities.repaymentOfBorrowings.note,
              company.cashFlow.financingActivities.repaymentOfBorrowings.current,
              company.cashFlow.financingActivities.repaymentOfBorrowings.previous,
              'financingActivities.repaymentOfBorrowings'
            )}
            {renderRow(
              'Dividends paid',
              company.cashFlow.financingActivities.dividendsPaid.note,
              company.cashFlow.financingActivities.dividendsPaid.current,
              company.cashFlow.financingActivities.dividendsPaid.previous,
              'financingActivities.dividendsPaid'
            )}
            {renderRow(
              'Interest paid',
              company.cashFlow.financingActivities.interestPaid.note,
              company.cashFlow.financingActivities.interestPaid.current,
              company.cashFlow.financingActivities.interestPaid.previous,
              'financingActivities.interestPaid'
            )}
            {renderRow(
              'Other financing cash flows',
              company.cashFlow.financingActivities.otherFinancingCashFlows.note,
              company.cashFlow.financingActivities.otherFinancingCashFlows.current,
              company.cashFlow.financingActivities.otherFinancingCashFlows.previous,
              'financingActivities.otherFinancingCashFlows'
            )}

            <tr className="font-bold bg-green-100">
              <td className="border p-2">Net cash from/(used in) financing activities (C)</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.netCashFromFinancingActivitiesCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(totals.netCashFromFinancingActivitiesPrevious)}</td>
            </tr>

            <tr className="font-bold bg-orange-100">
              <td className="border p-2">Net increase/(decrease) in cash and cash equivalents (A+B+C)</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.netIncreaseInCashCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(totals.netIncreaseInCashPrevious)}</td>
            </tr>

            {renderRow(
              'Cash and cash equivalents at the beginning of the year',
              company.cashFlow.cashAndCashEquivalentsAtBeginning.note,
              company.cashFlow.cashAndCashEquivalentsAtBeginning.current,
              company.cashFlow.cashAndCashEquivalentsAtBeginning.previous,
              'cashAndCashEquivalentsAtBeginning'
            )}

            <tr className="font-bold bg-blue-100">
              <td className="border p-2">
                Cash and cash equivalents at the end of the year
                {Math.round(totals.calculatedClosingCurrent) !==
                  Math.round(company.cashFlow.cashAndCashEquivalentsAtEnd.current) && (
                    <div className="text-xs text-orange-600 mt-1">
                      Calculated closing: {formatValue(totals.calculatedClosingCurrent)}
                    </div>
                  )}
              </td>
              <td className="border p-2 text-right">
                {company.cashFlow.cashAndCashEquivalentsAtEnd.note || '-'}
              </td>
              {isEditable
                ? renderInputField(
                  company.cashFlow.cashAndCashEquivalentsAtEnd.current,
                  company.cashFlow.cashAndCashEquivalentsAtEnd.previous,
                  'cashAndCashEquivalentsAtEnd'
                )
                : renderDisplayField(
                  company.cashFlow.cashAndCashEquivalentsAtEnd.current,
                  company.cashFlow.cashAndCashEquivalentsAtEnd.previous
                )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashFlow;
