# ContentHarvester - Simple URL and File Collection

We're building ContentHarvester, a streamlined solution for collecting content from URLs and files. The core concept is simplicity: a clean, table-like interface where users can paste URLs or drag-and-drop files. The system should be a very opionated npm pacakge and uses dark theme (see visual design png), nodejs, express, pug, HTMX (for interactivity), firebase storage for files, firestore for database (metadata about storage and status to trigger firebase function (not in this project/repo) to process uploaded files and urls). We should include Firestore Emulator as a dev dependency and use that for all examples locally to develop and show-off the app.

## Key Features

1. **Single Table-Like Input Area**:
   - Paste URLs (only lines starting with http/https are processed)
   - Drag and drop files to a dropzone sized exactly like the table body
   - Clean visual feedback during interactions

2. **Smart Content Handling**:
   - Automatically extract URLs from pasted text (ignore non-URL text)
   - File type validation with clear user feedback
   - Rejection of unsupported file types (starting with .zip files)

3. **User Experience**:
   - In-place toast notifications for rejected files
   - No page refreshes or complex workflows
   - Immediate feedback on successful additions

4. **Technical Implementation**:
   - Minimal dependencies
   - Clean, modular JavaScript
   - Responsive design that works on all devices

The interface should be intuitive, with the table-like structure serving as both display and input mechanism. When users drag files over the table body, a dropzone overlay of the exact same size should appear. If unsupported files are dropped, a small toast notification should appear within the same container (not as a global notification).

This is a ground-up rebuild focusing on simplicity and user experience rather than complex features. The goal is to create something that "just works" without requiring extensive configuration or setup.