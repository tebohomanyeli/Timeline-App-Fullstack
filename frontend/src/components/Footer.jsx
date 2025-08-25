// src/components/Footer.jsx
import React from 'react';
import { Trash2, Plus, Download } from 'lucide-react'; // Import Download icon

function Footer({ totalItems, visibleItems, onClearAll, onAdd, onExport }) { // Add onExport prop
    return (
        <footer className="bg-white dark:bg-gray-800 shadow-up py-4 mt-auto sticky bottom-0 z-30 border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                    {totalItems} total items. {visibleItems} visible.
                </p>
                <div className="flex items-center space-x-2">
                     <button onClick={onExport} className="p-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900/80 font-semibold rounded-lg shadow-sm transition-colors flex items-center">
                       <Download className="w-4 h-4 mr-1" /> Export Emails
                    </button>
                     <button onClick={onClearAll} className="p-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80 font-semibold rounded-lg shadow-sm transition-colors flex items-center">
                       <Trash2 className="w-4 h-4 mr-1" /> Clear All
                    </button>
                    <button onClick={onAdd} className="p-2 px-4 text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow transition-colors flex items-center">
                       <Plus className="w-5 h-5 mr-1" /> Add to Timeline
                    </button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;