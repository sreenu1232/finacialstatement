import React from 'react';
import { Building2, LogOut, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CompanyCard from '../components/CompanyCard';

const DashboardPage: React.FC = () => {
  const { currentUser, companies, logout, setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Statements System</h1>
              <p className="text-sm text-gray-600 font-medium">{currentUser?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 px-5 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Companies</h2>
            <p className="text-gray-600">Manage and view financial statements for your organizations</p>
          </div>
          <button 
            onClick={() => setCurrentView('add-company')} 
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
          >
            <Plus size={20} />
            Add Company
          </button>
        </div>
        
        {companies.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies yet</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first company to create financial statements.</p>
              <button 
                onClick={() => setCurrentView('add-company')} 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <Plus size={20} />
                Add Your First Company
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
