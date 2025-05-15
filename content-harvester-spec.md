# ContentHarvester - Technical Specification

## Overview

ContentHarvester is a lightweight, focused solution for collecting URLs and files through a single table-like interface. The core experience centers around a clean, intuitive UI where users can paste URLs or drag-and-drop files directly into a table structure.

## Core Requirements

1. **Table Input Interface**
   - Table-like structure that displays added content
   - Ability to paste text (extracting only valid http/https URLs)
   - Drag-and-drop zone exactly the size of the table body

2. **Input Validation**
   - URL validation (must start with http/https)
   - File type validation (reject unsupported types)
   - Initial list of unsupported file types: .zip

3. **User Feedback**
   - Visual cues during drag operations
   - In-context toast messages for rejected files
   - Success indicators for added content

## UI Design

```
┌───────────────────────────────────────────────────────────┐
│ Content Collection                                        │
├───────────────────────────────────────────────────────────┤
│ Type    │ Name                          │ Size    │ Status│
├─────────┼───────────────────────────────┼─────────┼───────┤
│         │                               │         │       │
│         │   [Table Body / Drop Zone]    │         │       │
│         │                               │         │       │
│         │                               │         │       │
└─────────┴───────────────────────────────┴─────────┴───────┘
```

### Key UI Elements

1. **Table Structure**
   - Column headers: Type, Name, Size, Status
   - Table body serves as drop zone when dragging files
   - Each row represents a piece of content (URL or file)

2. **Drop Zone Overlay**
   - Appears when dragging files over the table body
   - Same exact dimensions as table body
   - Clear visual styling (border, background color)
   - Centered message "Drop files here"

3. **Toast Notifications**
   - Appear within the table container (not global overlays)
   - Show for unsupported file types
   - Automatically dismiss after short duration
   - Non-disruptive positioning

## Technical Implementation

### HTML Structure

```html
<div class="content-harvester">
  <div class="table-container">
    <!-- Header -->
    <div class="table-header">
      <div class="header-cell">Type</div>
      <div class="header-cell">Name</div>
      <div class="header-cell">Size</div>
      <div class="header-cell">Status</div>
    </div>
    
    <!-- Table Body / Drop Zone -->
    <div class="table-body" id="drop-zone">
      <!-- Rows will be added here dynamically -->
      
      <!-- Drop Overlay (hidden by default) -->
      <div class="drop-overlay" id="drop-overlay">
        <div class="drop-message">
          <h3>Drop Files Here</h3>
        </div>
      </div>
      
      <!-- Toast Container (for notifications) -->
      <div class="toast-container" id="toast-container"></div>
    </div>
  </div>
</div>
```

### JavaScript Components

1. **URL Handling**
   - Listen for paste events on the table body
   - Extract valid URLs (must start with http/https)
   - Ignore non-URL text
   - Add valid URLs as new rows

2. **Drag and Drop**
   - Show overlay when files dragged over table
   - Process files on drop
   - Validate file types
   - Show toast for unsupported files
   - Add supported files as new rows

3. **Toast System**
   - Create and display toast messages
   - Auto-dismiss after timeout
   - Position within table container
   - Non-blocking design

### CSS Styling

```css
.content-harvester {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.table-container {
  position: relative;
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 100px 1fr 100px 100px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-cell {
  padding: 12px;
  font-weight: 600;
  color: #475569;
}

.table-body {
  position: relative;
  min-height: 200px;
  background-color: #ffffff;
}

.table-row {
  display: grid;
  grid-template-columns: 100px 1fr 100px 100px;
  border-bottom: 1px solid #e2e8f0;
}

.table-cell {
  padding: 12px;
  color: #1e293b;
}

/* Drop overlay styles */
.drop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(96, 165, 250, 0.2);
  border: 3px dashed #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.drop-overlay.active {
  opacity: 1;
}

.drop-message {
  background-color: #ffffff;
  padding: 16px 24px;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Toast notification styles */
.toast-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.toast {
  padding: 12px 16px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  max-width: 300px;
}

.toast.error {
  border-left: 4px solid #ef4444;
}

.toast.success {
  border-left: 4px solid #22c55e;
}
```

## File Type Handling

### Supported File Types (Initial Implementation)
- Document types (.pdf, .docx, .doc, .txt, .md)
- Image types (.jpg, .jpeg, .png, .gif, .webp)
- Media types (.mp4, .mp3, .wav)

### Unsupported File Types
- Archive files (.zip, .rar, .7z)
- Executable files (.exe, .dmg, .bin)
- System files (.dll, .sys)

## URL Validation

- Must start with http:// or https://
- Basic URL structure validation
- Extract only valid URLs from pasted text
- Ignore lines not starting with http/https

