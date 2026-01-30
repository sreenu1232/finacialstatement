import React, { useMemo, useCallback } from 'react';
import { Company, ChangesInEquityData, ChangesInEquityOtherEquityRowInput } from '../types';
import { useApp } from '../context/AppContext';
import { formatINR, getUnitLabel } from '../utils/formatters';
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
  const { primaryColor } = company.settings.template;

  const formatValue = (value: number) => formatINR(value, unitOfMeasurement, decimalPoints, numberStyle, customNumberGrouping);
  const unitLabel = getUnitLabel(unitOfMeasurement);

  const { tableClassName, theadClassName, accentStrongRowClass } = getTableDesignClasses(tableDesign, tableAccent, tableDensity);

  const defaultData: ChangesInEquityData = useMemo(() => ({
    equityShareCapital: {
      opening: { current: 0, previous: 0 },
      changes: { current: 0, previous: 0 }
    },
    otherEquity: {
      rows: {
        equity_component_other_financial_instruments: {
          beginning: { current: 0, previous: 0 },
          accountingPolicyOrPriorPeriodErrors: { current: 0, previous: 0 },
          totalComprehensiveIncomeForYear: { current: 0, previous: 0 },
          dividends: { current: 0, previous: 0 },
          transferToRetainedEarnings: { current: 0, previous: 0 },
          otherChange: { current: 0, previous: 0 }
        },
        retained_earnings: {
          beginning: { current: 0, previous: 0 },
          accountingPolicyOrPriorPeriodErrors: { current: 0, previous: 0 },
          totalComprehensiveIncomeForYear: { current: 0, previous: 0 },
          dividends: { current: 0, previous: 0 },
          transferToRetainedEarnings: { current: 0, previous: 0 },
          otherChange: { current: 0, previous: 0 }
        },
        reserves_representing_unrealised_gains_losses: {
          beginning: { current: 0, previous: 0 },
          accountingPolicyOrPriorPeriodErrors: { current: 0, previous: 0 },
          totalComprehensiveIncomeForYear: { current: 0, previous: 0 },
          dividends: { current: 0, previous: 0 },
          transferToRetainedEarnings: { current: 0, previous: 0 },
          otherChange: { current: 0, previous: 0 }
        },
        debt_instruments_through_oci: {
          beginning: { current: 0, previous: 0 },
          accountingPolicyOrPriorPeriodErrors: { current: 0, previous: 0 },
          totalComprehensiveIncomeForYear: { current: 0, previous: 0 },
          dividends: { current: 0, previous: 0 },
          transferToRetainedEarnings: { current: 0, previous: 0 },
          otherChange: { current: 0, previous: 0 }
        },
        equity_instruments_through_oci: {
          beginning: { current: 0, previous: 0 },
          accountingPolicyOrPriorPeriodErrors: { current: 0, previous: 0 },
          totalComprehensiveIncomeForYear: { current: 0, previous: 0 },
          dividends: { current: 0, previous: 0 },
          transferToRetainedEarnings: { current: 0, previous: 0 },
          otherChange: { current: 0, previous: 0 }
        },
        effective_portion_cash_flow_hedges: {
          beginning: { current: 0, previous: 0 },
          accountingPolicyOrPriorPeriodErrors: { current: 0, previous: 0 },
          totalComprehensiveIncomeForYear: { current: 0, previous: 0 },
          dividends: { current: 0, previous: 0 },
          transferToRetainedEarnings: { current: 0, previous: 0 },
          otherChange: { current: 0, previous: 0 }
        },
        revaluation_surplus: {
          beginning: { current: 0, previous: 0 },
          accountingPolicyOrPriorPeriodErrors: { current: 0, previous: 0 },
          totalComprehensiveIncomeForYear: { current: 0, previous: 0 },
          dividends: { current: 0, previous: 0 },
          transferToRetainedEarnings: { current: 0, previous: 0 },
          otherChange: { current: 0, previous: 0 }
        },
        remeasurements_net_defined_benefit_plans: {
          beginning: { current: 0, previous: 0 },
          accountingPolicyOrPriorPeriodErrors: { current: 0, previous: 0 },
          totalComprehensiveIncomeForYear: { current: 0, previous: 0 },
          dividends: { current: 0, previous: 0 },
          transferToRetainedEarnings: { current: 0, previous: 0 },
          otherChange: { current: 0, previous: 0 }
        },
        exchange_differences_foreign_operation: {
          beginning: { current: 0, previous: 0 },
          accountingPolicyOrPriorPeriodErrors: { current: 0, previous: 0 },
          totalComprehensiveIncomeForYear: { current: 0, previous: 0 },
          dividends: { current: 0, previous: 0 },
          transferToRetainedEarnings: { current: 0, previous: 0 },
          otherChange: { current: 0, previous: 0 }
        },
        others_reserves: {
          beginning: { current: 0, previous: 0 },
          accountingPolicyOrPriorPeriodErrors: { current: 0, previous: 0 },
          totalComprehensiveIncomeForYear: { current: 0, previous: 0 },
          dividends: { current: 0, previous: 0 },
          transferToRetainedEarnings: { current: 0, previous: 0 },
          otherChange: { current: 0, previous: 0 }
        },
        money_received_against_share_warrants: {
          beginning: { current: 0, previous: 0 },
          accountingPolicyOrPriorPeriodErrors: { current: 0, previous: 0 },
          totalComprehensiveIncomeForYear: { current: 0, previous: 0 },
          dividends: { current: 0, previous: 0 },
          transferToRetainedEarnings: { current: 0, previous: 0 },
          otherChange: { current: 0, previous: 0 }
        },
        others_final: {
          beginning: { current: 0, previous: 0 },
          accountingPolicyOrPriorPeriodErrors: { current: 0, previous: 0 },
          totalComprehensiveIncomeForYear: { current: 0, previous: 0 },
          dividends: { current: 0, previous: 0 },
          transferToRetainedEarnings: { current: 0, previous: 0 },
          otherChange: { current: 0, previous: 0 }
        }
      }
    }
  }), []);

  const data = company.changesInEquity ?? defaultData;

  const updateValue = (path: string, value: number) => {
    const keys = path.split('.');
    // shallow copy root
    const mergedRows = { ...defaultData.otherEquity.rows, ...(data.otherEquity.rows || {}) };
    const next: ChangesInEquityData = {
      equityShareCapital: {
        opening: { ...data.equityShareCapital.opening },
        changes: { ...data.equityShareCapital.changes }
      },
      otherEquity: {
        rows: Object.fromEntries(
          Object.entries(mergedRows).map(([rowId, row]) => [
            rowId,
            {
              beginning: { ...row.beginning },
              accountingPolicyOrPriorPeriodErrors: { ...row.accountingPolicyOrPriorPeriodErrors },
              totalComprehensiveIncomeForYear: { ...row.totalComprehensiveIncomeForYear },
              dividends: { ...row.dividends },
              transferToRetainedEarnings: { ...row.transferToRetainedEarnings },
              otherChange: { ...row.otherChange }
            }
          ])
        )
      }
    };

    let obj: any = next;
    for (let i = 0; i < keys.length - 1; i += 1) {
      const k = keys[i];
      if (obj[k] === undefined || obj[k] === null) obj[k] = {};
      obj = obj[k];
    }
    obj[keys[keys.length - 1]] = Number.isFinite(value) ? value : 0;
    updateCompany(company.id, { changesInEquity: next });
  };

  const scOpeningCurrent = data.equityShareCapital.opening.current;
  const scOpeningPrev = data.equityShareCapital.opening.previous;
  const scChangesCurrent = data.equityShareCapital.changes.current;
  const scChangesPrev = data.equityShareCapital.changes.previous;
  const scClosingCurrent = scOpeningCurrent + scChangesCurrent;
  const scClosingPrev = scOpeningPrev + scChangesPrev;

  type OtherEquityRowConfig =
    | { kind: 'header'; label: string; indent?: number }
    | { kind: 'computed'; label: string; compute: (year: 'current' | 'previous') => number; indent?: number }
    | { kind: 'row'; id: string; label: string; includeInTotal: boolean; indent?: number };

  const getRow = useCallback((rowId: string): ChangesInEquityOtherEquityRowInput => {
    return data.otherEquity.rows[rowId] ?? defaultData.otherEquity.rows[rowId];
  }, [data, defaultData]);

  const computeOtherEquity = useCallback((row: ChangesInEquityOtherEquityRowInput, year: 'current' | 'previous') => {
    const beginning = row.beginning[year] || 0;
    const accounting = row.accountingPolicyOrPriorPeriodErrors[year] || 0;
    const restatedBeginning = beginning + accounting;
    const tci = row.totalComprehensiveIncomeForYear[year] || 0;
    const dividends = row.dividends[year] || 0; // positive input
    const transfer = row.transferToRetainedEarnings[year] || 0;
    const other = row.otherChange[year] || 0;
    const ending = restatedBeginning + tci - dividends + transfer + other;
    return { beginning, accounting, restatedBeginning, tci, dividends, transfer, other, ending };
  }, []);

  const otherEquityRows: OtherEquityRowConfig[] = useMemo(() => {
    const reserveRowIds = [
      'debt_instruments_through_oci',
      'equity_instruments_through_oci',
      'effective_portion_cash_flow_hedges',
      'revaluation_surplus',
      'remeasurements_net_defined_benefit_plans',
      'exchange_differences_foreign_operation',
      'others_reserves'
    ] as const;

    return [
      { kind: 'row', id: 'equity_component_other_financial_instruments', label: '(i) Equity component of other financial instruments', includeInTotal: true },
      { kind: 'row', id: 'retained_earnings', label: '(ii) Retained Earnings', includeInTotal: true },

      { kind: 'header', label: '(iii) Reserves' },
      { kind: 'header', label: '1.1 Reserves representing unrealised gains/losses', indent: 1 },
      { kind: 'row', id: 'debt_instruments_through_oci', label: 'Debt instruments through Other Comprehensive Income', includeInTotal: true, indent: 2 },
      { kind: 'row', id: 'equity_instruments_through_oci', label: 'Equity instruments through Other Comprehensive Income', includeInTotal: true, indent: 2 },
      { kind: 'row', id: 'effective_portion_cash_flow_hedges', label: 'Effective portion of Cash Flow Hedges', includeInTotal: true, indent: 2 },
      { kind: 'row', id: 'revaluation_surplus', label: 'Re-valuation Surplus', includeInTotal: true, indent: 2 },
      { kind: 'row', id: 'remeasurements_net_defined_benefit_plans', label: 'Remeasurements of the net defined benefit Plans', includeInTotal: true, indent: 2 },
      { kind: 'row', id: 'exchange_differences_foreign_operation', label: 'Exchange differences on translating the financial statements of a foreign operation', includeInTotal: true, indent: 2 },
      { kind: 'row', id: 'others_reserves', label: 'Others', includeInTotal: true, indent: 2 },

      { kind: 'header', label: '1.2 Other Reserves (to be specified separately)', indent: 1 },

      { kind: 'computed', label: '(iii) Total Reserves', indent: 1, compute: (year) => {
        return reserveRowIds.reduce((sum, id) => {
          const row = getRow(id);
          return sum + computeOtherEquity(row, year).ending;
        }, 0);
      }},

      { kind: 'row', id: 'money_received_against_share_warrants', label: '(iv) Money received against share warrants', includeInTotal: true, indent: 1 },
      { kind: 'row', id: 'others_final', label: '(v) Others', includeInTotal: true, indent: 1 }
    ];
  }, [getRow, computeOtherEquity]);

  const otherEquityTotals = (year: 'current' | 'previous') => {
    return otherEquityRows.reduce((sum, r) => {
      if (r.kind !== 'row' || !r.includeInTotal) return sum;
      const row = getRow(r.id);
      return sum + computeOtherEquity(row, year).ending;
    }, 0);
  };

  const oeClosingCurrent = otherEquityTotals('current');
  const oeClosingPrev = otherEquityTotals('previous');

  const totalEquityCurrent = scClosingCurrent + oeClosingCurrent;
  const totalEquityPrevious = scClosingPrev + oeClosingPrev;

  const renderNumberCell = (value: number, path: string) => {
    if (!isEditable) return <span>{formatValue(value)}</span>;

    return (
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => updateValue(path, e.target.value === '' ? 0 : Number(e.target.value))}
        className="w-full px-2 py-1 border rounded text-right bg-yellow-50"
      />
    );
  };

  const renderDividendCell = (value: number, path: string) => {
    if (isEditable) {
      return (
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => updateValue(path, e.target.value === '' ? 0 : Number(e.target.value))}
          className="w-full px-2 py-1 border rounded text-right bg-yellow-50"
          title="Enter positive dividend amount"
        />
      );
    }
    // Display dividends in brackets like (xxx)
    const display = value ? -Math.abs(value) : 0;
    return <span>{formatValue(display)}</span>;
  };

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
              <td className="border p-2 text-right">{renderNumberCell(scOpeningCurrent, 'equityShareCapital.opening.current')}</td>
              <td className="border p-2 text-right">{renderNumberCell(scOpeningPrev, 'equityShareCapital.opening.previous')}</td>
            </tr>
            <tr>
              <td className="border p-2">Changes in equity share capital during the year</td>
              <td className="border p-2 text-right">{renderNumberCell(scChangesCurrent, 'equityShareCapital.changes.current')}</td>
              <td className="border p-2 text-right">{renderNumberCell(scChangesPrev, 'equityShareCapital.changes.previous')}</td>
            </tr>
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">Balance at the end of the reporting period</td>
              <td className="border p-2 text-right">{formatValue(scClosingCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(scClosingPrev)}</td>
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
              <th className="border p-2 text-left w-[260px]">Particulars</th>
              <th className="border p-2 text-center">Balance at the beginning of the reporting period</th>
              <th className="border p-2 text-center">Changes in accounting policy / prior period errors</th>
              <th className="border p-2 text-center">Restated balance at the beginning of the reporting period</th>
              <th className="border p-2 text-center">Total Comprehensive Income for the year</th>
              <th className="border p-2 text-center">Dividends</th>
              <th className="border p-2 text-center">Transfer to retained earnings</th>
              <th className="border p-2 text-center">Any other change (to be specified)</th>
              <th className="border p-2 text-center">Balance at the end of the reporting period</th>
            </tr>
          </thead>
          <tbody>
            {/* Current Year block */}
            <tr className="bg-gray-100 font-semibold">
              <td className="border p-2" colSpan={9}>For the year ended {company.yearEnd} (₹ {unitLabel})</td>
            </tr>
            {otherEquityRows.map((r, idx) => {
              const paddingStyle = r.indent ? { paddingLeft: r.indent * 16 } : undefined;

              if (r.kind === 'header') {
                return (
                  <tr key={`hdr-current-${idx}`} className="bg-white">
                    <td className="border p-2 font-semibold italic" style={paddingStyle} colSpan={9}>{r.label}</td>
                  </tr>
                );
              }

              if (r.kind === 'computed') {
                const v = r.compute('current');
                return (
                  <tr key={`cmp-current-${idx}`} className="bg-slate-50 font-semibold">
                    <td className="border p-2" style={paddingStyle}>{r.label}</td>
                    <td className="border p-2 text-right" colSpan={7}></td>
                    <td className="border p-2 text-right">{formatValue(v)}</td>
                  </tr>
                );
              }

              const row = getRow(r.id);
              const c = computeOtherEquity(row, 'current');
              return (
                <tr key={`${r.id}-current`}>
                  <td className="border p-2 font-medium" style={paddingStyle}>{r.label}</td>
                  <td className="border p-2 text-right">{renderNumberCell(c.beginning, `otherEquity.rows.${r.id}.beginning.current`)}</td>
                  <td className="border p-2 text-right">{renderNumberCell(c.accounting, `otherEquity.rows.${r.id}.accountingPolicyOrPriorPeriodErrors.current`)}</td>
                  <td className="border p-2 text-right">{formatValue(c.restatedBeginning)}</td>
                  <td className="border p-2 text-right">{renderNumberCell(c.tci, `otherEquity.rows.${r.id}.totalComprehensiveIncomeForYear.current`)}</td>
                  <td className="border p-2 text-right">{renderDividendCell(c.dividends, `otherEquity.rows.${r.id}.dividends.current`)}</td>
                  <td className="border p-2 text-right">{renderNumberCell(c.transfer, `otherEquity.rows.${r.id}.transferToRetainedEarnings.current`)}</td>
                  <td className="border p-2 text-right">{renderNumberCell(c.other, `otherEquity.rows.${r.id}.otherChange.current`)}</td>
                  <td className="border p-2 text-right font-semibold">{formatValue(c.ending)}</td>
                </tr>
              );
            })}
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">Total Other Equity</td>
              <td className="border p-2 text-right" colSpan={7}></td>
              <td className="border p-2 text-right">{formatValue(oeClosingCurrent)}</td>
            </tr>

            {/* Previous Year block */}
            <tr className="bg-gray-100 font-semibold">
              <td className="border p-2" colSpan={9}>For the year ended {company.prevYearEnd} (₹ {unitLabel})</td>
            </tr>
            {otherEquityRows.map((r, idx) => {
              const paddingStyle = r.indent ? { paddingLeft: r.indent * 16 } : undefined;

              if (r.kind === 'header') {
                return (
                  <tr key={`hdr-prev-${idx}`} className="bg-white">
                    <td className="border p-2 font-semibold italic" style={paddingStyle} colSpan={9}>{r.label}</td>
                  </tr>
                );
              }

              if (r.kind === 'computed') {
                const v = r.compute('previous');
                return (
                  <tr key={`cmp-prev-${idx}`} className="bg-slate-50 font-semibold">
                    <td className="border p-2" style={paddingStyle}>{r.label}</td>
                    <td className="border p-2 text-right" colSpan={7}></td>
                    <td className="border p-2 text-right">{formatValue(v)}</td>
                  </tr>
                );
              }

              const row = getRow(r.id);
              const p = computeOtherEquity(row, 'previous');
              return (
                <tr key={`${r.id}-previous`}>
                  <td className="border p-2 font-medium" style={paddingStyle}>{r.label}</td>
                  <td className="border p-2 text-right">{renderNumberCell(p.beginning, `otherEquity.rows.${r.id}.beginning.previous`)}</td>
                  <td className="border p-2 text-right">{renderNumberCell(p.accounting, `otherEquity.rows.${r.id}.accountingPolicyOrPriorPeriodErrors.previous`)}</td>
                  <td className="border p-2 text-right">{formatValue(p.restatedBeginning)}</td>
                  <td className="border p-2 text-right">{renderNumberCell(p.tci, `otherEquity.rows.${r.id}.totalComprehensiveIncomeForYear.previous`)}</td>
                  <td className="border p-2 text-right">{renderDividendCell(p.dividends, `otherEquity.rows.${r.id}.dividends.previous`)}</td>
                  <td className="border p-2 text-right">{renderNumberCell(p.transfer, `otherEquity.rows.${r.id}.transferToRetainedEarnings.previous`)}</td>
                  <td className="border p-2 text-right">{renderNumberCell(p.other, `otherEquity.rows.${r.id}.otherChange.previous`)}</td>
                  <td className="border p-2 text-right font-semibold">{formatValue(p.ending)}</td>
                </tr>
              );
            })}
            <tr className={`font-bold ${accentStrongRowClass}`}>
              <td className="border p-2">Total Other Equity</td>
              <td className="border p-2 text-right" colSpan={7}></td>
              <td className="border p-2 text-right">{formatValue(oeClosingPrev)}</td>
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
              <td className="border p-2 text-right">{formatValue(scClosingCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(scClosingPrev)}</td>
            </tr>
            <tr>
              <td className="border p-2">Other Equity</td>
              <td className="border p-2 text-right">{formatValue(oeClosingCurrent)}</td>
              <td className="border p-2 text-right">{formatValue(oeClosingPrev)}</td>
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
