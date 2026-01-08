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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{company.name}</h3>
          <p className="text-sm text-gray-600">{company.sector} - {company.specifications}</p>
          <p className="text-xs text-gray-500 mt-1">{company.address}</p>
          <p className="text-xs text-gray-500">CIN: {company.cin}</p>
        </div>
        <button onClick={() => window.confirm('Delete?') && deleteCompany(company.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
          <Trash2 size={18} />
        </button>
      </div>
      <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Assets:</span>
              <span className="font-bold text-blue-600">{formatValue(totals.totalAssets)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">PAT:</span>
              <span className="font-bold text-green-600">{formatValue(plTotals.profitForThePeriod)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">{unitLabel}</div>
      </div>
      <button
        onClick={() => { setSelectedCompanyId(company.id); setCurrentView('company-detail'); setActiveTab('balance-sheet'); }}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        View Statements
      </button>
    </div>
  );
};

export default CompanyCard;
