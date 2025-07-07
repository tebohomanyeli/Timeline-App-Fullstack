const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parseMboxFile } = require('../services/parser');
const Email = require('../models/Email');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('mboxfile'), async (req, res) => {
    try {
        await parseMboxFile(req.file.path);
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
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;