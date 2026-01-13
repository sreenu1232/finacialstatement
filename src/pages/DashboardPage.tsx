import React from 'react';
import { Building2, LogOut, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CompanyCard from '../components/CompanyCard';

const DashboardPage: React.FC = () => {
  const { currentUser, companies, logout, setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50">
      <div className="bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-xl ring-4 ring-blue-500/20">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Financial Statements System</h1>
              <p className="text-sm text-gray-600 font-medium mt-0.5">{currentUser?.email}</p>
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
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Your Companies</h2>
            <p className="text-gray-600 text-sm">Manage and view financial statements for your organizations</p>
          </div>
          <button 
            onClick={() => setCurrentView('add-company')} 
            className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] font-medium ring-4 ring-blue-500/20 hover:ring-blue-500/30"
          >
            <Plus size={20} />
            Add Company
          </button>
        </div>
        
        {companies.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-blue-50">
                <Building2 size={40} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">No companies yet</h3>
              <p className="text-gray-600 mb-8 text-sm">Get started by adding your first company to create financial statements.</p>
              <button 
                onClick={() => setCurrentView('add-company')} 
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] font-medium ring-4 ring-blue-500/20 hover:ring-blue-500/30"
              >
                <Plus size={20} />
                Add Your First Company
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
