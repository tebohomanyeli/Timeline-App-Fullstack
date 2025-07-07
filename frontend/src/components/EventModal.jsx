// src/components/EventModal.jsx
import React, { useState, useEffect } from 'react';
import { UploadCloud, Edit } from 'lucide-react';
import { ITEM_TYPES, ITEM_SOURCES } from '../constants';
import { formatToDateTimeLocal } from '../utils/index.jsx';
// Note: The local mboxParser is no longer needed here
// import { parseMbox } from '../lib/parsers/mboxParser.js';

function EventModal({ isOpen, onClose, onSave, itemToEdit, onImport }) {
    const [activeTab, setActiveTab] = useState('manual');
    
    const getInitialFormState = () => ({
        title: '',
        content: '',
        type: 'other',
        sourceName: 'Other',
        tags: '',
        timestamp: formatToDateTimeLocal(new Date()),
        from: '',
        to: '',
        subject: '',
        threadId: '',
        gmailLabels: '',
        fileName: '',
        fileType: '',
        path: '',
        notes: '',
        chatId: '',
        chatType: 'direct',
        fromUser: '',
        messageType: 'text',
    });

    const [formState, setFormState] = useState(getInitialFormState());

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setFormState({
                    title: itemToEdit.title || '',
                    content: itemToEdit.content || '',
                    type: itemToEdit.type || 'other',
                    sourceName: itemToEdit.sourceName || '',
                    tags: itemToEdit.tags ? itemToEdit.tags.join(', ') : '',
                    timestamp: formatToDateTimeLocal(itemToEdit.timestamp),
                    from: itemToEdit.from || '',
                    to: Array.isArray(itemToEdit.to) ? itemToEdit.to.join(', ') : (itemToEdit.to || ''),
                    subject: itemToEdit.subject || '',
                    threadId: itemToEdit.threadId || '',
                    gmailLabels: itemToEdit.gmailLabels ? itemToEdit.gmailLabels.join(', ') : '',
                    fileName: itemToEdit.fileName || '',
                    fileType: itemToEdit.fileType || '',
                    path: itemToEdit.path || '',
                    notes: itemToEdit.notes || '',
                    chatId: itemToEdit.chatId || '',
                    chatType: itemToEdit.chatType || 'direct',
                    fromUser: itemToEdit.fromUser || '',
                    messageType: itemToEdit.messageType || 'text',
                });
            } else {
                setFormState(getInitialFormState());
            }
            setActiveTab('manual');
        }
    }, [itemToEdit, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = {
            ...formState,
            title: formState.type === ITEM_TYPES.EMAIL ? formState.subject : (formState.type === ITEM_TYPES.FILE ? formState.fileName : formState.title),
            tags: formState.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            to: formState.type === ITEM_TYPES.EMAIL ? formState.to.split(',').map(tag => tag.trim()).filter(Boolean) : formState.to,
            gmailLabels: formState.type === ITEM_TYPES.EMAIL ? formState.gmailLabels.split(',').map(tag => tag.trim()).filter(Boolean) : formState.gmailLabels,
            timestamp: new Date(formState.timestamp),
        };
        onSave(finalData, itemToEdit);
    };
    
    const handleMboxFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        alert(`Uploading and parsing ${file.name}... this may take a moment.`);

        try {
            // The onImport function now handles the upload to the backend
            await onImport(file);
            alert(`Successfully imported emails!`);
        } catch (error) {
            console.error("Failed to import MBOX file:", error);
            alert("An error occurred while importing the MBOX file.");
        } finally {
            onClose();
        }
    };

    const renderFormFields = () => {
        const { type } = formState;
        switch (type) {
            case ITEM_TYPES.EMAIL:
                return (
                    <>
                        <div className="md:col-span-2">
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                            <input type="text" name="subject" id="subject" value={formState.subject} onChange={handleInputChange} required className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="from" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
                            <input type="email" name="from" id="from" value={formState.from} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To (comma separated)</label>
                            <input type="text" name="to" id="to" value={formState.to} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="threadId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thread ID</label>
                            <input type="text" name="threadId" id="threadId" value={formState.threadId} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="gmailLabels" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gmail Labels (comma separated)</label>
                            <input type="text" name="gmailLabels" id="gmailLabels" value={formState.gmailLabels} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </>
                );
            case ITEM_TYPES.FILE:
                return (
                    <>
                        <div className="md:col-span-2">
                            <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File Name</label>
                            <input type="text" name="fileName" id="fileName" value={formState.fileName} onChange={handleInputChange} required className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File Type</label>
                            <input type="text" name="fileType" id="fileType" placeholder="e.g., pdf, docx, png" value={formState.fileType} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="path" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File Path / URL</label>
                            <input type="text" name="path" id="path" value={formState.path} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                            <textarea name="notes" id="notes" rows="3" value={formState.notes} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                    </>
                );
            case ITEM_TYPES.TELEGRAM:
                 return (
                    <>
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input type="text" name="title" id="title" value={formState.title} onChange={handleInputChange} required className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="chatType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chat Type</label>
                            <select name="chatType" id="chatType" value={formState.chatType} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500">
                               <option value="direct">Direct</option>
                               <option value="group">Group</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="fromUser" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From User</label>
                            <input type="text" name="fromUser" id="fromUser" value={formState.fromUser} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="chatId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chat ID</label>
                            <input type="text" name="chatId" id="chatId" value={formState.chatId} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="messageType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message Type</label>
                            <select name="messageType" id="messageType" value={formState.messageType} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500">
                               <option value="text">Text</option>
                               <option value="photo">Photo</option>
                               <option value="video">Video</option>
                               <option value="file">File</option>
                            </select>
                        </div>
                    </>
                );
            default:
                return (
                     <div className="md:col-span-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input type="text" name="title" id="title" value={formState.title} onChange={handleInputChange} required className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                );
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{itemToEdit ? 'Edit Timeline Event' : 'Add to Timeline'}</h2>
                </div>
                
                <div className="flex border-b dark:border-gray-700">
                    <button onClick={() => setActiveTab('manual')} className={`flex items-center space-x-2 py-3 px-6 text-sm font-semibold transition-colors ${activeTab === 'manual' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>
                        <Edit className="w-4 h-4"/> <span>Manual Entry</span>
                    </button>
                     <button onClick={() => setActiveTab('import')} className={`flex items-center space-x-2 py-3 px-6 text-sm font-semibold transition-colors ${activeTab === 'import' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>
                       <UploadCloud className="w-4 h-4"/> <span>Import MBOX</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {activeTab === 'manual' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 text-left">
                                <div className="md:col-span-2">
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                    <select name="type" id="type" value={formState.type} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500">
                                        {Object.keys(ITEM_TYPES).map(k => <option key={k} value={ITEM_TYPES[k]}>{k.charAt(0) + k.slice(1).toLowerCase()}</option>)}
                                    </select>
                                </div>
                                
                                {renderFormFields()}

                                <div className="md:col-span-2">
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content / Description</label>
                                    <textarea name="content" id="content" rows="3" value={formState.content} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"></textarea>
                                </div>
                                <div>
                                    <label htmlFor="sourceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
                                    <select name="sourceName" id="sourceName" value={formState.sourceName} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500">
                                        {ITEM_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                 <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Tags (comma separated)</label>
                                    <input type="text" name="tags" id="tags" value={formState.tags} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                 <div className="md:col-span-2">
                                    <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date & Time</label>
                                    <input type="datetime-local" name="timestamp" id="timestamp" value={formState.timestamp} onChange={handleInputChange} required className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>
                        ) : (
                             <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400"/>
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Select MBOX file to import</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Drag and drop or click to upload.</p>
                                <div className="mt-4">
                                     <input type="file" id="mbox-upload" accept=".mbox" onChange={handleMboxFileChange} className="sr-only" />
                                     <label htmlFor="mbox-upload" className="cursor-pointer bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                                        Choose File
                                     </label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-end space-x-3 rounded-b-xl border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
                        {activeTab === 'manual' && (
                           <button type="submit" className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">{itemToEdit ? 'Save Changes' : 'Add Event'}</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EventModal;
