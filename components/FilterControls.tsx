import React from 'react';
import { FilterState } from '../types';

interface FilterControlsProps {
    filters: FilterState;
    onFilterChange: (filterName: keyof FilterState, value: string) => void;
    onResetFilters: () => void;
    uniqueCategories: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange, onResetFilters, uniqueCategories }) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onFilterChange(name as keyof FilterState, value);
    };
    
    return (
        <div className="p-4 bg-white rounded-lg shadow-md border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., Amazon, Starbucks"
                        value={filters.description}
                        onChange={handleInputChange}
                    />
                </div>
                
                {/* Category */}
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                        id="category"
                        name="category"
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={filters.category}
                        onChange={handleInputChange}
                    >
                        <option value="">All Categories</option>
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>


                {/* Date Range */}
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={filters.startDate}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={filters.endDate}
                        onChange={handleInputChange}
                    />
                </div>
                 
                {/* Debit Range */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Debit Amount</label>
                    <div className="flex items-center space-x-2">
                         <input
                            type="number"
                            name="minDebit"
                            id="minDebit"
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Min"
                            value={filters.minDebit}
                            onChange={handleInputChange}
                            min="0"
                        />
                         <span className="text-slate-500">-</span>
                         <input
                            type="number"
                            name="maxDebit"
                            id="maxDebit"
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Max"
                            value={filters.maxDebit}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>
                </div>

                {/* Credit Range */}
                <div className="md:col-span-1">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Credit Amount</label>
                    <div className="flex items-center space-x-2">
                         <input
                            type="number"
                            name="minCredit"
                            id="minCredit"
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Min"
                            value={filters.minCredit}
                            onChange={handleInputChange}
                            min="0"
                        />
                         <span className="text-slate-500">-</span>
                         <input
                            type="number"
                            name="maxCredit"
                            id="maxCredit"
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Max"
                            value={filters.maxCredit}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>
                </div>

                 <div className="md:col-span-2 flex justify-end">
                    <button
                        onClick={onResetFilters}
                        className="px-4 py-2 bg-slate-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition-colors duration-300"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterControls;
