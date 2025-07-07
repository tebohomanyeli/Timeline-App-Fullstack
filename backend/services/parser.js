const { simpleParser } = require('mailparser');
const MboxReader = require('mbox-reader');
const Email = require('../models/Email');
const { v4: uuidv4 } = require('uuid');

async function parseMboxFile(filePath) {
    const mboxReader = new MboxReader(filePath);
    let message;

    // Clear existing emails to avoid duplicates on re-upload
    await Email.deleteMany({});

    while ((message = await mboxReader.readMessage()) !== null) {
        try {
            const parsedEmail = await simpleParser(message);

            const emailData = {
                id: uuidv4(),
                timestamp: parsedEmail.date || new Date(),
                from: parsedEmail.from?.text || '',
                to: parsedEmail.to?.text.split(', ').filter(Boolean) || [],
                cc: parsedEmail.cc?.text.split(', ').filter(Boolean) || [],
                bcc: parsedEmail.bcc?.text.split(', ').filter(Boolean) || [],
                subject: parsedEmail.subject || 'No Subject',
                title: parsedEmail.subject || 'No Subject',
                content: parsedEmail.text || '',
                html: parsedEmail.html || '',
                threadId: parsedEmail.headers.get('x-gm-thrid'),
                messageId: parsedEmail.messageId,
                inReplyTo: parsedEmail.inReplyTo,
                gmailLabels: parsedEmail.headers.get('x-gmail-labels')
                    ? parsedEmail.headers.get('x-gmail-labels').split(',').map(s => s.trim()).filter(Boolean)
                    : [],
                attachments: parsedEmail.attachments.map(att => ({
                    filename: att.filename,
                    contentType: att.contentType,
                    size: att.size,
                    content: att.content, // Storing as Buffer
                })),
            };

            const email = new Email(emailData);
            await email.save();
        } catch (err) {
            console.error('Failed to parse a message:', err);
        }
    }
}

module.exports = { parseMboxFile };