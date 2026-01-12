import React, { useState, useEffect } from 'react';
import { Printer, AlertTriangle, CheckCircle, XCircle, ChevronDown, FileText } from 'lucide-react';
import { Company } from '../types';
import { useApp } from '../context/AppContext';
import BalanceSheet from './BalanceSheet';
import ProfitLoss from './ProfitLoss';
import CashFlow from './CashFlow';
import Notes from './Notes';
import { runAllValidations, ValidationResult } from '../utils/validationHelpers';
import { exportToWord } from '../utils/exportHelpers';

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
  const { fontStyle, fontSize, primaryColor, secondaryColor, logo, paperSize } = company.settings.template;

  const paperClass = paperSize === 'A4' ? 'w-[210mm] min-h-[297mm] p-[20mm]' : 'w-full max-w-4xl p-8';

  const handlePrint = () => {
    // Hide any elements that shouldn't appear in print
    const style = document.createElement('style');
    style.textContent = `
      @page {
        size: A4;
        margin: 1.5cm 2cm 2cm 2cm;
      }
      @page :first {
        margin-top: 0;
      }
      body { margin: 0; }
      .no-print { display: none !important; }

      /* Professional print styles */
      .cover-page {
        page-break-after: always;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        padding: 2rem;
      }

      .cover-logo {
        max-width: 300px;
        max-height: 200px;
        margin-bottom: 2rem;
        filter: brightness(0) invert(1);
      }

      .cover-title {
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 1rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }

      .cover-subtitle {
        font-size: 1.5rem;
        margin-bottom: 2rem;
        opacity: 0.9;
      }

      .section-header {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-left: 4px solid #3b82f6;
        padding: 1.5rem 2rem;
        margin-bottom: 2rem;
        page-break-after: avoid;
      }

      .section-title {
        font-size: 2rem;
        font-weight: bold;
        color: #1e293b;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .section-subtitle {
        font-size: 1rem;
        color: #64748b;
        font-weight: 500;
      }

      .financial-statement {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
    `;
    document.head.appendChild(style);

    window.print();

    // Clean up
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  };

  const handleExportWord = () => {
    exportToWord('full-report-content', `${company.name}_Financial_Statements`);
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 print:bg-white print:py-0">
      <div className="w-full max-w-[210mm] flex justify-end gap-3 mb-6 print:hidden">
        <button
          onClick={handleExportWord}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <FileText size={18} />
          <span className="font-medium">Download Word</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Printer size={18} />
          <span className="font-medium">Print / PDF</span>
        </button>
      </div>

      {/* Validation Dashboard - Only visible in Edit Mode */}
      {viewMode === 'edit' && (
        <div className="w-full max-w-[210mm] mb-6 print:hidden">
          <ValidationDashboard company={company} />
        </div>
      )}

      <div
        id="full-report-content"
        className={`bg-white shadow-2xl print:shadow-none print:w-full mx-auto transition-all duration-300 rounded-2xl overflow-hidden ${paperClass}`}
        style={{ fontFamily: fontStyle, fontSize: `${fontSize}px` }}
      >
        {/* Cover Page - Only visible in print */}
        <div className="cover-page print:block hidden">
          {logo && (
            <img
              src={logo}
              alt={`${company.name} Logo`}
              className="cover-logo"
            />
          )}
          <h1 className="cover-title">{company.name}</h1>
          <p className="cover-subtitle">Financial Statements</p>
          <div className="text-center space-y-2">
            <p className="text-lg">For the year ended {company.yearEnd}</p>
            <p className="text-sm opacity-0.8">{company.financialYear}</p>
          </div>
        </div>

        {/* Company Header - Only visible in print after cover page */}
        <div className="print:block hidden bg-white p-8 border-b-2 border-gray-200">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight" style={{ color: primaryColor }}>
              {company.name}
            </h2>
            <div className="text-gray-600 space-y-2">
              <p className="text-lg">{company.address}</p>
              <div className="flex justify-center gap-6 text-sm">
                <span className="px-4 py-2 bg-gray-100 rounded-lg border">CIN: {company.cin}</span>
                <span className="px-4 py-2 bg-gray-100 rounded-lg border">PAN: {company.pan}</span>
              </div>
              <p className="text-base font-medium">{company.sector} - {company.specifications}</p>
              <p className="text-sm">Financial Year: {company.financialYear}</p>
              <p className="text-xl font-semibold" style={{ color: secondaryColor }}>For the year ended {company.yearEnd}</p>
            </div>
          </div>
        </div>

        {/* Screen Header - Only visible on screen */}
        <section className="text-center space-y-8 page-break-after bg-gradient-to-r from-gray-50 to-white py-12 px-8 print:hidden">
          {logo && (
            <div className="flex justify-center mb-6 print:mb-4">
              <img
                src={logo}
                alt={`${company.name} logo`}
                className="max-h-28 print:max-h-20 object-contain drop-shadow-sm"
              />
            </div>
          )}
          <div className="space-y-4 print:space-y-2">
            <div className="inline-block px-4 py-2 bg-gray-100 rounded-full print:bg-white print:border print:border-gray-300">
              <p className="uppercase tracking-widest text-xs font-semibold text-gray-600">Financial Statements</p>
            </div>
            <h2 className="text-5xl print:text-3xl font-bold tracking-tight" style={{ color: primaryColor }}>
              {company.name}
            </h2>
          </div>
          <div className="text-gray-600 leading-relaxed space-y-2 max-w-2xl mx-auto print:max-w-none print:space-y-1">
            <p className="text-lg print:text-base">{company.address}</p>
            <div className="flex justify-center gap-6 text-sm print:flex-col print:gap-2 print:items-center">
              <span className="px-3 py-1 bg-white rounded-lg shadow-sm print:bg-gray-50 print:shadow-none print:border print:border-gray-300">CIN: {company.cin}</span>
              <span className="px-3 py-1 bg-white rounded-lg shadow-sm print:bg-gray-50 print:shadow-none print:border print:border-gray-300">PAN: {company.pan}</span>
            </div>
            <p className="text-base print:text-sm font-medium">{company.sector} - {company.specifications}</p>
            <p className="text-sm print:text-xs">Financial Year: {company.financialYear}</p>
            <p className="text-lg print:text-base font-semibold" style={{ color: secondaryColor }}>For the year ended {company.yearEnd}</p>
          </div>
        </section>

        <section className="page-break-after print:mt-8">
          <div className="section-header print:block hidden">
            <h3 className="section-title">Balance Sheet</h3>
            <p className="section-subtitle">As at {company.yearEnd}</p>
          </div>
          <div className="px-8 print:px-6">
            <BalanceSheet company={company} modeOverride="report" />
          </div>
        </section>

        <section className="page-break-after print:mt-8">
          <div className="section-header print:block hidden">
            <h3 className="section-title">Profit & Loss Account</h3>
            <p className="section-subtitle">For the year ended {company.yearEnd}</p>
          </div>
          <div className="px-8 print:px-6">
            <ProfitLoss company={company} modeOverride="report" />
          </div>
        </section>

        <section className="page-break-after print:mt-8">
          <div className="section-header print:block hidden">
            <h3 className="section-title">Cash Flow Statement</h3>
            <p className="section-subtitle">For the year ended {company.yearEnd}</p>
          </div>
          <div className="px-8 print:px-6">
            <CashFlow company={company} modeOverride="report" />
          </div>
        </section>

        <section className="page-break-after print:mt-8">
          <div className="section-header print:block hidden">
            <h3 className="section-title">Notes to Accounts</h3>
            <p className="section-subtitle">For the year ended {company.yearEnd}</p>
          </div>
          <div className="px-8 print:px-6">
            <Notes company={company} modeOverride="report" />
          </div>
        </section>

        <footer className="text-center text-xs text-gray-500 mt-20 print:mt-12 py-8 bg-gray-50 border-t border-gray-100 print:bg-white print:border-t print:border-gray-300 print:py-4">
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
