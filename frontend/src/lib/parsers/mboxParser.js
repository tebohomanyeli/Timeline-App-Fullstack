// src/lib/parsers/mboxParser.js
import { createEmailModel } from '../models/Email.js';

/**
 * Parses raw email text into a headers Map and a body string.
 * @param {string} rawEmail
 * @returns {{headersMap: Map<string,string>, body: string}}
 */
function parseRawEmail(rawEmail) {
  // Split headers / body on first blank line
  const [rawHeadersPart, ...bodyParts] = rawEmail.split(/\r?\n\r?\n/);
  const body = bodyParts.join('\n\n');

  // Unfold header lines (replace CRLF+SPACE/TAB with a single space)
  const unfolded = rawHeadersPart.replace(/\r?\n([ \t])/g, ' ');

  const headersMap = new Map();
  unfolded.split(/\r?\n/).forEach(line => {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim().toLowerCase();
      const value = line.slice(idx + 1).trim();
      // If header repeats, concatenate with comma
      if (headersMap.has(key)) {
        headersMap.set(key, headersMap.get(key) + ', ' + value);
      } else {
        headersMap.set(key, value);
      }
    }
  });

  return { headersMap, body };
}

/**
 * Safely get a header value (string) from a Map.
 */
function getHeader(headersMap, name) {
  return headersMap.get(name.toLowerCase()) || '';
}

/**
 * Parses MBOX content into structured email models.
 * @param {string} mboxContent
 * @returns {Promise<Array<object>>}
 */
export async function parseMbox(mboxContent) {
  const items = [];

  // Split on lines that start with "From " (the mbox delimiter)
  const rawMessages = mboxContent
    .split(/^From .*\r?\n/m)
    .map(chunk => chunk.trim())
    .filter(Boolean);

  for (const raw of rawMessages) {
    try {
      const { headersMap, body } = parseRawEmail(raw);

      const mapped = {
        from: getHeader(headersMap, 'from'),
        to: getHeader(headersMap, 'to')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        subject: getHeader(headersMap, 'subject') || 'No Subject',
        content: body,
        timestamp: (() => {
          const d = new Date(getHeader(headersMap, 'date'));
          return isNaN(d) ? new Date() : d;
        })(),
        threadId: getHeader(headersMap, 'x-gm-thrid'),
        gmailLabels: getHeader(headersMap, 'x-gmail-labels')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
      };

      items.push(createEmailModel(mapped));
    } catch (err) {
      console.error('Failed to parse one mbox message:', err);
    }
  }

  console.log(`MBOX parsing complete. Found ${items.length} emails.`);
  return items;
}