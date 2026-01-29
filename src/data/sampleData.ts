import { Company } from '../types';

export const sampleCompanies: Company[] = [
  {
    id: 1,
    name: 'ABC Limited',
    address: '123 Business Park, Mumbai, Maharashtra 400001',
    cin: 'U12345MH2020PLC123456',
    sector: 'Secondary',
    specifications: 'Manufacturing',
    pan: 'AAAAA1234A',
    financialYear: '2024-25',
    yearEnd: '2024-25',
    prevYearEnd: '2023-24',
    balanceSheet: {
      // Assets (shown first)
      nonCurrentAssets: {
        propertyPlantEquipment: { current: 30000000, previous: 28000000, note: '1' },
        capitalWorkInProgress: { current: 2000000, previous: 1500000, note: '2' },
        investmentProperty: { current: 0, previous: 0, note: '3' },
        goodwill: { current: 0, previous: 0, note: '4' },
        otherIntangibleAssets: { current: 2000000, previous: 1500000, note: '5' },
        intangibleAssetsUnderDevelopment: { current: 500000, previous: 400000, note: '6' },
        biologicalAssetsOtherThanBearerPlants: { current: 0, previous: 0, note: '7' },
        financialAssets: {
          investments: { current: 5000000, previous: 4000000, note: '8' },
          tradeReceivables: { current: 0, previous: 0, note: '9' },
          loans: { current: 1000000, previous: 900000, note: '10' }
        },
        deferredTaxAssets: { current: 300000, previous: 250000, note: '11' },
        otherNonCurrentAssets: { current: 500000, previous: 400000, note: '12' }
      },
      currentAssets: {
        inventories: { current: 12000000, previous: 10000000, note: '13' },
        financialAssets: {
          investments: { current: 2000000, previous: 1500000, note: '14' },
          tradeReceivables: { current: 15000000, previous: 13000000, note: '15' },
          cashAndCashEquivalents: { current: 6000000, previous: 5000000, note: '16' },
          bankBalancesOtherThanCash: { current: 0, previous: 0, note: '17' },
          loans: { current: 1000000, previous: 800000, note: '18' },
          others: { current: 0, previous: 0, note: '19' }
        },
        currentTaxAssets: { current: 0, previous: 0, note: '20' },
        otherCurrentAssets: { current: 1600000, previous: 1350000, note: '21' }
      },
      // Equity and Liabilities
      equity: {
        equityShareCapital: { current: 10000000, previous: 10000000, note: '22' },
        otherEquity: { current: 25000000, previous: 20000000, note: '23' }
      },
      nonCurrentLiabilities: {
        financialLiabilities: {
          borrowings: { current: 15000000, previous: 12000000, note: '24' },
          leaseLiabilities: { current: 0, previous: 0, note: '25' },
          tradePayables: {
            microSmallEnterprisesDues: { current: 0, previous: 0, note: '26' },
            otherCreditorsDues: { current: 0, previous: 0, note: '27' }
          },
          otherFinancialLiabilities: { current: 0, previous: 0, note: '28' }
        },
        provisions: { current: 500000, previous: 400000, note: '29' },
        deferredTaxLiabilities: { current: 800000, previous: 700000, note: '30' },
        otherNonCurrentLiabilities: { current: 0, previous: 0, note: '31' }
      },
      currentLiabilities: {
        financialLiabilities: {
          borrowings: { current: 5000000, previous: 4000000, note: '32' },
          leaseLiabilities: { current: 0, previous: 0, note: '33' },
          tradePayables: {
            microSmallEnterprisesDues: { current: 500000, previous: 400000, note: '34' },
            otherCreditorsDues: { current: 7500000, previous: 6600000, note: '35' }
          },
          otherFinancialLiabilities: { current: 0, previous: 0, note: '36' }
        },
        otherCurrentLiabilities: { current: 2000000, previous: 1800000, note: '37' },
        provisions: { current: 300000, previous: 250000, note: '38' },
        currentTaxLiabilities: { current: 0, previous: 0, note: '39' }
      }
    },
    profitLoss: {
      revenueFromOperations: {
        amount: { current: 80000000, previous: 70000000, note: '40' }
      },
      otherIncome: {
        amount: { current: 2000000, previous: 1500000, note: '41' }
      },
      expenses: {
        costOfMaterialsConsumed: { current: 35000000, previous: 30000000, note: '42' },
        purchasesOfStockInTrade: { current: 5000000, previous: 4000000, note: '43' },
        changesInInventories: { current: 2000000, previous: 1500000, note: '44' },
        employeeBenefitsExpense: { current: 15000000, previous: 13000000, note: '45' },
        financeCosts: { current: 2000000, previous: 1800000, note: '46' },
        depreciationAndAmortisation: { current: 3000000, previous: 2800000, note: '47' },
        otherExpenses: { current: 13000000, previous: 12000000, note: '48' }
      },
      exceptionalItems: {
        amount: { current: 0, previous: 0, note: '49' }
      },
      taxExpense: {
        currentTax: { current: 2700000, previous: 2400000, note: '50' },
        deferredTax: { current: 100000, previous: 80000, note: '51' }
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
        basic: { current: 4.8, previous: 0, note: '66' },
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
        profitBeforeTax: { current: 6500000, previous: 6000000, note: '70' },
        adjustments: {
          depreciationAndAmortisation: { current: 3000000, previous: 2800000, note: '71' },
          financeCosts: { current: 2000000, previous: 1800000, note: '72' },
          interestIncome: { current: -500000, previous: -450000, note: '73' },
          otherAdjustments: { current: 250000, previous: 200000, note: '74' }
        },
        changesInWorkingCapital: {
          tradeReceivables: { current: -2000000, previous: -1500000, note: '75' },
          inventories: { current: -1000000, previous: -800000, note: '76' },
          tradePayables: { current: 1200000, previous: 1000000, note: '77' },
          otherWorkingCapitalChanges: { current: 500000, previous: 400000, note: '78' }
        },
        incomeTaxesPaid: { current: -2800000, previous: -2500000, note: '79' }
      },
      investingActivities: {
        purchaseOfPropertyPlantAndEquipment: { current: -3500000, previous: -3200000, note: '80' },
        proceedsFromSaleOfPropertyPlantAndEquipment: { current: 500000, previous: 400000, note: '81' },
        purchaseOfInvestments: { current: -1500000, previous: -1200000, note: '82' },
        proceedsFromInvestments: { current: 800000, previous: 600000, note: '83' },
        otherInvestingCashFlows: { current: -250000, previous: -200000, note: '84' }
      },
      financingActivities: {
        proceedsFromShareCapital: { current: 1000000, previous: 500000, note: '85' },
        proceedsFromBorrowings: { current: 2500000, previous: 2000000, note: '86' },
        repaymentOfBorrowings: { current: -1500000, previous: -1200000, note: '87' },
        dividendsPaid: { current: -1000000, previous: -900000, note: '88' },
        interestPaid: { current: -2000000, previous: -1800000, note: '89' },
        otherFinancingCashFlows: { current: -150000, previous: -120000, note: '90' }
      },
      cashAndCashEquivalentsAtBeginning: { current: 5000000, previous: 4500000, note: '91' },
      cashAndCashEquivalentsAtEnd: { current: 6200000, previous: 5000000, note: '92' }
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
        showSignatureBlocks: true,
        signatureBlocks: [
          {
            id: '1',
            title: 'Director',
            name: 'John Smith',
            designation: 'Director',
            showDSC: true
          },
          {
            id: '2',
            title: 'Managing Director',
            name: 'Jane Doe',
            designation: 'Managing Director',
            showDSC: true
          }
        ],
        showDSCSign: true
      }
    },
    noteDetails: {},
    breakdowns: {
      '66': [
        { id: 'net-profit', description: 'Net profit', current: 19200000, previous: 0 },
        { id: 'equity-shares', description: 'No.of Equity Shares', current: 4000000, previous: 0 }
      ]
    },
    ppeBreakdowns: {
      '1': [
        { id: '1', description: 'Land', grossBlock: 30000000, depreciation: 10000000 },
        { id: '2', description: 'Buildings', grossBlock: 10000000, depreciation: 0 },
        { id: '3', description: 'Plant and Equipment', grossBlock: 0, depreciation: 0 },
        { id: '4', description: 'Furniture and Fixtures', grossBlock: 0, depreciation: 0 },
        { id: '5', description: 'Vehicles', grossBlock: 0, depreciation: 0 },
        { id: '6', description: 'Office Equipment', grossBlock: 0, depreciation: 0 }
      ]
    }
  }
];
