import React, { useState } from 'react';
import { Transaction, SortConfig } from '../types';

interface DataTableProps {
    transactions: Transaction[];
    sortConfig: SortConfig | null;
    requestSort: (key: keyof Transaction) => void;
    allCategories: string[];
    onCategoryChange: (id: string, newCategory: string) => void;
    onAddNewCategory: (newCategory: string) => void;
}

const SortIcon = ({ direction }: { direction: 'asc' | 'desc' | null }) => {
    return (
        <span className="inline-flex flex-col ml-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${direction === 'asc' ? 'text-slate-800' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${direction === 'desc' ? 'text-slate-800' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
        </span>
    );
};

const SortableHeader: React.FC<{
    columnKey: keyof Transaction;
    title: string;
    sortConfig: SortConfig | null;
    requestSort: (key: keyof Transaction) => void;
    className?: string;
}> = ({ columnKey, title, sortConfig, requestSort, className = '' }) => {
    const direction = sortConfig?.key === columnKey ? sortConfig.direction : null;
    return (
        <th scope="col" className={`px-6 py-3 ${className}`}>
            <div
                className="flex items-center cursor-pointer select-none group"
                onClick={() => requestSort(columnKey)}
            >
                {title}
                <SortIcon direction={direction} />
            </div>
        </th>
    );
}

const categoryColorMap: { [key: string]: string } = {
    'Bank Charges': 'bg-red-100 text-red-800',
    'Claims': 'bg-amber-100 text-amber-800',
    'Stamp Duty': 'bg-purple-100 text-purple-800',
    'Capitation': 'bg-green-100 text-green-800',
    'IHMS': 'bg-sky-100 text-sky-800',
    'Other': 'bg-slate-100 text-slate-800',
};

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
    const colorClass = categoryColorMap[category] || 'bg-gray-100 text-gray-800';
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
            {category}
        </span>
    );
};

const DataTable: React.FC<DataTableProps> = ({ transactions, sortConfig, requestSort, allCategories, onCategoryChange, onAddNewCategory }) => {
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
        const newCategory = e.target.value;

        if (newCategory === '--add-new--') {
            const customCategory = window.prompt("Enter new category name:");
            if (customCategory && customCategory.trim() !== "") {
                const trimmedCategory = customCategory.trim();
                onAddNewCategory(trimmedCategory);
                onCategoryChange(id, trimmedCategory);
            }
        } else {
            onCategoryChange(id, newCategory);
        }
        setEditingId(null); // Exit editing mode after change
    };


    const formatCurrency = (amount: number | null) => {
        if (amount === null || typeof amount !== 'number') {
            return <span className="text-slate-400">-</span>;
        }
        return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
    };

    return (
        <div className="w-full overflow-hidden rounded-lg shadow-md border border-slate-200">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                            <SortableHeader columnKey="date" title="Date" sortConfig={sortConfig} requestSort={requestSort} />
                            <SortableHeader columnKey="description" title="Description" sortConfig={sortConfig} requestSort={requestSort} />
                            <SortableHeader columnKey="category" title="Category" sortConfig={sortConfig} requestSort={requestSort} />
                            <SortableHeader columnKey="debit" title="Debit" sortConfig={sortConfig} requestSort={requestSort} className="text-right" />
                            <SortableHeader columnKey="credit" title="Credit" sortConfig={sortConfig} requestSort={requestSort} className="text-right" />
                            <SortableHeader columnKey="balance" title="Balance" sortConfig={sortConfig} requestSort={requestSort} className="text-right" />
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx, index) => (
                            <tr key={index} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{tx.date}</td>
                                <td className="px-6 py-4">{tx.description}</td>
                                <td className="px-6 py-4">
                                    {editingId === tx.id ? (
                                        <select
                                            value={tx.category}
                                            onChange={(e) => handleCategorySelectChange(e, tx.id)}
                                            onBlur={() => setEditingId(null)}
                                            autoFocus
                                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            {allCategories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                            <option value="" disabled>──────────</option>
                                            <option value="--add-new--">＋ Add New...</option>
                                        </select>
                                    ) : (
                                        <div onClick={() => setEditingId(tx.id)} className="cursor-pointer">
                                            <CategoryBadge category={tx.category} />
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-red-600">{formatCurrency(tx.debit)}</td>
                                <td className="px-6 py-4 text-right font-mono text-green-600">{formatCurrency(tx.credit)}</td>
                                <td className="px-6 py-4 text-right font-mono">{formatCurrency(tx.balance)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;