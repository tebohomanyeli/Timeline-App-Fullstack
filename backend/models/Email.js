const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  size: Number,
  content: Buffer, // Storing attachment content directly in the DB
});

const emailSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, default: 'email' },
  sourceName: { type: String, default: 'Email' },
  timestamp: { type: Date, required: true },
  from: { type: String, required: true },
  to: [String],
  cc: [String],
  bcc: [String],
  subject: { type: String, required: true },
  threadId: { type: String },
  messageId: { type: String },
  inReplyTo: { type: String },
  gmailLabels: [String],
  title: { type: String, required: true },
  content: { type: String },
  html: { type: String }, // Added for rich email content
  tags: [String],
  attachments: [attachmentSchema], // Added attachments array
});

module.exports = mongoose.model('Email', emailSchema);