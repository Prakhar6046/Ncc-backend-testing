# Vercel Deployment Guide

This guide explains how to deploy your NCC Backend to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Environment variables configured

## Step 1: Install Vercel CLI (Optional)

You can deploy via the Vercel dashboard or CLI. For CLI:

```bash
npm i -g vercel
```

## Step 2: Environment Variables

Before deploying, make sure to set these environment variables in Vercel:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

- `MONGO_USER` - Your MongoDB username
- `MONGO_PASSWORD` - Your MongoDB password
- `MONGO_CLUSTER` - Your MongoDB cluster URL
- `MONGO_DBNAME` - Your MongoDB database name
- `JWT_SECRET` - Your JWT secret key
- Any other environment variables your app uses

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect the configuration
5. Click "Deploy"

### Option B: Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel

# For production deployment
vercel --prod
```

## Step 4: Verify Deployment

After deployment, Vercel will provide you with a URL like:
- `https://your-project-name.vercel.app`

Test your API endpoints:
- `https://your-project-name.vercel.app/` - Should return "Hello World"
- `https://your-project-name.vercel.app/api/your-route` - Test your API routes

## Step 5: Configure Cron Jobs

The cron jobs are configured in `vercel.json`:
- Daily cron: Runs at midnight (0 0 * * *)
- Weekly cron: Runs on Sundays at midnight (0 0 * * 0)

Vercel will automatically trigger these endpoints. Make sure your Vercel plan supports cron jobs (available on Pro plan and above).

## Important Notes

1. **Database Connection**: The MongoDB connection will be established on each serverless function invocation. This is normal for serverless architectures.

2. **Cold Starts**: Serverless functions may have cold starts. Consider using Vercel's Edge Functions or keeping functions warm if needed.

3. **File Uploads**: If you're using file uploads, make sure to configure proper limits in your Express middleware.

4. **CORS**: Update your CORS origins in `src/index.ts` to include your Vercel deployment URL.

5. **Local Development**: The app will still work locally. The `VERCEL` environment variable check ensures compatibility with both environments.

## Troubleshooting

- **Build Errors**: Check that all dependencies are listed in `package.json`
- **Runtime Errors**: Check Vercel function logs in the dashboard
- **Cron Jobs Not Running**: Verify your Vercel plan includes cron job support
- **Database Connection Issues**: Ensure environment variables are correctly set

## Updating CORS Origins

After deployment, update the CORS origins in `src/index.ts` to include your Vercel URL:

```typescript
origin: [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ncc-sobm.vercel.app",
  "https://web.nethgo.com",
  "https://your-project-name.vercel.app" // Add your Vercel URL
]
```

