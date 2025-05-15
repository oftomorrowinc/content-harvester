const contentController = require('../../src/controllers/contentController');
const contentModel = require('../../src/models/content');

// Mock content model
jest.mock('../../src/models/content', () => ({
  getAllContent: jest.fn(),
  processUrl: jest.fn(),
  processFile: jest.fn(),
  deleteContent: jest.fn(),
  toggleAnonymize: jest.fn(),
  getContentById: jest.fn(),
  updateContentStatus: jest.fn(),
  uploadFile: jest.fn(),
  createContent: jest.fn(),
  updateContent: jest.fn(),
}));

describe('Content Controller', () => {
  // Mock request and response objects
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      files: {},
      headers: {},
      params: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      render: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    };
  });

  describe('renderMainPage', () => {
    test('renders index page with content items', async () => {
      const mockContentItems = [
        { id: '1', name: 'item1', type: 'url' },
        { id: '2', name: 'item2', type: 'file' },
      ];

      contentModel.getAllContent.mockResolvedValueOnce(mockContentItems);

      await contentController.renderMainPage(mockReq, mockRes);

      expect(contentModel.getAllContent).toHaveBeenCalled();
      expect(mockRes.render).toHaveBeenCalledWith('index', {
        title: 'Content Harvester',
        contentItems: mockContentItems,
      });
    });

    test('handles errors', async () => {
      const error = new Error('Test error');
      contentModel.getAllContent.mockRejectedValueOnce(error);

      await contentController.renderMainPage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.render).toHaveBeenCalledWith('error', { error });
    });
  });

  describe('addUrls', () => {
    test('processes valid URLs', async () => {
      mockReq.body = { urls: 'https://example.com\nhttps://test.com' };
      mockReq.headers = { 'hx-request': 'true' };

      const mockResults = [
        { id: '1', type: 'url', name: 'https://example.com' },
        { id: '2', type: 'url', name: 'https://test.com' },
      ];

      contentModel.processUrl
        .mockResolvedValueOnce(mockResults[0])
        .mockResolvedValueOnce(mockResults[1]);

      contentModel.getAllContent.mockResolvedValueOnce(mockResults);

      await contentController.addUrls(mockReq, mockRes);

      expect(contentModel.processUrl).toHaveBeenCalledTimes(2);
      expect(contentModel.getAllContent).toHaveBeenCalled();
      expect(mockRes.render).toHaveBeenCalledWith('partials/content-table', {
        contentItems: mockResults,
      });
    });

    test('handles empty URL input for HTMX request', async () => {
      mockReq.body = { urls: '' };
      mockReq.headers = { 'hx-request': 'true' };

      const mockContentItems = [{ id: '1', name: 'existing-item', type: 'url' }];

      contentModel.getAllContent.mockResolvedValueOnce(mockContentItems);

      await contentController.addUrls(mockReq, mockRes);

      expect(contentModel.processUrl).not.toHaveBeenCalled();
      expect(mockRes.render).toHaveBeenCalledWith('partials/content-table', {
        contentItems: mockContentItems,
      });
    });

    test('handles no valid URLs for HTMX request', async () => {
      mockReq.body = { urls: 'not-a-url' };
      mockReq.headers = { 'hx-request': 'true' };

      const mockContentItems = [{ id: '1', name: 'existing-item', type: 'url' }];

      contentModel.getAllContent.mockResolvedValueOnce(mockContentItems);

      await contentController.addUrls(mockReq, mockRes);

      expect(contentModel.processUrl).not.toHaveBeenCalled();
      expect(mockRes.set).toHaveBeenCalledWith('HX-Trigger', expect.stringContaining('showToast'));
      expect(mockRes.render).toHaveBeenCalledWith('partials/content-table', {
        contentItems: mockContentItems,
      });
    });
  });

  describe('uploadFiles', () => {
    test('processes uploaded files', async () => {
      const mockFile = {
        name: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
      };

      mockReq.files = { file: mockFile };
      mockReq.headers = { 'hx-request': 'true' };

      const mockResult = {
        id: '1',
        type: 'file',
        name: 'test.pdf',
        url: 'https://example.com/test.pdf',
      };

      contentModel.processFile.mockResolvedValueOnce(mockResult);
      contentModel.getAllContent.mockResolvedValueOnce([mockResult]);

      await contentController.uploadFiles(mockReq, mockRes);

      expect(contentModel.processFile).toHaveBeenCalledWith(mockFile);
      expect(contentModel.getAllContent).toHaveBeenCalled();
      expect(mockRes.render).toHaveBeenCalledWith('partials/content-table', {
        contentItems: [mockResult],
      });
    });

    test('handles no files uploaded for HTMX request', async () => {
      mockReq.files = {};
      mockReq.headers = { 'hx-request': 'true' };

      const mockContentItems = [{ id: '1', name: 'existing-item', type: 'file' }];

      contentModel.getAllContent.mockResolvedValueOnce(mockContentItems);

      await contentController.uploadFiles(mockReq, mockRes);

      expect(contentModel.processFile).not.toHaveBeenCalled();
      expect(mockRes.render).toHaveBeenCalledWith('partials/content-table', {
        contentItems: mockContentItems,
      });
    });
  });

  describe('deleteContent', () => {
    test('deletes content and returns updated list', async () => {
      mockReq.params = { id: '123' };
      mockReq.headers = { 'hx-request': 'true' };

      const mockContentItems = [{ id: '456', name: 'remaining-item', type: 'url' }];

      contentModel.deleteContent.mockResolvedValueOnce({ success: true, id: '123' });
      contentModel.getAllContent.mockResolvedValueOnce(mockContentItems);

      await contentController.deleteContent(mockReq, mockRes);

      expect(contentModel.deleteContent).toHaveBeenCalledWith('123');
      expect(contentModel.getAllContent).toHaveBeenCalled();
      expect(mockRes.render).toHaveBeenCalledWith('partials/content-table', {
        contentItems: mockContentItems,
      });
    });
  });

  describe('toggleAnonymize', () => {
    test('toggles content anonymization', async () => {
      mockReq.params = { id: '123' };
      mockReq.body = { anonymize: 'true' };
      mockReq.headers = { 'hx-request': 'true' };

      const mockItem = {
        id: '123',
        name: 'test-item',
        type: 'url',
        anonymize: true,
      };

      contentModel.toggleAnonymize.mockResolvedValueOnce({ success: true });
      contentModel.getContentById.mockResolvedValueOnce(mockItem);

      await contentController.toggleAnonymize(mockReq, mockRes);

      expect(contentModel.toggleAnonymize).toHaveBeenCalledWith('123', true);
      expect(contentModel.getContentById).toHaveBeenCalledWith('123');
      expect(mockRes.render).toHaveBeenCalledWith('partials/content-row', {
        item: mockItem,
      });
    });
  });

  describe('processAllContent', () => {
    // Mock the setTimeout function
    const originalSetTimeout = global.setTimeout;

    beforeEach(() => {
      // Replace setTimeout with a mock function
      global.setTimeout = jest.fn(callback => {
        // Immediately execute the callback
        callback();
        // Return a fake timer ID
        return 123;
      });
    });

    afterEach(() => {
      // Restore the original setTimeout
      global.setTimeout = originalSetTimeout;
    });

    test('processes all pending content', async () => {
      mockReq.headers = { 'hx-request': 'true' };

      const pendingContent = [
        { id: '1', status: 'pending' },
        { id: '2', status: 'pending' },
      ];

      const allContent = [...pendingContent, { id: '3', status: 'completed' }];

      contentModel.getAllContent
        .mockResolvedValueOnce(allContent) // First call for filtering pending
        .mockResolvedValueOnce(allContent); // Second call for rendering updated list

      await contentController.processAllContent(mockReq, mockRes);

      expect(contentModel.updateContentStatus).toHaveBeenCalledTimes(4); // 2 for processing, 2 for completed
      expect(contentModel.updateContentStatus).toHaveBeenCalledWith('1', 'processing');
      expect(contentModel.updateContentStatus).toHaveBeenCalledWith('2', 'processing');
      expect(mockRes.render).toHaveBeenCalledWith('partials/content-table', {
        contentItems: allContent,
      });

      // Verify setTimeout was called
      expect(global.setTimeout).toHaveBeenCalled();
    });
  });
});
