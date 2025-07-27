# User Management API

A simple REST API for managing users with location data, using Firebase Realtime Database and OpenWeatherMap.

## Prerequisites

- **Node.js** v22.17.1
- **pnpm** (used as the package manager for this project)

> **Note:**
> This project uses [pnpm](https://pnpm.io/) for dependency management.
> If you don’t have pnpm installed, you can install it globally with:
>
> ```bash
> npm install -g pnpm
> ```

## Features

- CRUD endpoints for users
- Stores users in Firebase Realtime Database
- Fetches latitude, longitude, and timezone from OpenWeatherMap using zip code
- Validates US zip codes
- Endpoint for frontend to validate zip codes

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

## Environment Variables

- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_DATABASE_URL`
- `OPENWEATHER_API_KEY`

## Example `.env`

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
OPENWEATHER_API_KEY=your-openweathermap-api-key
```

---

That’s it! You now have a simple, full-stack-ready user management API with location validation.
