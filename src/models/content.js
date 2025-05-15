const { getFirestore, getBucket } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Collection name
const COLLECTION = 'contents';

// Get Firestore instance
const getDb = () => getFirestore();

// Create a new content item (URL or file)
const createContent = async (data) => {
  try {
    const db = getDb();
    const id = uuidv4();
    
    const contentData = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending',
      ...data
    };
    
    await db.collection(COLLECTION).doc(id).set(contentData);
    return { id, ...contentData };
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
};

// Get all content items
const getAllContent = async () => {
  try {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION).orderBy('createdAt', 'desc').get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting all content:', error);
    throw error;
  }
};

// Get a content item by ID
const getContentById = async (id) => {
  try {
    const db = getDb();
    const doc = await db.collection(COLLECTION).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error(`Error getting content with ID ${id}:`, error);
    throw error;
  }
};

// Update a content item
const updateContent = async (id, data) => {
  try {
    const db = getDb();
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    
    await db.collection(COLLECTION).doc(id).update(updateData);
    return { id, ...updateData };
  } catch (error) {
    console.error(`Error updating content with ID ${id}:`, error);
    throw error;
  }
};

// Delete a content item
const deleteContent = async (id) => {
  try {
    const db = getDb();
    
    // Get the content to check if it has a file to delete
    const content = await getContentById(id);
    
    if (content && content.type === 'file' && content.storageRef) {
      // Delete the file from storage
      const bucket = getBucket();
      await bucket.file(content.storageRef).delete();
    }
    
    // Delete from Firestore
    await db.collection(COLLECTION).doc(id).delete();
    return { success: true, id };
  } catch (error) {
    console.error(`Error deleting content with ID ${id}:`, error);
    throw error;
  }
};

// Upload a file to Firebase Storage
const uploadFile = async (file) => {
  try {
    console.log('Uploading file:', file.name, 'size:', file.size);
    
    // When running in emulator mode, we don't actually upload to Firebase Storage
    // Instead, we'll simulate it by returning a mock URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Using Firebase emulator, simulating upload');
      
      // Create a mock file URL
      const filename = `${uuidv4()}-${path.basename(file.name)}`;
      const filePath = `uploads/${filename}`;
      const mockUrl = `http://localhost:9199/v0/b/content-harvester.appspot.com/o/${encodeURIComponent(filePath)}?alt=media`;
      
      return {
        storageRef: filePath,
        url: mockUrl,
        name: file.name,
        size: file.size,
        type: file.mimetype
      };
    }
    
    // Production upload to real Firebase Storage
    const bucket = getBucket();
    const filename = `${uuidv4()}-${path.basename(file.name)}`;
    const filePath = `uploads/${filename}`;
    
    // Upload the file to Firebase Storage
    await bucket.upload(file.tempFilePath, {
      destination: filePath,
      metadata: {
        contentType: file.mimetype,
        metadata: {
          originalName: file.name
        }
      }
    });
    
    // Clean up the temp file
    if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
      fs.unlinkSync(file.tempFilePath);
    }
    
    // Return the storage reference and public URL
    const fileRef = bucket.file(filePath);
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '01-01-2100'  // Far future expiry
    });
    
    return {
      storageRef: filePath,
      url,
      name: file.name,
      size: file.size,
      type: file.mimetype
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Process URL content
const processUrl = async (url) => {
  // URL validation
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    throw new Error('Invalid URL format');
  }
  
  // Create a content entry for the URL
  return await createContent({
    type: 'url',
    name: url,
    url,
    size: null,
    status: 'pending'
  });
};

// Process file content
const processFile = async (file) => {
  console.log('Processing file:', file);
  
  // Validate file input
  if (!file || !file.name) {
    throw new Error('Invalid file object');
  }
  
  // Check file type and reject .zip files (per requirements)
  const ext = path.extname(file.name).toLowerCase();
  if (ext === '.zip') {
    throw new Error('ZIP files are not supported');
  }
  
  try {
    // Upload the file to storage
    const fileData = await uploadFile(file);
    
    // Create a content entry for the file
    return await createContent({
      type: 'file',
      name: file.name,
      url: fileData.url,
      storageRef: fileData.storageRef,
      size: file.size,
      mimeType: file.mimetype,
      status: 'pending'
    });
  } catch (error) {
    console.error(`Error in processFile for ${file.name}:`, error);
    throw error;
  }
};

// Update content status
const updateContentStatus = async (id, status) => {
  return await updateContent(id, { status });
};

// Toggle content anonymization
const toggleAnonymize = async (id, anonymize) => {
  return await updateContent(id, { anonymize });
};

module.exports = {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
  processUrl,
  processFile,
  updateContentStatus,
  toggleAnonymize
};