const request = require('supertest');
const express = require('express');
const contentRoutes = require('../../src/routes/content');
const contentController = require('../../src/controllers/contentController');

// Mock content controller
jest.mock('../../src/controllers/contentController');

describe('Content Routes', () => {
  let app;

  beforeEach(() => {
    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/', contentRoutes);

    // Set up default mock implementations
    contentController.renderMainPage.mockImplementation((req, res) => {
      res.status(200).json({ page: 'main' });
    });

    contentController.addUrls.mockImplementation((req, res) => {
      res.status(200).json({ action: 'add-urls', urls: req.body.urls });
    });

    contentController.uploadFiles.mockImplementation((req, res) => {
      res.status(200).json({ action: 'upload-files' });
    });

    contentController.deleteContent.mockImplementation((req, res) => {
      res.status(200).json({ action: 'delete', id: req.params.id });
    });

    contentController.toggleAnonymize.mockImplementation((req, res) => {
      res.status(200).json({
        action: 'toggle-anonymize',
        id: req.params.id,
        anonymize: req.body.anonymize,
      });
    });

    contentController.processAllContent.mockImplementation((req, res) => {
      res.status(200).json({ action: 'process-all' });
    });
  });

  test('GET / calls renderMainPage', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(contentController.renderMainPage).toHaveBeenCalled();
    expect(response.body).toEqual({ page: 'main' });
  });

  test('POST /api/urls calls addUrls', async () => {
    const response = await request(app).post('/api/urls').send({ urls: 'https://example.com' });

    expect(response.status).toBe(200);
    expect(contentController.addUrls).toHaveBeenCalled();
    expect(response.body).toEqual({
      action: 'add-urls',
      urls: 'https://example.com',
    });
  });

  test('POST /api/files calls uploadFiles', async () => {
    const response = await request(app).post('/api/files').send({});

    expect(response.status).toBe(200);
    expect(contentController.uploadFiles).toHaveBeenCalled();
    expect(response.body).toEqual({ action: 'upload-files' });
  });

  test('DELETE /api/content/:id calls deleteContent', async () => {
    const response = await request(app).delete('/api/content/123');

    expect(response.status).toBe(200);
    expect(contentController.deleteContent).toHaveBeenCalled();
    expect(response.body).toEqual({ action: 'delete', id: '123' });
  });

  test('PUT /api/content/:id/anonymize calls toggleAnonymize', async () => {
    const response = await request(app)
      .put('/api/content/123/anonymize')
      .send({ anonymize: 'true' });

    expect(response.status).toBe(200);
    expect(contentController.toggleAnonymize).toHaveBeenCalled();
    expect(response.body).toEqual({
      action: 'toggle-anonymize',
      id: '123',
      anonymize: 'true',
    });
  });

  test('POST /api/process-all calls processAllContent', async () => {
    const response = await request(app).post('/api/process-all');

    expect(response.status).toBe(200);
    expect(contentController.processAllContent).toHaveBeenCalled();
    expect(response.body).toEqual({ action: 'process-all' });
  });
});
