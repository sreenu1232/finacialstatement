import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BreakdownItem, Company } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface EPSBreakdownTableProps {
    items: BreakdownItem[];
    onUpdate: (items: BreakdownItem[], totalCurrent: number, totalPrevious: number) => void;
    isEditable: boolean;
    company: Company;
}

const EPSBreakdownTable: React.FC<EPSBreakdownTableProps> = ({ items, onUpdate, isEditable, company }) => {
    // Only ABC Limited gets pre-filled values, others get 0
    const defaultItems: BreakdownItem[] = useMemo(() => company.name === 'ABC Limited' 
        ? [
            { id: 'net-profit', description: 'Net profit', current: 19200000, previous: 0 },
            { id: 'equity-shares', description: 'No.of Equity Shares', current: 4000000, previous: 0 }
          ]
        : [
            { id: 'net-profit', description: 'Net profit', current: 0, previous: 0 },
            { id: 'equity-shares', description: 'No.of Equity Shares', current: 0, previous: 0 }
          ], [company.name]);
    
    const [localItems, setLocalItems] = useState<BreakdownItem[]>(items && items.length > 0 ? items : defaultItems);
    const hasInitialized = useRef(false);
    
    useEffect(() => {
        let itemsToSet = items;
        if (!items || items.length === 0) {
            itemsToSet = defaultItems;
        }
        
        if (itemsToSet && itemsToSet.length > 0) {
            setLocalItems(itemsToSet);
            // Calculate and update EPS when items are first set or when items prop changes
            const { epsCurrent, epsPrevious } = calculateEPS(itemsToSet);
            if (onUpdate && (epsCurrent > 0 || !hasInitialized.current)) {
                onUpdate(itemsToSet, epsCurrent, epsPrevious);
                hasInitialized.current = true;
            }
        }
    }, [items, onUpdate, defaultItems]);

    const calculateEPS = (currentItems: BreakdownItem[]) => {
        if (!currentItems || currentItems.length === 0) {
            return { epsCurrent: 0, epsPrevious: 0 };
        }

        // Try to find items by ID first (most reliable)
        let netProfitItem = currentItems.find(item => item.id === 'net-profit');
        let equitySharesItem = currentItems.find(item => item.id === 'equity-shares');
        
        // If not found by ID, try to find by description
        if (!netProfitItem) {
            netProfitItem = currentItems.find(item => {
                const desc = item.description.toLowerCase().trim();
                return desc.includes('net profit') || desc === 'net profit';
            });
        }
        
        if (!equitySharesItem) {
            equitySharesItem = currentItems.find(item => {
                const desc = item.description.toLowerCase().trim();
                return desc.includes('equity shares') || 
                       desc.includes('no.of equity shares') ||
                       desc.includes('no. of equity shares') ||
                       desc.includes('no of equity shares') ||
                       desc.includes('number of equity shares');
            });
        }
        
        // If still not found, use first two items as fallback
        if (!netProfitItem && currentItems.length > 0) {
            netProfitItem = currentItems[0];
        }
        if (!equitySharesItem && currentItems.length > 1) {
            equitySharesItem = currentItems[1];
        }
        
        const netProfitCurrent = netProfitItem ? (Number(netProfitItem.current) || 0) : 0;
        const netProfitPrevious = netProfitItem ? (Number(netProfitItem.previous) || 0) : 0;
        const equitySharesCurrent = equitySharesItem ? (Number(equitySharesItem.current) || 0) : 0;
        const equitySharesPrevious = equitySharesItem ? (Number(equitySharesItem.previous) || 0) : 0;
        
        // Calculate EPS: NET PROFIT / No. of Equity Shares
        const epsCurrent = equitySharesCurrent > 0 ? netProfitCurrent / equitySharesCurrent : 0;
        const epsPrevious = equitySharesPrevious > 0 ? netProfitPrevious / equitySharesPrevious : 0;
        
        return { epsCurrent, epsPrevious };
    };

    const handleChange = (id: string, field: keyof BreakdownItem, value: string | number) => {
        // Convert to number for current/previous fields, keep string for description
        const processedValue = field === 'description' ? value : (Number(value) || 0);
        const updatedItems = localItems.map(item =>
            item.id === id ? { ...item, [field]: processedValue } : item
        );
        setLocalItems(updatedItems);
        // Calculate EPS immediately on change
        const { epsCurrent, epsPrevious } = calculateEPS(updatedItems);
        if (onUpdate) {
            onUpdate(updatedItems, epsCurrent, epsPrevious);
        }
    };

    const handleBlur = (id: string, field: keyof BreakdownItem, value: string | number) => {
        // Ensure numeric values are properly parsed
        const numericValue = field === 'description' ? value : Number(value) || 0;
        const updatedItems = localItems.map(item =>
            item.id === id ? { ...item, [field]: numericValue } : item
        );
        setLocalItems(updatedItems);
        // Recalculate EPS on blur
        const { epsCurrent, epsPrevious } = calculateEPS(updatedItems);
        if (onUpdate) {
            onUpdate(updatedItems, epsCurrent, epsPrevious);
        }
    };

    const addItem = () => {
        try {
            const newItem: BreakdownItem = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                description: '',
                current: 0,
                previous: 0
            };
            const updatedItems = [...localItems, newItem];
            setLocalItems(updatedItems);
            const { epsCurrent, epsPrevious } = calculateEPS(updatedItems);
            if (onUpdate) {
                onUpdate(updatedItems, epsCurrent, epsPrevious);
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const removeItem = (id: string) => {
        try {
            const updatedItems = localItems.filter(item => item.id !== id);
            setLocalItems(updatedItems);
            const { epsCurrent, epsPrevious } = calculateEPS(updatedItems);
            if (onUpdate) {
                onUpdate(updatedItems, epsCurrent, epsPrevious);
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const { epsCurrent, epsPrevious } = calculateEPS(localItems);

    return (
        <div className="mt-4 mb-8">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="border p-2 text-left">Particulars</th>
                        <th className="border p-2 text-right w-32">As at {company.yearEnd}</th>
                        <th className="border p-2 text-right w-32">As at {company.prevYearEnd}</th>
                        {isEditable && <th className="border p-2 w-10"></th>}
                    </tr>
                </thead>
                <tbody>
                    {localItems.map((item) => (
                        <tr key={item.id}>
                            <td className="border p-2">
                                {isEditable ? (
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                                        onBlur={(e) => handleBlur(item.id, 'description', e.target.value)}
                                        className="w-full p-1 border rounded"
                                        placeholder="Description"
                                    />
                                ) : (
                                    item.description
                                )}
                            </td>
                            <td className="border p-2 text-right">
                                {isEditable ? (
                                    <input
                                        type="number"
                                        value={item.current || ''}
                                        onChange={(e) => handleChange(item.id, 'current', e.target.value)}
                                        onBlur={(e) => handleBlur(item.id, 'current', e.target.value)}
                                        className="w-full p-1 border rounded text-right"
                                    />
                                ) : (
                                    formatINR(item.current, 'full-number')
                                )}
                            </td>
                            <td className="border p-2 text-right">
                                {isEditable ? (
                                    <input
                                        type="number"
                                        value={item.previous || ''}
                                        onChange={(e) => handleChange(item.id, 'previous', e.target.value)}
                                        onBlur={(e) => handleBlur(item.id, 'previous', e.target.value)}
                                        className="w-full p-1 border rounded text-right"
                                    />
                                ) : (
                                    formatINR(item.previous, 'full-number')
                                )}
                            </td>
                            {isEditable && (
                                <td className="border p-2 text-center">
                                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    <tr className="font-bold bg-gray-50">
                        <td className="border p-2">Total (EPS)</td>
                        <td className="border p-2 text-right">
                            {isNaN(epsCurrent) || !isFinite(epsCurrent) ? '0.00' : epsCurrent.toFixed(2)}
                        </td>
                        <td className="border p-2 text-right">
                            {isNaN(epsPrevious) || !isFinite(epsPrevious) ? '0.00' : epsPrevious.toFixed(2)}
                        </td>
                        {isEditable && <td className="border p-2"></td>}
                    </tr>
                </tbody>
            </table>
            {isEditable && (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={addItem}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md font-medium"
                    >
                        <Plus size={16} />
                        Add Item
                    </button>
                </div>
            )}
        </div>
    );
};

export default EPSBreakdownTable;
