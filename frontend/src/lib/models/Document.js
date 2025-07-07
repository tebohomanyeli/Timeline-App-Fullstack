// src/lib/models/Document.js
import { ITEM_TYPES } from '../../constants';

/**
 * Creates a structured Document timeline item.
 * @param {object} data - The raw data for the document.
 * @returns {object} A structured document object for the timeline.
 */
export function createDocumentModel(data = {}) {
    return {
        id: crypto.randomUUID(),
        type: ITEM_TYPES.FILE,
        sourceName: 'File System',
        timestamp: data.timestamp || new Date(),

        // File specific fields
        fileName: data.fileName || 'Untitled Document',
        fileType: data.fileType || 'unknown',
        path: data.path || '',
        notes: data.notes || '',

        // Common fields
        title: data.fileName || 'Untitled Document',
        content: data.content || `Document: ${data.fileName || ''}`,
        tags: data.tags || [],
    };
}
