# User Management API - Made with Google Firebase

A REST API for managing users with automatic location data fetching from zip codes, powered by Firebase Realtime Database.

## 📋 Requirements Met

1. ✅ **CRUD Endpoints** - Complete Create, Read, Update, Delete operations
2. ✅ **Firebase Realtime Database** - NoSQL database integration
3. ✅ **User Data** - `id`, `name`, `zipCode`, `latitude`, `longitude`, `timezone`
4. ✅ **Location Integration** - Automatic fetching from OpenWeatherMap API
5. ✅ **Update Logic** - Re-fetches location data when zip code changes
6. ✅ **Frontend Ready** - Designed for ReactJS integration

## 🚀 Quick Start

```bash
pnpm install
pnpm run start:dev
```

API runs on: `http://localhost:3000`

## 🔥 Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Realtime Database

2. **Generate Service Account**:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

3. **Environment Variables**:
   Create a `.env` file with:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
   OPENWEATHER_API_KEY=7afa46f2e91768e7eeeb9001ce40de19
   ```

## 📡 API Endpoints

### Create User

**POST** `/users`

```json
{
  "name": "John Doe",
  "zipCode": "10001"
}
```

### Get All Users

**GET** `/users`

### Get User by ID

**GET** `/users/:id`

### Update User

**PATCH** `/users/:id`

```json
{
  "name": "Jane Doe",
  "zipCode": "90210"
}
```

### Delete User

**DELETE** `/users/:id`

## 🔧 Key Features

- **Firebase Integration**: Real-time database with automatic synchronization
- **Automatic Location Fetching**: When creating/updating users, the API automatically fetches `latitude`, `longitude`, and `timezone` from the zip code using OpenWeatherMap API
- **Smart Updates**: If zip code changes during update, location data is re-fetched
- **Type Safety**: Full TypeScript implementation with DTOs
- **Error Handling**: Proper HTTP status codes and error messages

## 🏗️ Project Structure

```
src/
├── users/          # User CRUD operations
├── weather/        # OpenWeatherMap API integration
├── config/         # Firebase configuration
└── main.ts         # Application entry point
```

## 🎯 Creative Additions

- Firebase Realtime Database integration
- Weather service integration for automatic location data
- Comprehensive error handling
- TypeScript DTOs for validation
- Timestamp tracking (createdAt/updatedAt)

## 🔮 Future Enhancements

- User authentication with Firebase Auth
- Real-time updates with Firebase listeners
- Rate limiting
- Swagger documentation
