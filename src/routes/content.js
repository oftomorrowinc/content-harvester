const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// Main page
router.get('/', contentController.renderMainPage);

// Add URLs
router.post('/api/urls', contentController.addUrls);

// Upload files
router.post('/api/files', contentController.uploadFiles);

// Delete content
router.delete('/api/content/:id', contentController.deleteContent);

// Toggle anonymize
router.put('/api/content/:id/anonymize', contentController.toggleAnonymize);

// Process all content
router.post('/api/process-all', contentController.processAllContent);

module.exports = router;