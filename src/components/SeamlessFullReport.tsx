import React, { useState, useEffect } from 'react';
import { Printer, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';
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
    <div className={`mb-6 border rounded-lg ${statusColor} transition-all`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold text-lg">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-2">
          {results.map((result: ValidationResult) => (
            <div key={result.id} className={`flex items-start gap-2 p-2 rounded ${result.type === 'error' ? 'bg-red-100 text-red-800' : result.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              <div className="mt-1">
                {result.type === 'error' && <XCircle size={14} />}
                {result.type === 'warning' && <AlertTriangle size={14} />}
                {result.type === 'success' && <CheckCircle size={14} />}
              </div>
              <div>
                <p className="font-medium text-sm">{result.message}</p>
                {result.details && <p className="text-xs opacity-80">{result.details}</p>}
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
    window.print();
  };

  const handleExportWord = () => {
    exportToWord('full-report-content', `${company.name}_Financial_Statements`);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-8 print:bg-white print:py-0">
      <div className="w-full max-w-[210mm] flex justify-end gap-4 mb-4 print:hidden">
        <button
          onClick={handleExportWord}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FileText size={20} />
          Download Word
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
        >
          <Printer size={20} />
          Print / PDF
        </button>
      </div>

      {/* Validation Dashboard - Only visible in Edit Mode */}
      {viewMode === 'edit' && (
        <div className="w-full max-w-[210mm] mb-4 print:hidden">
          <ValidationDashboard company={company} />
        </div>
      )}

      <div
        id="full-report-content"
        className={`bg-white shadow-lg print:shadow-none print:w-full mx-auto transition-all duration-300 ${paperClass}`}
        style={{ fontFamily: fontStyle, fontSize: `${fontSize}px` }}
      >
        <section className="text-center space-y-6 page-break-after">
          {logo && (
            <img
              src={logo}
              alt={`${company.name} logo`}
              className="mx-auto max-h-24 object-contain"
            />
          )}
          <div>
            <p className="uppercase tracking-wide text-sm text-gray-500">Financial Statements</p>
            <h2 className="text-4xl font-bold" style={{ color: primaryColor }}>
              {company.name}
            </h2>
          </div>
          <div className="text-gray-600 leading-relaxed">
            <p>{company.address}</p>
            <p>CIN: {company.cin} · PAN: {company.pan}</p>
            <p>Sector: {company.sector} - {company.specifications}</p>
            <p>Financial Year: {company.financialYear}</p>
            <p style={{ color: secondaryColor }}>For the year ended {company.yearEnd}</p>
          </div>
        </section>

        <section className="page-break-after">
          <BalanceSheet company={company} />
        </section>

        <section className="page-break-after">
          <ProfitLoss company={company} />
        </section>

        <section className="page-break-after">
          <CashFlow company={company} />
        </section>

        <section className="page-break-after">
          <Notes company={company} />
        </section>

        <footer className="text-center text-xs text-gray-500 mt-16 print:mt-10">
          <p>This report was generated on {new Date().toLocaleDateString()}</p>
          <p>Figures are auto-synced with Balance Sheet, Profit & Loss, Cash Flow, and Notes modules.</p>
        </footer>
      </div>
    </div>
  );
};

export default SeamlessFullReport;
