import React from 'react';
import { Company, ViewMode } from '../types';
import { useApp } from '../context/AppContext';
import { formatINR, calculateBSTotal, getUnitLabel } from '../utils/formatters';
import { getTableDesignClasses } from '../utils/tableDesign';
import { buildNoteIndex } from '../utils/noteHelpers';

interface Props {
  company: Company;
  modeOverride?: ViewMode;
}

const BalanceSheet: React.FC<Props> = ({ company, modeOverride }) => {
  const { viewMode, updateCompanyBS, setActiveTab } = useApp();
  const effectiveViewMode = modeOverride ?? viewMode;
  const isEditable = effectiveViewMode === 'edit';
  const totals = calculateBSTotal(company.balanceSheet);
  const noteIndex = buildNoteIndex(company);
  const { unitOfMeasurement, decimalPoints, numberStyle, customNumberGrouping, tableDesign, tableAccent, tableDensity, showSignatureBlocks, signatureBlocks } = company.settings.formatting;
  const { fontStyle, fontSize, primaryColor, secondaryColor } = company.settings.template;

  const formatValue = (value: number) => formatINR(value, unitOfMeasurement, decimalPoints, numberStyle, customNumberGrouping);
  const unitLabel = getUnitLabel(unitOfMeasurement);

  const { tableClassName, theadClassName, accentSoftRowClass, accentStrongRowClass } = getTableDesignClasses(tableDesign, tableAccent, tableDensity);
  const tableTitle = isEditable ? 'Edit Balance Sheet' : 'Balance Sheet';

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
    return (
      <td className="border p-2 text-right">
        {resolvedNote ? (
          <button type="button" onClick={() => handleNoteClick(resolvedNote)} className="text-blue-600 underline hover:text-blue-800">
            {resolvedNote}
          </button>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
    );
  };

  const renderInputField = (currentValue: number, previousValue: number, path: string, note?: string) => {
    const resolvedNote = note ? noteIndex.map[note] : undefined;

    // For Balance Sheet, CY is always read-only, PY is editable when no notes exist
    return (
      <>
        <td className="border p-2 text-right bg-blue-50">
          <div className="flex items-center justify-end gap-2">
            <span className="font-medium">{formatValue(currentValue)}</span>
            {resolvedNote && (
              <button
                type="button"
                onClick={() => handleNoteClick(resolvedNote)}
                className="text-xs text-blue-600 hover:text-blue-800"
                title="View Note Details"
              >
                📊
              </button>
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
                updateCompanyBS(company.id, `${path}.previous`, raw);
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
                updateCompanyBS(company.id, `${path}.previous`, raw);
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

  if (effectiveViewMode === 'preview') {
    return (
      <div className="text-center py-8" style={{ fontFamily: fontStyle, fontSize: `${fontSize}px` }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>{company.name} - Balance Sheet</h2>
        <p className="text-lg mb-6" style={{ color: secondaryColor }}>As at {company.yearEnd}</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg">
            <p className="text-gray-600">Total Assets</p>
            <p className="text-3xl font-bold text-blue-600">{formatValue(totals.totalAssets)}</p>
            <p className="text-xs text-gray-500 mt-1">{unitLabel}</p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg">
            <p className="text-gray-600">Total Equity & Liabilities</p>
            <p className="text-3xl font-bold text-green-600">{formatValue(totals.totalLiabilities)}</p>
            <p className="text-xs text-gray-500 mt-1">{unitLabel}</p>
          </div>
        </div>
        {renderSignatureBlocks()}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: fontStyle, fontSize: `${fontSize}px` }}>
      <h3 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>{tableTitle}</h3>
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
            {/* ASSETS */}
            <tr className="bg-gray-200 font-bold">
              <td className="border p-2" colSpan={4}>ASSETS</td>
            </tr>

            {/* (1) Non-Current Assets */}
            <tr className="bg-blue-50 font-semibold">
              <td className="border p-2 pl-4">(1) Non-Current Assets</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.nonCurrentAssets)}</td>
              <td className="border p-2 text-right">{formatValue(totals.nonCurrentAssetsPrev)}</td>
            </tr>

            {/* (a) Property, Plant and Equipment */}
            <tr>
              <td className="border p-2 pl-8">(a) Property, Plant and Equipment</td>
              {renderNoteTd(company.balanceSheet.nonCurrentAssets.propertyPlantEquipment.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentAssets.propertyPlantEquipment.current,
                  company.balanceSheet.nonCurrentAssets.propertyPlantEquipment.previous,
                  'nonCurrentAssets.propertyPlantEquipment',
                  company.balanceSheet.nonCurrentAssets.propertyPlantEquipment.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentAssets.propertyPlantEquipment.current,
                  company.balanceSheet.nonCurrentAssets.propertyPlantEquipment.previous
                )
              }
            </tr>

            {/* (b) Capital work-in-progress */}
            <tr>
              <td className="border p-2 pl-8">(b) Capital work-in-progress</td>
              {renderNoteTd(company.balanceSheet.nonCurrentAssets.capitalWorkInProgress.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentAssets.capitalWorkInProgress.current,
                  company.balanceSheet.nonCurrentAssets.capitalWorkInProgress.previous,
                  'nonCurrentAssets.capitalWorkInProgress',
                  company.balanceSheet.nonCurrentAssets.capitalWorkInProgress.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentAssets.capitalWorkInProgress.current,
                  company.balanceSheet.nonCurrentAssets.capitalWorkInProgress.previous
                )
              }
            </tr>

            {/* (c) Investment Property */}
            <tr>
              <td className="border p-2 pl-8">(c) Investment Property</td>
              {renderNoteTd(company.balanceSheet.nonCurrentAssets.investmentProperty.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentAssets.investmentProperty.current,
                  company.balanceSheet.nonCurrentAssets.investmentProperty.previous,
                  'nonCurrentAssets.investmentProperty',
                  company.balanceSheet.nonCurrentAssets.investmentProperty.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentAssets.investmentProperty.current,
                  company.balanceSheet.nonCurrentAssets.investmentProperty.previous
                )
              }
            </tr>

            {/* (d) Goodwill */}
            <tr>
              <td className="border p-2 pl-8">(d) Goodwill</td>
              {renderNoteTd(company.balanceSheet.nonCurrentAssets.goodwill.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentAssets.goodwill.current,
                  company.balanceSheet.nonCurrentAssets.goodwill.previous,
                  'nonCurrentAssets.goodwill',
                  company.balanceSheet.nonCurrentAssets.goodwill.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentAssets.goodwill.current,
                  company.balanceSheet.nonCurrentAssets.goodwill.previous
                )
              }
            </tr>

            {/* (e) Other Intangible assets */}
            <tr>
              <td className="border p-2 pl-8">(e) Other Intangible assets</td>
              {renderNoteTd(company.balanceSheet.nonCurrentAssets.otherIntangibleAssets.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentAssets.otherIntangibleAssets.current,
                  company.balanceSheet.nonCurrentAssets.otherIntangibleAssets.previous,
                  'nonCurrentAssets.otherIntangibleAssets',
                  company.balanceSheet.nonCurrentAssets.otherIntangibleAssets.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentAssets.otherIntangibleAssets.current,
                  company.balanceSheet.nonCurrentAssets.otherIntangibleAssets.previous
                )
              }
            </tr>

            {/* (f) Intangible assets under development */}
            <tr>
              <td className="border p-2 pl-8">(f) Intangible assets under development</td>
              {renderNoteTd(company.balanceSheet.nonCurrentAssets.intangibleAssetsUnderDevelopment.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentAssets.intangibleAssetsUnderDevelopment.current,
                  company.balanceSheet.nonCurrentAssets.intangibleAssetsUnderDevelopment.previous,
                  'nonCurrentAssets.intangibleAssetsUnderDevelopment',
                  company.balanceSheet.nonCurrentAssets.intangibleAssetsUnderDevelopment.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentAssets.intangibleAssetsUnderDevelopment.current,
                  company.balanceSheet.nonCurrentAssets.intangibleAssetsUnderDevelopment.previous
                )
              }
            </tr>

            {/* (g) Biological Assets other than bearer plants */}
            <tr>
              <td className="border p-2 pl-8">(g) Biological Assets other than bearer plants</td>
              {renderNoteTd(company.balanceSheet.nonCurrentAssets.biologicalAssetsOtherThanBearerPlants.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentAssets.biologicalAssetsOtherThanBearerPlants.current,
                  company.balanceSheet.nonCurrentAssets.biologicalAssetsOtherThanBearerPlants.previous,
                  'nonCurrentAssets.biologicalAssetsOtherThanBearerPlants',
                  company.balanceSheet.nonCurrentAssets.biologicalAssetsOtherThanBearerPlants.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentAssets.biologicalAssetsOtherThanBearerPlants.current,
                  company.balanceSheet.nonCurrentAssets.biologicalAssetsOtherThanBearerPlants.previous
                )
              }
            </tr>

            {/* (h) Financial Assets */}
            <tr className="bg-gray-50 font-semibold">
              <td className="border p-2 pl-8">(h) Financial Assets</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(
                company.balanceSheet.nonCurrentAssets.financialAssets.investments.current +
                company.balanceSheet.nonCurrentAssets.financialAssets.tradeReceivables.current +
                company.balanceSheet.nonCurrentAssets.financialAssets.loans.current
              )}</td>
              <td className="border p-2 text-right">{formatValue(
                company.balanceSheet.nonCurrentAssets.financialAssets.investments.previous +
                company.balanceSheet.nonCurrentAssets.financialAssets.tradeReceivables.previous +
                company.balanceSheet.nonCurrentAssets.financialAssets.loans.previous
              )}</td>
            </tr>

            {/* (i) Investments */}
            <tr>
              <td className="border p-2 pl-12">(i) Investments</td>
              {renderNoteTd(company.balanceSheet.nonCurrentAssets.financialAssets.investments.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentAssets.financialAssets.investments.current,
                  company.balanceSheet.nonCurrentAssets.financialAssets.investments.previous,
                  'nonCurrentAssets.financialAssets.investments',
                  company.balanceSheet.nonCurrentAssets.financialAssets.investments.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentAssets.financialAssets.investments.current,
                  company.balanceSheet.nonCurrentAssets.financialAssets.investments.previous
                )
              }
            </tr>

            {/* (ii) Trade receivables */}
            <tr>
              <td className="border p-2 pl-12">(ii) Trade receivables</td>
              {renderNoteTd(company.balanceSheet.nonCurrentAssets.financialAssets.tradeReceivables.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentAssets.financialAssets.tradeReceivables.current,
                  company.balanceSheet.nonCurrentAssets.financialAssets.tradeReceivables.previous,
                  'nonCurrentAssets.financialAssets.tradeReceivables',
                  company.balanceSheet.nonCurrentAssets.financialAssets.tradeReceivables.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentAssets.financialAssets.tradeReceivables.current,
                  company.balanceSheet.nonCurrentAssets.financialAssets.tradeReceivables.previous
                )
              }
            </tr>

            {/* (iii) Loans */}
            <tr>
              <td className="border p-2 pl-12">(iii) Loans</td>
              {renderNoteTd(company.balanceSheet.nonCurrentAssets.financialAssets.loans.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentAssets.financialAssets.loans.current,
                  company.balanceSheet.nonCurrentAssets.financialAssets.loans.previous,
                  'nonCurrentAssets.financialAssets.loans',
                  company.balanceSheet.nonCurrentAssets.financialAssets.loans.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentAssets.financialAssets.loans.current,
                  company.balanceSheet.nonCurrentAssets.financialAssets.loans.previous
                )
              }
            </tr>

            {/* (i) Deferred tax assets (net) */}
            <tr>
              <td className="border p-2 pl-8">(i) Deferred tax assets (net)</td>
              {renderNoteTd(company.balanceSheet.nonCurrentAssets.deferredTaxAssets.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentAssets.deferredTaxAssets.current,
                  company.balanceSheet.nonCurrentAssets.deferredTaxAssets.previous,
                  'nonCurrentAssets.deferredTaxAssets',
                  company.balanceSheet.nonCurrentAssets.deferredTaxAssets.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentAssets.deferredTaxAssets.current,
                  company.balanceSheet.nonCurrentAssets.deferredTaxAssets.previous
                )
              }
            </tr>

            {/* (j) Other non-current assets */}
            <tr>
              <td className="border p-2 pl-8">(j) Other non-current assets</td>
              {renderNoteTd(company.balanceSheet.nonCurrentAssets.otherNonCurrentAssets.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentAssets.otherNonCurrentAssets.current,
                  company.balanceSheet.nonCurrentAssets.otherNonCurrentAssets.previous,
                  'nonCurrentAssets.otherNonCurrentAssets',
                  company.balanceSheet.nonCurrentAssets.otherNonCurrentAssets.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentAssets.otherNonCurrentAssets.current,
                  company.balanceSheet.nonCurrentAssets.otherNonCurrentAssets.previous
                )
              }
            </tr>

            {/* (2) Current Assets */}
            <tr className={`${accentSoftRowClass} font-semibold`}>
              <td className="border p-2 pl-4">(2) Current Assets</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.currentAssets)}</td>
              <td className="border p-2 text-right">{formatValue(totals.currentAssetsPrev)}</td>
            </tr>

            {/* (a) Inventories */}
            <tr>
              <td className="border p-2 pl-8">(a) Inventories</td>
              {renderNoteTd(company.balanceSheet.currentAssets.inventories.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentAssets.inventories.current,
                  company.balanceSheet.currentAssets.inventories.previous,
                  'currentAssets.inventories',
                  company.balanceSheet.currentAssets.inventories.note
                ) :
                renderDisplayField(
                  company.balanceSheet.currentAssets.inventories.current,
                  company.balanceSheet.currentAssets.inventories.previous
                )
              }
            </tr>

            {/* (b) Financial Assets */}
            <tr className="bg-gray-50 font-semibold">
              <td className="border p-2 pl-8">(b) Financial Assets</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(
                company.balanceSheet.currentAssets.financialAssets.investments.current +
                company.balanceSheet.currentAssets.financialAssets.tradeReceivables.current +
                company.balanceSheet.currentAssets.financialAssets.cashAndCashEquivalents.current +
                company.balanceSheet.currentAssets.financialAssets.bankBalancesOtherThanCash.current +
                company.balanceSheet.currentAssets.financialAssets.loans.current +
                company.balanceSheet.currentAssets.financialAssets.others.current
              )}</td>
              <td className="border p-2 text-right">{formatValue(
                company.balanceSheet.currentAssets.financialAssets.investments.previous +
                company.balanceSheet.currentAssets.financialAssets.tradeReceivables.previous +
                company.balanceSheet.currentAssets.financialAssets.cashAndCashEquivalents.previous +
                company.balanceSheet.currentAssets.financialAssets.bankBalancesOtherThanCash.previous +
                company.balanceSheet.currentAssets.financialAssets.loans.previous +
                company.balanceSheet.currentAssets.financialAssets.others.previous
              )}</td>
            </tr>

            {/* (i) Investments */}
            <tr>
              <td className="border p-2 pl-12">(i) Investments</td>
              {renderNoteTd(company.balanceSheet.currentAssets.financialAssets.investments.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentAssets.financialAssets.investments.current,
                  company.balanceSheet.currentAssets.financialAssets.investments.previous,
                  'currentAssets.financialAssets.investments',
                  company.balanceSheet.currentAssets.financialAssets.investments.note
                ) :
                renderDisplayField(
                  company.balanceSheet.currentAssets.financialAssets.investments.current,
                  company.balanceSheet.currentAssets.financialAssets.investments.previous
                )
              }
            </tr>

            {/* (ii) Trade receivables */}
            <tr>
              <td className="border p-2 pl-12">(ii) Trade receivables</td>
              {renderNoteTd(company.balanceSheet.currentAssets.financialAssets.tradeReceivables.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentAssets.financialAssets.tradeReceivables.current,
                  company.balanceSheet.currentAssets.financialAssets.tradeReceivables.previous,
                  'currentAssets.financialAssets.tradeReceivables',
                  company.balanceSheet.currentAssets.financialAssets.tradeReceivables.note
                ) :
                renderDisplayField(
                  company.balanceSheet.currentAssets.financialAssets.tradeReceivables.current,
                  company.balanceSheet.currentAssets.financialAssets.tradeReceivables.previous
                )
              }
            </tr>

            {/* (iii) Cash and cash equivalents */}
            <tr>
              <td className="border p-2 pl-12">(iii) Cash and cash equivalents</td>
              {renderNoteTd(company.balanceSheet.currentAssets.financialAssets.cashAndCashEquivalents.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentAssets.financialAssets.cashAndCashEquivalents.current,
                  company.balanceSheet.currentAssets.financialAssets.cashAndCashEquivalents.previous,
                  'currentAssets.financialAssets.cashAndCashEquivalents',
                  company.balanceSheet.currentAssets.financialAssets.cashAndCashEquivalents.note
                ) :
                renderDisplayField(
                  company.balanceSheet.currentAssets.financialAssets.cashAndCashEquivalents.current,
                  company.balanceSheet.currentAssets.financialAssets.cashAndCashEquivalents.previous
                )
              }
            </tr>

            {/* (iv) Bank balances other than (iii) above */}
            <tr>
              <td className="border p-2 pl-12">(iv) Bank balances other than (iii) above</td>
              {renderNoteTd(company.balanceSheet.currentAssets.financialAssets.bankBalancesOtherThanCash.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentAssets.financialAssets.bankBalancesOtherThanCash.current,
                  company.balanceSheet.currentAssets.financialAssets.bankBalancesOtherThanCash.previous,
                  'currentAssets.financialAssets.bankBalancesOtherThanCash',
                  company.balanceSheet.currentAssets.financialAssets.bankBalancesOtherThanCash.note
                ) :
                renderDisplayField(
                  company.balanceSheet.currentAssets.financialAssets.bankBalancesOtherThanCash.current,
                  company.balanceSheet.currentAssets.financialAssets.bankBalancesOtherThanCash.previous
                )
              }
            </tr>

            {/* (v) Loans */}
            <tr>
              <td className="border p-2 pl-12">(v) Loans</td>
              {renderNoteTd(company.balanceSheet.currentAssets.financialAssets.loans.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentAssets.financialAssets.loans.current,
                  company.balanceSheet.currentAssets.financialAssets.loans.previous,
                  'currentAssets.financialAssets.loans',
                  company.balanceSheet.currentAssets.financialAssets.loans.note
                ) :
                renderDisplayField(
                  company.balanceSheet.currentAssets.financialAssets.loans.current,
                  company.balanceSheet.currentAssets.financialAssets.loans.previous
                )
              }
            </tr>

            {/* (vi) Others (to be specified) */}
            <tr>
              <td className="border p-2 pl-12">(vi) Others (to be specified)</td>
              {renderNoteTd(company.balanceSheet.currentAssets.financialAssets.others.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentAssets.financialAssets.others.current,
                  company.balanceSheet.currentAssets.financialAssets.others.previous,
                  'currentAssets.financialAssets.others',
                  company.balanceSheet.currentAssets.financialAssets.others.note
                ) :
                renderDisplayField(
                  company.balanceSheet.currentAssets.financialAssets.others.current,
                  company.balanceSheet.currentAssets.financialAssets.others.previous
                )
              }
            </tr>

            {/* (c) Current Tax Assets (Net) */}
            <tr>
              <td className="border p-2 pl-8">(c) Current Tax Assets (Net)</td>
              {renderNoteTd(company.balanceSheet.currentAssets.currentTaxAssets.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentAssets.currentTaxAssets.current,
                  company.balanceSheet.currentAssets.currentTaxAssets.previous,
                  'currentAssets.currentTaxAssets',
                  company.balanceSheet.currentAssets.currentTaxAssets.note
                ) :
                renderDisplayField(
                  company.balanceSheet.currentAssets.currentTaxAssets.current,
                  company.balanceSheet.currentAssets.currentTaxAssets.previous
                )
              }
            </tr>

            {/* (d) Other current assets */}
            <tr>
              <td className="border p-2 pl-8">(d) Other current assets</td>
              {renderNoteTd(company.balanceSheet.currentAssets.otherCurrentAssets.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentAssets.otherCurrentAssets.current,
                  company.balanceSheet.currentAssets.otherCurrentAssets.previous,
                  'currentAssets.otherCurrentAssets',
                  company.balanceSheet.currentAssets.otherCurrentAssets.note
                ) :
                renderDisplayField(
                  company.balanceSheet.currentAssets.otherCurrentAssets.current,
                  company.balanceSheet.currentAssets.otherCurrentAssets.previous
                )
              }
            </tr>

            {/* Total Assets */}
            <tr className="font-bold bg-blue-100">
              <td className="border p-2">Total Assets</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.totalAssets)}</td>
              <td className="border p-2 text-right">{formatValue(totals.totalAssetsPrev)}</td>
            </tr>

            {/* EQUITY AND LIABILITIES */}
            <tr className="bg-gray-200 font-bold">
              <td className="border p-2" colSpan={4}>EQUITY AND LIABILITIES</td>
            </tr>

            {/* Equity */}
            <tr className="bg-blue-50 font-semibold">
              <td className="border p-2 pl-4">Equity</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.equity)}</td>
              <td className="border p-2 text-right">{formatValue(totals.equityPrev)}</td>
            </tr>

            {/* (a) Equity Share capital */}
            <tr>
              <td className="border p-2 pl-8">(a) Equity Share capital</td>
              {renderNoteTd(company.balanceSheet.equity.equityShareCapital.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.equity.equityShareCapital.current,
                  company.balanceSheet.equity.equityShareCapital.previous,
                  'equity.equityShareCapital',
                  company.balanceSheet.equity.equityShareCapital.note
                ) :
                renderDisplayField(
                  company.balanceSheet.equity.equityShareCapital.current,
                  company.balanceSheet.equity.equityShareCapital.previous
                )
              }
            </tr>

            {/* (b) Other Equity */}
            <tr>
              <td className="border p-2 pl-8">(b) Other Equity</td>
              {renderNoteTd(company.balanceSheet.equity.otherEquity.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.equity.otherEquity.current,
                  company.balanceSheet.equity.otherEquity.previous,
                  'equity.otherEquity',
                  company.balanceSheet.equity.otherEquity.note
                ) :
                renderDisplayField(
                  company.balanceSheet.equity.otherEquity.current,
                  company.balanceSheet.equity.otherEquity.previous
                )
              }
            </tr>

            {/* (1) LIABILITIES */}
            <tr className="bg-blue-50 font-semibold">
              <td className="border p-2 pl-4">(1) LIABILITIES</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.nonCurrentLiabilities + totals.currentLiabilities)}</td>
              <td className="border p-2 text-right">{formatValue(totals.nonCurrentLiabilitiesPrev + totals.currentLiabilitiesPrev)}</td>
            </tr>

            {/* Non-current liabilities */}
            <tr className="bg-blue-50 font-semibold">
              <td className="border p-2 pl-8">Non-current liabilities</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.nonCurrentLiabilities)}</td>
              <td className="border p-2 text-right">{formatValue(totals.nonCurrentLiabilitiesPrev)}</td>
            </tr>

            {/* (a) Financial Liabilities */}
            <tr className="bg-gray-50 font-semibold">
              <td className="border p-2 pl-12">(a) Financial Liabilities</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.borrowings.current +
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.leaseLiabilities.current +
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current +
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current +
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities.current
              )}</td>
              <td className="border p-2 text-right">{formatValue(
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.borrowings.previous +
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.leaseLiabilities.previous +
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.previous +
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.previous +
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities.previous
              )}</td>
            </tr>

            {/* (i) Borrowings */}
            <tr>
              <td className="border p-2 pl-16">(i) Borrowings</td>
              {renderNoteTd(company.balanceSheet.nonCurrentLiabilities.financialLiabilities.borrowings.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.borrowings.current,
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.borrowings.previous,
                  'nonCurrentLiabilities.financialLiabilities.borrowings',
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.borrowings.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.borrowings.current,
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.borrowings.previous
                )
              }
            </tr>

            {/* (ia) Lease liabilities */}
            <tr>
              <td className="border p-2 pl-16">(ia) Lease liabilities</td>
              {renderNoteTd(company.balanceSheet.nonCurrentLiabilities.financialLiabilities.leaseLiabilities.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.leaseLiabilities.current,
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.leaseLiabilities.previous,
                  'nonCurrentLiabilities.financialLiabilities.leaseLiabilities',
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.leaseLiabilities.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.leaseLiabilities.current,
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.leaseLiabilities.previous
                )
              }
            </tr>

            {/* (ii) Trade Payables */}
            <tr className="bg-gray-50 font-semibold">
              <td className="border p-2 pl-16">(ii) Trade Payables:</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current +
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current
              )}</td>
              <td className="border p-2 text-right">{formatValue(
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.previous +
                company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.previous
              )}</td>
            </tr>

            {/* (A) total outstanding dues of micro enterprises and small enterprises */}
            <tr>
              <td className="border p-2 pl-20">(A) total outstanding dues of micro enterprises and small enterprises</td>
              {renderNoteTd(company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current,
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.previous,
                  'nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues',
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current,
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.previous
                )
              }
            </tr>

            {/* (B) total outstanding dues of creditors other than micro enterprises and small enterprises */}
            <tr>
              <td className="border p-2 pl-20">(B) total outstanding dues of creditors other than micro enterprises and small enterprises</td>
              {renderNoteTd(company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current,
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.previous,
                  'nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues',
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current,
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.previous
                )
              }
            </tr>

            {/* (iii) Other financial liabilities */}
            <tr>
              <td className="border p-2 pl-16">(iii) Other financial liabilities (other than those specified in item (b), to be specified)</td>
              {renderNoteTd(company.balanceSheet.nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities.current,
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities.previous,
                  'nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities',
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities.current,
                  company.balanceSheet.nonCurrentLiabilities.financialLiabilities.otherFinancialLiabilities.previous
                )
              }
            </tr>

            {/* (b) Provisions */}
            <tr>
              <td className="border p-2 pl-12">(b) Provisions</td>
              {renderNoteTd(company.balanceSheet.nonCurrentLiabilities.provisions.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentLiabilities.provisions.current,
                  company.balanceSheet.nonCurrentLiabilities.provisions.previous,
                  'nonCurrentLiabilities.provisions',
                  company.balanceSheet.nonCurrentLiabilities.provisions.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentLiabilities.provisions.current,
                  company.balanceSheet.nonCurrentLiabilities.provisions.previous
                )
              }
            </tr>

            {/* (c) Deferred tax liabilities (Net) */}
            <tr>
              <td className="border p-2 pl-12">(c) Deferred tax liabilities (Net)</td>
              {renderNoteTd(company.balanceSheet.nonCurrentLiabilities.deferredTaxLiabilities.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentLiabilities.deferredTaxLiabilities.current,
                  company.balanceSheet.nonCurrentLiabilities.deferredTaxLiabilities.previous,
                  'nonCurrentLiabilities.deferredTaxLiabilities',
                  company.balanceSheet.nonCurrentLiabilities.deferredTaxLiabilities.note
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentLiabilities.deferredTaxLiabilities.current,
                  company.balanceSheet.nonCurrentLiabilities.deferredTaxLiabilities.previous
                )
              }
            </tr>

            {/* (d) Other non-current liabilities */}
            <tr>
              <td className="border p-2 pl-12">(d) Other non-current liabilities</td>
              {renderNoteTd(company.balanceSheet.nonCurrentLiabilities.otherNonCurrentLiabilities.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.nonCurrentLiabilities.otherNonCurrentLiabilities.current,
                  company.balanceSheet.nonCurrentLiabilities.otherNonCurrentLiabilities.previous,
                  'nonCurrentLiabilities.otherNonCurrentLiabilities'
                ) :
                renderDisplayField(
                  company.balanceSheet.nonCurrentLiabilities.otherNonCurrentLiabilities.current,
                  company.balanceSheet.nonCurrentLiabilities.otherNonCurrentLiabilities.previous
                )
              }
            </tr>

            {/* (2) Current liabilities */}
            <tr className={`${accentSoftRowClass} font-semibold`}>
              <td className="border p-2 pl-8">(2) Current liabilities</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.currentLiabilities)}</td>
              <td className="border p-2 text-right">{formatValue(totals.currentLiabilitiesPrev)}</td>
            </tr>

            {/* (a) Financial Liabilities */}
            <tr className="bg-gray-50 font-semibold">
              <td className="border p-2 pl-12">(a) Financial Liabilities</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(
                company.balanceSheet.currentLiabilities.financialLiabilities.borrowings.current +
                company.balanceSheet.currentLiabilities.financialLiabilities.leaseLiabilities.current +
                company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current +
                company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current +
                company.balanceSheet.currentLiabilities.financialLiabilities.otherFinancialLiabilities.current
              )}</td>
              <td className="border p-2 text-right">{formatValue(
                company.balanceSheet.currentLiabilities.financialLiabilities.borrowings.previous +
                company.balanceSheet.currentLiabilities.financialLiabilities.leaseLiabilities.previous +
                company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.previous +
                company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.previous +
                company.balanceSheet.currentLiabilities.financialLiabilities.otherFinancialLiabilities.previous
              )}</td>
            </tr>

            {/* (i) Borrowings */}
            <tr>
              <td className="border p-2 pl-16">(i) Borrowings</td>
              {renderNoteTd(company.balanceSheet.currentLiabilities.financialLiabilities.borrowings.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentLiabilities.financialLiabilities.borrowings.current,
                  company.balanceSheet.currentLiabilities.financialLiabilities.borrowings.previous,
                  'currentLiabilities.financialLiabilities.borrowings'
                ) :
                renderDisplayField(
                  company.balanceSheet.currentLiabilities.financialLiabilities.borrowings.current,
                  company.balanceSheet.currentLiabilities.financialLiabilities.borrowings.previous
                )
              }
            </tr>

            {/* (ia) Lease liabilities */}
            <tr>
              <td className="border p-2 pl-16">(ia) Lease liabilities</td>
              {renderNoteTd(company.balanceSheet.currentLiabilities.financialLiabilities.leaseLiabilities.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentLiabilities.financialLiabilities.leaseLiabilities.current,
                  company.balanceSheet.currentLiabilities.financialLiabilities.leaseLiabilities.previous,
                  'currentLiabilities.financialLiabilities.leaseLiabilities'
                ) :
                renderDisplayField(
                  company.balanceSheet.currentLiabilities.financialLiabilities.leaseLiabilities.current,
                  company.balanceSheet.currentLiabilities.financialLiabilities.leaseLiabilities.previous
                )
              }
            </tr>

            {/* (ii) Trade payables */}
            <tr className="bg-gray-50 font-semibold">
              <td className="border p-2 pl-16">(ii) Trade payables:</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(
                company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current +
                company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current
              )}</td>
              <td className="border p-2 text-right">{formatValue(
                company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.previous +
                company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.previous
              )}</td>
            </tr>

            {/* (A) total outstanding dues of micro enterprises and small enterprises */}
            <tr>
              <td className="border p-2 pl-20">(A) total outstanding dues of micro enterprises and small enterprises</td>
              {renderNoteTd(company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current,
                  company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.previous,
                  'currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues'
                ) :
                renderDisplayField(
                  company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.current,
                  company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.microSmallEnterprisesDues.previous
                )
              }
            </tr>

            {/* (B) total outstanding dues of creditors other than micro enterprises and small enterprises */}
            <tr>
              <td className="border p-2 pl-20">(B) total outstanding dues of creditors other than micro enterprises and small enterprises</td>
              {renderNoteTd(company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current,
                  company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.previous,
                  'currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues'
                ) :
                renderDisplayField(
                  company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.current,
                  company.balanceSheet.currentLiabilities.financialLiabilities.tradePayables.otherCreditorsDues.previous
                )
              }
            </tr>

            {/* (iii) Other financial liabilities */}
            <tr>
              <td className="border p-2 pl-16">(iii) Other financial liabilities (other than those specified in item (c))</td>
              {renderNoteTd(company.balanceSheet.currentLiabilities.financialLiabilities.otherFinancialLiabilities.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentLiabilities.financialLiabilities.otherFinancialLiabilities.current,
                  company.balanceSheet.currentLiabilities.financialLiabilities.otherFinancialLiabilities.previous,
                  'currentLiabilities.financialLiabilities.otherFinancialLiabilities'
                ) :
                renderDisplayField(
                  company.balanceSheet.currentLiabilities.financialLiabilities.otherFinancialLiabilities.current,
                  company.balanceSheet.currentLiabilities.financialLiabilities.otherFinancialLiabilities.previous
                )
              }
            </tr>

            {/* (b) Other current liabilities */}
            <tr>
              <td className="border p-2 pl-12">(b) Other current liabilities</td>
              {renderNoteTd(company.balanceSheet.currentLiabilities.otherCurrentLiabilities.note)}
              {isEditable ?
                renderInputField(
                  company.balanceSheet.currentLiabilities.otherCurrentLiabilities.current,
                  company.balanceSheet.currentLiabilities.otherCurrentLiabilities.previous,
                  'currentLiabilities.otherCurrentLiabilities',
                  company.balanceSheet.currentLiabilities.otherCurrentLiabilities.note
                ) :
                renderDisplayField(
                  company.balanceSheet.currentLiabilities.otherCurrentLiabilities.current,
                  company.balanceSheet.currentLiabilities.otherCurrentLiabilities.previous
                )
              }
            </tr>

            {/* (c) Provisions */}
            <tr>
              <td className="border p-2 pl-12">(c) Provisions</td>
              {renderNoteTd(company.balanceSheet.currentLiabilities.provisions.note)}
              {viewMode === 'edit' ?
                renderInputField(
                  company.balanceSheet.currentLiabilities.provisions.current,
                  company.balanceSheet.currentLiabilities.provisions.previous,
                  'currentLiabilities.provisions',
                  company.balanceSheet.currentLiabilities.provisions.note
                ) :
                renderDisplayField(
                  company.balanceSheet.currentLiabilities.provisions.current,
                  company.balanceSheet.currentLiabilities.provisions.previous
                )
              }
            </tr>

            {/* (d) Current Tax Liabilities (Net) */}
            <tr>
              <td className="border p-2 pl-12">(d) Current Tax Liabilities (Net)</td>
              {renderNoteTd(company.balanceSheet.currentLiabilities.currentTaxLiabilities.note)}
              {viewMode === 'edit' ?
                renderInputField(
                  company.balanceSheet.currentLiabilities.currentTaxLiabilities.current,
                  company.balanceSheet.currentLiabilities.currentTaxLiabilities.previous,
                  'currentLiabilities.currentTaxLiabilities',
                  company.balanceSheet.currentLiabilities.currentTaxLiabilities.note
                ) :
                renderDisplayField(
                  company.balanceSheet.currentLiabilities.currentTaxLiabilities.current,
                  company.balanceSheet.currentLiabilities.currentTaxLiabilities.previous
                )
              }
            </tr>

            {/* Total Equity and Liabilities */}
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">Total Equity and Liabilities</td>
              <td className="border p-2"></td>
              <td className="border p-2 text-right">{formatValue(totals.totalLiabilities)}</td>
              <td className="border p-2 text-right">{formatValue(totals.totalLiabilitiesPrev)}</td>
            </tr>
          </tbody>
        </table>
        {renderSignatureBlocks()}
      </div>
    </div>
  );
};

export default BalanceSheet;