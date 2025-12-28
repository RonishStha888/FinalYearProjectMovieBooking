# RTX Cinema Backend

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Install MongoDB
Make sure MongoDB is installed and running on your system.

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

**Start MongoDB locally:**
```bash
mongod
```

### 3. Configure Environment
The `.env` file is already created with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rtx_cinema
```

If using MongoDB Atlas, update `MONGODB_URI` with your connection string.

### 4. Run the Server
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### POST /api/auth/login
Login with username and password
```json
{
  "login": "username",
  "password": "password123"
}
```

### POST /api/auth/google
Google OAuth signup/login
```json
{
  "email": "user@gmail.com",
  "name": "User Name",
  "googleId": "google-user-id"
}
```

## Testing

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands

Example:
```bash
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","name":"Test User","googleId":"12345"}'
```
