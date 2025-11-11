const { base, tables } = require('../config/airtable');

// Fallback in-memory storage for development
let fallbackStorage = [];
let nextId = 1;

class StorageService {
  constructor() {
    // Force use in-memory storage for now to avoid Airtable field name issues
    this.useAirtable = false;
  }

  async createSubmission(data) {
    if (this.useAirtable) {
      return this.createInAirtable(data);
    } else {
      return this.createInMemory(data);
    }
  }

  async getSubmissions() {
    if (this.useAirtable) {
      return this.getFromAirtable();
    } else {
      return this.getFromMemory();
    }
  }

  async updateSubmission(id, status) {
    if (this.useAirtable) {
      return this.updateInAirtable(id, status);
    } else {
      return this.updateInMemory(id, status);
    }
  }

  // Airtable methods
  async createInAirtable(data) {
    try {
      const airtableData = {
        Name: data.name,
        Email: data.email,
        Phone: data.phone || '',
        Bio: data.bio,
        Role: data.role,
        Status: 'Submitted',
        'Instagram URL': data.socialMedia?.instagram || '',
        'Twitter URL': data.socialMedia?.twitter || '',
        'LinkedIn URL': data.socialMedia?.linkedin || '',
        'Website URL': data.socialMedia?.website || '',
        'YouTube URL': data.socialMedia?.youtube || '',
        'TikTok URL': data.socialMedia?.tiktok || '',
        'Created At': new Date().toISOString()
      };

      const records = await base(tables.SUBMISSIONS).create([{ fields: airtableData }]);
      const record = records[0];

      return {
        id: record.id,
        ...data,
        status: 'Submitted',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Airtable error:', error);
      // Fallback to in-memory storage if Airtable fails
      return this.createInMemory(data);
    }
  }

  async getFromAirtable() {
    try {
      const records = await base(tables.SUBMISSIONS).select({
        sort: [{ field: 'Created At', direction: 'desc' }]
      }).all();

      return records.map(record => ({
        id: record.id,
        name: record.get('Name'),
        email: record.get('Email'),
        phone: record.get('Phone'),
        bio: record.get('Bio'),
        role: record.get('Role'),
        status: record.get('Status'),
        createdAt: record.get('Created At'),
        socialMedia: {
          instagram: record.get('Instagram URL'),
          twitter: record.get('Twitter URL'),
          linkedin: record.get('LinkedIn URL'),
          website: record.get('Website URL'),
          youtube: record.get('YouTube URL'),
          tiktok: record.get('TikTok URL')
        }
      }));
    } catch (error) {
      console.error('Airtable error:', error);
      // Fallback to in-memory storage if Airtable fails
      return this.getFromMemory();
    }
  }

  async updateInAirtable(id, status) {
    try {
      await base(tables.SUBMISSIONS).update([{
        id: id,
        fields: { Status: status }
      }]);
      return { message: 'Submission updated successfully' };
    } catch (error) {
      console.error('Airtable error:', error);
      // Fallback to in-memory storage if Airtable fails
      return this.updateInMemory(id, status);
    }
  }

  // In-memory fallback methods
  createInMemory(data) {
    const submission = {
      id: `sub_${nextId++}`,
      ...data,
      status: 'Submitted',
      createdAt: new Date().toISOString()
    };
    fallbackStorage.push(submission);
    return submission;
  }

  getFromMemory() {
    return [...fallbackStorage].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  updateInMemory(id, status) {
    const submission = fallbackStorage.find(s => s.id === id);
    if (submission) {
      submission.status = status;
      return { message: 'Submission updated successfully' };
    }
    throw new Error('Submission not found');
  }
}

module.exports = new StorageService();
