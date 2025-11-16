# Deploying to Vercel with Decap CMS

This guide walks you through deploying your Christian bookstore website to Vercel and setting up Decap CMS for content management.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Part 1: Deploy to Vercel](#part-1-deploy-to-vercel)
- [Part 2: Configure Decap CMS](#part-2-configure-decap-cms)
- [Part 3: Set Up OAuth Authentication](#part-3-set-up-oauth-authentication)
- [Part 4: Testing and Verification](#part-4-testing-and-verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:
- A GitHub account with your repository
- A Vercel account (free tier works fine)
- Admin access to your GitHub repository
- Your Supabase credentials (if using database features)

## Part 1: Deploy to Vercel

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Authorize Vercel to access your GitHub account
5. Find and select your repository: `Flaming-31/flaming-reads-reimagined`

### Step 2: Configure Project Settings

1. Vercel will auto-detect that this is a Vite project
2. **Framework Preset**: Should auto-select "Vite"
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `dist` (default)
5. **Install Command**: `npm install` (default)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add the following:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
```

**Where to find these values:**
- Check your `.env` file locally
- Or get them from your Supabase project dashboard

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the deployment to complete (usually 1-3 minutes)
3. Once done, you'll see a success screen with your deployment URL
4. Your site will be live at: `https://your-project-name.vercel.app`

### Step 5: Set Up Custom Domain (Optional)

1. Go to your project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

## Part 2: Configure Decap CMS

### Step 1: Update config.yml with Your Repository

The `public/admin/config.yml` file should already have your repository configured:

```yaml
backend:
  name: github
  repo: Flaming-31/flaming-reads-reimagined
  branch: main
  base_url: https://your-project-name.vercel.app/api
  auth_endpoint: auth
```

**Important:** Replace `https://your-project-name.vercel.app` with your actual Vercel deployment URL.

### Step 2: Verify CMS Files

Ensure these files exist in your project:
- `public/admin/index.html` - CMS admin interface
- `public/admin/config.yml` - CMS configuration

These should already be in your repository.

## Part 3: Set Up OAuth Authentication

Decap CMS requires GitHub OAuth for authentication. You have two options:

### Option A: Self-Hosted OAuth (Recommended for Vercel)

You'll need to create a serverless function for OAuth on Vercel.

#### Step 1: Create GitHub OAuth App

1. Go to GitHub: **Settings** → **Developer settings** → **OAuth Apps**
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: `Flaming Reads CMS`
   - **Homepage URL**: `https://your-project-name.vercel.app`
   - **Authorization callback URL**: `https://your-project-name.vercel.app/api/callback`
4. Click **"Register application"**
5. Note down your **Client ID**
6. Click **"Generate a new client secret"** and note it down

#### Step 2: Create OAuth Serverless Functions

Create `api/auth.js`:

```javascript
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;

module.exports = (req, res) => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user`;
  res.redirect(authUrl);
};
```

Create `api/callback.js`:

```javascript
const axios = require('axios');
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;

module.exports = async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const token = response.data.access_token;
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Complete</title>
        </head>
        <body>
          <script>
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({ token, provider: 'github' })}',
              window.location.origin
            );
            window.close();
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};
```

#### Step 3: Add axios Dependency

Run locally:
```bash
npm install axios
```

#### Step 4: Add Environment Variables to Vercel

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add:
   ```
   OAUTH_CLIENT_ID=your_github_client_id
   OAUTH_CLIENT_SECRET=your_github_client_secret
   ```

#### Step 5: Redeploy

1. Commit and push your changes to GitHub
2. Vercel will automatically redeploy
3. Or manually trigger a redeploy from Vercel dashboard

### Option B: Use Decap CMS OAuth Gateway (Quick Setup)

If you want a faster setup without creating serverless functions:

1. Update `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: Flaming-31/flaming-reads-reimagined
  branch: main
```

2. Go to [decapcms.org](https://decapcms.org) and follow their OAuth gateway instructions
3. Note: This relies on Decap's hosted OAuth service

## Part 4: Testing and Verification

### Step 1: Access CMS Admin

1. Navigate to: `https://your-project-name.vercel.app/admin/`
2. You should see the Decap CMS login screen

### Step 2: Log In

1. Click **"Login with GitHub"**
2. Authorize the OAuth app
3. You should be redirected back to the CMS dashboard

### Step 3: Test Content Management

1. Try creating a new book entry:
   - Click **"Books"** → **"New Books"**
   - Fill in the fields
   - Upload an image
   - Click **"Publish"**

2. Check your GitHub repository:
   - You should see a new file in `content/books/`
   - The image should be in `public/images/uploads/`

### Step 4: Sync with Database (If Using Supabase)

If you're using the Supabase database, you'll need to sync the markdown content:

**Manual Sync:**
- Parse the markdown files and insert into Supabase manually

**Automated Sync (Recommended):**
- Set up a GitHub Action or Vercel serverless function to auto-sync
- See the main `DECAP_CMS_SETUP.md` for example code

## Troubleshooting

### Issue: "Not Found" Error When Logging In

**Solution:**
1. Verify your OAuth callback URL in GitHub matches: `https://your-project-name.vercel.app/api/callback`
2. Check that your serverless functions are deployed correctly
3. Verify environment variables are set in Vercel

### Issue: "Failed to Load Entries"

**Solution:**
1. Check browser console for errors
2. Verify your repository name in `config.yml` is correct
3. Ensure you have write access to the repository
4. Check that the `content/` folders exist in your repo

### Issue: OAuth Loop / Keeps Redirecting

**Solution:**
1. Clear browser cache and cookies
2. Check that `base_url` in `config.yml` matches your Vercel URL exactly
3. Verify client ID and secret are correct in Vercel environment variables
4. Check serverless function logs in Vercel dashboard

### Issue: Images Not Uploading

**Solution:**
1. Ensure `media_folder` path exists: `public/images/uploads/`
2. Create the folder if it doesn't exist
3. Commit and push the folder to GitHub (may need a `.gitkeep` file)

### Issue: Changes Not Appearing on Site

**Solution:**
1. Remember: Decap CMS saves content as markdown files in Git
2. These need to be synced with your Supabase database
3. Set up automated sync or manually import the data
4. Check that your app is fetching from the correct data source

### Issue: Build Fails on Vercel

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Ensure environment variables are set
4. Test build locally: `npm run build`

## Next Steps

1. **Set Up Automated Sync**: Create a workflow to sync markdown content with Supabase
2. **Add More Admins**: Invite team members as GitHub collaborators
3. **Configure Workflows**: Enable editorial workflow for content approval
4. **Backup Strategy**: Set up automated backups of your Supabase database
5. **Monitor**: Use Vercel Analytics to track site performance

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [GitHub OAuth Apps Guide](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

## Security Best Practices

1. **Never commit secrets**: Use Vercel environment variables
2. **Rotate tokens**: Regularly update OAuth credentials
3. **Monitor access**: Review GitHub repository access regularly
4. **Use HTTPS**: Vercel provides this by default
5. **Enable RLS**: Ensure Supabase Row Level Security is properly configured

---

**Need Help?** Check the troubleshooting section or refer to the [Decap CMS GitHub discussions](https://github.com/decaporg/decap-cms/discussions).
