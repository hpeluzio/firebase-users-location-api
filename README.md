# User Management API

A modern REST API built with NestJS that manages users with automatic location data fetching. When you create or update a user with just their name and zip code, the API automatically retrieves their latitude, longitude, and timezone from OpenWeatherMap.

## Features

- **Full CRUD for users** (create, read, update, delete)
- **Firebase Realtime Database** integration
- **Automatic location fetching** from zip codes using OpenWeatherMap
- **Zip code validation** with dedicated endpoint
- **TypeScript** with full type safety
- **Comprehensive error handling** and validation

## Getting Started

### Prerequisites

- **Node.js** v22.17.1
- **pnpm** (used as the package manager for this project)

> **Note:**
> This project uses [pnpm](https://pnpm.io/) for dependency management.
> If you don't have pnpm installed, you can install it globally with:
>
> ```bash
> npm install -g pnpm
> ```

### Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up your `.env` file with Firebase and OpenWeatherMap credentials:**

   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
   FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
   OPENWEATHER_API_KEY=your-openweathermap-api-key
   ```

3. **Start the development server:**
   ```bash
   pnpm run start:dev
   ```

The API will be available at `http://localhost:3000`.

## API Endpoints

1. **Create User**  
   `POST /users`  
   Create a new user with name and zip code.

   **Request Example:**

   ```json
   {
     "name": "John Doe",
     "zipCode": "10001"
   }
   ```

   **Response Example:**

   ```json
   {
     "id": "abc123def",
     "name": "John Doe",
     "zipCode": "10001",
     "latitude": 40.7505,
     "longitude": -73.9934,
     "timezone": "America/New_York",
     "createdAt": "2024-01-15T10:30:00.000Z",
     "updatedAt": "2024-01-15T10:30:00.000Z"
   }
   ```

   **Curl:**

   ```bash
   curl -X POST http://localhost:3000/users \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "zipCode": "10001"}'
   ```

2. **Get All Users**  
   `GET /users`  
   Retrieve a list of all users.

   **Response Example:**

   ```json
   [
     {
       "id": "abc123def",
       "name": "John Doe",
       "zipCode": "10001",
       "latitude": 40.7505,
       "longitude": -73.9934,
       "timezone": "America/New_York",
       "createdAt": "2024-01-15T10:30:00.000Z",
       "updatedAt": "2024-01-15T10:30:00.000Z"
     }
   ]
   ```

   **Curl:**

   ```bash
   curl http://localhost:3000/users
   ```

3. **Get User by ID**  
   `GET /users/:id`  
   Retrieve a single user by their unique ID.

   **Response Example:**

   ```json
   {
     "id": "abc123def",
     "name": "John Doe",
     "zipCode": "10001",
     "latitude": 40.7505,
     "longitude": -73.9934,
     "timezone": "America/New_York",
     "createdAt": "2024-01-15T10:30:00.000Z",
     "updatedAt": "2024-01-15T10:30:00.000Z"
   }
   ```

   **Curl:**

   ```bash
   curl http://localhost:3000/users/abc123def
   ```

4. **Update User**  
   `PATCH /users/:id`  
   Update a user's name and/or zip code.

   **Request Example:**

   ```json
   {
     "name": "Jane Doe",
     "zipCode": "90210"
   }
   ```

   **Response Example:**

   ```json
   {
     "id": "abc123def",
     "name": "Jane Doe",
     "zipCode": "90210",
     "latitude": 34.0901,
     "longitude": -118.4065,
     "timezone": "America/Los_Angeles",
     "createdAt": "2024-01-15T10:30:00.000Z",
     "updatedAt": "2024-01-15T11:45:00.000Z"
   }
   ```

   **Curl:**

   ```bash
   curl -X PATCH http://localhost:3000/users/abc123def \
     -H "Content-Type: application/json" \
     -d '{"name": "Jane Doe", "zipCode": "90210"}'
   ```

5. **Delete User**  
   `DELETE /users/:id`  
   Delete a user by their unique ID.

   **Curl:**

   ```bash
   curl -X DELETE http://localhost:3000/users/abc123def
   ```

6. **Validate Zip Code**  
   `GET /zipcodes/validate/:zipCode`  
   Check if a zip code is valid and get its location data.

   **Valid Response Example:**

   ```json
   {
     "valid": true,
     "latitude": 40.7505,
     "longitude": -73.9934,
     "timezone": "America/New_York"
   }
   ```

   **Invalid Response Example:**

   ```json
   {
     "valid": false,
     "message": "Zip code \"99999\" not found. Please enter a valid US zip code."
   }
   ```

   **Curl:**

   ```bash
   curl http://localhost:3000/zipcodes/validate/10001
   ```

## Project Structure

```
src/
├── users/          # User CRUD operations
├── weather/        # OpenWeatherMap API integration
├── config/         # Firebase configuration
└── main.ts         # Application entry point
```

## Testing

This project includes a comprehensive test suite with **46 tests** covering all aspects of the application.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:cov

# Run specific test file
pnpm test src/users/users.service.spec.ts
```

### Test Coverage

- **Unit Tests**: Service logic, DTO validation, controller handling
- **Integration Tests**: E2E API testing with HTTP requests
- **Mocking**: External dependencies (Firebase, OpenWeatherMap) are mocked for reliable testing

## Environment Variables

- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `FIREBASE_DATABASE_URL` - Firebase Realtime Database URL
- `OPENWEATHER_API_KEY` - OpenWeatherMap API key for location data

## Customization

**Database:** Uses Firebase Realtime Database, easily switchable to other databases.
**Location Service:** Powered by OpenWeatherMap API, can be extended for other providers.
**Validation:** Custom zip code validation with regex patterns for US format.
