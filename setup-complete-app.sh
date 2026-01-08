#!/bin/bash

echo "🚀 Setting up complete FSMaker application..."

# Create all directories
mkdir -p src/context src/pages src/components src/data src/types src/utils

echo "✅ Directories created"

# Create AppContext.tsx
cat > src/context/AppContext.tsx << 'EOF'
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
  updateCompanyBS: (companyId: number, field: string, value: any) => void;
  updateCompanyPL: (companyId: number, field: string, value: any) => void;
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
        updateCompanyBS,
        updateCompanyPL,
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
EOF

echo "✅ src/context/AppContext.tsx"

# Create sampleData.ts - using the complete data from earlier
cat > src/data/sampleData.ts << 'EOF'
import { Company } from '../types';

export const sampleCompanies: Company[] = [
  {
    id: 1,
    name: 'ABC Limited',
    industry: 'Manufacturing',
    pan: 'AAAAA1234A',
    cin: 'U12345MH2020PLC123456',
    yearEnd: '2024-25',
    prevYearEnd: '2023-24',
    balanceSheet: {
      equity: {
        shareCapital: { current: 10000000, previous: 10000000, note: '1' },
        otherEquity: { current: 25000000, previous: 20000000, note: '2' }
      },
      liabilities: {
        nonCurrent: {
          borrowings: { current: 15000000, previous: 12000000, note: '3' },
          provisions: { current: 500000, previous: 400000, note: '4' },
          deferredTax: { current: 800000, previous: 700000, note: '5' }
        },
        current: {
          borrowings: { current: 5000000, previous: 4000000, note: '6' },
          tradePayables: { current: 8000000, previous: 7000000, note: '7' },
          otherCurrentLiabilities: { current: 2000000, previous: 1800000, note: '8' },
          provisions: { current: 300000, previous: 250000, note: '9' }
        }
      },
      assets: {
        nonCurrent: {
          ppe: { current: 30000000, previous: 28000000, note: '10' },
          cwip: { current: 2000000, previous: 1500000, note: '11' },
          investments: { current: 5000000, previous: 4000000, note: '12' },
          otherNonCurrent: { current: 1000000, previous: 900000, note: '13' }
        },
        current: {
          inventories: { current: 12000000, previous: 10000000, note: '14' },
          tradeReceivables: { current: 15000000, previous: 13000000, note: '15' },
          cashAndEquivalents: { current: 6000000, previous: 5000000, note: '16' },
          otherCurrentAssets: { current: 2600000, previous: 2350000, note: '17' }
        }
      }
    },
    profitLoss: {
      revenue: {
        operations: { current: 80000000, previous: 70000000, note: '18' },
        other: { current: 2000000, previous: 1500000, note: '19' }
      },
      expenses: {
        materialCost: { current: 35000000, previous: 30000000, note: '20' },
        employeeBenefit: { current: 15000000, previous: 13000000, note: '21' },
        finance: { current: 2000000, previous: 1800000, note: '22' },
        depreciation: { current: 3000000, previous: 2800000, note: '23' },
        other: { current: 18000000, previous: 16000000, note: '24' }
      },
      tax: {
        current: { current: 2700000, previous: 2400000 },
        deferred: { current: 100000, previous: 80000 }
      }
    }
  }
];
EOF

echo "✅ src/data/sampleData.ts"

# Now create all the page files...
# (continuing in next part due to length)

echo ""
echo "Creating page files..."

