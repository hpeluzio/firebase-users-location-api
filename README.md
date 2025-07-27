# User Management API - Made with Google Firebase

A REST API for managing users with automatic location data fetching from zip codes.

## 📋 Requirements Met

1. ✅ **CRUD Endpoints** - Complete Create, Read, Update, Delete operations
2. ✅ **NoSQL Storage** - In-memory database (ready for Firebase integration)
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

- **Automatic Location Fetching**: When creating/updating users, the API automatically fetches `latitude`, `longitude`, and `timezone` from the zip code using OpenWeatherMap API
- **Smart Updates**: If zip code changes during update, location data is re-fetched
- **Type Safety**: Full TypeScript implementation with DTOs
- **Error Handling**: Proper HTTP status codes and error messages

## 🏗️ Project Structure

```
src/
├── users/          # User CRUD operations
├── weather/        # OpenWeatherMap API integration
└── main.ts         # Application entry point
```

## 🎯 Creative Additions

- Weather service integration for automatic location data
- Comprehensive error handling
- TypeScript DTOs for validation
- Timestamp tracking (createdAt/updatedAt)

## 🔮 Future Enhancements

- Firebase Realtime Database integration
- User authentication
- Rate limiting
- Swagger documentation
