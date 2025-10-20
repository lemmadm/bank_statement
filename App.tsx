import React, { useState, useMemo, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import FilterControls from './components/FilterControls';
import { analyzeStatement } from './services/geminiService';
import { Transaction, FilterState, SortConfig, SortDirection } from './types';

// Extend window type for xlsx library from CDN
declare global {
    interface Window {
        XLSX: any;
    }
}

const ExcelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 2v10h12V5H4zm3 2h2v2H7V7zm0 3h2v2H7v-2zm0 3h2v2H7v-2zm3-6h2v2h-2V7zm0 3h2v2h-2v-2zm0 3h2v2h-2v-2z" />
    </svg>
);

const Loader: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-md border border-slate-200">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
         <h3 className="mt-4 text-lg font-semibold text-slate-700">AI is analyzing your statement...</h3>
         <p className="text-sm text-slate-500">Categorizing transactions. Please wait.</p>
    </div>
);

const INITIAL_FILTERS: FilterState = {
    startDate: '',
    endDate: '',
    description: '',
    minDebit: '',
    maxDebit: '',
    minCredit: '',
    maxCredit: '',
    category: '',
};

const CUSTOM_CATEGORIES_STORAGE_KEY = 'bankStatementConverter_customCategories';
const DEFAULT_CATEGORIES = ['Bank Charges', 'Claims', 'Stamp Duty', 'IHMS', 'Capitation', 'Other'];

const App: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'asc' });
    const [allCategories, setAllCategories] = useState<string[]>(DEFAULT_CATEGORIES);

    useEffect(() => {
        try {
            const savedCategoriesJSON = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
            if (savedCategoriesJSON) {
                const savedCategories = JSON.parse(savedCategoriesJSON);
                setAllCategories(prev => {
                    const combined = new Set([...prev, ...savedCategories]);
                    return Array.from(combined).sort();
                });
            }
        } catch (e) {
            console.error("Failed to load custom categories from localStorage", e);
        }
    }, []);

    useEffect(() => {
        if (transactions.length > 0) {
            const aiCategories = new Set(transactions.map(tx => tx.category));
            setAllCategories(prev => {
                const combined = new Set([...prev, ...Array.from(aiCategories)]);
                return Array.from(combined).sort();
            });
        }
    }, [transactions]);

    const handleFileSelect = async (file: File) => {
        setIsLoading(true);
        setError(null);
        setTransactions([]);
        setFilters(INITIAL_FILTERS);
        setFileName(file.name);

        try {
            const result = await analyzeStatement(file);
            setTransactions(result);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (filterName: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const handleResetFilters = () => {
        setFilters(INITIAL_FILTERS);
    };

    const handleAddNewCategory = (newCategory: string) => {
        if (newCategory && !allCategories.includes(newCategory)) {
            const updatedCategories = [...allCategories, newCategory].sort();
            setAllCategories(updatedCategories);

            try {
                const customCategories = updatedCategories.filter(cat => !DEFAULT_CATEGORIES.includes(cat));
                localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(customCategories));
            } catch (e) {
                console.error("Failed to save custom categories to localStorage", e);
            }
        }
    };

    const handleCategoryChange = (transactionIndex: number, newCategory: string) => {
        setTransactions(prev => {
            const newTransactions = [...prev];
            if (newTransactions[transactionIndex]) {
                 newTransactions[transactionIndex].category = newCategory;
            }
            return newTransactions;
        });
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            if (filters.startDate && new Date(tx.date) < new Date(filters.startDate)) return false;
            if (filters.endDate) {
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999);
                if (new Date(tx.date) > endDate) return false;
            }
            if (filters.description && !tx.description.toLowerCase().includes(filters.description.toLowerCase())) return false;
            if (filters.category && tx.category !== filters.category) return false;
            
            const minDebit = filters.minDebit !== '' ? parseFloat(filters.minDebit) : -Infinity;
            const maxDebit = filters.maxDebit !== '' ? parseFloat(filters.maxDebit) : Infinity;
            if (minDebit > -Infinity || maxDebit < Infinity) {
                if (tx.debit === null || tx.debit < minDebit || tx.debit > maxDebit) return false;
            }

            const minCredit = filters.minCredit !== '' ? parseFloat(filters.minCredit) : -Infinity;
            const maxCredit = filters.maxCredit !== '' ? parseFloat(filters.maxCredit) : Infinity;
            if (minCredit > -Infinity || maxCredit < Infinity) {
                if (tx.credit === null || tx.credit < minCredit || tx.credit > maxCredit) return false;
            }

            return true;
        });
    }, [transactions, filters]);

    const requestSort = (key: keyof Transaction) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedTransactions = useMemo(() => {
        const sortableItems = [...filteredTransactions];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal === null) return 1;
                if (bVal === null) return -1;
                
                if (aVal < bVal) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredTransactions, sortConfig]);

    const handleExportToExcel = () => {
        if (sortedTransactions.length === 0) return;

        const worksheet = window.XLSX.utils.json_to_sheet(sortedTransactions);
        const workbook = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
        
        const excelFileName = `${fileName?.replace(/\.pdf$/i, '') || 'transactions'}.xlsx`;

        window.XLSX.writeFile(workbook, excelFileName);
    };

    const renderContent = () => {
        if (isLoading) return <Loader />;
        if (error) {
            return (
                <div className="p-4 text-center bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md" role="alert">
                    <strong className="font-bold">Oh no!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            );
        }
        if (transactions.length > 0) {
            return (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2 sm:mb-0">Extracted Transactions</h2>
                        <button
                            onClick={handleExportToExcel}
                            disabled={sortedTransactions.length === 0}
                            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                           <ExcelIcon /> Export to Excel
                        </button>
                    </div>
                    <FilterControls 
                        filters={filters} 
                        onFilterChange={handleFilterChange}
                        onResetFilters={handleResetFilters}
                        uniqueCategories={allCategories}
                    />
                    <DataTable 
                        transactions={sortedTransactions}
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                        allCategories={allCategories}
                        onCategoryChange={handleCategoryChange}
                        onAddNewCategory={handleAddNewCategory}
                    />
                    {sortedTransactions.length === 0 && (
                        <div className="text-center p-8 bg-white rounded-lg shadow-md border border-slate-200">
                             <h3 className="text-lg font-semibold text-slate-700">No Transactions Found</h3>
                             <p className="mt-2 text-slate-500">No transactions match your current filters. Try adjusting your search.</p>
                        </div>
                    )}
                </div>
            );
        }
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-700">Ready to Start?</h2>
                <p className="mt-2 text-slate-500">Upload your bank statement PDF to begin the automated extraction process.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <main className="container mx-auto px-4 py-8 sm:py-12">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Bank Statement Converter
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600">
                        Transform your PDF bank statements into organized Excel data in seconds.
                    </p>
                </header>
                
                <div className="mb-10">
                     <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
                </div>

                <div className="w-full max-w-6xl mx-auto">
                    {renderContent()}
                </div>

                 <footer className="text-center mt-12 py-4">
                    <p className="text-sm text-slate-500">Powered by Gemini AI</p>
                </footer>
            </main>
        </div>
    );
};

export default App;