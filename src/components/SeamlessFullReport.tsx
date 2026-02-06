import React, { useState, useEffect } from 'react';
import { Printer, AlertTriangle, CheckCircle, XCircle, ChevronDown, FileText, FileDown, Sheet, BarChart3, Layers, Waves, StickyNote } from 'lucide-react';
import type { Company } from '../types';
import { useApp } from '../context/AppContext';
import BalanceSheet from './BalanceSheet';
import ProfitLoss from './ProfitLoss';
import ChangesInEquity from './ChangesInEquity';
import CashFlow from './CashFlow';
import Notes from './Notes';
import { getUnitLabel } from '../utils/formatters';
import { runAllValidations, ValidationResult } from '../utils/validationHelpers';
import { exportToWord } from '../utils/exportHelpers';
import { generatePrintStyles } from '../utils/templateStyles';

interface Props {
  company: Company;
}

const ValidationDashboard: React.FC<{ company: Company }> = ({ company }) => {
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setResults(runAllValidations(company));
  }, [company]);

  const errors = results.filter((r: ValidationResult) => r.type === 'error');
  const warnings = results.filter((r: ValidationResult) => r.type === 'warning');

  const statusColor = errors.length > 0 ? 'bg-red-50 border-red-200' : warnings.length > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200';
  const icon = errors.length > 0 ? <XCircle className="text-red-600" /> : warnings.length > 0 ? <AlertTriangle className="text-yellow-600" /> : <CheckCircle className="text-green-600" />;
  const title = errors.length > 0 ? `${errors.length} Critical Errors Found` : warnings.length > 0 ? 'Warnings Found' : 'All Systems Operational';

  return (
    <div className={`mb-6 border rounded-xl shadow-sm ${statusColor} transition-all duration-200 hover:shadow-md`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-opacity-50 transition-colors duration-150"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-white bg-opacity-50">
            {icon}
          </div>
          <div className="text-left">
            <span className="font-semibold text-lg text-gray-800">{title}</span>
            <p className="text-sm text-gray-600 mt-1">
              {errors.length > 0 ? `${errors.length} errors, ${warnings.length} warnings` : 
               warnings.length > 0 ? `${warnings.length} warnings` : 'All validations passed'}
            </p>
          </div>
        </div>
        <div className="transform transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ChevronDown size={20} className="text-gray-500" />
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-3 border-t border-opacity-20" style={{ borderColor: 'currentColor' }}>
          {results.map((result: ValidationResult) => (
            <div key={result.id} className={`flex items-start gap-3 p-4 rounded-lg shadow-sm ${result.type === 'error' ? 'bg-red-50 border border-red-100 text-red-800' : result.type === 'warning' ? 'bg-yellow-50 border border-yellow-100 text-yellow-800' : 'bg-green-50 border border-green-100 text-green-800'}`}>
              <div className="mt-0.5 p-1 rounded-full bg-white bg-opacity-50">
                {result.type === 'error' && <XCircle size={16} />}
                {result.type === 'warning' && <AlertTriangle size={16} />}
                {result.type === 'success' && <CheckCircle size={16} />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm leading-relaxed">{result.message}</p>
                {result.details && <p className="text-xs opacity-75 mt-1 leading-relaxed">{result.details}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SeamlessFullReport: React.FC<Props> = ({ company }) => {
  const { viewMode } = useApp();
  const { fontStyle, fontSize, primaryColor, secondaryColor, logo, paperSize, templateFormat } = company.settings.template;
  const { unitOfMeasurement } = company.settings.formatting;
  const unitLabel = getUnitLabel(unitOfMeasurement);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [downloadSection, setDownloadSection] = useState<'full-report' | 'balance-sheet' | 'profit-loss' | 'changes-in-equity' | 'cash-flow' | 'notes'>('full-report');

  const paperClass = paperSize === 'A4' ? 'w-[210mm] min-h-[297mm] p-[20mm]' : 'w-full max-w-4xl p-8';

  const handlePrint = async () => {
    // Create comprehensive print styles using template-specific styling
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.textContent = generatePrintStyles(templateFormat, primaryColor, secondaryColor, fontSize);
    
    // Remove existing print styles if any
    const existingStyle = document.getElementById('print-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);

    const waitForLogo = (src?: string | null) =>
      new Promise<void>((resolve) => {
        if (!src) {
          resolve();
          return;
        }
        const img = new Image();
        const done = () => resolve();
        img.onload = done;
        img.onerror = done;
        img.src = src;
        if (img.complete) {
          resolve();
        }
      });

    await waitForLogo(logo);
    
    // Small delay to ensure styles are applied
    setTimeout(() => {
      window.print();
    }, 100);

    // Clean up after print
    setTimeout(() => {
      const styleToRemove = document.getElementById('print-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
      setDownloadSection('full-report');
    }, 2000);
  };

  const handleExportWord = () => {
    exportToWord('full-report-content', `${company.name}_Financial_Statements`);
  };

  const handleDownloadPdf = (section: 'balance-sheet' | 'profit-loss' | 'changes-in-equity' | 'cash-flow' | 'notes') => {
    setDownloadSection(section);
    setIsDownloadOpen(false);
    setTimeout(() => {
      handlePrint();
    }, 50);
  };

  const shouldRenderSection = (section: typeof downloadSection) =>
    downloadSection === 'full-report' || downloadSection === section;

  const ReportHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
    <div className="report-statement-header hidden print:block">
      <div className="report-company">
        <div>{company.name}</div>
        <div>CIN: {company.cin}</div>
        <div>{company.address}</div>
      </div>
      <div className="report-title">{title}</div>
      <div className="report-subtitle">{subtitle}</div>
      <div className="report-unit-note">(All amounts are stated in {unitLabel} unless otherwise stated)</div>
    </div>
  );

  const ReportSignatures = () => {
    if (!company.settings.formatting.showSignatureBlocks || company.settings.formatting.signatureBlocks.length === 0) {
      return null;
    }

    return (
      <div className="report-footer-signature hidden print:block">
        <div className="report-signatures-grid">
          {company.settings.formatting.signatureBlocks.map((signature) => (
            <div key={signature.id} className="report-signature">
              <div className="line"></div>
              <div className="text-[10px] font-semibold">{signature.title}</div>
              <div className="text-[10px]">{signature.name}</div>
              <div className="text-[9px] text-gray-600">{signature.designation}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 print:bg-white print:py-0 print:min-h-0 print:block">
      {/* Action Buttons - Hidden in print */}
      <div className="w-full max-w-[210mm] flex justify-end gap-3 mb-6 print:hidden no-print">
        <button
          onClick={handleExportWord}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <FileText size={18} />
          <span className="font-medium">Download Word</span>
        </button>
        <button
          onClick={() => setIsDownloadOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <FileDown size={18} />
          <span className="font-medium">Download PDF</span>
        </button>
      </div>

      {isDownloadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 print:hidden">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Download PDF</h3>
                <p className="text-sm text-slate-500">Choose a section to export</p>
              </div>
              <button
                onClick={() => setIsDownloadOpen(false)}
                className="rounded-full p-2 hover:bg-slate-100 text-slate-500"
                type="button"
              >
                ✕
              </button>
            </div>
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs text-emerald-700">
                <span>Template: {templateFormat}</span>
                <span>Applies to PDF output</span>
              </div>
            </div>
            <div className="px-6 py-5 space-y-3">
              {([
                { id: 'full-report', label: 'Full Report', icon: <FileText size={16} />, description: 'Complete financial statements' },
                { id: 'balance-sheet', label: 'Balance Sheet', icon: <Sheet size={16} />, description: 'Assets, liabilities, and equity' },
                { id: 'profit-loss', label: 'Profit & Loss', icon: <BarChart3 size={16} />, description: 'Income and expenses statement' },
                { id: 'changes-in-equity', label: 'Changes in Equity', icon: <Layers size={16} />, description: 'Movements in equity' },
                { id: 'cash-flow', label: 'Cash Flow', icon: <Waves size={16} />, description: 'Cash flow statement' },
                { id: 'notes', label: 'Notes', icon: <StickyNote size={16} />, description: 'Notes to accounts' }
              ] as const).map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.id === 'full-report' ? (setDownloadSection('full-report'), setIsDownloadOpen(false), setTimeout(() => handlePrint(), 50)) : handleDownloadPdf(item.id)}
                  className="w-full flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                  type="button"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-6 pb-5">
              <button
                onClick={() => setIsDownloadOpen(false)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Dashboard - Only visible in Edit Mode */}
      {viewMode === 'edit' && (
        <div className="w-full max-w-[210mm] mb-6 print:hidden no-print">
          <ValidationDashboard company={company} />
        </div>
      )}

      {/* Main Report Content */}
      <div
        id="full-report-content"
        className={`bg-white shadow-2xl print:shadow-none print:w-full print:max-w-none mx-auto transition-all duration-300 rounded-2xl print:rounded-none overflow-hidden ${paperClass}`}
        style={{ fontFamily: fontStyle, fontSize: `${fontSize}px` }}
      >
        {/* Cover Page with Company Details - Combined on first page, only visible in print */}
        {downloadSection === 'full-report' && (
          <div className="hidden print:block cover-page">
            <div className="cover-hero">
              <div className="cover-hero-content">
                <div className="cover-logo-row">
                  {logo ? (
                    <img
                      src={logo}
                      alt={`${company.name} Logo`}
                      className="cover-logo"
                    />
                  ) : (
                    <div className="cover-logo-placeholder">Company Logo</div>
                  )}
                </div>
                <h1 className="cover-title">{company.name}</h1>
                <div className="cover-subtitle">Financial Statements</div>
                <div className="cover-year">For the year ended {company.yearEnd}</div>
                <div className="cover-badges">
                  <span className="cover-badge">CIN: {company.cin}</span>
                  <span className="cover-badge">PAN: {company.pan}</span>
                </div>
              </div>
              <div className="cover-hero-accent">
                <div className="cover-card cover-card-primary"></div>
                <div className="cover-card cover-card-secondary"></div>
                <div className="cover-card cover-card-tertiary"></div>
              </div>
            </div>

            <div className="cover-details">
              <div className="cover-details-grid">
                <div className="cover-detail-card">
                  <div className="cover-detail-label">Registered Office</div>
                  <div className="cover-detail-value">{company.address}</div>
                </div>
                <div className="cover-detail-card">
                  <div className="cover-detail-label">Sector</div>
                  <div className="cover-detail-value">{company.sector} - {company.specifications}</div>
                </div>
                <div className="cover-detail-card">
                  <div className="cover-detail-label">Financial Year</div>
                  <div className="cover-detail-value">{company.financialYear}</div>
                </div>
                <div className="cover-detail-card">
                  <div className="cover-detail-label">Prepared For</div>
                  <div className="cover-detail-value">{company.name}</div>
                </div>
              </div>
              <div className="cover-footer-note">
                This report is generated from the financial statements module.
              </div>
            </div>
          </div>
        )}

        {/* Screen Header - Only visible on screen - Completely hidden in print */}
        <section className="text-center space-y-8 bg-gradient-to-r from-gray-50 to-white py-12 px-8 print:hidden no-print" style={{ display: 'none' }}>
          {logo && (
            <div className="flex justify-center mb-6">
              <img
                src={logo}
                alt={`${company.name} logo`}
                className="max-h-28 object-contain drop-shadow-sm"
              />
            </div>
          )}
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-gray-100 rounded-full">
              <p className="uppercase tracking-widest text-xs font-semibold text-gray-600">Financial Statements</p>
            </div>
            <h2 className="text-5xl font-bold tracking-tight" style={{ color: primaryColor }}>
              {company.name}
            </h2>
          </div>
          <div className="text-gray-600 leading-relaxed space-y-2 max-w-2xl mx-auto">
            <p className="text-lg">{company.address}</p>
            <div className="flex justify-center gap-6 text-sm">
              <span className="px-3 py-1 bg-white rounded-lg shadow-sm">CIN: {company.cin}</span>
              <span className="px-3 py-1 bg-white rounded-lg shadow-sm">PAN: {company.pan}</span>
            </div>
            <p className="text-base font-medium">{company.sector} - {company.specifications}</p>
            <p className="text-sm">Financial Year: {company.financialYear}</p>
            <p className="text-lg font-semibold" style={{ color: secondaryColor }}>For the year ended {company.yearEnd}</p>
          </div>
        </section>

        {/* Balance Sheet Section */}
        {shouldRenderSection('balance-sheet') && (
        <section
          className={`professional-balance-sheet page-break-after ${
            downloadSection === 'full-report' ? 'report-first-section' : ''
          }`}
        >
          <div className="px-8 print:px-0">
            <ReportHeader title="Standalone Balance Sheet" subtitle={`As at 31 March, ${company.yearEnd}`} />
            <BalanceSheet company={company} modeOverride="report" />
            <ReportSignatures />
          </div>
        </section>
        )}

        {/* Profit & Loss Section */}
        {shouldRenderSection('profit-loss') && (
        <section className="page-break-after">
          <div className="px-8 print:px-4">
            <ReportHeader title="Statement of Profit & Loss" subtitle={`For the year ended ${company.yearEnd}`} />
            <ProfitLoss company={company} modeOverride="report" />
            <ReportSignatures />
          </div>
        </section>
        )}

        {/* Changes in Equity Section */}
        {shouldRenderSection('changes-in-equity') && (
        <section className="page-break-after">
          <div className="px-8 print:px-4">
            <ReportHeader title="Statement of Changes in Equity" subtitle={`For the year ended ${company.yearEnd}`} />
            <ChangesInEquity company={company} modeOverride="report" />
            <ReportSignatures />
          </div>
        </section>
        )}

        {/* Cash Flow Section */}
        {shouldRenderSection('cash-flow') && (
        <section className="page-break-after">
          <div className="px-8 print:px-4">
            <ReportHeader title="Cash Flow Statement" subtitle={`For the year ended ${company.yearEnd}`} />
            <CashFlow company={company} modeOverride="report" />
            <ReportSignatures />
          </div>
        </section>
        )}

        {/* Notes Section */}
        {shouldRenderSection('notes') && (
        <section className="page-break-before">
          <ReportHeader title="Notes to Financial Statements" subtitle={`For the year ended ${company.yearEnd}`} />
          <div className="px-8 print:px-4">
            <Notes company={company} modeOverride="report" />
          </div>
        </section>
        )}
        {/* Footer */}
        <footer className="text-center text-xs text-gray-500 mt-20 print:mt-8 py-8 bg-gray-50 border-t border-gray-100 print:bg-white print:border-t print:border-gray-300 print:py-4">
          <div className="max-w-2xl mx-auto space-y-2 print:space-y-1">
            <p className="font-medium">This report was generated on {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p className="text-gray-400 print:text-gray-600">Figures are auto-synced with Balance Sheet, Profit & Loss, Cash Flow, and Notes modules.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SeamlessFullReport;
