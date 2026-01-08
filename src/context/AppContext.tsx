import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Company, User, ViewType, TabType, ViewMode } from '../types';
import { sampleCompanies } from '../data/sampleData';

interface AppContextType {
  isLoggedIn: boolean;
  currentUser: User | null;
  companies: Company[];
  currentView: ViewType;
  selectedCompanyId: number | null;
  activeTab: TabType;
  viewMode: ViewMode;
  login: (email: string, password: string) => void;
  logout: () => void;
  setCurrentView: (view: ViewType) => void;
  setSelectedCompanyId: (id: number | null) => void;
  setActiveTab: (tab: TabType) => void;
  setViewMode: (mode: ViewMode) => void;
  addCompany: (company: Company) => void;
  deleteCompany: (id: number) => void;
  updateCompany: (companyId: number, updates: Partial<Company>) => void;
  updateCompanyBS: (companyId: number, field: string, value: any) => void;
  updateCompanyPL: (companyId: number, field: string, value: any) => void;
  updateCompanyCF: (companyId: number, field: string, value: any) => void;
  getCompanyById: (id: number) => Company | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>(sampleCompanies);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('balance-sheet');
  const [viewMode, setViewMode] = useState<ViewMode>('edit');

  const login = (email: string, password: string) => {
    if (email && password) {
      setCurrentUser({ email, name: 'User' });
      setIsLoggedIn(true);
      setCurrentView('dashboard');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
    setSelectedCompanyId(null);
  };

  const addCompany = (company: Company) => {
    setCompanies([...companies, company]);
  };

  const deleteCompany = (id: number) => {
    setCompanies(companies.filter((c) => c.id !== id));
  };

  const updateCompany = (companyId: number, updates: Partial<Company>) => {
    setCompanies(
      companies.map((c) => {
        if (c.id === companyId) {
          return { ...c, ...updates };
        }
        return c;
      })
    );
  };

  const updateCompanyBS = (companyId: number, field: string, value: any) => {
    setCompanies(
      companies.map((c) => {
        if (c.id === companyId) {
          const updated = { ...c };
          const keys = field.split('.');
          let obj: any = updated.balanceSheet;
          for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
          }
          obj[keys[keys.length - 1]] = value;
          return updated;
        }
        return c;
      })
    );
  };

  const updateCompanyPL = (companyId: number, field: string, value: any) => {
    setCompanies(
      companies.map((c) => {
        if (c.id === companyId) {
          const updated = { ...c };
          const keys = field.split('.');
          let obj: any = updated.profitLoss;
          for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
          }
          obj[keys[keys.length - 1]] = value;
          return updated;
        }
        return c;
      })
    );
  };

  const updateCompanyCF = (companyId: number, field: string, value: any) => {
    setCompanies(
      companies.map((c) => {
        if (c.id === companyId) {
          const updated = { ...c };
          const keys = field.split('.');
          let obj: any = updated.cashFlow;
          for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
          }
          obj[keys[keys.length - 1]] = value;
          return updated;
        }
        return c;
      })
    );
  };

  const getCompanyById = (id: number) => {
    return companies.find((c) => c.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        companies,
        currentView,
        selectedCompanyId,
        activeTab,
        viewMode,
        login,
        logout,
        setCurrentView,
        setSelectedCompanyId,
        setActiveTab,
        setViewMode,
        addCompany,
        deleteCompany,
        updateCompany,
        updateCompanyBS,
        updateCompanyPL,
        updateCompanyCF,
        getCompanyById
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
