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
