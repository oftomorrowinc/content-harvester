document.addEventListener('DOMContentLoaded', () => {
  // Helpers
  const createToast = (message, type = 'info') => {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}-toast`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-message">${message}</span>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.remove();
    }, 5000);
  };

  // Listen for HTMX events
  document.body.addEventListener('htmx:responseError', event => {
    console.error('HTMX Error:', event.detail);
    createToast(event.detail.xhr.responseText || 'An error occurred', 'error');
  });

  document.body.addEventListener('htmx:afterRequest', event => {
    // Check if the event has a trigger for showing a toast
    const triggerHeader = event.detail.xhr.getResponseHeader('HX-Trigger');
    if (triggerHeader) {
      try {
        const triggers = JSON.parse(triggerHeader);
        if (triggers.showToast) {
          createToast(triggers.showToast.message, triggers.showToast.type);
        }
      } catch (error) {
        console.error('Error parsing HX-Trigger:', error);
      }
    }

    // Clear URL input field if the URL form was submitted successfully
    if (
      event.detail.elt &&
      event.detail.elt.id === 'url-form' &&
      event.detail.successful &&
      !event.detail.failed
    ) {
      const urlInput = document.getElementById('url-input');
      if (urlInput) {
        urlInput.value = '';
      }
    }
  });

  // Handle document-level paste events (only when not focused on an input field)
  document.addEventListener('paste', event => {
    // Skip if we're pasting into an input or textarea
    if (
      document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA' ||
      document.activeElement.isContentEditable
    ) {
      return;
    }

    // Get the pasted text
    const pastedText = event.clipboardData.getData('text');

    // If it contains URLs (starts with http:// or https://)
    if (pastedText && (pastedText.includes('http://') || pastedText.includes('https://'))) {
      // Populate the URL input
      const urlInput = document.getElementById('url-input');
      if (urlInput) {
        urlInput.value = pastedText;

        // Submit the form
        const form = urlInput.closest('form');
        if (form && form.getAttribute('hx-post')) {
          form.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      }
    }
  });

  // Setup drag and drop functionality
  const setupDragAndDrop = () => {
    const dropzone = document.getElementById('content-table-body');
    const tableWrapper = document.querySelector('.content-table-wrapper');

    if (!dropzone) {
      console.log('Dropzone not found. Waiting for DOM update...');
      setTimeout(setupDragAndDrop, 500);
      return;
    }

    console.log('Setting up drag and drop on element:', dropzone);

    // Create a visual indicator element
    const createIndicator = () => {
      const indicator = document.createElement('div');
      indicator.className = 'drag-indicator';
      indicator.innerHTML = `
        <div class="drag-indicator-content">
          <div class="drag-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p class="drag-text">Drop files to upload</p>
        </div>
      `;
      return indicator;
    };

    // Prevent default drag behaviors for the entire document
    document.addEventListener('dragover', event => {
      event.preventDefault();
    });

    document.addEventListener('drop', event => {
      event.preventDefault();
    });

    // Prevent default drag behaviors for the dropzone
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(
        eventName,
        event => {
          event.preventDefault();
          event.stopPropagation();
        },
        false
      );
    });

    // Track drag enter/leave events
    let dragCounter = 0;

    // When files are dragged over the document
    document.addEventListener('dragenter', event => {
      dragCounter++;

      // Check if a file is being dragged
      if (event.dataTransfer.types.includes('Files')) {
        // Add hover effect to the dropzone
        dropzone.classList.add('dragover');

        // If we don't already have an indicator, create one
        if (!document.querySelector('.drag-indicator')) {
          const indicator = createIndicator();
          document.body.appendChild(indicator);

          // Position the indicator over the table
          if (tableWrapper) {
            const rect = tableWrapper.getBoundingClientRect();
            indicator.style.position = 'fixed';
            indicator.style.left = `${rect.left}px`;
            indicator.style.top = `${rect.top}px`;
            indicator.style.width = `${rect.width}px`;
            indicator.style.height = `${rect.height}px`;
          }
        }
      }
    });

    // When files are dragged out of the document
    document.addEventListener('dragleave', _event => {
      dragCounter--;

      // If we're no longer dragging over the document
      if (dragCounter <= 0) {
        dragCounter = 0;
        dropzone.classList.remove('dragover');

        // Remove the indicator if it exists
        const indicator = document.querySelector('.drag-indicator');
        if (indicator) {
          indicator.remove();
        }
      }
    });

    // When files are dropped
    document.addEventListener('drop', () => {
      dragCounter = 0;
      dropzone.classList.remove('dragover');

      // Remove the indicator if it exists
      const indicator = document.querySelector('.drag-indicator');
      if (indicator) {
        indicator.remove();
      }
    });

    // Handle file drop specifically on the dropzone
    dropzone.addEventListener(
      'drop',
      e => {
        console.log('Drop event triggered with files:', e.dataTransfer.files);
        const files = e.dataTransfer.files;

        if (files.length === 0) {
          return;
        }

        // List of unsupported file extensions
        const unsupportedExtensions = [
          "pptx", "ppt", "xlsx", "xls", "csv", "jpg", "jpeg", "png", "gif", 
          "webp", "svg", "epub", "zip", "rar", "7z", "tar", "gz", "bz2", 
          "tgz", "odp", "odt", "ods", "numbers", "pages", "key", "rtf", 
          "webm", "mkv", "ogg", "ogv", "m4a", "flac", "aac", "heic", 
          "heif", "avif", "tiff", "tif", "bmp", "psd", "ai", "indd", 
          "raw", "cr2", "nef", "arw", "dng"
        ];
        
        // Max file size: 50MB
        const MAX_FILE_SIZE = 50 * 1024 * 1024; 
        
        // Check for unsupported file types and file size
        const validationResults = Array.from(files).map(file => {
          const fileName = file.name.toLowerCase();
          const fileExt = fileName.split('.').pop() || '';
          
          // Check file type
          if (unsupportedExtensions.some(ext => fileName.endsWith(`.${ext}`))) {
            return { 
              file, 
              valid: false, 
              reason: 'type',
              extension: fileExt
            };
          }
          
          // Check file size
          if (file.size > MAX_FILE_SIZE) {
            return { 
              file, 
              valid: false, 
              reason: 'size',
              size: file.size
            };
          }
          
          return { file, valid: true };
        });
        
        const invalidFiles = validationResults.filter(result => !result.valid);
        
        if (invalidFiles.length > 0) {
          // Group by reason
          const typeErrors = invalidFiles.filter(f => f.reason === 'type');
          const sizeErrors = invalidFiles.filter(f => f.reason === 'size');
          
          let errorMessage = '';
          
          // Format type errors
          if (typeErrors.length > 0) {
            const extensions = [...new Set(typeErrors.map(f => f.extension))];
            errorMessage += `Unsupported file type${typeErrors.length > 1 ? 's' : ''}: .${extensions.join(', .')}. `;
          }
          
          // Format size errors
          if (sizeErrors.length > 0) {
            const maxSizeFormatted = formatSize(MAX_FILE_SIZE);
            if (sizeErrors.length === 1) {
              errorMessage += `File exceeds the ${maxSizeFormatted} size limit. `;
            } else {
              errorMessage += `${sizeErrors.length} files exceed the ${maxSizeFormatted} size limit. `;
            }
          }
          
          createToast(errorMessage, 'error');

          // If all files are invalid, return early
          if (invalidFiles.length === files.length) {
            return;
          }
        }

        // Create FormData and upload supported files
        const formData = new FormData();
        const supportedFiles = validationResults
          .filter(result => result.valid)
          .map(result => result.file);

        // Log what we're uploading
        console.log(
          `Uploading ${supportedFiles.length} files:`,
          supportedFiles.map(f => f.name)
        );

        // Add each file to the form data
        supportedFiles.forEach(file => {
          // Use 'file' as the field name (matches what the controller expects)
          formData.append('file', file);
        });

        // Get the upload URL from the data attribute
        const uploadUrl = dropzone.getAttribute('data-upload-url') || '/api/files';
        console.log('Using upload URL:', uploadUrl);

        // Manually trigger XHR request for the file upload
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl);
        xhr.setRequestHeader('HX-Request', 'true');

        // Debug the upload process
        xhr.upload.addEventListener('progress', event => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            console.log(`Upload progress: ${Math.round(percentComplete)}%`);
          }
        });

        xhr.onload = function () {
          console.log('Upload response status:', xhr.status);
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Upload successful, updating content');
            document.getElementById('content-table-container').innerHTML = xhr.responseText;
            // Reinitialize drag and drop after content update
            setupDragAndDrop();
          } else {
            console.error('Upload error:', xhr.responseText);
            createToast('Error uploading files: ' + xhr.statusText, 'error');
          }
        };

        xhr.onerror = function (error) {
          console.error('XHR error:', error);
          createToast('Network error during file upload', 'error');
        };

        xhr.send(formData);
      },
      false
    );
  };

  // Initial setup
  setupDragAndDrop();

  // Reinitialize drag and drop after any HTMX content swap
  document.body.addEventListener('htmx:afterSwap', event => {
    if (event.detail.target.id === 'content-table-container') {
      // Set up drag and drop again
      setupDragAndDrop();

      // Auto-scroll to the bottom of the table when content is updated
      const tbody = document.getElementById('content-table-body');
      if (tbody) {
        // Use setTimeout to ensure the DOM has finished updating
        setTimeout(() => {
          tbody.scrollTop = tbody.scrollHeight;
          
          // Check if the table has any rows other than the empty state
          const hasRows = tbody.querySelectorAll('tr:not(.empty-state)').length > 0;
          
          if (hasRows) {
            // Add a class to ensure proper scrolling state
            tbody.classList.add('has-content');
          } else {
            tbody.classList.remove('has-content');
          }
        }, 100);
      }
    }
  });
});

// Helper function to format file sizes
const formatSize = bytes => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Make it available to Pug templates
window.formatSize = formatSize;
