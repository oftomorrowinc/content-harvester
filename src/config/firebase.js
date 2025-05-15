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
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'content-harvester.appspot.com',
      });

      // If running locally and emulators are enabled, configure them
      if (process.env.USE_FIREBASE_EMULATORS === 'true') {
        console.log('Using Firebase Emulators');
        const firestore = admin.firestore();
        const firestoreHost = `${process.env.FIREBASE_EMULATOR_HOST || 'localhost'}:${process.env.FIREBASE_FIRESTORE_EMULATOR_PORT || '8080'}`;
        
        firestore.settings({
          host: firestoreHost,
          ssl: false,
        });

        // Configure Storage emulator
        process.env.FIREBASE_STORAGE_EMULATOR_HOST = process.env.FIREBASE_STORAGE_EMULATOR_HOST || 'localhost:9199';
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
  getBucket: () => admin.storage().bucket(),
};
