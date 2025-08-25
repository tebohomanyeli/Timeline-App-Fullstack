// src/components/DetailedView.jsx
import React from 'react';
import { X, Edit, Calendar, Clock, User, Tag, Mail, Users, Hash, FileText, FolderOpen, MessageSquare, StickyNote, Paperclip, Download } from 'lucide-react'; // Import Download icon
import { getIcon, formatDate, formatTime } from '../utils/index.jsx';
import { ITEM_TYPES } from '../constants/index.jsx';

function DetailedView({ item, onClose, onEdit, onExportPdf, threadIds, gmailLabels }) { // Add onExportPdf prop
    if (!item) return null;

    const allTags = [
        ...(item.tags || []),
        ...(item.type === ITEM_TYPES.EMAIL && item.threadId ? [item.threadId] : []),
        ...(item.type === ITEM_TYPES.EMAIL && item.gmailLabels ? item.gmailLabels : []),
    ];

    const getTagColor = (tag) => {
        if (threadIds && threadIds.includes(tag)) {
            return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        }
        if (gmailLabels && gmailLabels.includes(tag)) {
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
        }
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    };

    const renderEmailDetails = () => (
        <>
            <div className="flex items-start text-gray-600 dark:text-gray-400">
                <Mail className="w-5 h-5 mr-4 mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                    <p><span className="font-semibold text-gray-700 dark:text-gray-300">From:</span> {item.from}</p>
                    <p><span className="font-semibold text-gray-700 dark:text-gray-300">To:</span> {Array.isArray(item.to) ? item.to.join(', ') : item.to}</p>
                    {item.cc && item.cc.length > 0 && (
                         <p><span className="font-semibold text-gray-700 dark:text-gray-300">Cc:</span> {item.cc.join(', ')}</p>
                    )}
                    {item.bcc && item.bcc.length > 0 && (
                         <p><span className="font-semibold text-gray-700 dark:text-gray-300">Bcc:</span> {item.bcc.join(', ')}</p>
                    )}
                </div>
            </div>
        </>
    );

    const renderFileDetails = () => (
        <>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FileText className="w-5 h-5 mr-4" />
                <p><span className="font-semibold text-gray-700 dark:text-gray-300">File Name:</span> {item.fileName} ({item.fileType})</p>
            </div>
             <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FolderOpen className="w-5 h-5 mr-4" />
                <p className="truncate"><span className="font-semibold text-gray-700 dark:text-gray-300">Path:</span> {item.path}</p>
            </div>
             {item.notes && (
                 <div className="flex items-start text-gray-600 dark:text-gray-400">
                    <StickyNote className="w-5 h-5 mr-4 mt-1" />
                    <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Notes:</p>
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{item.notes}</p>
                    </div>
                </div>
             )}
        </>
    );

    const renderTelegramDetails = () => (
        <>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
                {item.chatType === 'group' ? <Users className="w-5 h-5 mr-4" /> : <User className="w-5 h-5 mr-4" />}
                <p><span className="font-semibold text-gray-700 dark:text-gray-300">Chat Type:</span> <span className="capitalize">{item.chatType}</span></p>
            </div>
             <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MessageSquare className="w-5 h-5 mr-4" />
                <p><span className="font-semibold text-gray-700 dark:text-gray-300">From User:</span> {item.fromUser}</p>
            </div>
             <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Hash className="w-5 h-5 mr-4" />
                <p><span className="font-semibold text-gray-700 dark:text-gray-300">Chat ID:</span> {item.chatId}</p>
            </div>
        </>
    );

    const renderAttachments = () => (
        <div className="pt-5 border-t dark:border-gray-700">
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                <Paperclip className="w-5 h-5 mr-4" />
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Attachments ({item.attachments.length})</h4>
            </div>
            <div className="space-y-2 pl-9">
                {item.attachments.map((att, index) => (
                    <a
                        key={index}
                        href={`http://localhost:5000/api/attachments/${att.fileId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm p-2 rounded-md bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <FileText className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{att.filename}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-auto flex-shrink-0">({(att.size / 1024).toFixed(2)} KB)</span>
                    </a>
                ))}
            </div>
        </div>
    );


    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        {getIcon(item.type)}
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{item.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-5">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="w-5 h-5 mr-4" />
                            <span>{formatDate(item.timestamp)}</span>
                            <Clock className="w-5 h-5 mr-4 ml-8" />
                            <span>{formatTime(item.timestamp)}</span>
                        </div>
                        
                        {item.type === ITEM_TYPES.EMAIL && renderEmailDetails()}
                        {item.type === ITEM_TYPES.FILE && renderFileDetails()}
                        {item.type === ITEM_TYPES.TELEGRAM && renderTelegramDetails()}
                        
                        <div className="border-t dark:border-gray-700 pt-5 prose dark:prose-invert max-w-none">
                             {item.html ? (
                                <div dangerouslySetInnerHTML={{ __html: item.html }} />
                             ) : (
                                <p className="whitespace-pre-wrap">{item.content}</p>
                             )}
                        </div>

                        {item.attachments && item.attachments.length > 0 && renderAttachments()}

                        {allTags.length > 0 && (
                            <div className="flex items-start text-gray-600 dark:text-gray-400 pt-5 border-t dark:border-gray-700">
                                <Tag className="w-5 h-5 mr-4 mt-1 flex-shrink-0" />
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map(tag => (
                                        <span 
                                            key={tag} 
                                            className={`px-2.5 py-1 text-sm font-medium rounded-full ${getTagColor(tag)}`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-end space-x-3 rounded-b-xl border-t dark:border-gray-700">
                    <button type="button" onClick={onClose} className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Close</button>
                    <button type="button" onClick={() => onExportPdf(item)} className="bg-green-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 flex items-center">
                        <Download className="w-4 h-4 mr-2"/>
                        Export to PDF
                    </button>
                    <button type="button" onClick={() => onEdit(item)} className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 flex items-center">
                        <Edit className="w-4 h-4 mr-2"/>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DetailedView;