## User Experience Flow

1. **Initial State**
   - Empty table with headers
   - Visual cue indicating where to paste URLs or drop files

2. **URL Pasting**
   - User pastes text into table
   - System extracts and validates URLs
   - Valid URLs added as rows
   - No feedback for ignored content

3. **File Dragging**
   - User drags files over table
   - Drop zone overlay appears (exact table size)
   - Visual feedback indicates valid drop target

4. **File Dropping**
   - Files are validated by type
   - Supported files added as rows
   - Toast notification for unsupported files
   - Drop overlay disappears

5. **Content Display**
   - Each item appears as a row in the table
   - Type icon, name, size, and status shown
   - Status updates as processing occurs

## Implementation Notes

1. **Accessibility**
   - Keyboard navigation support
   - Screen reader compatibility
   - Focus management for interactions

2. **Performance**
   - Efficient DOM manipulation
   - Debounced paste handling
   - Optimized file validation

3. **Browser Compatibility**
   - Support modern browsers (Chrome, Firefox, Safari, Edge)
   - Graceful degradation for older browsers

## Minimal Example Implementation

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('drop-zone');
  const dropOverlay = document.getElementById('drop-overlay');
  const toastContainer = document.getElementById('toast-container');
  
  // Prevent default behaviors to allow drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });
  
  // Show drop overlay when dragging over
  dropZone.addEventListener('dragenter', () => {
    dropOverlay.classList.add('active');
  });
  
  // Hide drop overlay when leaving
  dropZone.addEventListener('dragleave', e => {
    // Only if we're leaving the drop zone (not entering a child element)
    if (!dropZone.contains(e.relatedTarget)) {
      dropOverlay.classList.remove('active');
    }
  });
  
  // Handle dropped files
  dropZone.addEventListener('drop', e => {
    dropOverlay.classList.remove('active');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => {
        // Check if file type is supported
        if (isFileTypeSupported(file)) {
          addContentRow(file);
        } else {
          showToast(`Unsupported file type: ${getFileExtension(file.name)}`, 'error');
        }
      });
    }
  });
  
  // Handle pasted content
  dropZone.addEventListener('paste', e => {
    const text = e.clipboardData.getData('text');
    const urls = extractUrls(text);
    
    if (urls.length > 0) {
      urls.forEach(url => {
        addContentRow({ type: 'url', url });
      });
    }
  });
  
  // Helper functions
  function isFileTypeSupported(file) {
    const extension = getFileExtension(file.name).toLowerCase();
    const unsupportedTypes = ['zip', 'rar', '7z', 'exe', 'dmg', 'bin', 'dll', 'sys'];
    return !unsupportedTypes.includes(extension);
  }
  
  function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }
  
  function extractUrls(text) {
    const lines = text.split('\n');
    return lines
      .filter(line => line.trim().startsWith('http'))
      .map(line => line.trim());
  }
  
  function addContentRow(content) {
    const row = document.createElement('div');
    row.className = 'table-row';
    
    // Create cells based on content type
    if (content.type === 'url') {
      row.innerHTML = `
        <div class="table-cell">URL</div>
        <div class="table-cell">${content.url}</div>
        <div class="table-cell">-</div>
        <div class="table-cell">Added</div>
      `;
    } else {
      // File content
      row.innerHTML = `
        <div class="table-cell">${getFileTypeLabel(content)}</div>
        <div class="table-cell">${content.name}</div>
        <div class="table-cell">${formatFileSize(content.size)}</div>
        <div class="table-cell">Added</div>
      `;
    }
    
    dropZone.appendChild(row);
  }
  
  function getFileTypeLabel(file) {
    const extension = getFileExtension(file.name).toLowerCase();
    // Map extension to user-friendly label
    const typeMap = {
      'pdf': 'PDF',
      'docx': 'Word',
      'jpg': 'Image',
      'jpeg': 'Image',
      'png': 'Image',
      'mp4': 'Video',
      'mp3': 'Audio'
      // Add more as needed
    };
    
    return typeMap[extension] || extension.toUpperCase();
  }
  
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  }
  
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after delay
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 300);
    }, 3000);
  }
});
```

## Future Enhancements

1. **Content Preview**
   - Thumbnail generation for images
   - Type-specific icons for different file types
   - URL metadata preview (title, description)

2. **Batch Operations**
   - Select multiple items
   - Delete selected items
   - Process selected items

3. **Advanced Validation**
   - Content type detection by file signature
   - URL reachability checking
   - Duplicate detection

The final implementation should prioritize simplicity and user experience, with a clean, intuitive interface that makes content collection effortless.