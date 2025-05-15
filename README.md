# Content Harvester

A streamlined solution for collecting content from URLs and files. Content Harvester provides a clean, table-like interface where users can paste URLs or drag-and-drop files for collection and processing.

![Content Harvester](Visual%20Design.png)

## Features

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
   - Firebase Storage for files
   - Firestore for metadata and status tracking
   - HTMX for interactive UI without complex JavaScript
   - Responsive design that works on all devices

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- Firebase account (for production deployment)
- Firebase CLI (for local emulation)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/content-harvester.git
   cd content-harvester
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start Firebase emulators (Firestore and Storage)
   ```
   npm run emulator
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open a browser and navigate to `http://localhost:3000`

### Firebase Emulator Data

To save and reuse emulator data:

- Export emulator data:
  ```
  npm run emulator:export
  ```

- Import emulator data on startup:
  ```
  npm run emulator:import
  ```

## Production Deployment

1. Create a Firebase project and enable Firestore and Storage

2. Set up environment variables
   - `FIREBASE_SERVICE_ACCOUNT` - Your Firebase service account JSON (stringified)
   - `FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket name
   - `NODE_ENV=production`

3. Deploy to your preferred hosting service (Netlify, Vercel, Firebase Hosting, etc.)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.