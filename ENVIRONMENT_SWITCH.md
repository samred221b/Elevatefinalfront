# Environment Configuration Guide

## Current Setup: LOCAL DEVELOPMENT

Your app is now configured to use your local backend server.

## Quick Environment Switching

### For Local Development (Current)
In `.env` file:
```bash
# LOCAL DEVELOPMENT - Currently Active
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

### For Production Deployment
In `.env` file:
```bash
# Production Railway Backend - Currently Active
VITE_API_URL=https://elevate1-production.up.railway.app/api
VITE_ENV=production
```

### For Mobile Testing (Same Network)
In `.env` file:
```bash
# Mobile Access - Currently Active
VITE_API_URL=http://192.168.137.1:5000/api
VITE_ENV=development
```

## How to Switch

1. **To Local Development:**
   - Uncomment the localhost line
   - Comment out the production line
   - Set `VITE_ENV=development`

2. **To Production:**
   - Comment out the localhost line
   - Uncomment the production line
   - Set `VITE_ENV=production`

3. **Restart your dev server** after changing .env files:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Verification

Check the browser console when the app loads - you should see:
- 🌐 API Base URL: http://localhost:5000/api (for local)
- 🔧 Environment: development

## Backend Requirements

Make sure your local backend is running on:
- **Port:** 5000
- **URL:** http://localhost:5000
- **API Base:** http://localhost:5000/api

## Troubleshooting

If you get connection errors:
1. Verify your backend is running on port 5000
2. Check if there are any CORS issues
3. Ensure the backend API routes are working
4. Use the API Debugger: add `?debug=api` to your URL
