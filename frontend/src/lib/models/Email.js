// src/lib/models/Email.js

// NOTE: Since we removed the constants file, we'll define ITEM_TYPES here for now.
const ITEM_TYPES = {
    EMAIL: 'email'
};

/**
 * Creates a structured Email timeline item.
 * @param {object} data - The raw data for the email.
 * @returns {object} A structured email object for the timeline.
 */
export function createEmailModel(data = {}) {
    return {
        id: crypto.randomUUID(),
        type: ITEM_TYPES.EMAIL,
        sourceName: 'Email',
        timestamp: data.timestamp || new Date(),

        // Email specific fields
        from: data.from || '',
        to: data.to || [],
        subject: data.subject || 'Untitled Email',
        threadId: data.threadId || '',
        gmailLabels: data.gmailLabels || [],

        // Common fields
        title: data.subject || 'Untitled Email',
        content: data.content || '',
        tags: data.tags || [],
    };
}