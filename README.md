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

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Firebase account (for production deployment)
- Firebase CLI (for local emulation)

### Quick Start

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/content-harvester.git
   cd content-harvester
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start Firebase emulators (Firestore and Storage)
   ```bash
   npm run emulator
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open a browser and navigate to `http://localhost:3000`

### Using Content Harvester

1. **Adding URLs**:
   - Type or paste URLs in the input field at the top right
   - Click "Add URLs" or use keyboard shortcuts to submit
   - Alternatively, paste URLs anywhere on the page (when not focused on an input)

2. **Uploading Files**:
   - Drag and drop files onto the table area
   - Watch as they're automatically processed and added to the table

3. **Managing Content**:
   - Toggle anonymization settings for each item
   - Remove items with the delete button
   - Process all pending content with the "Process All Content" button
   - Scroll through your collected content in the table

## Core Concepts

### Content Model

Content Harvester organizes all data in a unified "content" model with these key attributes:

- **Type**: Either 'url' or 'file', determining how the content is processed
- **Name**: The URL or filename for identification
- **Size**: Size in bytes (for files)
- **Status**: Current processing state ('pending', 'processing', 'completed')
- **Anonymize**: Toggle whether the content should be processed anonymously
- **Storage References**: For files, information on where they're stored in Firebase

### Firebase Integration

The application uses two Firebase services:

1. **Firestore Database**: Stores metadata about all content
   - Collection structure: `contents/{contentId}`
   - Each document contains type, name, URL, status, etc.

2. **Firebase Storage**: Handles file uploads
   - Files are uploaded to `uploads/{uuid}-{filename}`
   - Signed URLs enable secure access to the files

In development mode, Firebase emulators simulate these services locally.

### HTMX Architecture

Content Harvester uses HTMX to create a reactive UI without complex JavaScript:

- **Server-rendered Partials**: The server returns HTML fragments that HTMX swaps into the DOM
- **Input → Backend → HTML**: User interactions trigger server requests that return updated HTML
- **No State Management**: Eliminates the need for client-side state management libraries
- **Progressive Enhancement**: Core functionality works even without JavaScript

## Development Guide

### Project Structure

```
content-harvester/
├── src/
│   ├── config/          # Configuration for Firebase and other services
│   ├── controllers/     # Request handlers and business logic
│   ├── models/          # Data models and database operations
│   ├── public/          # Static assets (CSS, client-side JS)
│   ├── routes/          # Express routes definitions
│   ├── utils/           # Utility functions and helpers
│   ├── views/           # Pug templates for rendering HTML
│   │   ├── layouts/     # Base layout templates
│   │   └── partials/    # Reusable UI components
│   └── index.js         # Application entry point
├── tests/
│   ├── unit/            # Unit tests for isolated components
│   ├── integration/     # Tests for API routes and controllers
│   └── setup.js         # Test configuration and mocks
└── package.json         # Dependencies and scripts
```

### Testing

Run the test suite with these commands:

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Code Quality

Maintain code quality with:

```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

### Firebase Emulator Data

To save and reuse emulator data:

```bash
# Export current emulator state
npm run emulator:export

# Start emulators with previously exported data
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

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (commits will be linted and formatted automatically)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please ensure your code passes all tests and follows the project's code style.