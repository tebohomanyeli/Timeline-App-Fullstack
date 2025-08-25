// src/hooks/useTimeline.jsx
import { useState, useEffect, useCallback } from 'react';

// The base URL for your new backend server
const API_URL = 'http://localhost:5000/api';

export const useTimeline = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetches all email items from the backend API
    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/emails`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Ensure timestamp is a Date object for sorting and display
            setItems(data.map(item => ({ ...item, timestamp: new Date(item.timestamp) })));
        } catch (error) {
            console.error("Failed to load items from API:", error);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial data load when the component mounts
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleSaveItem = (itemData, editingItem) => {
        // TODO: This should be migrated to a dedicated POST/PUT endpoint in the future.
        if (editingItem) {
            setItems(currentItems =>
                currentItems.map(item =>
                    item.id === editingItem.id ? { ...item, ...itemData } : item
                )
            );
        } else {
            const newItem = {
                ...itemData,
                id: crypto.randomUUID(),
            };
            setItems(currentItems => [newItem, ...currentItems]);
        }
    };

    const handleImportItems = async (file) => {
        const formData = new FormData();
        formData.append('mboxfile', file);

        setIsLoading(true);
        try {
            const uploadResponse = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('File upload failed.');
            }
            
            await fetchItems();

        } catch (error) {
            console.error("Failed to import and process MBOX file:", error);
            setIsLoading(false);
        }
    };

    const handleExportEmails = async () => {
        try {
            const response = await fetch(`${API_URL}/emails/export-all`);
            if (!response.ok) {
                throw new Error('Failed to export emails');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'all-emails.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Error exporting emails:", error);
            alert("Failed to export the emails.");
        }
    };

    const handleExportEmailAsPdf = async (email) => {
        try {
            const response = await fetch(`${API_URL}/emails/export/${email.id}`);
            if (!response.ok) {
                throw new Error('Failed to export email as PDF');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Sanitize the title to create a valid filename
            const filename = email.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            a.download = `${filename}.pdf`;

            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Error exporting email as PDF:", error);
            alert("Failed to export the email as a PDF.");
        }
    };

    // FIXED: Handles deleting an item by calling the backend
    const handleDeleteItem = async (idToDelete) => {
        try {
            const response = await fetch(`${API_URL}/emails/${idToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            // If successful, remove the item from the local state
            setItems(currentItems => currentItems.filter(item => item.id !== idToDelete));
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete the item.");
        }
    };

    // FIXED: Clears all items from the timeline by calling the backend
    const clearItemsToEmpty = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/emails`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to clear items');
            }
            // If successful, clear the local state
            setItems([]);
        } catch (error) {
            console.error("Error clearing items:", error);
            alert("Failed to clear the timeline.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetItemsToDefault = () => {
        console.warn("resetItemsToDefault is deprecated. Data is now managed by the backend.");
    };
    
    return { 
        items, 
        isLoading, 
        handleSaveItem, 
        handleDeleteItem, 
        clearItemsToEmpty, 
        resetItemsToDefault, 
        handleImportItems, 
        handleExportEmails,
        handleExportEmailAsPdf
    };
};