// src/components/Header.jsx
import React from 'react';
import { Search, Filter, Tag, ChevronDown, User, Calendar, SlidersHorizontal, Hash, X } from 'lucide-react';
import { ITEM_SOURCES } from '../constants';
import ThemeToggle from './ThemeToggle';

function Header({ 
    searchTerm, setSearchTerm, 
    sourceFilter, setSourceFilter, 
    tagFilter, setTagFilter, 
    userTags, 
    authorFilter, setAuthorFilter,
    startDate, setStartDate,
    endDate, setEndDate,
    systemTagFilter, setSystemTagFilter,
    systemTags,
    theme, toggleTheme, 
    showAdvanced, setShowAdvanced,
    isAnyFilterActive, onResetFilters
}) {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 md:px-6">
                <div className="py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                       <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Local Timeline</h1>
                       <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="Search content..." className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors w-full sm:w-48 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="relative hidden md:block">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select className="pl-10 pr-8 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none transition-colors w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
                                {ITEM_SOURCES.map(source => <option key={source} value={source}>{source}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="relative hidden md:block">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select className="pl-10 pr-8 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none transition-colors w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
                                <option value="">All User Tags</option>
                                {userTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                        {/* Reset Filters Button */}
                        {isAnyFilterActive && (
                            <button 
                                onClick={onResetFilters}
                                className="p-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                title="Reset Filters"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                        {/* Advanced Search Toggle Button */}
                        <button 
                            onClick={() => setShowAdvanced(!showAdvanced)} 
                            className={`p-2 rounded-lg transition-colors ${showAdvanced ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            title="Advanced Filters"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {showAdvanced && (
                    <div className="pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-gray-200 dark:border-gray-600 pt-3">
                        <div className="relative">
                            <label htmlFor="authorFilter" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sender/Receiver</label>
                            <User className="absolute left-3 bottom-2.5 w-5 h-5 text-gray-400" />
                            <input id="authorFilter" type="text" placeholder="e.g. john.doe@..." className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} />
                        </div>
                        <div className="relative">
                            <label htmlFor="systemTagFilter" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">System Tags (Threads, etc.)</label>
                            <Hash className="absolute left-3 bottom-2.5 w-5 h-5 text-gray-400" />
                            <select id="systemTagFilter" className="pl-10 pr-8 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none transition-colors w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" value={systemTagFilter} onChange={(e) => setSystemTagFilter(e.target.value)}>
                                <option value="">All System Tags</option>
                                {systemTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 bottom-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <label htmlFor="startDate" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                            <Calendar className="absolute left-3 bottom-2.5 w-5 h-5 text-gray-400" />
                            <input id="startDate" type="date" className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                         <div className="relative">
                            <label htmlFor="endDate" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">End Date</label>
                            <Calendar className="absolute left-3 bottom-2.5 w-5 h-5 text-gray-400" />
                            <input id="endDate" type="date" className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
