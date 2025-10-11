# Habit Tracker - Full Stack Setup Guide

This guide will help you set up the complete Habit Tracker application with MongoDB backend and React frontend.

## 🏗️ Architecture Overview

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT tokens
- **Database**: MongoDB (local or Atlas)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/habit-tracker
# JWT_SECRET=your-super-secret-key
# PORT=5000

# Start MongoDB (if using local installation)
# mongod

# Start the backend server
npm run dev
```

The backend will be available at `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to root directory (frontend)
cd ..

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env file
# REACT_APP_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔧 Detailed Configuration

### Backend Configuration

1. **MongoDB Setup**:
   
   **Option A: Local MongoDB**
   ```bash
   # Install MongoDB Community Edition
   # Follow: https://docs.mongodb.com/manual/installation/
   
   # Start MongoDB service
   mongod
   ```
   
   **Option B: MongoDB Atlas (Cloud)**
   ```bash
   # 1. Create account at https://cloud.mongodb.com
   # 2. Create a new cluster
   # 3. Get connection string
   # 4. Update MONGODB_URI in .env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habit-tracker
   ```

2. **Environment Variables** (backend/.env):
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/habit-tracker
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   # Frontend
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start Backend**:
   ```bash
   cd backend
   npm run dev  # Development mode with auto-reload
   # or
   npm start    # Production mode
   ```

### Frontend Configuration

1. **Environment Variables** (.env):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_ENV=development
   ```

2. **Update Main App File**:
   ```bash
   # Replace the current App.tsx with the new backend-integrated version
   mv src/AppNew.tsx src/App.tsx
   mv src/context/HabitContextNew.tsx src/context/HabitContext.tsx
   ```

3. **Start Frontend**:
   ```bash
   npm run dev
   ```

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with name, email, and password
2. **Login**: Users authenticate and receive JWT tokens
3. **Protected Routes**: All app features require authentication
4. **Token Storage**: JWT tokens stored in localStorage
5. **Auto-logout**: Invalid/expired tokens automatically log users out

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Categories
- `GET /api/categories` - Get user categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Habits
- `GET /api/habits` - Get user habits
- `POST /api/habits` - Create habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit

### Logs
- `GET /api/logs` - Get habit logs
- `POST /api/logs` - Create/update log
- `PUT /api/logs/:id` - Update log
- `DELETE /api/logs/:id` - Delete log

### Analytics
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/habits` - Habit analytics
- `GET /api/analytics/categories` - Category analytics

## 🧪 Testing the Setup

1. **Backend Health Check**:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Register a Test User**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

3. **Frontend Access**:
   - Open `http://localhost:5173`
   - You should see the login/register page
   - Create an account or login
   - Default categories will be created automatically

## 🔄 Data Migration

If you have existing data in localStorage, you'll need to:

1. **Export existing data** using the current app
2. **Create account** in the new system
3. **Manually recreate** categories and habits
4. **Import logs** if needed (future feature)

## 🚨 Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Check MongoDB is running
   - Verify .env configuration
   - Check port 5000 is available

2. **Frontend can't connect**:
   - Verify backend is running on port 5000
   - Check REACT_APP_API_URL in .env
   - Check browser console for CORS errors

3. **Authentication issues**:
   - Clear localStorage and cookies
   - Check JWT_SECRET is set
   - Verify token format in network tab

4. **Database connection**:
   ```bash
   # Test MongoDB connection
   mongosh mongodb://localhost:27017/habit-tracker
   ```

### Debug Mode

1. **Backend Logs**:
   ```bash
   cd backend
   DEBUG=* npm run dev
   ```

2. **Frontend Console**:
   - Open browser DevTools
   - Check Console and Network tabs
   - Look for API call errors

## 🔧 Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
2. **API Testing**: Use Postman or curl for API testing
3. **Database GUI**: Use MongoDB Compass for database inspection
4. **Logging**: Check backend console for detailed logs

## 📦 Production Deployment

### Backend (Node.js)
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

### Frontend (Static Build)
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Environment Variables for Production
- Use strong JWT secrets
- Use MongoDB Atlas for database
- Set proper CORS origins
- Enable HTTPS

## 🆘 Support

If you encounter issues:

1. Check this setup guide
2. Review error messages in console
3. Verify all environment variables
4. Test API endpoints individually
5. Check MongoDB connection

## 🎉 Success!

Once everything is running:
- ✅ Backend API at http://localhost:5000
- ✅ Frontend app at http://localhost:5173
- ✅ MongoDB connected and ready
- ✅ Authentication working
- ✅ Data syncing between frontend and backend

You now have a fully functional, full-stack habit tracking application! 🚀
