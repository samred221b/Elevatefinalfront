# 🚀 Deploying Habit Tracker to Render

This guide will help you deploy your full-stack Habit Tracker application to Render.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Set up a MongoDB Atlas cluster (free tier available)

## 🏗️ Architecture Overview

Your app will be deployed as:
- **Backend API**: Node.js service on Render
- **Frontend**: Static site on Render
- **Database**: MongoDB Atlas (cloud database)

## 📁 Project Structure

```
habit-tracker/
├── backend/           # Node.js API server
├── src/              # React frontend source
├── dist/             # Built frontend (generated)
├── render.yaml       # Render configuration
└── DEPLOYMENT.md     # This guide
```

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Ensure your repository is public** or upgrade to Render's paid plan for private repos.

### Step 2: Set Up MongoDB Atlas

1. **Create a MongoDB Atlas account** at [mongodb.com/atlas](https://mongodb.com/atlas)

2. **Create a new cluster**:
   - Choose the free tier (M0)
   - Select a region close to your users
   - Name your cluster (e.g., "habit-tracker-cluster")

3. **Create a database user**:
   - Go to Database Access
   - Add a new user with read/write permissions
   - Remember the username and password

4. **Configure network access**:
   - Go to Network Access
   - Add IP address: `0.0.0.0/0` (allow access from anywhere)
   - This is needed for Render to connect

5. **Get your connection string**:
   - Go to your cluster and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (it looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/habittracker?retryWrites=true&w=majority
   ```

### Step 3: Deploy to Render

1. **Go to Render Dashboard**:
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Sign in with your GitHub account

2. **Create a new Blueprint**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing your habit tracker

3. **Render will automatically detect** the `render.yaml` file and create:
   - Backend API service
   - Frontend static site
   - MongoDB database connection

4. **Configure Environment Variables**:
   
   **For the Backend Service (`habit-tracker-api`)**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render default)
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a secure random string
   - `CORS_ORIGIN`: `https://habit-tracker-frontend.onrender.com`
   - `JWT_EXPIRE`: `7d`

   **For the Frontend Service (`habit-tracker-frontend`)**:
   - `VITE_API_URL`: `https://habit-tracker-api.onrender.com`
   - `NODE_ENV`: `production`

### Step 4: Update Service Names (Optional)

The default names in `render.yaml` are:
- Backend: `habit-tracker-api`
- Frontend: `habit-tracker-frontend`

You can customize these names in the Render dashboard or by editing `render.yaml`.

### Step 5: Monitor Deployment

1. **Watch the build logs**:
   - Click on each service to see build progress
   - Backend should show: "Server running on port 10000"
   - Frontend should build successfully and deploy

2. **Test your deployment**:
   - Backend health check: `https://your-api-name.onrender.com/api/health`
   - Frontend: `https://your-frontend-name.onrender.com`

## 🔍 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Database Connection Issues**:
   - Verify MongoDB Atlas connection string
   - Check network access settings (allow 0.0.0.0/0)
   - Ensure database user has correct permissions

3. **CORS Errors**:
   - Verify `CORS_ORIGIN` environment variable
   - Check that frontend URL matches in backend CORS config

4. **Environment Variables**:
   - Double-check all required env vars are set
   - Ensure no typos in variable names
   - Verify MongoDB URI format

### Debugging Commands:

```bash
# Test backend locally
cd backend && npm start

# Test frontend locally
npm run dev

# Build frontend locally
npm run build
```

## 🔄 Updating Your Deployment

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```

2. **Render will automatically redeploy** when you push to the main branch.

## 📊 Monitoring

- **Render Dashboard**: Monitor service health, logs, and metrics
- **MongoDB Atlas**: Monitor database performance and usage
- **Browser DevTools**: Check for frontend errors and API calls

## 🔐 Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **JWT Secret**: Use a strong, randomly generated secret
3. **Database Access**: Regularly rotate database passwords
4. **HTTPS**: Render provides SSL certificates automatically

## 💰 Costs

- **Render Free Tier**: 
  - 750 hours/month for web services
  - Static sites are free
  - Services sleep after 15 minutes of inactivity

- **MongoDB Atlas Free Tier**:
  - 512 MB storage
  - Shared cluster
  - No credit card required

## 🎉 Success!

Once deployed, your Habit Tracker will be available at:
- **Frontend**: `https://your-frontend-name.onrender.com`
- **API**: `https://your-api-name.onrender.com`

Your users can now access your habit tracking application from anywhere in the world!

## 📞 Support

If you encounter issues:
1. Check Render documentation: [render.com/docs](https://render.com/docs)
2. MongoDB Atlas support: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
3. Review application logs in Render dashboard
