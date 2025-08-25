// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Briefcase, Search } from 'lucide-react';
import { useTimeline } from './hooks/useTimeline';
import { useDarkMode } from './hooks/useDarkMode';
import { DEFAULT_TAGS, ITEM_TYPES } from './constants';
import { formatDate } from './utils/index.jsx';

import Header from './components/Header';
import Footer from './components/Footer';
import TimelineItem from './components/TimelineItem';
import EventModal from './components/EventModal';
import ConfirmClearModal from './components/ConfirmClearModal';
import DetailedView from './components/DetailedView';

function App() {
    const { items, isLoading, handleSaveItem, handleDeleteItem, clearItemsToEmpty, resetItemsToDefault, handleImportItems, handleExportEmails, handleExportEmailAsPdf } = useTimeline();
    const [theme, toggleTheme] = useDarkMode();
    
    // --- Filter States ---
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sourceFilter, setSourceFilter] = useState('All');
    const [tagFilter, setTagFilter] = useState('');
    const [authorFilter, setAuthorFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [systemTagFilter, setSystemTagFilter] = useState('');

    // --- Tag States ---
    const [userTags, setUserTags] = useState(DEFAULT_TAGS);
    const [systemTags, setSystemTags] = useState([]);
    const [threadIds, setThreadIds] = useState([]);
    const [gmailLabels, setGmailLabels] = useState([]);


    // --- UI State ---
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [resetFlag, setResetFlag] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const isAnyFilterActive = useMemo(() => {
        return searchTerm || sourceFilter !== 'All' || tagFilter || authorFilter || startDate || endDate || systemTagFilter;
    }, [searchTerm, sourceFilter, tagFilter, authorFilter, startDate, endDate, systemTagFilter]);

    const resetFilters = () => {
        setSearchTerm('');
        setSourceFilter('All');
        setTagFilter('');
        setAuthorFilter('');
        setStartDate('');
        setEndDate('');
        setSystemTagFilter('');
    };

    useEffect(() => {
        // Tag Calculation
        const allUserTags = new Set(DEFAULT_TAGS);
        const allSystemTags = new Set();
        const allThreadIds = new Set();
        const allGmailLabels = new Set();

        items.forEach(item => {
            if (item.tags && Array.isArray(item.tags)) {
                item.tags.forEach(tag => allUserTags.add(tag));
            }
            if (item.type === ITEM_TYPES.EMAIL) {
                if (item.threadId) {
                    allSystemTags.add(item.threadId);
                    allThreadIds.add(item.threadId);
                }
                if (item.gmailLabels && Array.isArray(item.gmailLabels)) {
                    item.gmailLabels.forEach(label => {
                        allSystemTags.add(label);
                        allGmailLabels.add(label);
                    });
                }
            }
        });
        setUserTags(Array.from(allUserTags).sort());
        setSystemTags(Array.from(allSystemTags).sort());
        setThreadIds(Array.from(allThreadIds));
        setGmailLabels(Array.from(allGmailLabels));

        // Filtering Logic
        let currentItems = [...items];
        
        if (sourceFilter !== 'All') {
            currentItems = currentItems.filter(item => item.sourceName === sourceFilter);
        }
        if (tagFilter) {
            currentItems = currentItems.filter(item => item.tags && item.tags.includes(tagFilter));
        }
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            currentItems = currentItems.filter(item =>
                item.title?.toLowerCase().includes(lowerSearchTerm) ||
                item.content?.toLowerCase().includes(lowerSearchTerm)
            );
        }
        if (authorFilter) {
            const lowerAuthorFilter = authorFilter.toLowerCase();
            currentItems = currentItems.filter(item => 
                item.from?.toLowerCase().includes(lowerAuthorFilter) ||
                (Array.isArray(item.to) && item.to.join(',').toLowerCase().includes(lowerAuthorFilter)) ||
                item.sender?.toLowerCase().includes(lowerAuthorFilter) ||
                item.fromUser?.toLowerCase().includes(lowerAuthorFilter)
            );
        }
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            currentItems = currentItems.filter(item => item.timestamp >= start);
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            currentItems = currentItems.filter(item => item.timestamp <= end);
        }
        if (systemTagFilter) {
            currentItems = currentItems.filter(item => 
                item.threadId === systemTagFilter || 
                (item.gmailLabels && item.gmailLabels.includes(systemTagFilter))
            );
        }

        currentItems.sort((a, b) => b.timestamp - a.timestamp);
        setFilteredItems(currentItems);

    }, [items, searchTerm, sourceFilter, tagFilter, authorFilter, startDate, endDate, systemTagFilter]);

    const groupedItems = useMemo(() => {
        return filteredItems.reduce((acc, item) => {
            const dateStr = formatDate(item.timestamp);
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(item);
            return acc;
        }, {});
    }, [filteredItems]);
    
    const openEventModalForEdit = (item) => {
        setEditingItem(item);
        setIsEventModalOpen(true);
    };
    const openEventModalForAdd = () => {
        setEditingItem(null);
        setIsEventModalOpen(true);
    };
    const closeEventModal = () => {
        setIsEventModalOpen(false);
        setEditingItem(null);
    };
    const openDetailedView = (item) => {
        setSelectedItem(item);
    };
    const closeDetailedView = () => {
        setSelectedItem(null);
    };
    const handleEditFromDetailedView = (item) => {
        closeDetailedView();
        openEventModalForEdit(item);
    };
    const handleClearAllClick = () => {
        setIsConfirmModalOpen(true);
    };
    const handleConfirmClear = () => {
        setIsConfirmModalOpen(false);
        if (resetFlag) {
            resetItemsToDefault();
        } else {
            clearItemsToEmpty();
        }
        setResetFlag(false);
    };

    if (isLoading) {
         return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-xl text-gray-700 dark:text-gray-300 p-8 text-center">
                    <Briefcase className="w-12 h-12 mx-auto text-blue-500 mb-4 animate-pulse" />
                    Loading Timeline...
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 font-inter ${selectedItem ? 'overflow-hidden' : ''}`}>
            <Header
                // Filters
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                sourceFilter={sourceFilter} setSourceFilter={setSourceFilter}
                tagFilter={tagFilter} setTagFilter={setTagFilter}
                userTags={userTags}
                authorFilter={authorFilter} setAuthorFilter={setAuthorFilter}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                systemTagFilter={systemTagFilter} setSystemTagFilter={setSystemTagFilter}
                systemTags={systemTags}
                // UI Toggle and Reset
                showAdvanced={showAdvanced} setShowAdvanced={setShowAdvanced}
                isAnyFilterActive={isAnyFilterActive} onResetFilters={resetFilters}
                // Theme
                theme={theme} toggleTheme={toggleTheme}
            />

            <main className="container mx-auto px-4 py-6 md:px-6 flex-grow">
                {filteredItems.length === 0 && (
                     <div className="text-center py-10">
                        <Search className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">No items match your search or filters.</p>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your criteria or add a new event.</p>
                    </div>
                )}
                {Object.keys(groupedItems).length > 0 && (
                    <div className="space-y-8">
                        {Object.entries(groupedItems).map(([dateStr, dateItems]) => (
                            <section key={dateStr}>
                                <h2 className={`text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 sticky bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm py-2 z-10 ${
                                    showAdvanced ? 'top-[88px] md:top-[137px]' : 'top-[88px] md:top-[80px]'
                                }`}>
                                    {dateStr}
                                </h2>
                                <div className="space-y-4 relative">
                                    <div className="absolute left-5 md:left-6 top-2 bottom-2 w-0.5 bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
                                    {dateItems.map((item) => (
                                        <TimelineItem key={item.id} item={item} onView={openDetailedView} onDelete={handleDeleteItem} threadIds={threadIds} gmailLabels={gmailLabels} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>
            
            <Footer
                totalItems={items.length}
                visibleItems={filteredItems.length}
                onClearAll={handleClearAllClick}
                onAdd={openEventModalForAdd}
                onExport={handleExportEmails}
            />
            
            <EventModal
                isOpen={isEventModalOpen}
                onClose={closeEventModal}
                onSave={(itemData) => {
                    handleSaveItem(itemData, editingItem);
                    closeEventModal();
                }}
                itemToEdit={editingItem}
                onImport={handleImportItems}
            />

            <ConfirmClearModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmClear}
                resetFlag={resetFlag}
                setResetFlag={setResetFlag}
            />
            
            <DetailedView 
                item={selectedItem}
                onClose={closeDetailedView}
                onEdit={handleEditFromDetailedView}
                onExportPdf={handleExportEmailAsPdf}
                threadIds={threadIds}
                gmailLabels={gmailLabels}
            />
        </div>
    );
}

export default App;