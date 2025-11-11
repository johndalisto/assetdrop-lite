const Airtable = require('airtable');

// For development, use fallback values if env vars are not set
const apiKey = process.env.AIRTABLE_API_KEY || 'demo_key';
const baseId = process.env.AIRTABLE_BASE_ID || 'demo_base';

// Only throw error in production
if (process.env.NODE_ENV === 'production' && (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID)) {
  throw new Error('Missing required Airtable configuration. Check your .env file.');
}

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: apiKey
});

const base = Airtable.base(baseId);

module.exports = {
  base,
  tables: {
    SUBMISSIONS: 'tblmb1bEXm1S6vNbq' 
  }
};