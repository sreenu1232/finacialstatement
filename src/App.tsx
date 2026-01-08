import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddCompanyPage from './pages/AddCompanyPage';
import CompanyDetailPage from './pages/CompanyDetailPage';

const AppContent: React.FC = () => {
  const { isLoggedIn, currentView } = useApp();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  switch (currentView) {
    case 'dashboard':
      return <DashboardPage />;
    case 'add-company':
      return <AddCompanyPage />;
    case 'company-detail':
      return <CompanyDetailPage />;
    default:
      return <DashboardPage />;
  }
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
