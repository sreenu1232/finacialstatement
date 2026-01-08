#!/bin/bash

echo "🚀 Creating all React component and page files..."

# Create sampleData.ts (if not exists)
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

echo "✅ sampleData.ts"

# Create App.tsx
cat > src/App.tsx << 'EOF'
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
EOF

echo "✅ App.tsx"

# Create index.tsx
cat > src/index.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

echo "✅ index.tsx"

echo ""
echo "🎉 All core files created successfully!"
echo ""
echo "Next steps:"
echo "1. I'll provide the pages (Login, Dashboard, etc.) - Ready?"
