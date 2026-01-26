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
    // Create comprehensive print styles
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.textContent = `
      @page {
        size: A4;
        margin: 15mm 15mm 20mm 15mm;
      }
      
      @media print {
        /* Reset everything */
        * {
          box-sizing: border-box;
        }
        
        html, body {
          width: 210mm;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Hide all non-print elements */
        .no-print,
        .print\\:hidden,
        button:not(.print-show),
        input,
        select,
        textarea,
        nav,
        header:not(.print-header),
        [class*="sidebar"],
        [class*="Sidebar"] {
          display: none !important;
        }
        
        /* Report container */
        #full-report-content {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          background: white !important;
        }
        
        /* Cover page styles */
        .cover-page {
          page-break-after: always;
          min-height: 100vh;
          display: flex !important;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%) !important;
          color: white !important;
          text-align: center;
          padding: 40mm 20mm;
        }
        
        .cover-page h1 {
          font-size: 32pt !important;
          font-weight: bold !important;
          margin-bottom: 10mm !important;
          color: white !important;
        }
        
        .cover-page p {
          font-size: 14pt !important;
          color: rgba(255,255,255,0.9) !important;
        }

        /* Section headers */
        .section-header {
          display: block !important;
          background: #f8fafc !important;
          border-left: 4px solid #2563eb !important;
          padding: 12pt 16pt !important;
          margin-bottom: 16pt !important;
          page-break-after: avoid;
          page-break-inside: avoid;
        }

        .section-header .section-title {
          font-size: 16pt !important;
          font-weight: bold !important;
          color: #1e293b !important;
          margin: 0 0 4pt 0 !important;
          text-transform: uppercase;
          letter-spacing: 0.5pt;
        }

        .section-header .section-subtitle {
          font-size: 10pt !important;
          color: #64748b !important;
          margin: 0 !important;
        }

        /* Section spacing */
        section {
          page-break-inside: avoid;
          margin-bottom: 0 !important;
        }
        
        .page-break-after {
          page-break-after: always !important;
        }

        /* Tables */
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: 9pt !important;
          page-break-inside: auto;
        }
        
        thead {
          display: table-header-group;
        }
        
        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
        
        th, td {
          padding: 6pt 8pt !important;
          border: 0.5pt solid #d1d5db !important;
          text-align: left;
        }
        
        th {
          background: #f1f5f9 !important;
          font-weight: 600 !important;
        }
        
        /* Text alignment */
        .text-right, td.text-right, th.text-right {
          text-align: right !important;
        }
        
        .text-center, td.text-center, th.text-center {
          text-align: center !important;
        }

        /* Font sizes */
        .text-sm {
          font-size: 9pt !important;
        }
        
        .text-xs {
          font-size: 8pt !important;
        }

        /* Headings */
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid;
          page-break-inside: avoid;
        }

        /* Footer */
        footer {
          page-break-inside: avoid;
          margin-top: 20pt !important;
          padding: 12pt !important;
          border-top: 1pt solid #e5e7eb !important;
          background: white !important;
          font-size: 8pt !important;
          color: #6b7280 !important;
        }

        /* Remove shadows and gradients */
        .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl, .shadow-2xl {
          box-shadow: none !important;
        }

        /* Ensure colors print */
        .bg-blue-50, .bg-blue-100 {
          background-color: #eff6ff !important;
        }
        
        .bg-gray-50 {
          background-color: #f9fafb !important;
        }
        
        /* Notes section */
        .space-y-4 > * + * {
          margin-top: 12pt !important;
        }

        /* Hide interactive elements */
        [contenteditable="true"] {
          border: none !important;
          outline: none !important;
        }
      }
    `;
    
    // Remove existing print styles if any
    const existingStyle = document.getElementById('print-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
    
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
    }, 2000);
  };

  const handleExportWord = () => {
    exportToWord('full-report-content', `${company.name}_Financial_Statements`);
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
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Printer size={18} />
          <span className="font-medium">Print / PDF</span>
        </button>
      </div>

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
        {/* Cover Page - Only visible in print */}
        <div className="cover-page hidden print:flex print:flex-col print:justify-center print:items-center">
          {logo && (
            <img
              src={logo}
              alt={`${company.name} Logo`}
              className="max-w-[200px] max-h-[100px] mb-8 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          )}
          <h1 className="text-4xl font-bold mb-4 text-white">{company.name}</h1>
          <p className="text-2xl mb-8 text-white opacity-90">Financial Statements</p>
          <div className="text-center space-y-2 text-white">
            <p className="text-lg">For the year ended {company.yearEnd}</p>
            <p className="text-sm opacity-80">{company.financialYear}</p>
          </div>
        </div>

        {/* Screen Header - Only visible on screen */}
        <section className="text-center space-y-8 bg-gradient-to-r from-gray-50 to-white py-12 px-8 print:hidden no-print">
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
        <section className="page-break-after">
          <div className="section-header hidden print:block">
            <h3 className="section-title">Balance Sheet</h3>
            <p className="section-subtitle">As at {company.yearEnd}</p>
          </div>
          <div className="px-8 print:px-4">
            <BalanceSheet company={company} modeOverride="report" />
          </div>
        </section>

        {/* Profit & Loss Section */}
        <section className="page-break-after">
          <div className="section-header hidden print:block">
            <h3 className="section-title">Statement of Profit & Loss</h3>
            <p className="section-subtitle">For the year ended {company.yearEnd}</p>
          </div>
          <div className="px-8 print:px-4">
            <ProfitLoss company={company} modeOverride="report" />
          </div>
        </section>

        {/* Cash Flow Section */}
        <section className="page-break-after">
          <div className="section-header hidden print:block">
            <h3 className="section-title">Cash Flow Statement</h3>
            <p className="section-subtitle">For the year ended {company.yearEnd}</p>
          </div>
          <div className="px-8 print:px-4">
            <CashFlow company={company} modeOverride="report" />
          </div>
        </section>

        {/* Notes Section */}
        <section>
          <div className="section-header hidden print:block">
            <h3 className="section-title">Notes to Financial Statements</h3>
            <p className="section-subtitle">For the year ended {company.yearEnd}</p>
          </div>
          <div className="px-8 print:px-4">
            <Notes company={company} modeOverride="report" />
          </div>
        </section>

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
