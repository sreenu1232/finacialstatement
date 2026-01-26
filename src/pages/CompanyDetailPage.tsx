import React from 'react';
import { ArrowLeft, LogOut, Eye, Edit3, FileSpreadsheet, TrendingUp, DollarSign, FileText, BookOpen } from 'lucide-react';
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

  const tabs = [
    { key: 'balance-sheet', label: 'Balance Sheet', icon: FileSpreadsheet },
    { key: 'profit-loss', label: 'Profit & Loss', icon: TrendingUp },
    { key: 'cash-flow', label: 'Cash Flow', icon: DollarSign },
    { key: 'notes', label: 'Notes', icon: FileText },
    { key: 'full-report', label: 'Full Report', icon: BookOpen }
  ];

  const showPreviewToggle = activeTab === 'balance-sheet' || activeTab === 'profit-loss' || activeTab === 'full-report';

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden print:h-auto print:overflow-visible print:bg-white print:block">
      {/* Masters Sidebar - Hidden in print */}
      <div className="print:hidden">
        <MastersSidebar company={company} onSettingsUpdate={handleSettingsUpdate} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 print:block">
        {/* Header - Hidden in print */}
        <header className="bg-white border-b border-slate-200 shrink-0 print:hidden">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            {/* Left: Back + Company Info */}
            <div className="flex items-center gap-4 min-w-0">
              <button 
                onClick={() => { setCurrentView('dashboard'); setSelectedCompanyId(null); }} 
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                title="Back to Dashboard"
              >
                <ArrowLeft size={20} className="text-slate-600" />
              </button>
              
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-slate-900 truncate">{company.name}</h1>
                <p className="text-sm text-slate-500 truncate">{company.sector} · {company.specifications}</p>
              </div>

              <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 shrink-0">
                <span className="px-2 py-1 bg-slate-100 rounded font-mono">CIN: {company.cin}</span>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-semibold">FY: {company.financialYear}</span>
              </div>
            </div>

            {/* Right: Logout */}
            <button 
              onClick={logout} 
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm shrink-0"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Tabs Navigation - Hidden in print */}
        <div className="bg-white border-b border-slate-200 shrink-0 print:hidden">
          <div className="px-6 flex items-center justify-between">
            <nav className="flex items-center gap-1 -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`
                      flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all
                      ${isActive 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }
                    `}
                  >
                    <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Preview Toggle */}
            {showPreviewToggle && (
              <button 
                onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')} 
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${viewMode === 'preview' 
                    ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }
                `}
              >
                {viewMode === 'edit' ? (
                  <>
                    <Eye size={16} />
                    <span className="hidden sm:inline">Preview</span>
                  </>
                ) : (
                  <>
                    <Edit3 size={16} />
                    <span className="hidden sm:inline">Edit</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto print:overflow-visible">
          <div className="p-6 print:p-0">
            {activeTab === 'full-report' ? (
              <SeamlessFullReport company={company} />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 print:shadow-none print:border-0 print:rounded-none">
                {activeTab === 'balance-sheet' && <BalanceSheet company={company} />}
                {activeTab === 'profit-loss' && <ProfitLoss company={company} />}
                {activeTab === 'cash-flow' && <CashFlow company={company} />}
                {activeTab === 'notes' && <Notes company={company} />}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
