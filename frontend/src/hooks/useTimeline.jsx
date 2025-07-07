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
            // In case of an API error, you might want to set items to an empty array
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial data load when the component mounts
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // Handles saving a manually added/edited item
    const handleSaveItem = (itemData, editingItem) => {
        // TODO: This should be migrated to a dedicated POST/PUT endpoint in the future.
        // For now, it only updates the state on the client side for manual entries.
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

    // Handles uploading the .mbox file and refreshing the data
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
            
            // After a successful upload, refetch all items to update the timeline
            await fetchItems();

        } catch (error) {
            console.error("Failed to import and process MBOX file:", error);
            // Optionally reset loading state here if you don't refetch on error
            setIsLoading(false);
        }
    };

    // Handles deleting an item
    const handleDeleteItem = (idToDelete) => {
        // TODO: This should be migrated to a dedicated DELETE endpoint.
        setItems(currentItems => currentItems.filter(item => item.id !== idToDelete));
    };

    // Clears all items from the timeline
    const clearItemsToEmpty = async () => {
        // TODO: This should be migrated to a dedicated DELETE /api/emails/all endpoint.
        setItems([]);
    };
    
    // This function is no longer relevant as data comes from the backend.
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
        handleImportItems 
    };
};
