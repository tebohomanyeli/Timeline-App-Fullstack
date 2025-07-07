// src/lib/models/Other.js
import { ITEM_TYPES } from '../../constants';

/**
 * Creates a structured timeline item for generic types.
 * @param {object} data - The raw data for the item.
 * @returns {object} A structured generic object for the timeline.
 */
export function createOtherModel(data = {}) {
    return {
        id: crypto.randomUUID(),
        type: ITEM_TYPES.OTHER,
        sourceName: data.sourceName || 'Other',
        timestamp: data.timestamp || new Date(),

        // Common fields
        title: data.title || 'Untitled Item',
        content: data.content || '',
        sender: data.sender || '',
        tags: data.tags || [],
    };
}
