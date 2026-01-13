import React from 'react';
import { ArrowLeft, LogOut, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import BalanceSheet from '../components/BalanceSheet';
import ProfitLoss from '../components/ProfitLoss';
import CashFlow from '../components/CashFlow';
import Notes from '../components/Notes';
import SeamlessFullReport from '../components/SeamlessFullReport';
import MastersSidebar from '../components/MastersSidebar';

const CompanyDetailPage: React.FC = () => {
  const { selectedCompanyId, getCompanyById, setCurrentView, setSelectedCompanyId, logout, activeTab, setActiveTab, viewMode, setViewMode, updateCompany } = useApp();
  const company = selectedCompanyId ? getCompanyById(selectedCompanyId) : null;

  const handleSettingsUpdate = (settings: { template: any; formatting: any }) => {
    if (company) {
      updateCompany(company.id, { settings });
    }
  };

  if (!company) return <div>Company not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 flex">
      {/* Masters Sidebar */}
      <MastersSidebar company={company} onSettingsUpdate={handleSettingsUpdate} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100/50 sticky top-0 z-10">
          <div className="px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => { setCurrentView('dashboard'); setSelectedCompanyId(null); }} 
                className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-200"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{company.name}</h1>
                <p className="text-sm text-gray-600 font-medium mt-0.5">{company.sector} - {company.specifications}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{company.address}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-600 font-mono bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">CIN: {company.cin}</span>
                  <span className="text-xs text-gray-600 font-mono bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">FY: {company.financialYear}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 px-5 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-red-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-xl mb-8 border border-gray-100/50 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {[
                  { key: 'balance-sheet', label: 'Balance Sheet', icon: '📊' },
                  { key: 'profit-loss', label: 'Profit & Loss', icon: '💰' },
                  { key: 'cash-flow', label: 'Cash Flow', icon: '💸' },
                  { key: 'notes', label: 'Notes', icon: '📝' },
                  { key: 'full-report', label: 'Full Report', icon: '📄' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-b-2 ${
                      activeTab === tab.key 
                        ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg border-transparent' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="tracking-wide">{tab.label}</span>
                  </button>
                ))}
              </div>

              {(activeTab === 'balance-sheet' || activeTab === 'profit-loss' || activeTab === 'full-report') && (
                <div className="p-6 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-gray-50/80 border-b border-gray-100 flex justify-end backdrop-blur-sm">
                  <button 
                    onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')} 
                    className={`px-6 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ring-4 ${
                      viewMode === 'preview' 
                        ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white ring-blue-500/20 hover:ring-blue-500/30' 
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 ring-transparent'
                    }`}
                  >
                    <Eye size={18} />
                    {viewMode === 'edit' ? 'Preview Mode' : 'Edit Mode'}
                  </button>
                </div>
              )}
            </div>

            {activeTab === 'full-report' ? (
              <SeamlessFullReport company={company} />
            ) : (
              <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-gray-100/50">
                {activeTab === 'balance-sheet' && <BalanceSheet company={company} />}
                {activeTab === 'profit-loss' && <ProfitLoss company={company} />}
                {activeTab === 'cash-flow' && <CashFlow company={company} />}
                {activeTab === 'notes' && <Notes company={company} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
