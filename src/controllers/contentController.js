const contentModel = require('../models/content');
const { extractUrls } = require('../utils/url');

// Render the main page
const renderMainPage = async (req, res) => {
  try {
    const contentItems = await contentModel.getAllContent();
    res.render('index', { 
      title: 'Content Harvester',
      contentItems
    });
  } catch (error) {
    console.error('Error rendering main page:', error);
    res.status(500).render('error', { error });
  }
};

// Add URLs
const addUrls = async (req, res) => {
  try {
    const { urls } = req.body;
    
    if (!urls || urls.trim() === '') {
      // If the request is from HTMX, return the current content list
      if (req.headers['hx-request']) {
        const contentItems = await contentModel.getAllContent();
        return res.render('partials/content-table', { contentItems });
      }
      
      return res.status(400).json({ 
        success: false, 
        message: 'No URLs provided' 
      });
    }
    
    const extractedUrls = extractUrls(urls);
    
    if (extractedUrls.length === 0) {
      if (req.headers['hx-request']) {
        // Set header to show a toast notification
        res.set('HX-Trigger', JSON.stringify({
          'showToast': {
            message: 'No valid URLs found. URLs must start with http:// or https://',
            type: 'error'
          }
        }));
        
        const contentItems = await contentModel.getAllContent();
        return res.render('partials/content-table', { contentItems });
      }
      
      return res.status(400).json({ 
        success: false, 
        message: 'No valid URLs found' 
      });
    }
    
    // Process each URL
    const results = await Promise.all(
      extractedUrls.map(url => contentModel.processUrl(url))
    );
    
    // Get updated content list
    const contentItems = await contentModel.getAllContent();
    
    // If the request wants HTML (HTMX)
    if (req.headers['hx-request']) {
      return res.render('partials/content-table', { contentItems });
    }
    
    // Otherwise return JSON
    return res.status(200).json({ 
      success: true, 
      message: `Added ${results.length} URLs`,
      items: results
    });
  } catch (error) {
    console.error('Error adding URLs:', error);
    if (req.headers['hx-request']) {
      return res.status(400).render('partials/error-toast', { 
        message: error.message || 'Error adding URLs' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Error adding URLs' 
    });
  }
};

// Upload files
const uploadFiles = async (req, res) => {
  try {
    console.log("Upload files request:", req.files);
    
    // Check if we have any files
    if (!req.files || Object.keys(req.files).length === 0) {
      const contentItems = await contentModel.getAllContent();
      if (req.headers['hx-request']) {
        console.log("No files were uploaded (HTMX request)");
        return res.render('partials/content-table', { contentItems });
      }
      return res.status(400).json({ 
        success: false, 
        message: 'No files were uploaded' 
      });
    }
    
    // Convert to array if single file - check both 'files' and 'file' keys
    let files = [];
    if (req.files.files) {
      files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    } else if (req.files.file) {
      files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];
    } else {
      // Try to get any file that was uploaded
      const firstFileKey = Object.keys(req.files)[0];
      files = Array.isArray(req.files[firstFileKey]) 
        ? req.files[firstFileKey] 
        : [req.files[firstFileKey]];
    }
    
    console.log(`Processing ${files.length} files:`, files.map(f => f.name));
    
    // Process each file
    const results = [];
    const errors = [];
    
    for (const file of files) {
      try {
        const result = await contentModel.processFile(file);
        results.push(result);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        errors.push({ 
          name: file.name, 
          error: error.message || 'Error processing file' 
        });
      }
    }
    
    // Get updated content list
    const contentItems = await contentModel.getAllContent();
    
    // If the request wants HTML (HTMX)
    if (req.headers['hx-request']) {
      // Return the updated table with a success message if needed
      if (errors.length > 0) {
        // Add error information to the response headers
        res.set('HX-Trigger', JSON.stringify({
          'showToast': {
            message: `${errors.length} files could not be processed`,
            type: 'error'
          }
        }));
      }
      return res.render('partials/content-table', { contentItems });
    }
    
    // Otherwise return JSON
    return res.status(200).json({ 
      success: true, 
      message: `Processed ${results.length} files, ${errors.length} errors`,
      successItems: results,
      errorItems: errors
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    if (req.headers['hx-request']) {
      return res.status(400).render('partials/error-toast', { 
        message: error.message || 'Error uploading files' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Error uploading files' 
    });
  }
};

// Delete content
const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    await contentModel.deleteContent(id);
    
    // Get updated content list
    const contentItems = await contentModel.getAllContent();
    
    // If the request wants HTML (HTMX)
    if (req.headers['hx-request']) {
      return res.render('partials/content-table', { contentItems });
    }
    
    // Otherwise return JSON
    return res.status(200).json({ 
      success: true, 
      message: 'Content deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    if (req.headers['hx-request']) {
      return res.status(400).render('partials/error-toast', { 
        message: error.message || 'Error deleting content'
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Error deleting content' 
    });
  }
};

// Toggle anonymize
const toggleAnonymize = async (req, res) => {
  try {
    const { id } = req.params;
    const { anonymize } = req.body;
    
    await contentModel.toggleAnonymize(id, anonymize === 'true');
    
    // Get the updated item
    const item = await contentModel.getContentById(id);
    
    // If the request wants HTML (HTMX)
    if (req.headers['hx-request']) {
      return res.render('partials/content-row', { item });
    }
    
    // Otherwise return JSON
    return res.status(200).json({ 
      success: true, 
      item 
    });
  } catch (error) {
    console.error('Error toggling anonymize:', error);
    if (req.headers['hx-request']) {
      return res.status(400).render('partials/error-toast', { 
        message: error.message || 'Error updating content' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Error updating content' 
    });
  }
};

// Process all content
const processAllContent = async (req, res) => {
  try {
    // Get all pending content
    const allContent = await contentModel.getAllContent();
    const pendingContent = allContent.filter(item => item.status === 'pending');
    
    // Update status to processing
    await Promise.all(
      pendingContent.map(item => 
        contentModel.updateContentStatus(item.id, 'processing')
      )
    );
    
    // If this were a real implementation, we would trigger cloud functions,
    // but for demo purposes, we'll just update the status after a delay
    setTimeout(async () => {
      await Promise.all(
        pendingContent.map(item => 
          contentModel.updateContentStatus(item.id, 'completed')
        )
      );
    }, 3000);
    
    // Get updated content list
    const contentItems = await contentModel.getAllContent();
    
    // If the request wants HTML (HTMX)
    if (req.headers['hx-request']) {
      return res.render('partials/content-table', { contentItems });
    }
    
    // Otherwise return JSON
    return res.status(200).json({ 
      success: true, 
      message: `Processing ${pendingContent.length} items` 
    });
  } catch (error) {
    console.error('Error processing content:', error);
    if (req.headers['hx-request']) {
      return res.status(400).render('partials/error-toast', { 
        message: error.message || 'Error processing content' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Error processing content' 
    });
  }
};

module.exports = {
  renderMainPage,
  addUrls,
  uploadFiles,
  deleteContent,
  toggleAnonymize,
  processAllContent
};