import React, { useState, useEffect } from 'react';
import { Company, BorrowingsData, BorrowingItem } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface BorrowingsBreakdownProps {
  data: BorrowingsData;
  onUpdate: (data: BorrowingsData) => void;
  isEditable: boolean;
  company: Company;
  title?: string;
  noteId?: string;
  onBalanceSheetUpdate?: (current: number, previous: number) => void;
}

const BorrowingsBreakdown: React.FC<BorrowingsBreakdownProps> = ({ 
  data, 
  onUpdate, 
  isEditable, 
  company,
  title = "Borrowings",
  noteId,
  onBalanceSheetUpdate
}) => {
  // Get balance sheet value based on noteId
  const getBsValue = () => {
    if (noteId === '24') {
      return company.balanceSheet?.nonCurrentLiabilities?.financialLiabilities?.borrowings || { current: 0, previous: 0 };
    } else if (noteId === '32') {
      return company.balanceSheet?.currentLiabilities?.financialLiabilities?.borrowings || { current: 0, previous: 0 };
    }
    return { current: 0, previous: 0 };
  };
  const bsValue = getBsValue();
  const [localData, setLocalData] = useState<BorrowingsData>(data || {
    secured: [],
    unsecured: [],
    securityDetails: ''
  });

  useEffect(() => {
    setLocalData({
      secured: data?.secured || [],
      unsecured: data?.unsecured || [],
      securityDetails: data?.securityDetails || ''
    });
  }, [data]);

  const updateData = (newData: BorrowingsData) => {
    setLocalData(newData);
    onUpdate(newData);
  };

  const handleItemChange = (type: 'secured' | 'unsecured', id: string, field: keyof BorrowingItem, value: string | number) => {
    const updatedList = localData[type].map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateData({ ...localData, [type]: updatedList });
  };

  const addItem = (type: 'secured' | 'unsecured') => {
    const newItem: BorrowingItem = {
      id: Date.now().toString(),
      description: '',
      currentAmount: 0,
      previousAmount: 0
    };
    updateData({ ...localData, [type]: [...localData[type], newItem] });
  };

  const removeItem = (type: 'secured' | 'unsecured', id: string) => {
    updateData({ ...localData, [type]: localData[type].filter(item => item.id !== id) });
  };

  const calculateTotal = (type: 'secured' | 'unsecured', field: 'currentAmount' | 'previousAmount') => {
    return localData[type].reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
  };

  const grandTotalCurrent = calculateTotal('secured', 'currentAmount') + calculateTotal('unsecured', 'currentAmount');
  const grandTotalPrevious = calculateTotal('secured', 'previousAmount') + calculateTotal('unsecured', 'previousAmount');

  const renderBorrowingSection = (sectionTitle: string, type: 'secured' | 'unsecured', items: BorrowingItem[]) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-700 text-sm">{sectionTitle}</h4>
        {isEditable && (
          <button 
            onClick={() => addItem(type)} 
            className="text-blue-600 hover:text-blue-800 flex items-center text-xs"
          >
            <Plus size={14} className="mr-1" /> Add Row
          </button>
        )}
      </div>
      
      {items.length > 0 ? (
        <table className="w-full border-collapse text-sm mb-2">
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-200 p-2">
                  {isEditable ? (
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(type, item.id, 'description', e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded text-sm"
                      placeholder={type === 'secured' ? "e.g. Term Loans from Banks" : "e.g. Loans from related parties"}
                    />
                  ) : (
                    <span className="pl-4">{item.description}</span>
                  )}
                </td>
                <td className="border border-gray-200 p-2 text-right w-32">
                  {isEditable ? (
                    <input
                      type="number"
                      value={item.currentAmount}
                      onChange={(e) => handleItemChange(type, item.id, 'currentAmount', parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 border border-gray-300 rounded text-right text-sm"
                    />
                  ) : (
                    formatINR(item.currentAmount, 'full-number')
                  )}
                </td>
                <td className="border border-gray-200 p-2 text-right w-32">
                  {isEditable ? (
                    <input
                      type="number"
                      value={item.previousAmount}
                      onChange={(e) => handleItemChange(type, item.id, 'previousAmount', parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 border border-gray-300 rounded text-right text-sm"
                    />
                  ) : (
                    formatINR(item.previousAmount, 'full-number')
                  )}
                </td>
                {isEditable && (
                  <td className="border border-gray-200 p-2 text-center w-10">
                    <button 
                      onClick={() => removeItem(type, item.id)} 
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {/* Subtotal Row */}
            <tr className="bg-gray-50 font-medium">
              <td className="border border-gray-200 p-2 text-right">Sub-total</td>
              <td className="border border-gray-200 p-2 text-right">
                {formatINR(calculateTotal(type, 'currentAmount'), 'full-number')}
              </td>
              <td className="border border-gray-200 p-2 text-right">
                {formatINR(calculateTotal(type, 'previousAmount'), 'full-number')}
              </td>
              {isEditable && <td className="border border-gray-200 p-2"></td>}
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="text-gray-400 text-sm italic mb-2 pl-4">
          {isEditable ? 'Click "Add Row" to add items' : 'No items'}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-4">
      {/* Header */}
      <table className="w-full border-collapse text-sm mb-0">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 p-2 text-left font-semibold">Particulars</th>
            <th className="border border-gray-200 p-2 text-right w-32 font-semibold">As at {company.yearEnd}</th>
            <th className="border border-gray-200 p-2 text-right w-32 font-semibold">As at {company.prevYearEnd}</th>
            {isEditable && <th className="border border-gray-200 p-2 w-10"></th>}
          </tr>
        </thead>
      </table>

      {/* Secured Borrowings */}
      {renderBorrowingSection("Secured", 'secured', localData.secured)}

      {/* Unsecured Borrowings */}
      {renderBorrowingSection("Unsecured", 'unsecured', localData.unsecured)}

      {/* Grand Total */}
      <table className="w-full border-collapse text-sm mb-4">
        <tbody>
          <tr className="bg-blue-50 font-bold">
            <td className="border border-gray-200 p-2">Total</td>
            <td className="border border-gray-200 p-2 text-right w-32">
              {formatINR(grandTotalCurrent, 'full-number')}
            </td>
            <td className="border border-gray-200 p-2 text-right w-32">
              {formatINR(grandTotalPrevious, 'full-number')}
            </td>
            {isEditable && <td className="border border-gray-200 p-2 w-10"></td>}
          </tr>
        </tbody>
      </table>

      {/* Security Details */}
      <div className="mt-4">
        <h4 className="font-semibold text-gray-700 text-sm mb-2">
          Nature of security and terms of repayment for secured borrowings:
        </h4>
        {isEditable ? (
          <textarea
            value={localData.securityDetails}
            onChange={(e) => updateData({ ...localData, securityDetails: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded text-sm min-h-[80px]"
            placeholder="Enter details about security and repayment terms..."
          />
        ) : (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {localData.securityDetails || '-'}
          </p>
        )}
      </div>

      {/* Summary - Balance Sheet Value */}
      {noteId && (() => {
        // Use calculated total if items exist, otherwise use Balance Sheet value
        const hasItems = localData.secured.length > 0 || localData.unsecured.length > 0;
        const displayCurrent = hasItems ? grandTotalCurrent : bsValue.current;
        const displayPrevious = hasItems ? grandTotalPrevious : bsValue.previous;
        
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
                <tr>
                  <td className="border border-gray-300 p-2">Secured Borrowings</td>
                  <td className="border border-gray-300 p-2 text-right">{formatINR(calculateTotal('secured', 'currentAmount'), 'full-number')}</td>
                  <td className="border border-gray-300 p-2 text-right">{formatINR(calculateTotal('secured', 'previousAmount'), 'full-number')}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Unsecured Borrowings</td>
                  <td className="border border-gray-300 p-2 text-right">{formatINR(calculateTotal('unsecured', 'currentAmount'), 'full-number')}</td>
                  <td className="border border-gray-300 p-2 text-right">{formatINR(calculateTotal('unsecured', 'previousAmount'), 'full-number')}</td>
                </tr>
                <tr className="font-semibold bg-gray-50">
                  <td className="border border-gray-300 p-2">Total Borrowings</td>
                  <td className="border border-gray-300 p-2 text-right">{formatINR(grandTotalCurrent, 'full-number')}</td>
                  <td className="border border-gray-300 p-2 text-right">{formatINR(grandTotalPrevious, 'full-number')}</td>
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

export default BorrowingsBreakdown;
