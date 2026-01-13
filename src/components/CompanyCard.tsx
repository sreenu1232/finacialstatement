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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200/50 transform hover:-translate-y-1.5 group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">{company.name}</h3>
          <p className="text-xs font-semibold text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-full inline-block mb-3 border border-blue-100 tracking-wide">{company.sector}</p>
          <p className="text-sm text-gray-600 mb-2 leading-relaxed">{company.specifications}</p>
          <p className="text-xs text-gray-500 mb-2 leading-relaxed">{company.address}</p>
          <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">{company.cin}</p>
        </div>
        <button 
          onClick={() => window.confirm('Are you sure you want to delete this company?') && deleteCompany(company.id)} 
          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-300 ml-4 border border-transparent hover:border-red-200"
          title="Delete Company"
        >
          <Trash2 size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 via-blue-50/80 to-indigo-50 p-5 rounded-xl border border-blue-200/50 shadow-sm">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Total Assets</p>
          <p className="text-xl font-bold text-blue-900 mb-1">{formatValue(totals.totalAssets)}</p>
          <p className="text-xs text-blue-600 font-medium">{unitLabel}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 via-emerald-50/80 to-green-50 p-5 rounded-xl border border-green-200/50 shadow-sm">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Profit After Tax</p>
          <p className="text-xl font-bold text-green-900 mb-1">{formatValue(plTotals.profitForThePeriod)}</p>
          <p className="text-xs text-green-600 font-medium">{unitLabel}</p>
        </div>
      </div>
      
      <button
        onClick={() => { setSelectedCompanyId(company.id); setCurrentView('company-detail'); setActiveTab('balance-sheet'); }}
        className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold ring-4 ring-blue-500/20 hover:ring-blue-500/30 group-hover:shadow-2xl"
      >
        View Financial Statements
      </button>
    </div>
  );
};

export default CompanyCard;
