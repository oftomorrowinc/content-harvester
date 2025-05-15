// Set NODE_ENV to test for all tests
process.env.NODE_ENV = 'test';

// Set up a longer timeout for tests
jest.setTimeout(10000);

// Mock Date constructor for consistent test results
const mockDate = new Date('2023-01-01T00:00:00Z');
global.Date = class extends Date {
  constructor(...args) {
    super(...args);
    if (args.length === 0) {
      return mockDate;
    }
  }
};

// Mock Firebase modules
jest.mock('../src/config/firebase', () => {
  // Create a mock Firestore implementation
  const mockFirestore = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    set: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
    get: jest.fn().mockResolvedValue({
      docs: [],
      exists: true,
      data: () => ({}),
    }),
    orderBy: jest.fn().mockReturnThis(),
  };

  // Create a mock Storage implementation
  const mockStorage = {
    bucket: jest.fn().mockReturnValue({
      file: jest.fn().mockReturnValue({
        getSignedUrl: jest.fn().mockResolvedValue(['https://mock-storage-url.com']),
        delete: jest.fn().mockResolvedValue({}),
      }),
      upload: jest.fn().mockResolvedValue([{}]),
    }),
  };

  return {
    initializeApp: jest.fn(),
    getFirestore: jest.fn().mockReturnValue(mockFirestore),
    getStorage: jest.fn().mockReturnValue(mockStorage),
    getBucket: jest.fn().mockReturnValue(mockStorage.bucket()),
  };
});

// Global test utilities
global.createMockRequest = () => {
  return {
    body: {},
    files: {},
    headers: {},
    params: {},
  };
};

global.createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    render: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
  };
  return res;
};

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
