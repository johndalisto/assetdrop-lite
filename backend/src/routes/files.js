const express = require('express');
const { uploadSingle, uploadMultiple, getFileUrl, deleteFile } = require('../services/fileUpload');

const router = express.Router();

// POST /api/files/upload - Upload single file
router.post('/upload', (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ 
        error: 'File upload failed', 
        message: err.message 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded' 
      });
    }

    const fileUrl = getFileUrl(req, req.file.filename);

    res.json({
      message: 'File uploaded successfully',
      file: {
        id: req.file.filename,
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  });
});

// POST /api/files/upload-multiple - Upload multiple files
router.post('/upload-multiple', (req, res) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(400).json({ 
        error: 'File upload failed', 
        message: err.message 
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        error: 'No files uploaded' 
      });
    }

    const files = req.files.map(file => ({
      id: file.filename,
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      url: getFileUrl(req, file.filename)
    }));

    res.json({
      message: 'Files uploaded successfully',
      files
    });
  });
});

// DELETE /api/files/:filename - Delete file
router.delete('/:filename', (req, res) => {
  const { filename } = req.params;
  
  try {
    const deleted = deleteFile(filename);
    if (deleted) {
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
