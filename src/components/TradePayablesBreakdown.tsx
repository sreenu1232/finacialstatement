import React, { useState, useEffect } from 'react';
import { Company } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface TradePayableItem {
  id: string;
  description: string;
  lessThan1Year: number;
  oneToTwoYears: number;
  twoToThreeYears: number;
  moreThan3Years: number;
  notDue: number;
}

export interface TradePayablesData {
  msme: TradePayableItem[];
  others: TradePayableItem[];
  disputedMsme: TradePayableItem[];
  disputedOthers: TradePayableItem[];
  disclosures: string;
}

interface TradePayablesBreakdownProps {
  data: TradePayablesData;
  onUpdate: (data: TradePayablesData) => void;
  isEditable: boolean;
  company: Company;
  title?: string;
  noteId?: string;
  onBalanceSheetUpdate?: (current: number, previous: number) => void;
}

const TradePayablesBreakdown: React.FC<TradePayablesBreakdownProps> = ({ 
  data, 
  onUpdate, 
  isEditable, 
  company,
  title = "Trade Payables",
  noteId,
  onBalanceSheetUpdate
}) => {
  // Get balance sheet value based on noteId
  const getBsValue = () => {
    if (noteId === '26') {
      return company.balanceSheet?.nonCurrentLiabilities?.financialLiabilities?.tradePayables?.microSmallEnterprisesDues || { current: 0, previous: 0 };
    } else if (noteId === '27') {
      return company.balanceSheet?.nonCurrentLiabilities?.financialLiabilities?.tradePayables?.otherCreditorsDues || { current: 0, previous: 0 };
    } else if (noteId === '34') {
      return company.balanceSheet?.currentLiabilities?.financialLiabilities?.tradePayables?.microSmallEnterprisesDues || { current: 0, previous: 0 };
    } else if (noteId === '35') {
      return company.balanceSheet?.currentLiabilities?.financialLiabilities?.tradePayables?.otherCreditorsDues || { current: 0, previous: 0 };
    }
    return { current: 0, previous: 0 };
  };
  const bsValue = getBsValue();
  const [localData, setLocalData] = useState<TradePayablesData>(data || {
    msme: [],
    others: [],
    disputedMsme: [],
    disputedOthers: [],
    disclosures: ''
  });

  useEffect(() => {
    setLocalData({
      msme: data?.msme || [],
      others: data?.others || [],
      disputedMsme: data?.disputedMsme || [],
      disputedOthers: data?.disputedOthers || [],
      disclosures: data?.disclosures || ''
    });
  }, [data]);

  const updateData = (newData: TradePayablesData) => {
    setLocalData(newData);
    onUpdate(newData);
  };

  const handleItemChange = (
    type: 'msme' | 'others' | 'disputedMsme' | 'disputedOthers', 
    id: string, 
    field: keyof TradePayableItem, 
    value: string | number
  ) => {
    const updatedList = localData[type].map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateData({ ...localData, [type]: updatedList });
  };

  const addItem = (type: 'msme' | 'others' | 'disputedMsme' | 'disputedOthers') => {
    const newItem: TradePayableItem = {
      id: Date.now().toString(),
      description: '',
      lessThan1Year: 0,
      oneToTwoYears: 0,
      twoToThreeYears: 0,
      moreThan3Years: 0,
      notDue: 0
    };
    updateData({ ...localData, [type]: [...localData[type], newItem] });
  };

  const removeItem = (type: 'msme' | 'others' | 'disputedMsme' | 'disputedOthers', id: string) => {
    updateData({ ...localData, [type]: localData[type].filter(item => item.id !== id) });
  };

  const calculateRowTotal = (item: TradePayableItem) => {
    return (Number(item.lessThan1Year) || 0) + 
           (Number(item.oneToTwoYears) || 0) + 
           (Number(item.twoToThreeYears) || 0) + 
           (Number(item.moreThan3Years) || 0) + 
           (Number(item.notDue) || 0);
  };

  const calculateColumnTotal = (type: 'msme' | 'others' | 'disputedMsme' | 'disputedOthers', field: keyof TradePayableItem) => {
    if (field === 'id' || field === 'description') return 0;
    return localData[type].reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
  };

  const calculateSectionTotal = (type: 'msme' | 'others' | 'disputedMsme' | 'disputedOthers') => {
    return localData[type].reduce((sum, item) => sum + calculateRowTotal(item), 0);
  };

  const grandTotal = calculateSectionTotal('msme') + calculateSectionTotal('others') + 
                     calculateSectionTotal('disputedMsme') + calculateSectionTotal('disputedOthers');

  const renderSection = (
    sectionTitle: string, 
    type: 'msme' | 'others' | 'disputedMsme' | 'disputedOthers', 
    items: TradePayableItem[]
  ) => (
    <>
      <tr className="bg-gray-50">
        <td className="border border-gray-200 p-2 font-semibold text-sm" colSpan={isEditable ? 8 : 7}>
          <div className="flex justify-between items-center">
            <span>{sectionTitle}</span>
            {isEditable && (
              <button 
                onClick={() => addItem(type)} 
                className="text-blue-600 hover:text-blue-800 flex items-center text-xs font-normal"
              >
                <Plus size={14} className="mr-1" /> Add
              </button>
            )}
          </div>
        </td>
      </tr>
      {items.length > 0 ? (
        items.map((item) => (
          <tr key={item.id}>
            <td className="border border-gray-200 p-2">
              {isEditable ? (
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(type, item.id, 'description', e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                  placeholder="Description"
                />
              ) : (
                <span className="text-sm">{item.description || '-'}</span>
              )}
            </td>
            <td className="border border-gray-200 p-1 text-right">
              {isEditable ? (
                <input
                  type="number"
                  value={item.lessThan1Year}
                  onChange={(e) => handleItemChange(type, item.id, 'lessThan1Year', parseFloat(e.target.value) || 0)}
                  className="w-full p-1 border border-gray-300 rounded text-right text-sm"
                />
              ) : (
                <span className="text-sm">{formatINR(item.lessThan1Year, 'full-number')}</span>
              )}
            </td>
            <td className="border border-gray-200 p-1 text-right">
              {isEditable ? (
                <input
                  type="number"
                  value={item.oneToTwoYears}
                  onChange={(e) => handleItemChange(type, item.id, 'oneToTwoYears', parseFloat(e.target.value) || 0)}
                  className="w-full p-1 border border-gray-300 rounded text-right text-sm"
                />
              ) : (
                <span className="text-sm">{formatINR(item.oneToTwoYears, 'full-number')}</span>
              )}
            </td>
            <td className="border border-gray-200 p-1 text-right">
              {isEditable ? (
                <input
                  type="number"
                  value={item.twoToThreeYears}
                  onChange={(e) => handleItemChange(type, item.id, 'twoToThreeYears', parseFloat(e.target.value) || 0)}
                  className="w-full p-1 border border-gray-300 rounded text-right text-sm"
                />
              ) : (
                <span className="text-sm">{formatINR(item.twoToThreeYears, 'full-number')}</span>
              )}
            </td>
            <td className="border border-gray-200 p-1 text-right">
              {isEditable ? (
                <input
                  type="number"
                  value={item.moreThan3Years}
                  onChange={(e) => handleItemChange(type, item.id, 'moreThan3Years', parseFloat(e.target.value) || 0)}
                  className="w-full p-1 border border-gray-300 rounded text-right text-sm"
                />
              ) : (
                <span className="text-sm">{formatINR(item.moreThan3Years, 'full-number')}</span>
              )}
            </td>
            <td className="border border-gray-200 p-1 text-right">
              {isEditable ? (
                <input
                  type="number"
                  value={item.notDue}
                  onChange={(e) => handleItemChange(type, item.id, 'notDue', parseFloat(e.target.value) || 0)}
                  className="w-full p-1 border border-gray-300 rounded text-right text-sm"
                />
              ) : (
                <span className="text-sm">{formatINR(item.notDue, 'full-number')}</span>
              )}
            </td>
            <td className="border border-gray-200 p-2 text-right font-medium text-sm">
              {formatINR(calculateRowTotal(item), 'full-number')}
            </td>
            {isEditable && (
              <td className="border border-gray-200 p-1 text-center">
                <button 
                  onClick={() => removeItem(type, item.id)} 
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </button>
              </td>
            )}
          </tr>
        ))
      ) : (
        <tr>
          <td className="border border-gray-200 p-2 text-center text-gray-400 text-sm italic" colSpan={isEditable ? 8 : 7}>
            No items added
          </td>
        </tr>
      )}
      {/* Section Subtotal */}
      {items.length > 0 && (
        <tr className="bg-gray-100 font-medium">
          <td className="border border-gray-200 p-2 text-right text-sm">Sub-total</td>
          <td className="border border-gray-200 p-2 text-right text-sm">{formatINR(calculateColumnTotal(type, 'lessThan1Year'), 'full-number')}</td>
          <td className="border border-gray-200 p-2 text-right text-sm">{formatINR(calculateColumnTotal(type, 'oneToTwoYears'), 'full-number')}</td>
          <td className="border border-gray-200 p-2 text-right text-sm">{formatINR(calculateColumnTotal(type, 'twoToThreeYears'), 'full-number')}</td>
          <td className="border border-gray-200 p-2 text-right text-sm">{formatINR(calculateColumnTotal(type, 'moreThan3Years'), 'full-number')}</td>
          <td className="border border-gray-200 p-2 text-right text-sm">{formatINR(calculateColumnTotal(type, 'notDue'), 'full-number')}</td>
          <td className="border border-gray-200 p-2 text-right text-sm">{formatINR(calculateSectionTotal(type), 'full-number')}</td>
          {isEditable && <td className="border border-gray-200 p-2"></td>}
        </tr>
      )}
    </>
  );

  return (
    <div className="mt-4">
      <h4 className="font-semibold text-gray-700 text-sm mb-3">Trade Payables Ageing Schedule - As at {company.yearEnd}</h4>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-50">
              <th className="border border-gray-200 p-2 text-left font-semibold" rowSpan={2}>Particulars</th>
              <th className="border border-gray-200 p-2 text-center font-semibold" colSpan={5}>
                Outstanding for following periods from due date of payment
              </th>
              <th className="border border-gray-200 p-2 text-right font-semibold" rowSpan={2}>Total</th>
              {isEditable && <th className="border border-gray-200 p-2 w-10" rowSpan={2}></th>}
            </tr>
            <tr className="bg-blue-50">
              <th className="border border-gray-200 p-2 text-right font-semibold text-xs">Less than 1 year</th>
              <th className="border border-gray-200 p-2 text-right font-semibold text-xs">1-2 years</th>
              <th className="border border-gray-200 p-2 text-right font-semibold text-xs">2-3 years</th>
              <th className="border border-gray-200 p-2 text-right font-semibold text-xs">More than 3 years</th>
              <th className="border border-gray-200 p-2 text-right font-semibold text-xs">Not Due</th>
            </tr>
          </thead>
          <tbody>
            {renderSection("(i) MSME", 'msme', localData.msme)}
            {renderSection("(ii) Others", 'others', localData.others)}
            {renderSection("(iii) Disputed dues - MSME", 'disputedMsme', localData.disputedMsme)}
            {renderSection("(iv) Disputed dues - Others", 'disputedOthers', localData.disputedOthers)}
            
            {/* Grand Total */}
            <tr className="bg-blue-100 font-bold">
              <td className="border border-gray-200 p-2">Total</td>
              <td className="border border-gray-200 p-2 text-right">
                {formatINR(
                  calculateColumnTotal('msme', 'lessThan1Year') + 
                  calculateColumnTotal('others', 'lessThan1Year') +
                  calculateColumnTotal('disputedMsme', 'lessThan1Year') +
                  calculateColumnTotal('disputedOthers', 'lessThan1Year'),
                  'full-number'
                )}
              </td>
              <td className="border border-gray-200 p-2 text-right">
                {formatINR(
                  calculateColumnTotal('msme', 'oneToTwoYears') + 
                  calculateColumnTotal('others', 'oneToTwoYears') +
                  calculateColumnTotal('disputedMsme', 'oneToTwoYears') +
                  calculateColumnTotal('disputedOthers', 'oneToTwoYears'),
                  'full-number'
                )}
              </td>
              <td className="border border-gray-200 p-2 text-right">
                {formatINR(
                  calculateColumnTotal('msme', 'twoToThreeYears') + 
                  calculateColumnTotal('others', 'twoToThreeYears') +
                  calculateColumnTotal('disputedMsme', 'twoToThreeYears') +
                  calculateColumnTotal('disputedOthers', 'twoToThreeYears'),
                  'full-number'
                )}
              </td>
              <td className="border border-gray-200 p-2 text-right">
                {formatINR(
                  calculateColumnTotal('msme', 'moreThan3Years') + 
                  calculateColumnTotal('others', 'moreThan3Years') +
                  calculateColumnTotal('disputedMsme', 'moreThan3Years') +
                  calculateColumnTotal('disputedOthers', 'moreThan3Years'),
                  'full-number'
                )}
              </td>
              <td className="border border-gray-200 p-2 text-right">
                {formatINR(
                  calculateColumnTotal('msme', 'notDue') + 
                  calculateColumnTotal('others', 'notDue') +
                  calculateColumnTotal('disputedMsme', 'notDue') +
                  calculateColumnTotal('disputedOthers', 'notDue'),
                  'full-number'
                )}
              </td>
              <td className="border border-gray-200 p-2 text-right">{formatINR(grandTotal, 'full-number')}</td>
              {isEditable && <td className="border border-gray-200 p-2"></td>}
            </tr>
          </tbody>
        </table>
      </div>

      {/* MSME Disclosures */}
      <div className="mt-4">
        <h4 className="font-semibold text-gray-700 text-sm mb-2">
          Disclosures under MSMED Act, 2006:
        </h4>
        {isEditable ? (
          <textarea
            value={localData.disclosures}
            onChange={(e) => updateData({ ...localData, disclosures: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded text-sm min-h-[100px]"
            placeholder="Enter disclosures related to MSME suppliers including principal amount, interest due, etc."
          />
        ) : (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {localData.disclosures || '-'}
          </p>
        )}
      </div>

      {/* Summary - Balance Sheet Value */}
      {noteId && (() => {
        // Use calculated total if items exist, otherwise use Balance Sheet value
        const hasItems = localData.msme.length > 0 || localData.others.length > 0 || localData.disputedMsme.length > 0 || localData.disputedOthers.length > 0;
        const displayCurrent = hasItems ? grandTotal : bsValue.current;
        const displayPrevious = bsValue.previous; // Keep previous from BS since ageing doesn't have previous year
        
        return (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 text-sm mb-2">Summary</h4>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 text-left font-semibold">Particulars</th>
                  <th className="border border-gray-300 p-2 text-right w-40 font-semibold">As at {company.yearEnd}</th>
                  <th className="border border-gray-300 p-2 text-right w-40 font-semibold">As at {company.prevYearEnd}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-semibold bg-gray-50">
                  <td className="border border-gray-300 p-2">Total Trade Payables (from ageing)</td>
                  <td className="border border-gray-300 p-2 text-right">{formatINR(grandTotal, 'full-number')}</td>
                  <td className="border border-gray-300 p-2 text-right">-</td>
                </tr>
                <tr className="font-bold bg-blue-100">
                  <td className="border border-gray-300 p-2">Balance Sheet Value</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {isEditable ? (
                      <input
                        type="number"
                        value={displayCurrent}
                        onChange={(e) => onBalanceSheetUpdate?.(parseFloat(e.target.value) || 0, displayPrevious)}
                        className="w-full p-1.5 border border-gray-300 rounded text-right text-sm font-bold"
                      />
                    ) : (
                      formatINR(displayCurrent, 'full-number')
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {isEditable ? (
                      <input
                        type="number"
                        value={displayPrevious}
                        onChange={(e) => onBalanceSheetUpdate?.(displayCurrent, parseFloat(e.target.value) || 0)}
                        className="w-full p-1.5 border border-gray-300 rounded text-right text-sm font-bold"
                      />
                    ) : (
                      formatINR(displayPrevious, 'full-number')
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })()}
    </div>
  );
};

export default TradePayablesBreakdown;
