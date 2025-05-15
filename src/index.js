const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const { initializeApp } = require('./config/firebase');
const { formatSize } = require('./utils/formatters');

// Set NODE_ENV to development if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Initialize Firebase
initializeApp();

// Import routes
const contentRoutes = require('./routes/content');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.formatSize = formatSize; // Make formatSize available in all templates

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/htmx', express.static(path.join(__dirname, '../node_modules/htmx.org/dist')));

// File upload middleware
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  abortOnLimit: true,
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Routes
app.use('/', contentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Content Harvester server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
});

module.exports = app;