import React, { useState, useEffect } from 'react';
import { BreakdownItem, Company } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface BreakdownTableProps {
    items: BreakdownItem[];
    onUpdate: (items: BreakdownItem[], totalCurrent: number, totalPrevious: number) => void;
    isEditable: boolean;
    company: Company;
}

const BreakdownTable: React.FC<BreakdownTableProps> = ({ items, onUpdate, isEditable, company }) => {
    const [localItems, setLocalItems] = useState<BreakdownItem[]>(items || []);

    useEffect(() => {
        setLocalItems(items || []);
    }, [items]);

    const calculateTotals = (currentItems: BreakdownItem[]) => {
        const totalCurrent = currentItems.reduce((sum, item) => sum + (Number(item.current) || 0), 0);
        const totalPrevious = currentItems.reduce((sum, item) => sum + (Number(item.previous) || 0), 0);
        return { totalCurrent, totalPrevious };
    };

    const handleChange = (id: string, field: keyof BreakdownItem, value: string | number) => {
        const updatedItems = localItems.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setLocalItems(updatedItems);
        // Only update totals when user finishes editing (on blur would be better, but for now on change)
        const { totalCurrent, totalPrevious } = calculateTotals(updatedItems);
        if (onUpdate) {
            onUpdate(updatedItems, totalCurrent, totalPrevious);
        }
    };

    const handleBlur = (id: string, field: keyof BreakdownItem, value: string | number) => {
        // Ensure numeric values are properly parsed
        const numericValue = field === 'description' ? value : Number(value) || 0;
        const updatedItems = localItems.map(item =>
            item.id === id ? { ...item, [field]: numericValue } : item
        );
        setLocalItems(updatedItems);
        const { totalCurrent, totalPrevious } = calculateTotals(updatedItems);
        if (onUpdate) {
            onUpdate(updatedItems, totalCurrent, totalPrevious);
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
            const { totalCurrent, totalPrevious } = calculateTotals(updatedItems);
            if (onUpdate) {
                onUpdate(updatedItems, totalCurrent, totalPrevious);
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const removeItem = (id: string) => {
        try {
            const updatedItems = localItems.filter(item => item.id !== id);
            setLocalItems(updatedItems);
            const { totalCurrent, totalPrevious } = calculateTotals(updatedItems);
            if (onUpdate) {
                onUpdate(updatedItems, totalCurrent, totalPrevious);
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const { totalCurrent, totalPrevious } = calculateTotals(localItems);

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
                                        value={item.current}
                                        onChange={(e) => handleChange(item.id, 'current', Number(e.target.value))}
                                        onBlur={(e) => handleBlur(item.id, 'current', Number(e.target.value))}
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
                                        value={item.previous}
                                        onChange={(e) => handleChange(item.id, 'previous', Number(e.target.value))}
                                        onBlur={(e) => handleBlur(item.id, 'previous', Number(e.target.value))}
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
                        <td className="border p-2">Total</td>
                        <td className="border p-2 text-right">{formatINR(totalCurrent, 'full-number')}</td>
                        <td className="border p-2 text-right">{formatINR(totalPrevious, 'full-number')}</td>
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

export default BreakdownTable;
