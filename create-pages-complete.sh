#!/bin/bash

echo "📄 Creating all page files..."

# LoginPage
cat > src/pages/LoginPage.tsx << 'EOF'
import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Building2 size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Financial Statements</h1>
          <p className="text-gray-600 mt-2">Multi-Company System</p>
        </div>
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && login(email, password)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && login(email, password)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Password"
          />
          <button
            onClick={() => login(email, password)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">Demo: Any email/password works</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
EOF

echo "✅ LoginPage.tsx"

# DashboardPage
cat > src/pages/DashboardPage.tsx << 'EOF'
import React from 'react';
import { Building2, LogOut, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CompanyCard from '../components/CompanyCard';

const DashboardPage: React.FC = () => {
  const { currentUser, companies, logout, setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Building2 size={28} className="text-blue-600" />
            <div>
              <h1 className="text-xl font-bold">Financial Statements System</h1>
              <p className="text-sm text-gray-600">{currentUser?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Companies</h2>
          <button onClick={() => setCurrentView('add-company')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus size={20} />
            Add Company
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
EOF

echo "✅ DashboardPage.tsx"

# AddCompanyPage - abbreviated for space
cat > src/pages/AddCompanyPage.tsx << 'EOF'
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Company } from '../types';

const AddCompanyPage: React.FC = () => {
  const { companies, addCompany, setCurrentView } = useApp();
  const [formData, setFormData] = useState({
    name: '', industry: '', pan: '', cin: '', yearEnd: '2024-25', prevYearEnd: '2023-24'
  });

  const createBlankCompany = (): Company => ({
    id: companies.length + 1,
    ...formData,
    balanceSheet: {
      equity: {
        shareCapital: { current: 0, previous: 0, note: '1' },
        otherEquity: { current: 0, previous: 0, note: '2' }
      },
      liabilities: {
        nonCurrent: {
          borrowings: { current: 0, previous: 0, note: '3' },
          provisions: { current: 0, previous: 0, note: '4' },
          deferredTax: { current: 0, previous: 0, note: '5' }
        },
        current: {
          borrowings: { current: 0, previous: 0, note: '6' },
          tradePayables: { current: 0, previous: 0, note: '7' },
          otherCurrentLiabilities: { current: 0, previous: 0, note: '8' },
          provisions: { current: 0, previous: 0, note: '9' }
        }
      },
      assets: {
        nonCurrent: {
          ppe: { current: 0, previous: 0, note: '10' },
          cwip: { current: 0, previous: 0, note: '11' },
          investments: { current: 0, previous: 0, note: '12' },
          otherNonCurrent: { current: 0, previous: 0, note: '13' }
        },
        current: {
          inventories: { current: 0, previous: 0, note: '14' },
          tradeReceivables: { current: 0, previous: 0, note: '15' },
          cashAndEquivalents: { current: 0, previous: 0, note: '16' },
          otherCurrentAssets: { current: 0, previous: 0, note: '17' }
        }
      }
    },
    profitLoss: {
      revenue: {
        operations: { current: 0, previous: 0, note: '18' },
        other: { current: 0, previous: 0, note: '19' }
      },
      expenses: {
        materialCost: { current: 0, previous: 0, note: '20' },
        employeeBenefit: { current: 0, previous: 0, note: '21' },
        finance: { current: 0, previous: 0, note: '22' },
        depreciation: { current: 0, previous: 0, note: '23' },
        other: { current: 0, previous: 0, note: '24' }
      },
      tax: {
        current: { current: 0, previous: 0 },
        deferred: { current: 0, previous: 0 }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Add New Company</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Company Name"
          />
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Industry"
          />
          <button
            onClick={() => { addCompany(createBlankCompany()); setCurrentView('dashboard'); }}
            disabled={!formData.name}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            Create Company
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyPage;
EOF

echo "✅ AddCompanyPage.tsx"

# CompanyDetailPage
cat > src/pages/CompanyDetailPage.tsx << 'EOF'
import React from 'react';
import { ArrowLeft, LogOut, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import BalanceSheet from '../components/BalanceSheet';
import ProfitLoss from '../components/ProfitLoss';
import CashFlow from '../components/CashFlow';
import Notes from '../components/Notes';

const CompanyDetailPage: React.FC = () => {
  const { selectedCompanyId, getCompanyById, setCurrentView, setSelectedCompanyId, logout, activeTab, setActiveTab, viewMode, setViewMode } = useApp();
  const company = selectedCompanyId ? getCompanyById(selectedCompanyId) : null;

  if (!company) return <div>Company not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => { setCurrentView('dashboard'); setSelectedCompanyId(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold">{company.name}</h1>
              <p className="text-sm text-gray-600">{company.industry}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            {['balance-sheet', 'profit-loss', 'cash-flow', 'notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 px-4 py-3 font-medium ${activeTab === tab ? 'bg-blue-50 border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
          {(activeTab === 'balance-sheet' || activeTab === 'profit-loss') && (
            <div className="p-4 bg-gray-50 border-b flex justify-end">
              <button onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')} className={`px-4 py-2 rounded flex items-center gap-2 ${viewMode === 'preview' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                <Eye size={16} />
                {viewMode === 'edit' ? 'Preview' : 'Edit'}
              </button>
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'balance-sheet' && <BalanceSheet company={company} />}
          {activeTab === 'profit-loss' && <ProfitLoss company={company} />}
          {activeTab === 'cash-flow' && <CashFlow company={company} />}
          {activeTab === 'notes' && <Notes company={company} />}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
EOF

echo "✅ CompanyDetailPage.tsx"

echo "🎉 All pages created!"

