// backend/routes/emails.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const puppeteer = require('puppeteer');
const { parseMboxFile } = require('../services/parser');
const Email = require('../models/Email');
const mongoose = require('mongoose');

const upload = multer({ dest: 'uploads/' });

// Pass the GridFS bucket to the parser
router.post('/upload', upload.single('mboxfile'), async (req, res) => {
    try {
        const bucket = req.app.get('gfsBucket'); // Get bucket from app locals
        if (!bucket) {
            return res.status(500).send('GridFS not initialized');
        }
        await parseMboxFile(req.file.path, bucket);
        res.status(200).send('File uploaded and parsed successfully');
    } catch (error) {
        console.error('Error parsing mbox file:', error);
        res.status(500).send('Error parsing file');
    }
});

router.get('/emails', async (req, res) => {
    try {
        const emails = await Email.find().sort({ timestamp: -1 });
        res.json(emails);
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({ message: error.message });
    }
});

// Route to export all emails as JSON
router.get('/emails/export', async (req, res) => {
    try {
        const emails = await Email.find().sort({ timestamp: -1 });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=emails.json');
        res.json(emails);
    } catch (error) {
        console.error('Error exporting emails:', error);
        res.status(500).json({ message: 'Error exporting emails' });
    }
});

router.get('/emails/export-all', async (req, res) => {
    try {
        const emails = await Email.find().sort({ timestamp: -1 });

        const allEmailsHtml = emails.map(email => `
            <div class="email-container" style="page-break-after: always;">
                <div class="email-header">
                    <h1>${email.subject}</h1>
                    <p><strong>From:</strong> ${email.from}</p>
                    <p><strong>To:</strong> ${email.to.join(', ')}</p>
                    <p><strong>Date:</strong> ${new Date(email.timestamp).toUTCString()}</p>
                </div>
                <div class="email-body">
                    ${email.html || `<p>${email.content.replace(/\n/g, '<br>')}</p>`}
                </div>
            </div>
        `).join('');

        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 20px; }
                    .email-container { border-bottom: 2px solid #000; padding-bottom: 20px; }
                    .email-header { padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; margin-bottom: 15px; }
                    h1 { font-size: 24px; margin: 0 0 10px; }
                    p { margin: 0 0 5px; color: #333; }
                    .email-body { margin-top: 20px; font-size: 16px; line-height: 1.6; }
                </style>
            </head>
            <body>
                ${allEmailsHtml}
            </body>
            </html>
        `;

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        });
        
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=all-emails.pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error exporting all emails as PDF:', error);
        res.status(500).json({ message: 'Error exporting all emails' });
    }
});

router.get('/emails/export/:id', async (req, res) => {
    try {
        const email = await Email.findOne({ id: req.params.id });
        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }

        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 20px; }
                    .email-header { padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; margin-bottom: 15px; }
                    h1 { font-size: 24px; margin: 0 0 10px; }
                    p { margin: 0 0 5px; color: #333; }
                    .email-body { margin-top: 20px; font-size: 16px; line-height: 1.6; }
                </style>
            </head>
            <body>
                <div class="email-header">
                    <h1>${email.subject}</h1>
                    <p><strong>From:</strong> ${email.from}</p>
                    <p><strong>To:</strong> ${email.to.join(', ')}</p>
                    <p><strong>Date:</strong> ${new Date(email.timestamp).toUTCString()}</p>
                </div>
                <div class="email-body">
                    ${email.html || `<p>${email.content.replace(/\n/g, '<br>')}</p>`}
                </div>
            </body>
            </html>
        `;

        const browser = await puppeteer.launch({
            // Important for running in Docker or Linux environments without a display
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        await page.setContent(emailHtml, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });
        
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=email-${email.id}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error exporting email as PDF:', error);
        res.status(500).json({ message: 'Error exporting email' });
    }
});


router.get('/emails/:id', async (req, res) => {
    try {
        const email = await Email.findOne({ id: req.params.id });
        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }
        res.json(email);
    } catch (error) {
        console.error(`Error fetching email with id ${req.params.id}:`, error);
        res.status(500).json({ message: error.message });
    }
});

// Route to get a file from GridFS using GridFSBucket
router.get('/attachments/:fileId', async (req, res) => {
    try {
        const bucket = req.app.get('gfsBucket');
        const fileId = new mongoose.Types.ObjectId(req.params.fileId);
        
        const files = await bucket.find({ _id: fileId }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ err: 'No file exists' });
        }
        
        const file = files[0];

        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', `inline; filename="${file.filename}"`);

        const downloadStream = bucket.openDownloadStream(file._id);
        downloadStream.pipe(res);

    } catch (err) {
        console.error('Error fetching attachment:', err);
        res.status(500).json({ message: 'Error fetching attachment' });
    }
});

// Route to delete a single email and its attachments
router.delete('/emails/:id', async (req, res) => {
    try {
        const email = await Email.findOneAndDelete({ id: req.params.id });
        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }
        if (email.attachments && email.attachments.length > 0) {
            const bucket = req.app.get('gfsBucket');
            for (const att of email.attachments) {
                await bucket.delete(new mongoose.Types.ObjectId(att.fileId));
            }
        }
        res.status(200).json({ message: 'Email deleted successfully' });
    } catch (error) {
        console.error('Error deleting email:', error);
        res.status(500).json({ message: 'Error deleting email' });
    }
});

// Route to delete all emails and drop the GridFS bucket
router.delete('/emails', async (req, res) => {
    try {
        await Email.deleteMany({});
        const bucket = req.app.get('gfsBucket');
        await bucket.drop();
        res.status(200).json({ message: 'All emails and attachments cleared successfully' });
    } catch (error) {
        if (error.message.includes('ns not found')) {
            return res.status(200).json({ message: 'All emails and attachments cleared successfully (GridFS was empty).' });
        }
        console.error('Error clearing all emails:', error);
        res.status(500).json({ message: 'Error clearing database' });
    }
});

module.exports = router;