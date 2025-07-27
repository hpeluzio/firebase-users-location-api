import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase, Database } from 'firebase-admin/database';

// Define mock database type for tests
type MockDatabase = {
  ref: jest.Mock;
};

let database: Database | MockDatabase;
let app: any;

// Skip Firebase initialization during tests
if (process.env.NODE_ENV !== 'test') {
  // Initialize Firebase Admin SDK
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
    privateKey:
      process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') ||
      'your-private-key',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'your-client-email',
  };

  // Initialize the app
  app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL:
      process.env.FIREBASE_DATABASE_URL ||
      'https://your-project-id-default-rtdb.firebaseio.com',
  });

  // Get the database instance
  database = getDatabase(app);
} else {
  // Mock database for tests
  database = {
    ref: jest.fn(() => ({
      child: jest.fn(() => ({
        set: jest.fn(),
        once: jest.fn(() => Promise.resolve({ val: () => null })),
        update: jest.fn(),
        remove: jest.fn(),
      })),
      once: jest.fn(() => Promise.resolve({ val: () => null })),
    })),
  };
  app = {};
}

export { database };
export default app;
