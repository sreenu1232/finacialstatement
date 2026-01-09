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
    window.print();
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
        <section className="text-center space-y-8 page-break-after bg-gradient-to-r from-gray-50 to-white py-12 px-8">
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

        <footer className="text-center text-xs text-gray-500 mt-20 print:mt-12 py-8 bg-gray-50 border-t border-gray-100">
          <div className="max-w-2xl mx-auto space-y-2">
            <p className="font-medium">This report was generated on {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p className="text-gray-400">Figures are auto-synced with Balance Sheet, Profit & Loss, Cash Flow, and Notes modules.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SeamlessFullReport;
