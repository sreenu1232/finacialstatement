import React from 'react';
import { Trash2 } from 'lucide-react';
import { Company } from '../types';
import { useApp } from '../context/AppContext';
import { formatINR, calculateBSTotal, calculatePLTotal, getUnitLabel } from '../utils/formatters';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const { deleteCompany, setSelectedCompanyId, setCurrentView, setActiveTab } = useApp();
  const totals = calculateBSTotal(company.balanceSheet);
  const plTotals = calculatePLTotal(company.profitLoss);
  const { unitOfMeasurement, decimalPoints } = company.settings.formatting;
  
  const formatValue = (value: number) => formatINR(value, unitOfMeasurement, decimalPoints);
  const unitLabel = getUnitLabel(unitOfMeasurement);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{company.name}</h3>
          <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mb-3">{company.sector}</p>
          <p className="text-sm text-gray-600 mb-1">{company.specifications}</p>
          <p className="text-xs text-gray-500 mb-1">{company.address}</p>
          <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">CIN: {company.cin}</p>
        </div>
        <button 
          onClick={() => window.confirm('Are you sure you want to delete this company?') && deleteCompany(company.id)} 
          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200 ml-4"
          title="Delete Company"
        >
          <Trash2 size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Total Assets</p>
          <p className="text-lg font-bold text-blue-900">{formatValue(totals.totalAssets)}</p>
          <p className="text-xs text-blue-600 mt-1">{unitLabel}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Profit After Tax</p>
          <p className="text-lg font-bold text-green-900">{formatValue(plTotals.profitForThePeriod)}</p>
          <p className="text-xs text-green-600 mt-1">{unitLabel}</p>
        </div>
      </div>
      
      <button
        onClick={() => { setSelectedCompanyId(company.id); setCurrentView('company-detail'); setActiveTab('balance-sheet'); }}
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
      >
        View Financial Statements
      </button>
    </div>
  );
};

export default CompanyCard;
