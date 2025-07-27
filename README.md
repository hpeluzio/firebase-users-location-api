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

## Quick Start

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Set up your `.env` file with Firebase and OpenWeatherMap credentials (see `.env.example`)
3. Start the server:
   ```bash
   pnpm run start:dev
   ```

## Endpoints

### Create User

`POST /users`

```json
{
  "name": "John Doe",
  "zipCode": "10001"
}
```

### Get All Users

`GET /users`

### Get User by ID

`GET /users/:id`

### Update User

`PATCH /users/:id`

```json
{
  "name": "Jane Doe",
  "zipCode": "90210"
}
```

### Delete User

`DELETE /users/:id`

### Validate Zip Code

`GET /zipcodes/validate/:zipCode`

- Returns `{ valid: true, latitude, longitude, timezone }` for valid US zip codes
- Returns `{ valid: false, message }` for invalid or not found zip codes

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
