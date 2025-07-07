// src/components/ConfirmClearModal.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

function ConfirmClearModal({ isOpen, onClose, onConfirm, resetFlag, setResetFlag }) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="p-6 text-center">
                    <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
                    <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-100">Are you sure?</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">This action cannot be undone. Please confirm how you would like to proceed.</p>
                </div>

                <div className="px-6 py-4 border-y dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <label htmlFor="reset-switch" className="flex items-center justify-between cursor-pointer">
                        <span className="font-medium text-gray-700 dark:text-gray-200">Reset to default data</span>
                        <div className="relative">
                            <input
                                id="reset-switch"
                                type="checkbox"
                                className="sr-only"
                                checked={resetFlag}
                                onChange={() => setResetFlag(!resetFlag)}
                            />
                            <div className={`block w-14 h-8 rounded-full transition-colors ${resetFlag ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${resetFlag ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </label>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {resetFlag
                            ? "This will delete all current data and restore the initial sample items."
                            : "This will delete all items, leaving the timeline empty."
                        }
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 flex justify-end space-x-3 rounded-b-xl">
                    <button type="button" onClick={onClose} className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
                    <button type="button" onClick={handleConfirm} className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700">Confirm</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmClearModal;