# 🚂 Railway Deployment Guide

## 🎯 Overview

Deploy your full-stack Habit Tracker to Railway with automatic builds and deployments.

## 📋 Prerequisites

1. **GitHub Repository**: Code pushed to GitHub
2. **Railway Account**: Sign up at [railway.app](https://railway.app)
3. **MongoDB Atlas**: Database setup (free tier)

## 🏗️ Architecture

- **Frontend**: React + Vite static site
- **Backend**: Node.js + Express API
- **Database**: MongoDB Atlas

## 🚀 Deployment Steps

### Step 1: Prepare Repository

1. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Verify configuration files**:
   - ✅ `railway.json` (frontend)
   - ✅ `nixpacks.toml` (frontend)
   - ✅ `backend/railway.json` (backend)
   - ✅ `backend/nixpacks.toml` (backend)

### Step 2: Deploy Backend API

1. **Go to Railway Dashboard**:
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your habit-tracker repository
   - Select the `backend` folder

3. **Configure Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secure-jwt-secret
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://your-frontend-domain.railway.app
   ```

4. **Deploy**:
   - Railway will automatically build and deploy
   - Note your backend URL: `https://your-backend.railway.app`

### Step 3: Deploy Frontend

1. **Create Second Service**:
   - In the same project, click "New Service"
   - Select "GitHub Repo"
   - Choose the root directory (not backend folder)

2. **Configure Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.railway.app
   NODE_ENV=production
   ```

3. **Deploy**:
   - Railway will build and deploy the frontend
   - Note your frontend URL: `https://your-frontend.railway.app`

### Step 4: Update CORS Configuration

1. **Update Backend Environment**:
   - Go to your backend service
   - Update `CORS_ORIGIN` with your actual frontend URL
   - Redeploy if needed

## 🔧 Configuration Files Explained

### Frontend (`railway.json`)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Frontend (`nixpacks.toml`)
```toml
[phases.setup]
nixPkgs = ['nodejs-18_x', 'npm-9_x']

[phases.install]
cmds = ['npm ci --include=dev']

[phases.build]
cmds = ['npm run build']

[start]
cmd = 'npm run preview'
```

### Backend (`railway.json`)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Backend (`nixpacks.toml`)
```toml
[phases.setup]
nixPkgs = ['nodejs-18_x', 'npm-9_x']

[phases.install]
cmds = ['npm ci']

[start]
cmd = 'npm start'
```

## 🔍 Testing Your Deployment

### Backend Health Check
```bash
curl https://your-backend.railway.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Habit Tracker API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### Frontend Test
- Visit: `https://your-frontend.railway.app`
- Should load without errors
- Login/register should work
- API calls should succeed

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures
- Check build logs in Railway dashboard
- Verify `package.json` scripts
- Ensure all dependencies are listed

#### Environment Variables
- Double-check all required variables are set
- Verify MongoDB connection string format
- Ensure no typos in variable names

#### CORS Errors
- Update `CORS_ORIGIN` with correct frontend URL
- Check backend logs for CORS warnings
- Verify frontend is making requests to correct backend URL

#### Database Connection
- Verify MongoDB Atlas connection string
- Check network access settings (allow 0.0.0.0/0)
- Ensure database user has correct permissions

## 📊 Monitoring

### Railway Dashboard
- View service health and metrics
- Check build and deployment logs
- Monitor resource usage

### Application Logs
- Backend: Check Railway logs for API errors
- Frontend: Use browser DevTools for client errors
- Database: Monitor MongoDB Atlas metrics

## 💰 Pricing

### Railway Pricing
- **Starter Plan**: $5/month per service
- **Pro Plan**: $20/month per service
- **Free Trial**: Limited usage for testing

### MongoDB Atlas
- **Free Tier**: 512MB storage
- **Shared clusters**: No cost
- **Dedicated clusters**: Starting at $9/month

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to your main branch:

1. Make changes locally
2. Test thoroughly
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
4. Railway automatically rebuilds and deploys

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit secrets to Git
2. **JWT Secret**: Use a strong, randomly generated secret
3. **Database**: Regularly rotate database passwords
4. **HTTPS**: Railway provides SSL certificates automatically
5. **CORS**: Only allow your frontend domain

## 📈 Performance Optimization

### Frontend
- ✅ Code splitting enabled
- ✅ Minification enabled
- ✅ Gzip compression
- ✅ Static asset caching

### Backend
- ✅ MongoDB connection pooling
- ✅ Rate limiting enabled
- ✅ Helmet security headers
- ✅ Compression middleware

## 🎉 Success Checklist

Your deployment is successful when:
- [ ] ✅ Backend health check responds
- [ ] ✅ Frontend loads without errors
- [ ] ✅ User registration works
- [ ] ✅ User login works
- [ ] ✅ Habits can be created and managed
- [ ] ✅ Data persists between sessions
- [ ] ✅ Mobile responsive design works

## 📞 Support

If you encounter issues:
1. **Railway Docs**: [docs.railway.app](https://docs.railway.app)
2. **Railway Discord**: Community support
3. **MongoDB Atlas Support**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

---

**🚂 All aboard! Your Habit Tracker is ready for Railway deployment!**
