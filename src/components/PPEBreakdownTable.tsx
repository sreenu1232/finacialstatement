import React, { useState, useEffect } from 'react';
import { Company } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface PPEItem {
    id: string;
    description: string;
    grossBlock: number;
    depreciation: number;
}

interface PPEBreakdownTableProps {
    items: PPEItem[];
    onUpdate: (items: PPEItem[], totalGrossBlock: number, totalDepreciation: number, totalNetBlock: number) => void;
    isEditable: boolean;
    company: Company;
}

const PPEBreakdownTable: React.FC<PPEBreakdownTableProps> = ({ items, onUpdate, isEditable, company }) => {
    const [localItems, setLocalItems] = useState<PPEItem[]>(items || [
        { id: '1', description: 'Land', grossBlock: 0, depreciation: 0 },
        { id: '2', description: 'Buildings', grossBlock: 0, depreciation: 0 },
        { id: '3', description: 'Plant and Equipment', grossBlock: 0, depreciation: 0 },
        { id: '4', description: 'Furniture and Fixtures', grossBlock: 0, depreciation: 0 },
        { id: '5', description: 'Vehicles', grossBlock: 0, depreciation: 0 },
        { id: '6', description: 'Office Equipment', grossBlock: 0, depreciation: 0 },
    ]);

    useEffect(() => {
        if (items && items.length > 0) {
            setLocalItems(items);
        }
    }, [items]);

    const calculateTotals = (currentItems: PPEItem[]) => {
        const totalGrossBlock = currentItems.reduce((sum, item) => sum + (Number(item.grossBlock) || 0), 0);
        const totalDepreciation = currentItems.reduce((sum, item) => sum + (Number(item.depreciation) || 0), 0);
        const totalNetBlock = totalGrossBlock - totalDepreciation;
        return { totalGrossBlock, totalDepreciation, totalNetBlock };
    };

    const getNetBlock = (item: PPEItem): number => {
        return (Number(item.grossBlock) || 0) - (Number(item.depreciation) || 0);
    };

    const handleChange = (id: string, field: keyof PPEItem, value: string | number) => {
        const updatedItems = localItems.map(item =>
            item.id === id ? { ...item, [field]: field === 'description' ? value : Number(value) || 0 } : item
        );
        setLocalItems(updatedItems);
        const { totalGrossBlock, totalDepreciation, totalNetBlock } = calculateTotals(updatedItems);
        if (onUpdate) {
            onUpdate(updatedItems, totalGrossBlock, totalDepreciation, totalNetBlock);
        }
    };

    const addItem = () => {
        const newItem: PPEItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            description: '',
            grossBlock: 0,
            depreciation: 0
        };
        const updatedItems = [...localItems, newItem];
        setLocalItems(updatedItems);
        const { totalGrossBlock, totalDepreciation, totalNetBlock } = calculateTotals(updatedItems);
        if (onUpdate) {
            onUpdate(updatedItems, totalGrossBlock, totalDepreciation, totalNetBlock);
        }
    };

    const removeItem = (id: string) => {
        const updatedItems = localItems.filter(item => item.id !== id);
        setLocalItems(updatedItems);
        const { totalGrossBlock, totalDepreciation, totalNetBlock } = calculateTotals(updatedItems);
        if (onUpdate) {
            onUpdate(updatedItems, totalGrossBlock, totalDepreciation, totalNetBlock);
        }
    };

    const { totalGrossBlock, totalDepreciation, totalNetBlock } = calculateTotals(localItems);

    return (
        <div className="mt-4 mb-8">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="border p-2 text-left">Description</th>
                        <th className="border p-2 text-right w-28">Gross Block</th>
                        <th className="border p-2 text-right w-28">Depreciation</th>
                        <th className="border p-2 text-right w-28">Net Block</th>
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
                                        value={item.grossBlock}
                                        onChange={(e) => handleChange(item.id, 'grossBlock', Number(e.target.value))}
                                        className="w-full p-1 border rounded text-right"
                                    />
                                ) : (
                                    formatINR(item.grossBlock, 'full-number')
                                )}
                            </td>
                            <td className="border p-2 text-right">
                                {isEditable ? (
                                    <input
                                        type="number"
                                        value={item.depreciation}
                                        onChange={(e) => handleChange(item.id, 'depreciation', Number(e.target.value))}
                                        className="w-full p-1 border rounded text-right"
                                    />
                                ) : (
                                    formatINR(item.depreciation, 'full-number')
                                )}
                            </td>
                            <td className="border p-2 text-right font-semibold bg-blue-50">
                                {formatINR(getNetBlock(item), 'full-number')}
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
                        <td className="border p-2 text-right">{formatINR(totalGrossBlock, 'full-number')}</td>
                        <td className="border p-2 text-right">{formatINR(totalDepreciation, 'full-number')}</td>
                        <td className="border p-2 text-right bg-blue-100">{formatINR(totalNetBlock, 'full-number')}</td>
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

export default PPEBreakdownTable;
