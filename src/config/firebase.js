const admin = require('firebase-admin');

// Check if we're running in a Firebase Function or locally
const initializeApp = () => {
  try {
    // Check if the app has already been initialized
    if (admin.apps.length === 0) {
      // Running locally or in Firebase Functions
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
        : null;

      // Initialize the app
      admin.initializeApp({
        credential: serviceAccount 
          ? admin.credential.cert(serviceAccount) 
          : admin.credential.applicationDefault(),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'content-harvester.appspot.com'
      });

      // If running locally, use Firebase emulators
      if (process.env.NODE_ENV !== 'production') {
        console.log('Using Firebase Emulators');
        const firestore = admin.firestore();
        firestore.settings({
          host: 'localhost:8080',
          ssl: false
        });
        
        // Configure Storage emulator
        process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';
      }
    }

    return admin;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

module.exports = { 
  initializeApp,
  getFirestore: () => admin.firestore(),
  getStorage: () => admin.storage(),
  getBucket: () => admin.storage().bucket()
};