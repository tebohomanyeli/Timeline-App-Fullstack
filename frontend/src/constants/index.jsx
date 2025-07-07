// src/constants/index.jsx
export const ITEM_TYPES = {
    EMAIL: 'email',
    TELEGRAM: 'telegram',
    FILE: 'file',
    MEETING: 'meeting',
    OTHER: 'other',
};

export const ITEM_SOURCES = ['All', 'Email', 'Telegram', 'File System', 'Calendar', 'Slack', 'Other'];

export const DEFAULT_TAGS = ['work', 'personal', 'project-alpha', 'urgent', 'documentation', 'meeting-notes'];

// Sample data has been updated to include gmailLabels for testing the new system tags feature
export const getInitialSampleData = () => [
    {
        id: crypto.randomUUID(),
        type: ITEM_TYPES.EMAIL,
        sourceName: 'Email',
        timestamp: new Date(2025, 4, 25, 10, 30, 0),
        // Email Specific
        from: 'project.lead@example.com',
        to: ['team@example.com'],
        subject: 'Project Phoenix - Phase 2 Kickoff',
        threadId: 'thread-alpha-123',
        gmailLabels: ['Inbox', 'Important'],
        // Common fields
        title: 'Project Phoenix - Phase 2 Kickoff',
        content: 'Team, we are officially starting Phase 2. Please review the attached timeline. We need to hit the ground running and ensure all deliverables are met.',
        tags: ['project-phoenix', 'kickoff', 'work', 'urgent'],
    },
    {
        id: crypto.randomUUID(),
        type: ITEM_TYPES.EMAIL,
        sourceName: 'Email',
        timestamp: new Date(2025, 4, 25, 11, 15, 0),
        // Email Specific
        from: 'jane.doe@example.com',
        to: ['project.lead@example.com'],
        subject: 'Re: Project Phoenix - Phase 2 Kickoff',
        threadId: 'thread-alpha-123', // Same threadId
        gmailLabels: ['Inbox'],
        // Common fields
        title: 'Re: Project Phoenix - Phase 2 Kickoff',
        content: 'Thanks for the update! I have a few questions regarding the resource allocation for the design team.',
        tags: ['project-phoenix', 'question', 'work'],
    },
    {
        id: crypto.randomUUID(),
        type: ITEM_TYPES.FILE,
        sourceName: 'File System',
        timestamp: new Date(2025, 4, 25, 18, 10, 0),
        // File Specific
        fileName: 'Design Mockups_v3.fig',
        fileType: 'figma',
        path: '/Users/Shared/Projects/Phoenix/Designs/Design Mockups_v3.fig',
        notes: 'Latest design mockups for the new dashboard interface. Includes dark mode variations.',
        // Common fields
        title: 'Design Mockups v3',
        content: 'Figma file containing the latest designs.',
        tags: ['design', 'project-phoenix'],
    },
    {
        id: crypto.randomUUID(),
        type: ITEM_TYPES.TELEGRAM,
        sourceName: 'Telegram',
        timestamp: new Date(2025, 4, 24, 14, 20, 0),
        // Telegram Specific
        chatId: 'dev_team_chat_id',
        chatType: 'group',
        fromUser: 'dave.dev',
        // Common fields
        sender: 'dave.dev @ dev_team_chat',
        title: 'Quick Sync re: API Integration',
        content: 'Can someone from the backend team confirm the new endpoint for user authentication?',
        tags: ['development', 'api', 'urgent'],
    },
];
