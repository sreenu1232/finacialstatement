import React from 'react';
import { Company, ViewMode } from '../types';
import { useApp } from '../context/AppContext';
import { formatINR, calculatePLTotal, getUnitLabel } from '../utils/formatters';
import { getTableDesignClasses } from '../utils/tableDesign';
import { buildNoteIndex } from '../utils/noteHelpers';

interface Props {
  company: Company;
  modeOverride?: ViewMode;
}

const ProfitLoss: React.FC<Props> = ({ company, modeOverride }) => {
  const { updateCompanyPL, viewMode, setActiveTab } = useApp();
  const effectiveViewMode = modeOverride ?? viewMode;
  const isEditable = effectiveViewMode === 'edit';
  const totals = calculatePLTotal(company.profitLoss);
  const noteIndex = buildNoteIndex(company);
  const { unitOfMeasurement, decimalPoints, numberStyle, customNumberGrouping, tableDesign, tableAccent, tableDensity, showSignatureBlocks, signatureBlocks } = company.settings.formatting;
  const { fontStyle, fontSize, primaryColor, secondaryColor } = company.settings.template;

  const formatValue = (value: number) => formatINR(value, unitOfMeasurement, decimalPoints, numberStyle, customNumberGrouping);
  const unitLabel = getUnitLabel(unitOfMeasurement);

  const { tableClassName, theadClassName, accentSoftRowClass, accentStrongRowClass } = getTableDesignClasses(tableDesign, tableAccent, tableDensity);

  const handleNoteClick = (noteNumber: string) => {
    setActiveTab('notes');
    setTimeout(() => {
      const el = document.getElementById(`note-${noteNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const renderNoteTd = (note?: string) => {
    const resolvedNote = note ? noteIndex.map[note] : undefined;
    const isReportMode = modeOverride === 'report';
    return (
      <td className="border p-2 text-right">
        {resolvedNote ? (
          isReportMode ? (
            <span className="text-gray-700 font-medium print:text-gray-900">{resolvedNote}</span>
          ) : (
            <>
              <button type="button" onClick={() => handleNoteClick(resolvedNote)} className="text-blue-600 underline hover:text-blue-800 print:hidden">
                {resolvedNote}
              </button>
              <span className="hidden print:inline text-gray-700 font-medium">{resolvedNote}</span>
            </>
          )
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
    );
  };

  const renderInputField = (currentValue: number, previousValue: number, path: string, note?: string) => {
    const resolvedNote = note ? noteIndex.map[note] : undefined;

    // For Profit & Loss, CY is always read-only, PY is editable when no notes exist
    return (
      <>
        <td className="border p-2 text-right bg-blue-50">
          <div className="flex items-center justify-end gap-2">
            <span className="font-medium">{formatValue(currentValue)}</span>
            {resolvedNote && (
              effectiveViewMode === 'report' ? (
                <span className="text-xs text-gray-700 font-medium print:inline">{resolvedNote}</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNoteClick(resolvedNote)}
                  className="text-xs text-blue-600 hover:text-blue-800 print:hidden"
                  title="View Note Details"
                >
                  📊
                </button>
              )
            )}
          </div>
        </td>
        <td className="border p-2">
          {resolvedNote ? (
            <input
              type="text"
              key={`${path}-prev-${unitOfMeasurement}-${decimalPoints}-${numberStyle}-${customNumberGrouping || ''}`}
              defaultValue={formatValue(previousValue)}
              onFocus={(e) => {
                e.target.value = previousValue.toString();
                e.target.type = 'number';
              }}
              onBlur={(e) => {
                const raw = Number(e.target.value);
                updateCompanyPL(company.id, `${path}.previous`, raw);
                e.target.type = 'text';
                e.target.value = formatValue(raw);
              }}
              className="w-full px-2 py-1 border rounded text-right bg-yellow-50"
              title="Previous Year - Manual Entry"
            />
          ) : (
            <input
              type="text"
              key={`${path}-prev-${unitOfMeasurement}-${decimalPoints}-${numberStyle}-${customNumberGrouping || ''}`}
              defaultValue={formatValue(previousValue)}
              onFocus={(e) => {
                e.target.value = previousValue.toString();
                e.target.type = 'number';
              }}
              onBlur={(e) => {
                const raw = Number(e.target.value);
                updateCompanyPL(company.id, `${path}.previous`, raw);
                e.target.type = 'text';
                e.target.value = formatValue(raw);
              }}
              className="w-full px-2 py-1 border rounded text-right"
              title="Previous Year - Manual Entry"
            />
          )}
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

  const renderSignatureBlocks = () => {
    if (!showSignatureBlocks || signatureBlocks.length === 0) return null;

    return (
      <div className="mt-8 pt-6 border-t border-gray-300">
        <div className="flex justify-center gap-12">
          {signatureBlocks.map((signature) => (
            <div key={signature.id} className="text-center min-w-[120px]">
              <div className="mb-6">
                <div className="h-16 border-b border-gray-400 mb-3"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-tight">{signature.title}</p>
                  <p className="text-sm leading-tight">{signature.name}</p>
                  <p className="text-xs text-gray-600 leading-tight">{signature.designation}</p>
                  {signature.showDSC && (
                    <p className="text-xs text-blue-600 mt-2 leading-tight">DSC Applied</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: fontStyle, fontSize: `${fontSize}px` }}>
      <h3 className="text-lg font-bold mb-2 profit-loss-title print:text-center print:mb-6" style={{ color: primaryColor }}>Profit & Loss Statement</h3>
      <p className="text-sm mb-4 print:text-center print:mb-6" style={{ color: secondaryColor }}>For the year ended {company.yearEnd}</p>
      <div className="overflow-x-auto">
        <table className={tableClassName} style={{ fontSize: `${fontSize}px` }}>
          <thead className={theadClassName}>
            <tr>
              <th className="border p-2 text-left">Particulars</th>
              <th className="border p-2 text-right">Note No.</th>
              <th className="border p-2 text-right">{company.yearEnd}<br /><span className="text-xs" style={{ color: secondaryColor }}>{unitLabel}</span></th>
              <th className="border p-2 text-right">{company.prevYearEnd}<br /><span className="text-xs" style={{ color: secondaryColor }}>{unitLabel}</span></th>
            </tr>
          </thead>
          <tbody>
            {/* I. Revenue from operations */}
            <tr>
              <td className="border p-2 font-semibold">I. Revenue from operations</td>
              {renderNoteTd(company.profitLoss.revenueFromOperations.amount.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.revenueFromOperations.amount.current,
                  company.profitLoss.revenueFromOperations.amount.previous,
                  'revenueFromOperations.amount',
                  company.profitLoss.revenueFromOperations.amount.note
                ) :
                renderDisplayField(
                  company.profitLoss.revenueFromOperations.amount.current,
                  company.profitLoss.revenueFromOperations.amount.previous
                )
              }
            </tr>

            {/* II. Other income */}
            <tr>
              <td className="border p-2 font-semibold">II. Other income</td>
              {renderNoteTd(company.profitLoss.otherIncome.amount.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.otherIncome.amount.current,
                  company.profitLoss.otherIncome.amount.previous,
                  'otherIncome.amount',
                  company.profitLoss.otherIncome.amount.note
                ) :
                renderDisplayField(
                  company.profitLoss.otherIncome.amount.current,
                  company.profitLoss.otherIncome.amount.previous
                )
              }
            </tr>

            {/* III. Total income (I + II) - Auto calculated */}
            <tr className="font-bold bg-blue-50">
              <td className="border p-2">III. Total income (I + II)</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.totalIncome)}</td>
              <td className="border p-2 text-right">{formatValue(totals.totalIncomePrev)}</td>
            </tr>

            {/* IV. Expenses */}
            <tr className="font-semibold bg-gray-200">
              <td className="border p-2" colSpan={4}>IV. Expenses:</td>
            </tr>

            {/* (a) Cost of materials consumed */}
            <tr>
              <td className="border p-2 pl-6">(a) Cost of materials consumed</td>
              {renderNoteTd(company.profitLoss.expenses.costOfMaterialsConsumed.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.expenses.costOfMaterialsConsumed.current,
                  company.profitLoss.expenses.costOfMaterialsConsumed.previous,
                  'expenses.costOfMaterialsConsumed',
                  company.profitLoss.expenses.costOfMaterialsConsumed.note
                ) :
                renderDisplayField(
                  company.profitLoss.expenses.costOfMaterialsConsumed.current,
                  company.profitLoss.expenses.costOfMaterialsConsumed.previous
                )
              }
            </tr>

            {/* (b) Purchases of stock-in-trade */}
            <tr>
              <td className="border p-2 pl-6">(b) Purchases of stock-in-trade</td>
              {renderNoteTd(company.profitLoss.expenses.purchasesOfStockInTrade.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.expenses.purchasesOfStockInTrade.current,
                  company.profitLoss.expenses.purchasesOfStockInTrade.previous,
                  'expenses.purchasesOfStockInTrade',
                  company.profitLoss.expenses.purchasesOfStockInTrade.note
                ) :
                renderDisplayField(
                  company.profitLoss.expenses.purchasesOfStockInTrade.current,
                  company.profitLoss.expenses.purchasesOfStockInTrade.previous
                )
              }
            </tr>

            {/* (c) Changes in inventories */}
            <tr>
              <td className="border p-2 pl-6">(c) Changes in inventories of finished goods, work-in-progress and stock-in-trade</td>
              {renderNoteTd(company.profitLoss.expenses.changesInInventories.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.expenses.changesInInventories.current,
                  company.profitLoss.expenses.changesInInventories.previous,
                  'expenses.changesInInventories',
                  company.profitLoss.expenses.changesInInventories.note
                ) :
                renderDisplayField(
                  company.profitLoss.expenses.changesInInventories.current,
                  company.profitLoss.expenses.changesInInventories.previous
                )
              }
            </tr>

            {/* (d) Employee benefits expense */}
            <tr>
              <td className="border p-2 pl-6">(d) Employee benefits expense</td>
              {renderNoteTd(company.profitLoss.expenses.employeeBenefitsExpense.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.expenses.employeeBenefitsExpense.current,
                  company.profitLoss.expenses.employeeBenefitsExpense.previous,
                  'expenses.employeeBenefitsExpense',
                  company.profitLoss.expenses.employeeBenefitsExpense.note
                ) :
                renderDisplayField(
                  company.profitLoss.expenses.employeeBenefitsExpense.current,
                  company.profitLoss.expenses.employeeBenefitsExpense.previous
                )
              }
            </tr>

            {/* (e) Finance costs */}
            <tr>
              <td className="border p-2 pl-6">(e) Finance costs</td>
              {renderNoteTd(company.profitLoss.expenses.financeCosts.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.expenses.financeCosts.current,
                  company.profitLoss.expenses.financeCosts.previous,
                  'expenses.financeCosts',
                  company.profitLoss.expenses.financeCosts.note
                ) :
                renderDisplayField(
                  company.profitLoss.expenses.financeCosts.current,
                  company.profitLoss.expenses.financeCosts.previous
                )
              }
            </tr>

            {/* (f) Depreciation and amortisation expense */}
            <tr>
              <td className="border p-2 pl-6">(f) Depreciation and amortisation expense</td>
              {renderNoteTd(company.profitLoss.expenses.depreciationAndAmortisation.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.expenses.depreciationAndAmortisation.current,
                  company.profitLoss.expenses.depreciationAndAmortisation.previous,
                  'expenses.depreciationAndAmortisation',
                  company.profitLoss.expenses.depreciationAndAmortisation.note
                ) :
                renderDisplayField(
                  company.profitLoss.expenses.depreciationAndAmortisation.current,
                  company.profitLoss.expenses.depreciationAndAmortisation.previous
                )
              }
            </tr>

            {/* (g) Other expenses */}
            <tr>
              <td className="border p-2 pl-6">(g) Other expenses</td>
              {renderNoteTd(company.profitLoss.expenses.otherExpenses.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.expenses.otherExpenses.current,
                  company.profitLoss.expenses.otherExpenses.previous,
                  'expenses.otherExpenses',
                  company.profitLoss.expenses.otherExpenses.note
                ) :
                renderDisplayField(
                  company.profitLoss.expenses.otherExpenses.current,
                  company.profitLoss.expenses.otherExpenses.previous
                )
              }
            </tr>

            {/* Total expenses (IV) - Auto calculated */}
            <tr className="font-bold bg-orange-50">
              <td className="border p-2">Total expenses (IV)</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.totalExpenses)}</td>
              <td className="border p-2 text-right">{formatValue(totals.totalExpensesPrev)}</td>
            </tr>

            {/* V. Profit before exceptional items and tax (III – IV) - Auto calculated */}
            <tr className={`font-bold ${accentSoftRowClass}`}>
              <td className="border p-2">V. Profit before exceptional items and tax (III – IV)</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.profitBeforeExceptionalItemsAndTax)}</td>
              <td className="border p-2 text-right">{formatValue(totals.profitBeforeExceptionalItemsAndTaxPrev)}</td>
            </tr>

            {/* VI. Exceptional items */}
            <tr>
              <td className="border p-2 font-semibold">VI. Exceptional items</td>
              {renderNoteTd(company.profitLoss.exceptionalItems.amount.note)}
              {isEditable ? (
                <td className="border p-2">
                  <input
                    type="number"
                    value={company.profitLoss.exceptionalItems.amount.current}
                    onChange={(e) => updateCompanyPL(company.id, 'exceptionalItems.amount.current', Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-right"
                  />
                </td>
              ) : (
                <td className="border p-2 text-right">{formatValue(company.profitLoss.exceptionalItems.amount.current)}</td>
              )}
              <td className="border p-2 text-right">{formatValue(company.profitLoss.exceptionalItems.amount.previous)}</td>
            </tr>

            {/* VII. Profit before tax (V – VI) - Auto calculated */}
            <tr className={`font-bold ${accentSoftRowClass}`}>
              <td className="border p-2">VII. Profit before tax (V – VI)</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.profitBeforeTax)}</td>
              <td className="border p-2 text-right">{formatValue(totals.profitBeforeTaxPrev)}</td>
            </tr>

            {/* VIII. Tax expense */}
            <tr className="font-semibold bg-gray-200">
              <td className="border p-2" colSpan={4}>VIII. Tax expense:</td>
            </tr>

            {/* (1) Current tax */}
            <tr>
              <td className="border p-2 pl-6">(1) Current tax</td>
              {renderNoteTd(company.profitLoss.taxExpense.currentTax.note)}
              {isEditable ? (
                <td className="border p-2">
                  <input
                    type="number"
                    value={company.profitLoss.taxExpense.currentTax.current}
                    onChange={(e) => updateCompanyPL(company.id, 'taxExpense.currentTax.current', Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-right"
                  />
                </td>
              ) : (
                <td className="border p-2 text-right">{formatValue(company.profitLoss.taxExpense.currentTax.current)}</td>
              )}
              <td className="border p-2 text-right">{formatValue(company.profitLoss.taxExpense.currentTax.previous)}</td>
            </tr>

            {/* (2) Deferred tax */}
            <tr>
              <td className="border p-2 pl-6">(2) Deferred tax</td>
              {renderNoteTd(company.profitLoss.taxExpense.deferredTax.note)}
              {isEditable ? (
                <td className="border p-2">
                  <input
                    type="number"
                    value={company.profitLoss.taxExpense.deferredTax.current}
                    onChange={(e) => updateCompanyPL(company.id, 'taxExpense.deferredTax.current', Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-right"
                  />
                </td>
              ) : (
                <td className="border p-2 text-right">{formatValue(company.profitLoss.taxExpense.deferredTax.current)}</td>
              )}
              <td className="border p-2 text-right">{formatValue(company.profitLoss.taxExpense.deferredTax.previous)}</td>
            </tr>

            {/* IX. Profit (Loss) for the period from continuing operations (VII - VIII) - Auto calculated */}
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">IX. Profit (Loss) for the period from continuing operations (VII - VIII)</td>
              {renderNoteTd(company.profitLoss.profitLossFromContinuingOperations.note)}
              <td className="border p-2 text-right">{formatValue(totals.profitForThePeriod)}</td>
              <td className="border p-2 text-right">{formatValue(totals.profitForThePeriodPrev)}</td>
            </tr>

            {/* X. Profit/(loss) from discontinued operations */}
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">X. Profit/(loss) from discontinued operations</td>
              {renderNoteTd(company.profitLoss.profitLossFromDiscontinuedOperations.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.profitLossFromDiscontinuedOperations.current,
                  company.profitLoss.profitLossFromDiscontinuedOperations.previous,
                  'profitLossFromDiscontinuedOperations',
                  company.profitLoss.profitLossFromDiscontinuedOperations.note
                ) :
                renderDisplayField(
                  company.profitLoss.profitLossFromDiscontinuedOperations.current,
                  company.profitLoss.profitLossFromDiscontinuedOperations.previous
                )
              }
            </tr>

            {/* XI. Tax expenses of discontinued operations */}
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">XI. Tax expenses of discontinued operations</td>
              {renderNoteTd(company.profitLoss.taxExpensesOfDiscontinuedOperations.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.taxExpensesOfDiscontinuedOperations.current,
                  company.profitLoss.taxExpensesOfDiscontinuedOperations.previous,
                  'taxExpensesOfDiscontinuedOperations',
                  company.profitLoss.taxExpensesOfDiscontinuedOperations.note
                ) :
                renderDisplayField(
                  company.profitLoss.taxExpensesOfDiscontinuedOperations.current,
                  company.profitLoss.taxExpensesOfDiscontinuedOperations.previous
                )
              }
            </tr>

            {/* XII. Profit/(loss) from Discontinued operations (after tax) (X-XI) - Auto calculated */}
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">XII. Profit/(loss) from Discontinued operations (after tax) (X-XI)</td>
              {renderNoteTd(company.profitLoss.profitLossFromDiscontinuedOperationsAfterTax.note)}
              <td className="border p-2 text-right">{formatValue(totals.profitLossFromDiscontinuedOperationsAfterTax)}</td>
              <td className="border p-2 text-right">{formatValue(totals.profitLossFromDiscontinuedOperationsAfterTaxPrev)}</td>
            </tr>

            {/* XIII. Profit/(loss) for the period (IX+XII) - Auto calculated */}
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">XIII. Profit/(loss) for the period (IX+XII)</td>
              {renderNoteTd(company.profitLoss.profitLossForThePeriod.note)}
              <td className="border p-2 text-right">{formatValue(totals.profitLossForThePeriod)}</td>
              <td className="border p-2 text-right">{formatValue(totals.profitLossForThePeriodPrev)}</td>
            </tr>

            {/* XIV. Other Comprehensive Income */}
            <tr className="font-semibold bg-gray-200">
              <td className="border p-2" colSpan={4}>XIV. Other Comprehensive Income</td>
            </tr>

            {/* A. (i) Items that will not be reclassified to profit or loss */}
            <tr className="font-semibold bg-blue-50">
              <td className="border p-2 pl-6">A. (i) Items that will not be reclassified to profit or loss</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>

            {/* (i) Re-measurement of the net defined benefit liabilities / assets */}
            <tr>
              <td className="border p-2 pl-12">(i) Re-measurement of the net defined benefit liabilities / assets</td>
              {renderNoteTd(company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.remeasurementOfNetDefinedBenefit.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.remeasurementOfNetDefinedBenefit.current,
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.remeasurementOfNetDefinedBenefit.previous,
                  'otherComprehensiveIncome.itemsNotReclassified.remeasurementOfNetDefinedBenefit',
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.remeasurementOfNetDefinedBenefit.note
                ) :
                renderDisplayField(
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.remeasurementOfNetDefinedBenefit.current,
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.remeasurementOfNetDefinedBenefit.previous
                )
              }
            </tr>

            {/* (ii) Equity instruments through OCI */}
            <tr>
              <td className="border p-2 pl-12">(ii) Equity instruments through OCI</td>
              {renderNoteTd(company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.equityInstrumentsThroughOCI.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.equityInstrumentsThroughOCI.current,
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.equityInstrumentsThroughOCI.previous,
                  'otherComprehensiveIncome.itemsNotReclassified.equityInstrumentsThroughOCI',
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.equityInstrumentsThroughOCI.note
                ) :
                renderDisplayField(
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.equityInstrumentsThroughOCI.current,
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.equityInstrumentsThroughOCI.previous
                )
              }
            </tr>

            {/* (iii) Income tax relating to items that will not be reclassified to profit or loss */}
            <tr>
              <td className="border p-2 pl-12">(iii) Income tax relating to items that will not be reclassified to profit or loss</td>
              {renderNoteTd(company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.incomeTaxNotReclassified.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.incomeTaxNotReclassified.current,
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.incomeTaxNotReclassified.previous,
                  'otherComprehensiveIncome.itemsNotReclassified.incomeTaxNotReclassified',
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.incomeTaxNotReclassified.note
                ) :
                renderDisplayField(
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.incomeTaxNotReclassified.current,
                  company.profitLoss.otherComprehensiveIncome.itemsNotReclassified.incomeTaxNotReclassified.previous
                )
              }
            </tr>

            {/* B. (i) Items that will be reclassified to profit or loss */}
            <tr className="font-semibold bg-blue-50">
              <td className="border p-2 pl-6">B. (i) Items that will be reclassified to profit or loss</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>

            {/* (i) Exchange differences in translating foreign operations */}
            <tr>
              <td className="border p-2 pl-12">(i) Exchange differences in translating foreign operations</td>
              {renderNoteTd(company.profitLoss.otherComprehensiveIncome.itemsReclassified.exchangeDifferences.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.exchangeDifferences.current,
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.exchangeDifferences.previous,
                  'otherComprehensiveIncome.itemsReclassified.exchangeDifferences',
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.exchangeDifferences.note
                ) :
                renderDisplayField(
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.exchangeDifferences.current,
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.exchangeDifferences.previous
                )
              }
            </tr>

            {/* (ii) Debt instruments through OCI */}
            <tr>
              <td className="border p-2 pl-12">(ii) Debt instruments through OCI</td>
              {renderNoteTd(company.profitLoss.otherComprehensiveIncome.itemsReclassified.debtInstrumentsThroughOCI.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.debtInstrumentsThroughOCI.current,
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.debtInstrumentsThroughOCI.previous,
                  'otherComprehensiveIncome.itemsReclassified.debtInstrumentsThroughOCI',
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.debtInstrumentsThroughOCI.note
                ) :
                renderDisplayField(
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.debtInstrumentsThroughOCI.current,
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.debtInstrumentsThroughOCI.previous
                )
              }
            </tr>

            {/* (iii) Income tax relating to items that will be reclassified to profit or loss */}
            <tr>
              <td className="border p-2 pl-12">(iii) Income tax relating to items that will be reclassified to profit or loss</td>
              {renderNoteTd(company.profitLoss.otherComprehensiveIncome.itemsReclassified.incomeTaxReclassified.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.incomeTaxReclassified.current,
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.incomeTaxReclassified.previous,
                  'otherComprehensiveIncome.itemsReclassified.incomeTaxReclassified',
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.incomeTaxReclassified.note
                ) :
                renderDisplayField(
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.incomeTaxReclassified.current,
                  company.profitLoss.otherComprehensiveIncome.itemsReclassified.incomeTaxReclassified.previous
                )
              }
            </tr>

            {/* XV. Total Comprehensive Income for the period (XIII+XIV) */}
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">XV. Total Comprehensive Income for the period (XIII+XIV)</td>
              {renderNoteTd(company.profitLoss.totalComprehensiveIncomeForThePeriod.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.totalComprehensiveIncomeForThePeriod.current,
                  company.profitLoss.totalComprehensiveIncomeForThePeriod.previous,
                  'totalComprehensiveIncomeForThePeriod',
                  company.profitLoss.totalComprehensiveIncomeForThePeriod.note
                ) :
                renderDisplayField(
                  company.profitLoss.totalComprehensiveIncomeForThePeriod.current,
                  company.profitLoss.totalComprehensiveIncomeForThePeriod.previous
                )
              }
            </tr>

            {/* XVI. Earnings per equity share (for continuing operation) */}
            <tr className="font-semibold bg-gray-200">
              <td className="border p-2" colSpan={4}>XVI. Earnings per equity share (for continuing operation)</td>
            </tr>

            {/* (1) Basic */}
            <tr className="font-bold bg-blue-50">
              <td className="border p-2 pl-6">(1) Basic</td>
              {renderNoteTd(company.profitLoss.earningsPerShareContinuing.basic.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.earningsPerShareContinuing.basic.current,
                  company.profitLoss.earningsPerShareContinuing.basic.previous,
                  'earningsPerShareContinuing.basic',
                  company.profitLoss.earningsPerShareContinuing.basic.note
                ) :
                renderDisplayField(
                  company.profitLoss.earningsPerShareContinuing.basic.current,
                  company.profitLoss.earningsPerShareContinuing.basic.previous
                )
              }
            </tr>

            {/* (2) Diluted */}
            <tr className="font-bold bg-blue-50">
              <td className="border p-2 pl-6">(2) Diluted</td>
              {renderNoteTd(company.profitLoss.earningsPerShareContinuing.diluted.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.earningsPerShareContinuing.diluted.current,
                  company.profitLoss.earningsPerShareContinuing.diluted.previous,
                  'earningsPerShareContinuing.diluted',
                  company.profitLoss.earningsPerShareContinuing.diluted.note
                ) :
                renderDisplayField(
                  company.profitLoss.earningsPerShareContinuing.diluted.current,
                  company.profitLoss.earningsPerShareContinuing.diluted.previous
                )
              }
            </tr>

            {/* XVII. Earnings per equity share (for discontinued operation) */}
            <tr className="font-semibold bg-gray-200">
              <td className="border p-2" colSpan={4}>XVII. Earnings per equity share (for discontinued operation)</td>
            </tr>

            {/* (1) Basic */}
            <tr className="font-bold bg-blue-50">
              <td className="border p-2 pl-6">(1) Basic</td>
              {renderNoteTd(company.profitLoss.earningsPerShareDiscontinued.basic.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.earningsPerShareDiscontinued.basic.current,
                  company.profitLoss.earningsPerShareDiscontinued.basic.previous,
                  'earningsPerShareDiscontinued.basic',
                  company.profitLoss.earningsPerShareDiscontinued.basic.note
                ) :
                renderDisplayField(
                  company.profitLoss.earningsPerShareDiscontinued.basic.current,
                  company.profitLoss.earningsPerShareDiscontinued.basic.previous
                )
              }
            </tr>

            {/* (2) Diluted */}
            <tr className="font-bold bg-blue-50">
              <td className="border p-2 pl-6">(2) Diluted</td>
              {renderNoteTd(company.profitLoss.earningsPerShareDiscontinued.diluted.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.earningsPerShareDiscontinued.diluted.current,
                  company.profitLoss.earningsPerShareDiscontinued.diluted.previous,
                  'earningsPerShareDiscontinued.diluted',
                  company.profitLoss.earningsPerShareDiscontinued.diluted.note
                ) :
                renderDisplayField(
                  company.profitLoss.earningsPerShareDiscontinued.diluted.current,
                  company.profitLoss.earningsPerShareDiscontinued.diluted.previous
                )
              }
            </tr>

            {/* XVIII. Earning per equity share (for discontinued & continuing operation) */}
            <tr className="font-semibold bg-gray-200">
              <td className="border p-2" colSpan={4}>XVIII. Earning per equity share (for discontinued & continuing operation)</td>
            </tr>

            {/* (1) Basic */}
            <tr className="font-bold bg-blue-50">
              <td className="border p-2 pl-6">(1) Basic</td>
              {renderNoteTd(company.profitLoss.earningsPerShareTotal.basic.note)}
              {isEditable ?
                renderInputField(
                  company.profitLoss.earningsPerShareTotal.basic.current,
                  company.profitLoss.earningsPerShareTotal.basic.previous,
                  'earningsPerShareTotal.basic',
                  company.profitLoss.earningsPerShareTotal.basic.note
                ) :
                renderDisplayField(
                  company.profitLoss.earningsPerShareTotal.basic.current,
                  company.profitLoss.earningsPerShareTotal.basic.previous
                )
              }
            </tr>

            {/* (2) Diluted */}
            <tr className="font-bold bg-blue-50">
              <td className="border p-2 pl-6">(2) Diluted</td>
              {renderNoteTd(company.profitLoss.earningsPerShareTotal.diluted.note)}
              {viewMode === 'edit' ?
                renderInputField(
                  company.profitLoss.earningsPerShareTotal.diluted.current,
                  company.profitLoss.earningsPerShareTotal.diluted.previous,
                  'earningsPerShareTotal.diluted',
                  company.profitLoss.earningsPerShareTotal.diluted.note
                ) :
                renderDisplayField(
                  company.profitLoss.earningsPerShareTotal.diluted.current,
                  company.profitLoss.earningsPerShareTotal.diluted.previous
                )
              }
            </tr>
          </tbody>
        </table>
      </div>
      {renderSignatureBlocks()}
    </div>
  );
};

export default ProfitLoss;