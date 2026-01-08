#!/bin/bash

echo "🧩 Creating all component files..."

# CompanyCard
cat > src/components/CompanyCard.tsx << 'EOF'
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Company } from '../types';
import { useApp } from '../context/AppContext';
import { formatINR, calculateBSTotal, calculatePLTotal } from '../utils/formatters';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const { deleteCompany, setSelectedCompanyId, setCurrentView, setActiveTab } = useApp();
  const totals = calculateBSTotal(company.balanceSheet);
  const plTotals = calculatePLTotal(company.profitLoss);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{company.name}</h3>
          <p className="text-sm text-gray-600">{company.industry}</p>
        </div>
        <button onClick={() => window.confirm('Delete?') && deleteCompany(company.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
          <Trash2 size={18} />
        </button>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Assets:</span>
          <span className="font-bold text-blue-600">₹{formatINR(totals.totalAssets)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">PAT:</span>
          <span className="font-bold text-green-600">₹{formatINR(plTotals.pat)}</span>
        </div>
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
EOF

echo "✅ CompanyCard.tsx"

# BalanceSheet
cat > src/components/BalanceSheet.tsx << 'EOF'
import React from 'react';
import { Company } from '../types';
import { useApp } from '../context/AppContext';
import { formatINR, calculateBSTotal } from '../utils/formatters';

interface Props {
  company: Company;
}

const BalanceSheet: React.FC<Props> = ({ company }) => {
  const { viewMode, updateCompanyBS } = useApp();
  const totals = calculateBSTotal(company.balanceSheet);

  if (viewMode === 'preview') {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-6">{company.name} - Balance Sheet</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg">
            <p className="text-gray-600">Total Assets</p>
            <p className="text-3xl font-bold text-blue-600">₹{formatINR(totals.totalAssets)}</p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg">
            <p className="text-gray-600">Total Equity</p>
            <p className="text-3xl font-bold text-green-600">₹{formatINR(totals.equity)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Edit Balance Sheet</h3>
      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Item</th>
            <th className="border p-2 text-right">Current</th>
            <th className="border p-2 text-right">Previous</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Share Capital</td>
            <td className="border p-2">
              <input type="number" value={company.balanceSheet.equity.shareCapital.current} onChange={(e) => updateCompanyBS(company.id, 'equity.shareCapital.current', Number(e.target.value))} className="w-full px-2 py-1 border rounded text-right" />
            </td>
            <td className="border p-2 text-right">{formatINR(company.balanceSheet.equity.shareCapital.previous)}</td>
          </tr>
          <tr className="font-bold bg-blue-50">
            <td className="border p-2">Total Assets</td>
            <td className="border p-2 text-right">{formatINR(totals.totalAssets)}</td>
            <td className="border p-2 text-right">{formatINR(totals.totalAssetsPrev)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BalanceSheet;
EOF

echo "✅ BalanceSheet.tsx"

# ProfitLoss
cat > src/components/ProfitLoss.tsx << 'EOF'
import React from 'react';
import { Company } from '../types';
import { useApp } from '../context/AppContext';
import { formatINR, calculatePLTotal } from '../utils/formatters';

interface Props {
  company: Company;
}

const ProfitLoss: React.FC<Props> = ({ company }) => {
  const { viewMode, updateCompanyPL } = useApp();
  const totals = calculatePLTotal(company.profitLoss);

  if (viewMode === 'preview') {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-6">{company.name} - P&L</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg">
            <p className="text-gray-600">Revenue</p>
            <p className="text-2xl font-bold text-blue-600">₹{formatINR(totals.totalRevenue)}</p>
          </div>
          <div className="p-6 bg-orange-50 rounded-lg">
            <p className="text-gray-600">Expenses</p>
            <p className="text-2xl font-bold text-orange-600">₹{formatINR(totals.totalExpenses)}</p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg">
            <p className="text-gray-600">PAT</p>
            <p className="text-2xl font-bold text-green-600">₹{formatINR(totals.pat)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Edit Profit & Loss</h3>
      <table className="w-full border-collapse border text-sm">
        <tbody>
          <tr>
            <td className="border p-2">Revenue</td>
            <td className="border p-2">
              <input type="number" value={company.profitLoss.revenue.operations.current} onChange={(e) => updateCompanyPL(company.id, 'revenue.operations.current', Number(e.target.value))} className="w-full px-2 py-1 border rounded text-right" />
            </td>
          </tr>
          <tr className="font-bold bg-green-100">
            <td className="border p-2">PAT</td>
            <td className="border p-2 text-right">{formatINR(totals.pat)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProfitLoss;
EOF

echo "✅ ProfitLoss.tsx"

# CashFlow
cat > src/components/CashFlow.tsx << 'EOF'
import React from 'react';
import { Company } from '../types';

const CashFlow: React.FC<{ company: Company }> = ({ company }) => (
  <div className="text-center py-8">
    <h2 className="text-2xl font-bold">{company.name}</h2>
    <p className="mt-4 text-gray-500">Cash Flow coming soon...</p>
  </div>
);

export default CashFlow;
EOF

echo "✅ CashFlow.tsx"

# Notes
cat > src/components/Notes.tsx << 'EOF'
import React from 'react';
import { Company } from '../types';

const Notes: React.FC<{ company: Company }> = ({ company }) => (
  <div className="text-center py-8">
    <h2 className="text-2xl font-bold">{company.name}</h2>
    <p className="mt-4 text-gray-500">Notes coming soon...</p>
  </div>
);

export default Notes;
EOF

echo "✅ Notes.tsx"

echo "🎉 All components created!"

