const express = require('express');
const Joi = require('joi');
const storage = require('../storage');

const router = express.Router();

// Validation schema
const submissionSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  bio: Joi.string().optional().allow(''),
  role: Joi.string().valid('musician', 'speaker', 'film-presenter').required(),
  status: Joi.string().default('Draft'),
  socialMedia: Joi.object({
    instagram: Joi.string().optional().allow(''),
    twitter: Joi.string().optional().allow(''),
    linkedin: Joi.string().optional().allow(''),
    website: Joi.string().optional().allow(''),
    youtube: Joi.string().optional().allow(''),
    tiktok: Joi.string().optional().allow('')
  }).optional()
});

// POST /api/submissions - Create new submission
router.post('/', async (req, res) => {
  try {
    const { error, value } = submissionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details.map(d => d.message)
      });
    }

    // Create submission using storage service
    const submission = await storage.createSubmission(value);

    res.status(201).json({
      id: submission.id,
      message: 'Submission created successfully',
      submission
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

// GET /api/submissions - Get all submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await storage.getSubmissions();
    res.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// PUT /api/submissions/:id - Update submission status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Submitted', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await storage.updateSubmission(id, status);
    res.json(result);
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({ error: 'Failed to update submission' });
  }
});

// GET /api/submissions/export - Export submissions as CSV
router.get('/export', async (req, res) => {
  try {
    const submissions = await storage.getSubmissions();
    
    // Convert to CSV format
    const csvHeader = 'Name,Email,Phone,Role,Status,Bio,Created At\n';
    const csvRows = submissions.map(submission => {
      return [
        `"${submission.name || ''}"`,
        `"${submission.email || ''}"`,
        `"${submission.phone || ''}"`,
        `"${submission.role || ''}"`,
        `"${submission.status || ''}"`,
        `"${(submission.bio || '').replace(/"/g, '""')}"`,
        `"${submission.createdAt || ''}"`
      ].join(',');
    });
    
    const csvContent = csvHeader + csvRows.join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=submissions-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting submissions:', error);
    res.status(500).json({ error: 'Failed to export submissions' });
  }
});

// POST /api/submissions/bulk-update - Bulk update submissions
router.post('/bulk-update', async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid submission IDs' });
    }

    if (!status || !['Submitted', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const results = [];
    for (const id of ids) {
      try {
        const result = await storage.updateSubmission(id, status);
        results.push({ id, success: true, result });
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }

    res.json({ 
      message: 'Bulk update completed',
      results,
      successCount: results.filter(r => r.success).length,
      errorCount: results.filter(r => !r.success).length
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({ error: 'Failed to perform bulk update' });
  }
});

module.exports = router;
