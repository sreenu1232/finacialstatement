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
        const { totalCurrent, totalPrevious } = calculateTotals(updatedItems);
        onUpdate(updatedItems, totalCurrent, totalPrevious);
    };

    const addItem = () => {
        const newItem: BreakdownItem = {
            id: Date.now().toString(),
            description: '',
            current: 0,
            previous: 0
        };
        const updatedItems = [...localItems, newItem];
        setLocalItems(updatedItems);
        const { totalCurrent, totalPrevious } = calculateTotals(updatedItems);
        onUpdate(updatedItems, totalCurrent, totalPrevious);
    };

    const removeItem = (id: string) => {
        const updatedItems = localItems.filter(item => item.id !== id);
        setLocalItems(updatedItems);
        const { totalCurrent, totalPrevious } = calculateTotals(updatedItems);
        onUpdate(updatedItems, totalCurrent, totalPrevious);
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
                                        className="w-full p-1 border rounded text-right"
                                    />
                                ) : (
                                    formatINR(item.current)
                                )}
                            </td>
                            <td className="border p-2 text-right">
                                {isEditable ? (
                                    <input
                                        type="number"
                                        value={item.previous}
                                        onChange={(e) => handleChange(item.id, 'previous', Number(e.target.value))}
                                        className="w-full p-1 border rounded text-right"
                                    />
                                ) : (
                                    formatINR(item.previous)
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
                        <td className="border p-2 text-right">{formatINR(totalCurrent)}</td>
                        <td className="border p-2 text-right">{formatINR(totalPrevious)}</td>
                        {isEditable && <td className="border p-2"></td>}
                    </tr>
                </tbody>
            </table>
            {isEditable && (
                <button
                    onClick={addItem}
                    className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    <Plus size={16} /> Add Item
                </button>
            )}
        </div>
    );
};

export default BreakdownTable;
