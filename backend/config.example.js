// Copy this file to config.js and fill in your actual values
module.exports = {
  // Airtable Configuration
  airtable: {
    apiKey: 'your_airtable_api_key_here',
    baseId: 'your_airtable_base_id_here'
  },
  
  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  
  // CORS Configuration
  cors: {
    origins: ['http://localhost:3000', 'http://localhost:3002']
  },
  
  // File Upload Configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'audio/mpeg',
      'audio/wav',
      'video/mp4',
      'application/pdf'
    ]
  }
};
