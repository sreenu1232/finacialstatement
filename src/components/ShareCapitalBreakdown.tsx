import React, { useState, useEffect } from 'react';
import { ShareCapitalData, ShareCapitalItem, ReconciliationItem, ShareholderItem, PromoterItem, Company } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface ShareCapitalBreakdownProps {
  data: ShareCapitalData;
  onUpdate: (data: ShareCapitalData) => void;
  isEditable: boolean;
  company: Company;
  balanceSheetValue?: { current: number; previous: number };
  onBalanceSheetUpdate?: (current: number, previous: number) => void;
}

const ShareCapitalBreakdown: React.FC<ShareCapitalBreakdownProps> = ({ data, onUpdate, isEditable, company, balanceSheetValue, onBalanceSheetUpdate }) => {
  // Get balance sheet value for share capital
  const bsValue = balanceSheetValue || company.balanceSheet?.equity?.equityShareCapital || { current: 0, previous: 0 };
  const [localData, setLocalData] = useState<ShareCapitalData>(data || {
    authorised: [],
    issued: [],
    reconciliation: [],
    shareholders: [],
    promoters: []
  });

  useEffect(() => {
    setLocalData({
      ...data,
      authorised: data.authorised || [],
      issued: data.issued || [],
      reconciliation: data.reconciliation || [],
      shareholders: data.shareholders || [],
      promoters: data.promoters || []
    });
  }, [data]);

  const updateData = (newData: ShareCapitalData) => {
    setLocalData(newData);
    onUpdate(newData);
  };

  // --- Authorised & Issued Handlers ---
  const handleCapitalChange = (type: 'authorised' | 'issued', id: string, field: keyof ShareCapitalItem, value: string | number) => {
    const updatedList = localData[type].map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateData({ ...localData, [type]: updatedList });
  };

  const addCapitalItem = (type: 'authorised' | 'issued') => {
    const newItem: ShareCapitalItem = {
      id: Date.now().toString(),
      description: '',
      currentAmount: 0,
      previousAmount: 0
    };
    updateData({ ...localData, [type]: [...localData[type], newItem] });
  };

  const removeCapitalItem = (type: 'authorised' | 'issued', id: string) => {
    updateData({ ...localData, [type]: localData[type].filter(item => item.id !== id) });
  };

  // --- Reconciliation Handlers ---
  const handleReconciliationChange = (id: string, field: keyof ReconciliationItem, value: string | number) => {
    const updatedList = localData.reconciliation.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateData({ ...localData, reconciliation: updatedList });
  };

  const addReconciliationItem = () => {
    const newItem: ReconciliationItem = {
      id: Date.now().toString(),
      description: '',
      currentCount: 0,
      currentAmount: 0,
      previousCount: 0,
      previousAmount: 0
    };
    updateData({ ...localData, reconciliation: [...localData.reconciliation, newItem] });
  };

  const removeReconciliationItem = (id: string) => {
    updateData({ ...localData, reconciliation: localData.reconciliation.filter(item => item.id !== id) });
  };

  // --- Shareholder Handlers ---
  const handleShareholderChange = (id: string, field: keyof ShareholderItem, value: string | number) => {
    const updatedList = localData.shareholders.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateData({ ...localData, shareholders: updatedList });
  };

  const addShareholderItem = () => {
    const newItem: ShareholderItem = {
      id: Date.now().toString(),
      name: '',
      currentCount: 0,
      currentPercentage: 0,
      previousCount: 0,
      previousPercentage: 0
    };
    updateData({ ...localData, shareholders: [...localData.shareholders, newItem] });
  };

  const removeShareholderItem = (id: string) => {
    updateData({ ...localData, shareholders: localData.shareholders.filter(item => item.id !== id) });
  };

  // --- Promoter Handlers ---
  const handlePromoterChange = (id: string, field: keyof PromoterItem, value: string | number) => {
    const updatedList = localData.promoters.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateData({ ...localData, promoters: updatedList });
  };

  const addPromoterItem = () => {
    const newItem: PromoterItem = {
      id: Date.now().toString(),
      name: '',
      currentCount: 0,
      currentPercentage: 0,
      changePercentage: 0
    };
    updateData({ ...localData, promoters: [...localData.promoters, newItem] });
  };

  const removePromoterItem = (id: string) => {
    updateData({ ...localData, promoters: localData.promoters.filter(item => item.id !== id) });
  };

  const renderCapitalTable = (title: string, type: 'authorised' | 'issued', items: ShareCapitalItem[]) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-700">{title}</h4>
        {isEditable && (
          <button onClick={() => addCapitalItem(type)} className="text-blue-600 hover:text-blue-800 flex items-center text-xs">
            <Plus size={14} className="mr-1" /> Add Row
          </button>
        )}
      </div>
      <table className="w-full border-collapse text-sm mb-2">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-left">Particulars</th>
            <th className="border p-2 text-right w-32">As at {company.yearEnd}</th>
            <th className="border p-2 text-right w-32">As at {company.prevYearEnd}</th>
            {isEditable && <th className="border p-2 w-10"></th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">
                {isEditable ? (
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleCapitalChange(type, item.id, 'description', e.target.value)}
                    className="w-full p-1 border rounded"
                    placeholder="e.g. 10,000 Equity Shares of ₹10 each"
                  />
                ) : item.description}
              </td>
              <td className="border p-2 text-right">
                {isEditable ? (
                  <input
                    type="number"
                    value={item.currentAmount}
                    onChange={(e) => handleCapitalChange(type, item.id, 'currentAmount', parseFloat(e.target.value) || 0)}
                    className="w-full p-1 border rounded text-right"
                  />
                ) : formatINR(item.currentAmount, 'full-number')}
              </td>
              <td className="border p-2 text-right">
                {isEditable ? (
                  <input
                    type="number"
                    value={item.previousAmount}
                    onChange={(e) => handleCapitalChange(type, item.id, 'previousAmount', parseFloat(e.target.value) || 0)}
                    className="w-full p-1 border rounded text-right"
                  />
                ) : formatINR(item.previousAmount, 'full-number')}
              </td>
              {isEditable && (
                <td className="border p-2 text-center">
                  <button onClick={() => removeCapitalItem(type, item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={14} />
                  </button>
                </td>
              )}
            </tr>
          ))}
          <tr className="font-bold bg-gray-50">
            <td className="border p-2 text-right">Total</td>
            <td className="border p-2 text-right">
              {formatINR(items.reduce((sum, item) => sum + (Number(item.currentAmount) || 0), 0), 'full-number')}
            </td>
            <td className="border p-2 text-right">
              {formatINR(items.reduce((sum, item) => sum + (Number(item.previousAmount) || 0), 0), 'full-number')}
            </td>
            {isEditable && <td className="border p-2"></td>}
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="mt-4">
      {renderCapitalTable("Authorised Share Capital", 'authorised', localData.authorised)}
      {renderCapitalTable("Issued, Subscribed and Paid-up", 'issued', localData.issued)}

      {/* Reconciliation Table */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-gray-700">(a) Reconciliation of shares outstanding</h4>
          {isEditable && (
            <button onClick={addReconciliationItem} className="text-blue-600 hover:text-blue-800 flex items-center text-xs">
              <Plus size={14} className="mr-1" /> Add Row
            </button>
          )}
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2 text-left" rowSpan={2}>Particulars</th>
              <th className="border p-2 text-center" colSpan={2}>As at {company.yearEnd}</th>
              <th className="border p-2 text-center" colSpan={2}>As at {company.prevYearEnd}</th>
              {isEditable && <th className="border p-2 w-10" rowSpan={2}></th>}
            </tr>
            <tr className="bg-gray-50">
              <th className="border p-2 text-right">No. of Shares</th>
              <th className="border p-2 text-right">Amount</th>
              <th className="border p-2 text-right">No. of Shares</th>
              <th className="border p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {localData.reconciliation.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">
                  {isEditable ? (
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleReconciliationChange(item.id, 'description', e.target.value)}
                      className="w-full p-1 border rounded"
                      placeholder="e.g. At the beginning"
                    />
                  ) : item.description}
                </td>
                <td className="border p-2 text-right">
                  {isEditable ? (
                    <input type="number" value={item.currentCount} onChange={(e) => handleReconciliationChange(item.id, 'currentCount', parseFloat(e.target.value))} className="w-full p-1 border rounded text-right" />
                  ) : item.currentCount}
                </td>
                <td className="border p-2 text-right">
                  {isEditable ? (
                    <input type="number" value={item.currentAmount} onChange={(e) => handleReconciliationChange(item.id, 'currentAmount', parseFloat(e.target.value))} className="w-full p-1 border rounded text-right" />
                  ) : formatINR(item.currentAmount, 'full-number')}
                </td>
                <td className="border p-2 text-right">
                  {isEditable ? (
                    <input type="number" value={item.previousCount} onChange={(e) => handleReconciliationChange(item.id, 'previousCount', parseFloat(e.target.value))} className="w-full p-1 border rounded text-right" />
                  ) : item.previousCount}
                </td>
                <td className="border p-2 text-right">
                  {isEditable ? (
                    <input type="number" value={item.previousAmount} onChange={(e) => handleReconciliationChange(item.id, 'previousAmount', parseFloat(e.target.value))} className="w-full p-1 border rounded text-right" />
                  ) : formatINR(item.previousAmount, 'full-number')}
                </td>
                {isEditable && (
                  <td className="border p-2 text-center">
                    <button onClick={() => removeReconciliationItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shareholders Table */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-gray-700">(b) Details of shareholders holding more than 5% shares</h4>
          {isEditable && (
            <button onClick={addShareholderItem} className="text-blue-600 hover:text-blue-800 flex items-center text-xs">
              <Plus size={14} className="mr-1" /> Add Row
            </button>
          )}
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2 text-left" rowSpan={2}>Name of Shareholder</th>
              <th className="border p-2 text-center" colSpan={2}>As at {company.yearEnd}</th>
              <th className="border p-2 text-center" colSpan={2}>As at {company.prevYearEnd}</th>
              {isEditable && <th className="border p-2 w-10" rowSpan={2}></th>}
            </tr>
            <tr className="bg-gray-50">
              <th className="border p-2 text-right">No. of Shares</th>
              <th className="border p-2 text-right">% Holding</th>
              <th className="border p-2 text-right">No. of Shares</th>
              <th className="border p-2 text-right">% Holding</th>
            </tr>
          </thead>
          <tbody>
            {localData.shareholders.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">
                  {isEditable ? (
                    <input type="text" value={item.name} onChange={(e) => handleShareholderChange(item.id, 'name', e.target.value)} className="w-full p-1 border rounded" />
                  ) : item.name}
                </td>
                <td className="border p-2 text-right">
                  {isEditable ? (
                    <input type="number" value={item.currentCount} onChange={(e) => handleShareholderChange(item.id, 'currentCount', parseFloat(e.target.value))} className="w-full p-1 border rounded text-right" />
                  ) : item.currentCount}
                </td>
                <td className="border p-2 text-right">
                  {isEditable ? (
                    <input type="number" value={item.currentPercentage} onChange={(e) => handleShareholderChange(item.id, 'currentPercentage', parseFloat(e.target.value))} className="w-full p-1 border rounded text-right" />
                  ) : item.currentPercentage}%
                </td>
                <td className="border p-2 text-right">
                  {isEditable ? (
                    <input type="number" value={item.previousCount} onChange={(e) => handleShareholderChange(item.id, 'previousCount', parseFloat(e.target.value))} className="w-full p-1 border rounded text-right" />
                  ) : item.previousCount}
                </td>
                <td className="border p-2 text-right">
                  {isEditable ? (
                    <input type="number" value={item.previousPercentage} onChange={(e) => handleShareholderChange(item.id, 'previousPercentage', parseFloat(e.target.value))} className="w-full p-1 border rounded text-right" />
                  ) : item.previousPercentage}%
                </td>
                {isEditable && (
                  <td className="border p-2 text-center">
                    <button onClick={() => removeShareholderItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Promoters Table */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-gray-700">(c) Details of Shares held by Promoters at the end of the year</h4>
          {isEditable && (
            <button onClick={addPromoterItem} className="text-blue-600 hover:text-blue-800 flex items-center text-xs">
              <Plus size={14} className="mr-1" /> Add Row
            </button>
          )}
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2 text-left">Promoter Name</th>
              <th className="border p-2 text-right">No. of Shares</th>
              <th className="border p-2 text-right">% of Total Shares</th>
              <th className="border p-2 text-right">% Change during the year</th>
              {isEditable && <th className="border p-2 w-10"></th>}
            </tr>
          </thead>
          <tbody>
            {localData.promoters && localData.promoters.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">
                  {isEditable ? (
                    <input type="text" value={item.name} onChange={(e) => handlePromoterChange(item.id, 'name', e.target.value)} className="w-full p-1 border rounded" />
                  ) : item.name}
                </td>
                <td className="border p-2 text-right">
                  {isEditable ? (
                    <input type="number" value={item.currentCount} onChange={(e) => handlePromoterChange(item.id, 'currentCount', parseFloat(e.target.value))} className="w-full p-1 border rounded text-right" />
                  ) : item.currentCount}
                </td>
                <td className="border p-2 text-right">
                  {isEditable ? (
                    <input type="number" value={item.currentPercentage} onChange={(e) => handlePromoterChange(item.id, 'currentPercentage', parseFloat(e.target.value))} className="w-full p-1 border rounded text-right" />
                  ) : item.currentPercentage}%
                </td>
                <td className="border p-2 text-right">
                  {isEditable ? (
                    <input type="number" value={item.changePercentage} onChange={(e) => handlePromoterChange(item.id, 'changePercentage', parseFloat(e.target.value))} className="w-full p-1 border rounded text-right" />
                  ) : item.changePercentage}%
                </td>
                {isEditable && (
                  <td className="border p-2 text-center">
                    <button onClick={() => removePromoterItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                  </td>
                )}
              </tr>
            ))}
            {(!localData.promoters || localData.promoters.length === 0) && (
               <tr>
                 <td className="border p-2 text-center text-gray-500" colSpan={isEditable ? 5 : 4}>No promoters data added</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Values from Balance Sheet */}
      {(() => {
        // Calculate totals from issued shares
        const issuedTotalCurrent = localData.issued.reduce((sum, item) => sum + (Number(item.currentAmount) || 0), 0);
        const issuedTotalPrevious = localData.issued.reduce((sum, item) => sum + (Number(item.previousAmount) || 0), 0);
        
        // Use calculated total if items exist, otherwise use Balance Sheet value
        const displayCurrent = localData.issued.length > 0 ? issuedTotalCurrent : bsValue.current;
        const displayPrevious = localData.issued.length > 0 ? issuedTotalPrevious : bsValue.previous;
        
        return (
          <div className="mb-6 mt-8">
            <h4 className="font-semibold text-gray-700 mb-2">Summary</h4>
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
                  <td className="border border-gray-300 p-2">Authorised Share Capital</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatINR(localData.authorised.reduce((sum, item) => sum + (Number(item.currentAmount) || 0), 0), 'full-number')}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatINR(localData.authorised.reduce((sum, item) => sum + (Number(item.previousAmount) || 0), 0), 'full-number')}
                  </td>
                </tr>
                <tr className="font-semibold bg-gray-50">
                  <td className="border border-gray-300 p-2">Issued, Subscribed and Paid-up Share Capital</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatINR(issuedTotalCurrent, 'full-number')}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatINR(issuedTotalPrevious, 'full-number')}
                  </td>
                </tr>
                <tr className="font-bold bg-blue-100">
                  <td className="border border-gray-300 p-2">Balance Sheet Value (Equity Share Capital)</td>
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

export default ShareCapitalBreakdown;