// src/utils/index.jsx
import React from 'react';
import { Mail, Send, FileText, CalendarDays, Briefcase } from 'lucide-react';
import { ITEM_TYPES } from '../constants';

export const formatDate = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatTime = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

// NEW function to format a Date object for the datetime-local input
export const formatToDateTimeLocal = (date) => {
    if (!date) return '';
    const d = new Date(date);
    // Adjust for timezone offset to display the correct local time in the input
    const timezoneOffset = d.getTimezoneOffset() * 60000;
    const localDate = new Date(d - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
};


export const getIcon = (type) => {
    switch (type) {
        case ITEM_TYPES.EMAIL: return <Mail className="w-5 h-5 text-blue-500" />;
        case ITEM_TYPES.TELEGRAM: return <Send className="w-5 h-5 text-sky-500" />;
        case ITEM_TYPES.FILE: return <FileText className="w-5 h-5 text-green-500" />;
        case ITEM_TYPES.MEETING: return <CalendarDays className="w-5 h-5 text-purple-500" />;
        default: return <Briefcase className="w-5 h-5 text-gray-500" />;
    }
};