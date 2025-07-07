// src/components/TimelineItem.jsx
import React from 'react';
import { Trash2 } from 'lucide-react';
import { getIcon, formatTime } from '../utils/index.jsx';
import { ITEM_TYPES } from '../constants';

function TimelineItem({ item, onView, onDelete, threadIds, gmailLabels }) {
    const allTags = [
        ...(item.tags || []),
        ...(item.type === ITEM_TYPES.EMAIL && item.threadId ? [item.threadId] : []),
        ...(item.type === ITEM_TYPES.EMAIL && item.gmailLabels ? item.gmailLabels : []),
    ];

    const getTagColor = (tag) => {
        if (threadIds.includes(tag)) {
            return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'; // Green for threads
        }
        if (gmailLabels.includes(tag)) {
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'; // Purple for labels
        }
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'; // Blue for user tags
    };
    
    // Helper function to create a clean text summary from HTML
    const createSummary = (html, fallbackText) => {
        if (html) {
            try {
                // Use the browser's built-in parser to safely strip HTML tags
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const text = doc.body.textContent || "";
                return text.trim();
            } catch (e) {
                return fallbackText; // Fallback in case of parsing error
            }
        }
        return fallbackText;
    };


    return (
        <div className="flex items-start space-x-3 sm:space-x-4 relative pl-0 sm:pl-12 py-2 group">
            <div className="absolute left-3 md:left-4 top-3.5 w-4 h-4 bg-gray-100 dark:bg-gray-900 border-2 border-blue-500 rounded-full z-10 hidden sm:block group-hover:scale-125 transition-transform"></div>
            <div className="sm:hidden flex-shrink-0 pt-1">{getIcon(item.type)}</div>

            <div
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full border border-gray-200 dark:border-gray-700 cursor-pointer relative"
                onClick={() => onView(item)}
            >
                <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1 sm:mb-0 flex items-center pr-4">
                       <span className="hidden sm:inline-block mr-3">{getIcon(item.type)}</span>
                       {item.title}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">{formatTime(item.timestamp)}</span>
                </div>
                {(item.sender || item.sourceName) && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {item.sender && `From: ${item.sender}`}
                        {item.sender && item.sourceName && ` | `}
                        {item.sourceName && `Source: ${item.sourceName}`}
                    </p>
                )}
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
                    {createSummary(item.html, item.content)}
                </p>
                {allTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                            <span 
                                key={tag} 
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getTagColor(tag)}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
                           onDelete(item.id);
                        }
                    }}
                    className="absolute bottom-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Item"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default TimelineItem;