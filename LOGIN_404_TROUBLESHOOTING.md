# 🔧 Login 404 Error - Troubleshooting Guide

## ❌ Issue: "Request failed with status code 404" during login

### 🔍 **Immediate Diagnostic Steps:**

#### **1. Check API Health** ✅
1. Go to **Settings** page in your app
2. Look for **"API Connection"** section
3. Check if the health check shows:
   - ✅ **Success**: API is reachable
   - ❌ **Error**: API connection issues

#### **2. Verify Environment Variables**
**Current Configuration:**
```env
VITE_API_URL=https://elevate-production.up.railway.app/api
```

**Expected Login Endpoint:**
```
POST https://elevate-production.up.railway.app/api/auth/login
```

#### **3. Test Backend Directly**
Open browser and visit:
```
https://elevate-production.up.railway.app/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Habit Tracker API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 🚨 **Common Causes & Solutions:**

#### **Cause 1: Backend Not Deployed** 
- **Symptom**: Health check fails completely
- **Solution**: Deploy backend to Railway first
- **Check**: Railway dashboard shows backend service running

#### **Cause 2: Wrong API URL**
- **Symptom**: 404 on all endpoints
- **Solution**: Verify `VITE_API_URL` matches your Railway backend URL
- **Check**: Backend URL should end with `/api` (no trailing slash)

#### **Cause 3: Routes Not Mounted**
- **Symptom**: Health check works, but auth endpoints fail
- **Solution**: Verify auth routes are properly mounted in server.js
- **Check**: `app.use('/api/auth', require('./routes/auth'))`

#### **Cause 4: CORS Issues**
- **Symptom**: Network errors or blocked requests
- **Solution**: Check CORS configuration in backend
- **Check**: Frontend domain allowed in CORS origins

### 🔧 **Step-by-Step Fix:**

#### **Step 1: Verify Backend Deployment**
1. Check Railway dashboard
2. Ensure backend service is deployed and running
3. Note the backend URL (should be different from frontend)

#### **Step 2: Test Backend Health**
```bash
curl https://your-backend-url.railway.app/api/health
```

#### **Step 3: Check Environment Variables**
**Frontend (.env):**
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

**Backend (Railway Environment Variables):**
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your-mongodb-connection-string
CORS_ORIGIN=https://elevate-production.up.railway.app
```

#### **Step 4: Test Login Endpoint**
```bash
curl -X POST https://your-backend-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'
```

### 🎯 **Quick Fixes:**

#### **Fix 1: Update API URL**
If your backend is on a different Railway URL:
```env
# Update .env file
VITE_API_URL=https://your-actual-backend-url.railway.app/api
```

#### **Fix 2: Deploy Backend**
If backend isn't deployed:
1. Push backend code to GitHub
2. Create Railway service for backend
3. Set environment variables
4. Deploy

#### **Fix 3: Check Route Mounting**
Verify in `backend/server.js`:
```javascript
// Routes should be mounted like this:
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
// etc...
```

### 📊 **Using the Health Check Tool:**

1. **Navigate to Settings** in your app
2. **Find "API Connection"** section  
3. **Click "Refresh Health Check"**
4. **Check the results:**
   - **Green ✅**: API is working, issue is elsewhere
   - **Red ❌**: API connection problem, fix backend first

### 🚀 **Expected Working Flow:**

1. **Health Check**: ✅ Success
2. **Login Attempt**: POST to `/api/auth/login`
3. **Backend Response**: User data + JWT token
4. **Frontend**: Stores token, redirects to dashboard

### 📞 **Still Having Issues?**

**Check Browser Console:**
- Look for network errors
- Check actual request URL
- Verify request payload

**Check Railway Logs:**
- Backend service logs
- Look for incoming requests
- Check for errors

**Verify Database:**
- MongoDB Atlas connection
- User collection exists
- Test user account exists

The health check tool will help identify if this is a backend connectivity issue or a specific auth endpoint problem! 🔍✨
