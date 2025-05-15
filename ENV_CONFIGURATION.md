# Content Harvester Environment Configuration

This document outlines the environment variables used by the Content Harvester application.

## Core Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CONTENT_HARVESTER_API_PATH` | Base path for all API endpoints | `/api` |
| `CONTENT_HARVESTER_COLLECTION` | Firestore collection name | `contents` |
| `CONTENT_HARVESTER_STORAGE_PATH` | Firebase Storage path for files | `uploads` |
| `CONTENT_HARVESTER_MAX_FILE_SIZE` | Maximum file size in MB | `50` |

## Firebase Configuration

Content Harvester uses the following Firebase environment variables, which can be shared with the main application:

| Variable | Description |
|----------|-------------|
| `FIREBASE_API_KEY` | Firebase API key |
| `FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `FIREBASE_APP_ID` | Firebase app ID |
| `FIREBASE_SERVICE_ACCOUNT` | JSON string of Firebase service account credentials |

## Firebase Emulator Configuration

For local development with Firebase emulators:

| Variable | Description | Default |
|----------|-------------|---------|
| `USE_FIREBASE_EMULATORS` | Whether to use Firebase emulators | `true` |
| `FIREBASE_EMULATOR_HOST` | Host for Firebase emulators | `localhost` |
| `FIREBASE_FIRESTORE_EMULATOR_PORT` | Port for Firestore emulator | `8080` |
| `FIREBASE_STORAGE_EMULATOR_PORT` | Port for Storage emulator | `9199` |
| `FIREBASE_STORAGE_EMULATOR_HOST` | Host:port for Storage emulator | `localhost:9199` |

## Server Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port for the Express server | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |

## Implementation Details

- Environment variables are used for both server-side and client-side configuration
- For client-side usage, variables are injected via Pug templates as data attributes
- Default values are provided for all variables to ensure the application works without explicit configuration
- Configuration values can be overridden by setting the appropriate environment variables

## Example Usage

A sample .env file is provided at `.env.example` that you can copy to `.env` and customize:

```bash
# Content Harvester Configuration
CONTENT_HARVESTER_API_PATH=/api
CONTENT_HARVESTER_COLLECTION=contents
CONTENT_HARVESTER_STORAGE_PATH=uploads
CONTENT_HARVESTER_MAX_FILE_SIZE=50

# Firebase Configuration (Inherit from main app)
# FIREBASE_API_KEY=your-api-key
# FIREBASE_STORAGE_BUCKET=your-app-id.appspot.com
# FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# Firebase Emulators (for local development)
USE_FIREBASE_EMULATORS=true
FIREBASE_EMULATOR_HOST=localhost
FIREBASE_FIRESTORE_EMULATOR_PORT=8080
FIREBASE_STORAGE_EMULATOR_PORT=9199
```