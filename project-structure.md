# Content Harvester - Project Structure

```
content-harvester/
├── firebase.json              # Firebase configuration
├── firestore.indexes.json     # Firestore indexes configuration
├── firestore.rules            # Firestore security rules
├── storage.rules              # Storage security rules
├── package.json               # NPM package definition
├── README.md                  # Project documentation
├── project-structure.md       # This file
│
└── src/                       # Source files
    ├── index.js               # Main application entry point
    │
    ├── config/                # Configuration files
    │   └── firebase.js        # Firebase initialization
    │
    ├── controllers/           # Request handlers
    │   └── contentController.js # Content-related logic
    │
    ├── models/                # Data models
    │   └── content.js         # Content model with Firebase integration
    │
    ├── public/                # Static assets
    │   ├── css/
    │   │   └── styles.css     # Application styles
    │   └── js/
    │       └── app.js         # Client-side JavaScript
    │
    ├── routes/                # Express routes
    │   └── content.js         # Content-related routes
    │
    ├── utils/                 # Utility functions
    │   ├── formatters.js      # Format helpers
    │   └── url.js             # URL parsing utilities
    │
    └── views/                 # Pug templates
        ├── index.pug          # Main application view
        ├── error.pug          # Error page
        │
        ├── layouts/           # Template layouts
        │   └── main.pug       # Main layout template
        │
        └── partials/          # Reusable template parts
            ├── content-row.pug    # Single content row
            ├── content-table.pug  # Content table
            └── error-toast.pug    # Error toast notification
```

## Key Components

1. **Firebase Integration**
   - `config/firebase.js` handles connection to Firebase/emulators
   - Automatically detects local vs production environments

2. **Content Model**
   - `models/content.js` handles all data interactions
   - Manages content metadata storage in Firestore
   - Handles file uploads to Firebase Storage

3. **Controller Logic**
   - `controllers/contentController.js` contains the business logic
   - Processes user inputs and handles file/URL validation

4. **View Templates**
   - Pug templates for rendering the UI
   - Partials for HTMX dynamic updates

5. **Client-Side Interactions**
   - Minimal JavaScript for drag-and-drop functionality
   - HTMX for most dynamic interactions
   - Toast notifications for user feedback