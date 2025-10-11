# 🚂 Railway Environment Configuration Guide

## ✅ Configuration Complete

### **Frontend Environment Variables**
Set these in your **Frontend Railway Service**:

```env
VITE_API_URL=https://elevate-production.up.railway.app/api
VITE_ENV=production
```

### **Backend Environment Variables** 
Set these in your **Backend Railway Service**:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://samred221b_db_user:Samred221b@cluster0.h3emedt.mongodb.net/habit-tracker?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=habit-tracker-super-secret-key-2024
JWT_EXPIRE=7d
FRONTEND_URL=https://elevate-production.up.railway.app
CORS_ORIGIN=https://elevate-production.up.railway.app
```

## 🔧 What Was Updated

### **1. Frontend Configuration** ✅
- **Main .env**: Now points to Railway backend
- **API Service**: Already configured to use `import.meta.env.VITE_API_URL`
- **Environment Files**: Created for different environments

### **2. Backend CORS Configuration** ✅
```javascript
// server.js - Updated allowedOrigins
const allowedOrigins = [
  'http://localhost:5174',           // Local development
  'http://localhost:5173', 
  'http://localhost:5175',
  'http://localhost:3000',
  process.env.FRONTEND_URL,          // Environment variable
  process.env.CORS_ORIGIN,           // Environment variable
  'https://elevate-production.up.railway.app' // ✅ Your Railway frontend
].filter(Boolean);
```

### **3. Backend Environment** ✅
- **FRONTEND_URL**: Set to your Railway frontend domain
- **CORS_ORIGIN**: Set to your Railway frontend domain
- **Production Ready**: All environment variables configured

## 🚀 Deployment Steps

### **Step 1: Deploy Backend First**
1. Push backend changes to GitHub
2. Railway auto-deploys backend
3. Note the backend URL: `https://elevate-production.up.railway.app`

### **Step 2: Set Backend Environment Variables**
In Railway Backend Service → Variables:
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://samred221b_db_user:Samred221b@cluster0.h3emedt.mongodb.net/habit-tracker?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=habit-tracker-super-secret-key-2024
JWT_EXPIRE=7d
FRONTEND_URL=https://elevate-production.up.railway.app
CORS_ORIGIN=https://elevate-production.up.railway.app
```

### **Step 3: Deploy Frontend**
1. Push frontend changes to GitHub
2. Railway auto-deploys frontend
3. Set Frontend Environment Variables in Railway:
```
VITE_API_URL=https://elevate-production.up.railway.app/api
VITE_ENV=production
```

### **Step 4: Test Connection**
1. Visit: `https://elevate-production.up.railway.app`
2. Try logging in/registering
3. Check browser console for API calls
4. Verify no CORS errors

## 🔍 Troubleshooting

### **CORS Errors**
- Check backend logs for blocked origins
- Verify FRONTEND_URL and CORS_ORIGIN are set correctly
- Ensure frontend domain matches exactly

### **API Connection Issues**
- Verify VITE_API_URL is set correctly
- Check backend is running and accessible
- Test backend directly: `https://elevate-production.up.railway.app/api/health`

### **Environment Variables Not Loading**
- Restart Railway services after setting variables
- Check variable names are exact (case-sensitive)
- Verify no extra spaces in values

## 📱 Local Development

### **Switch to Local Backend:**
Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

### **Switch to Production Backend:**
Update `.env`:
```env
VITE_API_URL=https://elevate-production.up.railway.app/api
VITE_ENV=production
```

## ✅ Status: Ready for Deployment!

Your full-stack application is now configured to work with Railway:
- ✅ Frontend points to Railway backend
- ✅ Backend allows Railway frontend
- ✅ CORS properly configured
- ✅ Environment variables set
- ✅ Production ready!

Deploy and test your application! 🎉
