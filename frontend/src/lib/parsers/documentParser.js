// src/lib/parsers/documentParser.js
import { createDocumentModel } from '../models/Document.js';

/**
 * Parses a document file.
 * NOTE: This is a placeholder. Logic will vary greatly by file type.
 * @param {File} file - The file object to parse.
 * @returns {Promise<object>} A structured document timeline item.
 */
export async function parseDocument(file) {
    console.log(`Parsing document: ${file.name}...`);

    // Placeholder logic: Real implementation would require libraries like
    // PDF.js for PDFs or Mammoth.js for DOCX to extract content.
    // For now, we simulate creating a model from file metadata.
    
    const simulatedParsedDoc = {
        fileName: file.name,
        fileType: file.type || 'unknown',
        path: `uploads/${file.name}`, // Simulated path
        content: `Content of ${file.name} would be extracted here.`,
        timestamp: new Date(file.lastModified),
    };

    const docModel = createDocumentModel(simulatedParsedDoc);

    console.log("Document parsing complete (simulated).");
    return docModel;
}
