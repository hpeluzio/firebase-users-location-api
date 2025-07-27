import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

// Initialize Firebase Admin SDK
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
  privateKey:
    process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') ||
    'your-private-key',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'your-client-email',
};

// Initialize the app
const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL:
    process.env.FIREBASE_DATABASE_URL ||
    'https://your-project-id-default-rtdb.firebaseio.com',
});

// Get the database instance
export const database = getDatabase(app);
export default app;
