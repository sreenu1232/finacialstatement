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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Masters Sidebar */}
      <MastersSidebar company={company} onSettingsUpdate={handleSettingsUpdate} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => { setCurrentView('dashboard'); setSelectedCompanyId(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold">{company.name}</h1>
                <p className="text-sm text-gray-600">{company.sector} - {company.specifications}</p>
                <p className="text-xs text-gray-500">{company.address}</p>
                <p className="text-xs text-gray-500">CIN: {company.cin} | FY: {company.financialYear}</p>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <div className="bg-white rounded-lg shadow-lg mb-6">
              <div className="flex border-b">
                {['balance-sheet', 'profit-loss', 'cash-flow', 'notes', 'full-report'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 px-4 py-3 font-medium ${activeTab === tab ? 'bg-blue-50 border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                  >
                    {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
              {(activeTab === 'balance-sheet' || activeTab === 'profit-loss' || activeTab === 'full-report') && (
                <div className="p-4 bg-gray-50 border-b flex justify-end">
                  <button onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')} className={`px-4 py-2 rounded flex items-center gap-2 ${viewMode === 'preview' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                    <Eye size={16} />
                    {viewMode === 'edit' ? 'Preview' : 'Edit'}
                  </button>
                </div>
              )}
            </div>
            {activeTab === 'full-report' ? (
              <SeamlessFullReport company={company} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
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
