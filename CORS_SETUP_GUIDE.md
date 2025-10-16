# 🔧 CORS Configuration Guide - Railway Deployment

## ✅ **Current Configuration Status**

### **Backend CORS Setup** ✅
**File**: `backend/server.js`
```javascript
const allowedOrigins = [
  'http://localhost:5174',           // Local development
  'http://localhost:5173', 
  'http://localhost:5175',
  'http://localhost:3000',
  process.env.FRONTEND_URL,          // Environment variable
  process.env.CORS_ORIGIN,           // Environment variable
  'https://habit-tracker-frontend.onrender.com',
  'https://elevate2-production.up.railway.app' // ✅ Your frontend domain
].filter(Boolean);
```

### **Backend Environment Variables** ✅
**File**: `backend/.env`
```env
FRONTEND_URL=https://elevate2-production.up.railway.app
CORS_ORIGIN=https://elevate2-production.up.railway.app
```

## 🚂 **Railway Environment Variables Setup**

### **For Backend Service (elevate1 repo):**
Set these in Railway Dashboard → Backend Service → Variables:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://samred221b_db_user:Samred221b@cluster0.h3emedt.mongodb.net/habit-tracker?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=habit-tracker-super-secret-key-2024
JWT_EXPIRE=7d
FRONTEND_URL=https://elevate2-production.up.railway.app
CORS_ORIGIN=https://elevate2-production.up.railway.app
```

### **For Frontend Service (elevate2 repo):**
Set these in Railway Dashboard → Frontend Service → Variables:

```env
VITE_API_URL=https://elevate1-production.up.railway.app/api
VITE_ENV=production
```

## 🔍 **CORS Troubleshooting Steps**

### **Step 1: Verify Backend is Running**
Test backend health:
```
https://elevate1-production.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Habit Tracker API is running"
}
```

### **Step 2: Check CORS Headers**
Open browser console on your frontend and look for:
```
Access-Control-Allow-Origin: https://elevate2-production.up.railway.app
Access-Control-Allow-Credentials: true
```

### **Step 3: Test CORS with curl**
```bash
curl -H "Origin: https://elevate2-production.up.railway.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://elevate1-production.up.railway.app/api/auth/login
```

## 🚨 **Common CORS Issues & Solutions**

### **Issue 1: Environment Variables Not Set**
**Symptom**: CORS blocks all requests
**Solution**: Set `FRONTEND_URL` and `CORS_ORIGIN` in Railway backend service

### **Issue 2: Wrong Frontend URL**
**Symptom**: CORS blocks specific domain
**Solution**: Verify frontend URL is exactly `https://elevate2-production.up.railway.app`

### **Issue 3: Backend Not Deployed**
**Symptom**: 404 errors, no CORS headers
**Solution**: Deploy backend service from `elevate1` repository

### **Issue 4: Railway Service Not Running**
**Symptom**: Connection refused, timeout errors
**Solution**: Check Railway dashboard, restart service if crashed

## 🔧 **Additional CORS Configuration**

### **For Extra Security (Optional):**
Add specific headers in `backend/server.js`:

```javascript
app.use(cors({
  origin: function (origin, callback) {
    // Your existing origin logic
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));
```

## 📋 **Deployment Checklist**

### **Backend (elevate1) Deployment:**
- [ ] Repository pushed to GitHub
- [ ] Railway service created from `elevate1` repo
- [ ] Environment variables set in Railway
- [ ] Service deployed and running
- [ ] Health check accessible: `/api/health`

### **Frontend (elevate2) Deployment:**
- [ ] Repository pushed to GitHub  
- [ ] Railway service created from `elevate2` repo
- [ ] Environment variables set in Railway
- [ ] Service deployed and running
- [ ] Frontend accessible at Railway URL

### **CORS Verification:**
- [ ] Backend allows frontend domain
- [ ] Environment variables set correctly
- [ ] No CORS errors in browser console
- [ ] API calls work from frontend

## 🎯 **Quick Test Commands**

### **Test Backend Health:**
```bash
curl https://elevate1-production.up.railway.app/api/health
```

### **Test CORS Preflight:**
```bash
curl -X OPTIONS https://elevate1-production.up.railway.app/api/auth/login \
  -H "Origin: https://elevate2-production.up.railway.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

### **Test Login Endpoint:**
```bash
curl -X POST https://elevate1-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://elevate2-production.up.railway.app" \
  -d '{"email":"test@test.com","password":"password123"}' \
  -v
```

## ✅ **Expected Working Flow**

1. **Frontend** (`elevate2`) makes request to backend
2. **Browser** sends preflight OPTIONS request
3. **Backend** (`elevate1`) responds with CORS headers
4. **Browser** allows the actual request
5. **Backend** processes request and responds
6. **Frontend** receives response

If any step fails, check the corresponding configuration above! 🔍✨
