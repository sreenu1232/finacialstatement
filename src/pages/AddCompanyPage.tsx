import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Company } from '../types';

const AddCompanyPage: React.FC = () => {
  const { companies, addCompany, setCurrentView } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cin: '',
    sector: 'Primary' as 'Primary' | 'Secondary' | 'Tertiary' | 'Quaternary',
    specifications: '',
    pan: '',
    financialYear: '2024-25'
  });

  // Generate current and previous year based on financial year selection
  const getYearLabels = (financialYear: string) => {
    const currentYear = financialYear;
    const prevYear = `${parseInt(financialYear.split('-')[0]) - 1}-${parseInt(financialYear.split('-')[1]) - 1}`;
    return { currentYear, prevYear };
  };

  const { currentYear, prevYear } = getYearLabels(formData.financialYear);

  const createBlankCompany = (): Company => ({
    id: companies.length + 1,
    name: formData.name,
    address: formData.address,
    cin: formData.cin,
    sector: formData.sector,
    specifications: formData.specifications,
    pan: formData.pan,
    financialYear: formData.financialYear,
    yearEnd: currentYear,
    prevYearEnd: prevYear,
    balanceSheet: {
      // Assets (shown first)
      nonCurrentAssets: {
        propertyPlantEquipment: { current: 0, previous: 0, note: '1' },
        capitalWorkInProgress: { current: 0, previous: 0, note: '2' },
        investmentProperty: { current: 0, previous: 0, note: '3' },
        goodwill: { current: 0, previous: 0, note: '4' },
        otherIntangibleAssets: { current: 0, previous: 0, note: '5' },
        intangibleAssetsUnderDevelopment: { current: 0, previous: 0, note: '6' },
        biologicalAssetsOtherThanBearerPlants: { current: 0, previous: 0, note: '7' },
        financialAssets: {
          investments: { current: 0, previous: 0, note: '8' },
          tradeReceivables: { current: 0, previous: 0, note: '9' },
          loans: { current: 0, previous: 0, note: '10' }
        },
        deferredTaxAssets: { current: 0, previous: 0, note: '11' },
        otherNonCurrentAssets: { current: 0, previous: 0, note: '12' }
      },
      currentAssets: {
        inventories: { current: 0, previous: 0, note: '13' },
        financialAssets: {
          investments: { current: 0, previous: 0, note: '14' },
          tradeReceivables: { current: 0, previous: 0, note: '15' },
          cashAndCashEquivalents: { current: 0, previous: 0, note: '16' },
          bankBalancesOtherThanCash: { current: 0, previous: 0, note: '17' },
          loans: { current: 0, previous: 0, note: '18' },
          others: { current: 0, previous: 0, note: '19' }
        },
        currentTaxAssets: { current: 0, previous: 0, note: '20' },
        otherCurrentAssets: { current: 0, previous: 0, note: '21' }
      },
      // Equity and Liabilities
      equity: {
        equityShareCapital: { current: 0, previous: 0, note: '22' },
        otherEquity: { current: 0, previous: 0, note: '23' }
      },
      nonCurrentLiabilities: {
        financialLiabilities: {
          borrowings: { current: 0, previous: 0, note: '24' },
          leaseLiabilities: { current: 0, previous: 0, note: '25' },
          tradePayables: {
            microSmallEnterprisesDues: { current: 0, previous: 0, note: '26' },
            otherCreditorsDues: { current: 0, previous: 0, note: '27' }
          },
          otherFinancialLiabilities: { current: 0, previous: 0, note: '28' }
        },
        provisions: { current: 0, previous: 0, note: '29' },
        deferredTaxLiabilities: { current: 0, previous: 0, note: '30' },
        otherNonCurrentLiabilities: { current: 0, previous: 0, note: '31' }
      },
      currentLiabilities: {
        financialLiabilities: {
          borrowings: { current: 0, previous: 0, note: '32' },
          leaseLiabilities: { current: 0, previous: 0, note: '33' },
          tradePayables: {
            microSmallEnterprisesDues: { current: 0, previous: 0, note: '34' },
            otherCreditorsDues: { current: 0, previous: 0, note: '35' }
          },
          otherFinancialLiabilities: { current: 0, previous: 0, note: '36' }
        },
        otherCurrentLiabilities: { current: 0, previous: 0, note: '37' },
        provisions: { current: 0, previous: 0, note: '38' },
        currentTaxLiabilities: { current: 0, previous: 0, note: '39' }
      }
    },
    profitLoss: {
      revenueFromOperations: {
        amount: { current: 0, previous: 0, note: '40' }
      },
      otherIncome: {
        amount: { current: 0, previous: 0, note: '41' }
      },
      expenses: {
        costOfMaterialsConsumed: { current: 0, previous: 0, note: '42' },
        purchasesOfStockInTrade: { current: 0, previous: 0, note: '43' },
        changesInInventories: { current: 0, previous: 0, note: '44' },
        employeeBenefitsExpense: { current: 0, previous: 0, note: '45' },
        financeCosts: { current: 0, previous: 0, note: '46' },
        depreciationAndAmortisation: { current: 0, previous: 0, note: '47' },
        otherExpenses: { current: 0, previous: 0, note: '48' }
      },
      exceptionalItems: {
        amount: { current: 0, previous: 0, note: '49' }
      },
      taxExpense: {
        currentTax: { current: 0, previous: 0, note: '50' },
        deferredTax: { current: 0, previous: 0, note: '51' }
      },
      // IX. Profit (Loss) for the period from continuing operations (VII - VIII)
      profitLossFromContinuingOperations: { current: 0, previous: 0, note: '52' },
      // X. Profit/(loss) from discontinued operations
      profitLossFromDiscontinuedOperations: { current: 0, previous: 0, note: '53' },
      // XI. Tax expenses of discontinued operations
      taxExpensesOfDiscontinuedOperations: { current: 0, previous: 0, note: '54' },
      // XII. Profit/(loss) from Discontinued operations (after tax) (X-XI)
      profitLossFromDiscontinuedOperationsAfterTax: { current: 0, previous: 0, note: '55' },
      // XIII. Profit/(loss) for the period (IX+XII)
      profitLossForThePeriod: { current: 0, previous: 0, note: '56' },
      // XIV. Other Comprehensive Income
      otherComprehensiveIncome: {
        itemsNotReclassified: {
          remeasurementOfNetDefinedBenefit: { current: 0, previous: 0, note: '57' },
          equityInstrumentsThroughOCI: { current: 0, previous: 0, note: '58' },
          incomeTaxNotReclassified: { current: 0, previous: 0, note: '59' }
        },
        itemsReclassified: {
          exchangeDifferences: { current: 0, previous: 0, note: '60' },
          debtInstrumentsThroughOCI: { current: 0, previous: 0, note: '61' },
          incomeTaxReclassified: { current: 0, previous: 0, note: '62' }
        }
      },
      // XV. Total Comprehensive Income for the period (XIII+XIV)
      totalComprehensiveIncomeForThePeriod: { current: 0, previous: 0, note: '63' },
      // XVI. Earnings per equity share (for continuing operation)
      earningsPerShareContinuing: {
        basic: { current: 0, previous: 0, note: '64' },
        diluted: { current: 0, previous: 0, note: '65' }
      },
      // XVII. Earnings per equity share (for discontinued operation)
      earningsPerShareDiscontinued: {
        basic: { current: 0, previous: 0, note: '66' },
        diluted: { current: 0, previous: 0, note: '67' }
      },
      // XVIII. Earning per equity share (for discontinued & continuing operation)
      earningsPerShareTotal: {
        basic: { current: 0, previous: 0, note: '68' },
        diluted: { current: 0, previous: 0, note: '69' }
      }
    },
    cashFlow: {
      operatingActivities: {
        profitBeforeTax: { current: 0, previous: 0, note: '70' },
        adjustments: {
          depreciationAndAmortisation: { current: 0, previous: 0, note: '71' },
          financeCosts: { current: 0, previous: 0, note: '72' },
          interestIncome: { current: 0, previous: 0, note: '73' },
          otherAdjustments: { current: 0, previous: 0, note: '74' }
        },
        changesInWorkingCapital: {
          tradeReceivables: { current: 0, previous: 0, note: '75' },
          inventories: { current: 0, previous: 0, note: '76' },
          tradePayables: { current: 0, previous: 0, note: '77' },
          otherWorkingCapitalChanges: { current: 0, previous: 0, note: '78' }
        },
        incomeTaxesPaid: { current: 0, previous: 0, note: '79' }
      },
      investingActivities: {
        purchaseOfPropertyPlantAndEquipment: { current: 0, previous: 0, note: '80' },
        proceedsFromSaleOfPropertyPlantAndEquipment: { current: 0, previous: 0, note: '81' },
        purchaseOfInvestments: { current: 0, previous: 0, note: '82' },
        proceedsFromInvestments: { current: 0, previous: 0, note: '83' },
        otherInvestingCashFlows: { current: 0, previous: 0, note: '84' }
      },
      financingActivities: {
        proceedsFromShareCapital: { current: 0, previous: 0, note: '85' },
        proceedsFromBorrowings: { current: 0, previous: 0, note: '86' },
        repaymentOfBorrowings: { current: 0, previous: 0, note: '87' },
        dividendsPaid: { current: 0, previous: 0, note: '88' },
        interestPaid: { current: 0, previous: 0, note: '89' },
        otherFinancingCashFlows: { current: 0, previous: 0, note: '90' }
      },
      cashAndCashEquivalentsAtBeginning: { current: 0, previous: 0, note: '91' },
      cashAndCashEquivalentsAtEnd: { current: 0, previous: 0, note: '92' }
    },
    settings: {
      template: {
        primaryColor: '#2563eb',
        secondaryColor: '#64748b',
        fontStyle: 'arial',
        fontSize: 12,
        paperSize: 'A4'
      },
      formatting: {
        decimalPoints: 0,
        unitOfMeasurement: 'full-number',
        numberStyle: 'indian',
        customNumberGrouping: '3,2',
        tableDesign: 'classic',
        tableAccent: 'blue',
        tableDensity: 'comfortable',
        showSignatureBlocks: false,
        signatureBlocks: [],
        showDSCSign: false
      }
    },
    noteDetails: {},
    breakdowns: {}
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Add New Company</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter company address"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CIN Number *</label>
            <input
              type="text"
              value={formData.cin}
              onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="U12345MH2020PLC123456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sector *</label>
            <select
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value as 'Primary' | 'Secondary' | 'Tertiary' | 'Quaternary' })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Tertiary">Tertiary</option>
              <option value="Quaternary">Quaternary</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specifications *</label>
            <input
              type="text"
              value={formData.specifications}
              onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., agricultural, manufacturing, IT, consulting service, R&D"
            />
          </div>
          

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input
              type="text"
              value={formData.pan}
              onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="AAAAA1234A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year *</label>
            <select
              value={formData.financialYear}
              onChange={(e) => setFormData({ ...formData, financialYear: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
              <option value="2021-22">2021-22</option>
              <option value="2020-21">2020-21</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Current Year: {currentYear} | Previous Year: {prevYear}
            </p>
          </div>

          <button
            onClick={() => { addCompany(createBlankCompany()); setCurrentView('dashboard'); }}
            disabled={!formData.name || !formData.address || !formData.cin || !formData.sector || !formData.specifications}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            Create Company
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyPage;
