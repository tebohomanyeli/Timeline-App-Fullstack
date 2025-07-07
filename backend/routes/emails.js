const express = require('express');
const router = express.Router();
const multer = require('multer');
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
