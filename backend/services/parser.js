const { simpleParser } = require('mailparser');
const { mboxReader } = require('mbox-reader');
const Email = require('../models/Email');
const { v4: uuidv4 } = require('uuid');
const { createReadStream } = require('fs');
const { Readable } = require('stream');

// The function now accepts the GridFSBucket instance
async function parseMboxFile(filePath, bucket) {
    // Clear existing emails to avoid duplicates on re-upload
    await Email.deleteMany({});
    
    // Clear existing files from GridFS by dropping the collections
    try {
        await bucket.drop();
    } catch (err) {
        // Ignore error if collection doesn't exist, which is fine
        if (err.message && !err.message.includes('ns not found')) {
            console.error("Error dropping GridFS collection:", err);
        }
    }

    const fileStream = createReadStream(filePath);

    for await (const message of mboxReader(fileStream)) {
        try {
            const parsedEmail = await simpleParser(message.content);

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
                attachments: [],
            };

            if (parsedEmail.attachments && parsedEmail.attachments.length > 0) {
                for (const att of parsedEmail.attachments) {
                    // Use a promise to handle the async stream upload
                    const attachmentId = await new Promise((resolve, reject) => {
                        const readableStream = Readable.from(att.content);
                        const uploadStream = bucket.openUploadStream(att.filename, {
                            contentType: att.contentType,
                        });
                        
                        uploadStream.on('finish', () => {
                            resolve(uploadStream.id);
                        });

                        uploadStream.on('error', (err) => {
                            reject(err);
                        });

                        readableStream.pipe(uploadStream);
                    });

                    emailData.attachments.push({
                        filename: att.filename,
                        contentType: att.contentType,
                        size: att.size,
                        fileId: attachmentId.toString(),
                    });
                }
            }

            const email = new Email(emailData);
            await email.save();
        } catch (err) {
            console.error('Failed to parse a message:', err);
        }
    }
}

module.exports = { parseMboxFile };
