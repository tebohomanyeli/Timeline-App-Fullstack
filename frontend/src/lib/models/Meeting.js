// src/lib/models/Meeting.js
import { ITEM_TYPES } from '../../constants';

/**
 * Creates a structured Meeting timeline item.
 * @param {object} data - The raw data for the meeting.
 * @returns {object} A structured meeting object for the timeline.
 */
export function createMeetingModel(data = {}) {
    return {
        id: crypto.randomUUID(),
        type: ITEM_TYPES.MEETING,
        sourceName: 'Calendar',
        timestamp: data.timestamp || new Date(),

        // Meeting specific fields (can be expanded later)
        attendees: data.attendees || [],
        location: data.location || '',

        // Common fields
        title: data.title || 'Untitled Meeting',
        content: data.content || '',
        tags: data.tags || [],
    };
}
