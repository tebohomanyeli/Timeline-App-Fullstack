// src/lib/models/Telegram.js
import { ITEM_TYPES } from '../../constants';

/**
 * Creates a structured Telegram timeline item.
 * @param {object} data - The raw data for the telegram message.
 * @returns {object} A structured telegram object for the timeline.
 */
export function createTelegramModel(data = {}) {
    return {
        id: crypto.randomUUID(),
        type: ITEM_TYPES.TELEGRAM,
        sourceName: 'Telegram',
        timestamp: data.timestamp || new Date(),

        // Telegram specific fields
        chatId: data.chatId || '',
        chatType: data.chatType || 'direct',
        fromUser: data.fromUser || '',
        messageType: data.messageType || 'text',
        
        // Common fields
        title: data.title || 'Telegram Message',
        content: data.content || '',
        sender: `${data.fromUser || 'unknown'} @ ${data.chatId || 'unknown'}`,
        tags: data.tags || [],
    };
}
