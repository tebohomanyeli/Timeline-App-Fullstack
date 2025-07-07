const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const emailRoutes = require('./routes/emails');
const { GridFSBucket } = require('mongodb'); // Use the modern GridFSBucket

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', emailRoutes);

// Database Connection
const MONGO_URI = 'mongodb://root:example@localhost:27017/timeline?authSource=admin';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize GridFSBucket
const conn = mongoose.connection;
conn.once('open', () => {
    const db = conn.db;
    const bucket = new GridFSBucket(db, {
        bucketName: 'uploads'
    });
    // Make the bucket available to our router
    app.set('gfsBucket', bucket);
    console.log('GridFS Bucket connected.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
