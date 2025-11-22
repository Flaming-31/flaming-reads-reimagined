# Complete Guide: Local Testing & cPanel Deployment with Decap CMS

This guide covers everything you need to test your site locally with Decap CMS and then deploy it to cPanel hosting.

---

## Part 1: Local Development & Testing

### Prerequisites
- Node.js (v18 or higher)
- Git
- GitHub account
- A code editor (VS Code recommended)

### Step 1: Clone and Setup

```bash
# Clone your repository
git clone https://github.com/Flaming-31/flaming-reads-reimagined.git
cd flaming-reads-reimagined

# Install dependencies
npm install

# Start the development server
npm run dev
```

Your app should now be running at `http://localhost:8080`

### Step 2: Understanding Decap CMS Structure

Your project includes:
- `public/admin/index.html` - CMS admin interface
- `public/admin/config.yml` - CMS configuration
- `api/auth.php` - OAuth authentication endpoint (for production)
- `api/callback.php` - OAuth callback handler (for production)

### Step 3: Testing Decap CMS Locally

**Important:** Decap CMS requires GitHub OAuth for authentication. For local testing, you have two options:

#### Option A: Use Decap CMS Proxy Server (Recommended for Local Testing)

1. **Install Decap CMS Proxy Server:**
   ```bash
   npm install -g @decapcms/decap-server
   ```

2. **Update `config.yml` for local development:**
   
   Open `public/admin/config.yml` and temporarily change the backend to:
   ```yaml
   backend:
     name: git-gateway
   
   local_backend: true
   ```

3. **Start the proxy server in a new terminal:**
   ```bash
   npx decap-server
   ```
   
   This runs on `http://localhost:8081` by default.

4. **Access the CMS:**
   - Go to `http://localhost:8080/admin/`
   - You should be able to access the CMS without GitHub authentication
   - You can create, edit, and delete content
   - Changes are saved to your local file system

5. **Test Your Changes:**
   - Create a test book, event, or author
   - Check that files are created in `content/` folders
   - Verify changes appear on your frontend

#### Option B: Use GitHub OAuth (More Complex)

If you want to test with real GitHub OAuth:

1. **Create a GitHub OAuth App:**
   - Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
   - **Application name:** "Flaming Books Local"
   - **Homepage URL:** `http://localhost:8080`
   - **Authorization callback URL:** `http://localhost:8080/api/callback.php`
   - Click "Register application"
   - Note your **Client ID** and generate a **Client Secret**

2. **Configure Local OAuth (requires PHP):**
   - You'll need PHP installed locally to test the OAuth endpoints
   - Create a `.env.local` file with your credentials:
     ```
     OAUTH_CLIENT_ID=your_client_id_here
     OAUTH_CLIENT_SECRET=your_client_secret_here
     ```

3. **Run PHP Server for API endpoints:**
   ```bash
   php -S localhost:8082 -t api/
   ```

4. **Update config.yml:**
   ```yaml
   backend:
     name: github
     repo: Flaming-31/flaming-reads-reimagined
     branch: main
     base_url: http://localhost:8082
     auth_endpoint: auth.php
   ```

**Note:** Option A (proxy server) is much simpler for local testing!

### Step 4: Build for Production

Before deploying, test the production build locally:

```bash
# Create production build
npm run build

# Preview the production build
npm run preview
```

This creates a `dist/` folder with your optimized site.

---

## Part 2: Deploying to cPanel

### Prerequisites
- cPanel hosting account with:
  - File Manager or FTP/SFTP access
  - PHP 7.4 or higher
  - SSL certificate (required for OAuth)
  - Custom domain or subdomain

### Step 1: Prepare Your Production Build

1. **Update config.yml for production:**
   
   Open `public/admin/config.yml` and ensure it has:
   ```yaml
   backend:
     name: github
     repo: Flaming-31/flaming-reads-reimagined
     branch: main
     base_url: https://yourdomain.com/api
     auth_endpoint: auth.php
   ```
   
   Replace `yourdomain.com` with your actual domain!

2. **Build the project:**
   ```bash
   npm run build
   ```

### Step 2: Upload Files to cPanel

#### Method A: Using File Manager

1. **Log into cPanel**
2. **Open File Manager**
3. **Navigate to your web root:**
   - Usually `public_html/` for main domain
   - Or `public_html/subdomain/` for a subdomain

4. **Upload the build:**
   - Upload everything from the `dist/` folder to your web root
   - Upload the `api/` folder to your web root (contains `auth.php` and `callback.php`)
   - Your structure should look like:
     ```
     public_html/
     ├── api/
     │   ├── auth.php
     │   └── callback.php
     ├── admin/
     │   ├── index.html
     │   └── config.yml
     ├── assets/
     ├── images/
     ├── index.html
     └── [other files]
     ```

#### Method B: Using FTP/SFTP

1. **Connect with your FTP client** (FileZilla, Cyberduck, etc.)
2. **Navigate to web root** (usually `public_html/`)
3. **Upload files:**
   - Upload contents of `dist/` folder
   - Upload `api/` folder

#### Method C: Using SSH (Advanced)

```bash
# Connect to your server
ssh username@yourdomain.com

# Navigate to web root
cd public_html

# Clone and build (if Node.js is available on server)
git clone https://github.com/Flaming-31/flaming-reads-reimagined.git temp
cd temp
npm install
npm run build
cp -r dist/* ../
cp -r api ../
cd ..
rm -rf temp
```

### Step 3: Configure .htaccess for SPA

Create/edit `.htaccess` in your web root:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Don't rewrite API endpoints
  RewriteCond %{REQUEST_URI} !^/api/
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Force HTTPS (required for OAuth)
<IfModule mod_rewrite.c>
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Step 4: Set Up GitHub OAuth for Production

1. **Create Production OAuth App:**
   - Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
   - **Application name:** "Flaming Books Production"
   - **Homepage URL:** `https://yourdomain.com`
   - **Authorization callback URL:** `https://yourdomain.com/api/callback.php`
   - Click "Register application"
   - Save your **Client ID** and **Client Secret**

2. **Configure OAuth Credentials in cPanel:**

   **Option A: Using Environment Variables (Recommended)**
   
   In cPanel, edit `.htaccess` to add:
   ```apache
   SetEnv OAUTH_CLIENT_ID "your_client_id_here"
   SetEnv OAUTH_CLIENT_SECRET "your_client_secret_here"
   ```

   **Option B: Using a Config File**
   
   Create `api/config.php`:
   ```php
   <?php
   define('OAUTH_CLIENT_ID', 'your_client_id_here');
   define('OAUTH_CLIENT_SECRET', 'your_client_secret_here');
   ```
   
   Then at the top of `auth.php` and `callback.php`, add:
   ```php
   require_once __DIR__ . '/config.php';
   ```

   **Security Note:** If using Option B, add this to `.htaccess`:
   ```apache
   <Files "config.php">
     Order Allow,Deny
     Deny from all
   </Files>
   ```

### Step 5: Test Your Deployment

1. **Test the main site:**
   - Visit `https://yourdomain.com`
   - Verify all pages load correctly
   - Test navigation and functionality

2. **Test Decap CMS:**
   - Visit `https://yourdomain.com/admin/`
   - Click "Login with GitHub"
   - Authorize the application
   - You should be redirected back to the CMS
   - Try creating/editing content
   - Verify changes are pushed to GitHub

3. **Check API endpoints:**
   - Visit `https://yourdomain.com/api/auth.php` (should redirect to GitHub)
   - Check error logs in cPanel if issues occur

### Step 6: Content Workflow

Once deployed and authenticated:

1. **Log into CMS:**
   - Go to `https://yourdomain.com/admin/`
   - Authenticate with GitHub

2. **Manage Content:**
   - Create/edit books, events, authors, testimonials
   - Use "Save" to commit draft
   - Use "Publish" to commit to main branch

3. **See Changes Live:**
   - After publishing, changes are committed to GitHub
   - If using auto-deploy, changes appear on site
   - Otherwise, pull changes and redeploy

---

## Part 3: Automated Deployment (Optional)

### Option A: GitHub Actions to cPanel

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to cPanel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to cPanel
      uses: SamKirkland/FTP-Deploy-Action@4.3.3
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/
        server-dir: /public_html/
```

Add secrets in GitHub repository settings:
- `FTP_SERVER`: Your cPanel FTP hostname
- `FTP_USERNAME`: Your FTP username
- `FTP_PASSWORD`: Your FTP password

### Option B: cPanel Git Version Control

If your cPanel has Git integration:

1. **In cPanel, find "Git Version Control"**
2. **Click "Create"**
3. **Enter repository URL:** `https://github.com/Flaming-31/flaming-reads-reimagined.git`
4. **Set repository path:** `/public_html/`
5. **Create a post-deploy script:**
   ```bash
   #!/bin/bash
   cd $DEPLOYPATH
   npm install
   npm run build
   cp -r dist/* ../
   ```

Now changes pushed to GitHub auto-deploy!

---

## Troubleshooting

### CMS Login Issues

**Problem:** "Unable to authenticate"
- Check OAuth credentials are correct
- Verify callback URL matches exactly
- Ensure SSL is enabled (HTTPS required)
- Check `auth.php` and `callback.php` have correct permissions (644)

**Problem:** "Failed to load config.yml"
- Check file exists at `/admin/config.yml`
- Verify file permissions (644)
- Check syntax is valid YAML

### Build Issues

**Problem:** Build fails locally
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Problem:** "Module not found" errors
- Check all imports use correct paths
- Verify all dependencies are in package.json

### cPanel Issues

**Problem:** "500 Internal Server Error"
- Check PHP error logs in cPanel
- Verify PHP version is 7.4+
- Check file permissions (644 for files, 755 for directories)

**Problem:** Routes return 404
- Verify `.htaccess` is uploaded and active
- Check mod_rewrite is enabled in cPanel

**Problem:** OAuth endpoints return errors
- Verify PHP curl extension is enabled
- Check OAuth credentials in environment/config
- Test endpoint directly: `https://yourdomain.com/api/auth.php`

### Content Sync Issues

**Problem:** Changes in CMS don't appear on site
- CMS pushes to GitHub, you need to rebuild/redeploy
- Set up automated deployment (see Part 3)
- Or manually pull and rebuild

**Problem:** Can't push to GitHub
- Check GitHub personal access token has repo permissions
- Verify repository name is correct in config.yml
- Check branch name matches

---

## Quick Reference

### Local Development Commands
```bash
npm install          # Install dependencies
npm run dev         # Start dev server
npm run build       # Create production build
npm run preview     # Preview production build
npx decap-server    # Start CMS proxy server
```

### Important URLs
- **Local app:** `http://localhost:8080`
- **Local CMS:** `http://localhost:8080/admin/`
- **Production CMS:** `https://yourdomain.com/admin/`
- **GitHub OAuth Settings:** `https://github.com/settings/developers`

### Key Files
- `public/admin/config.yml` - CMS configuration
- `api/auth.php` - OAuth authentication
- `api/callback.php` - OAuth callback
- `.htaccess` - Server configuration

### Need Help?
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/oauth-apps)
- [cPanel Documentation](https://docs.cpanel.net/)

---

## Summary

**For Local Testing:**
1. Clone repo and `npm install`
2. Use `npx decap-server` for easy CMS testing
3. Run `npm run dev` to see changes live

**For Production:**
1. Update `config.yml` with your domain
2. Build with `npm run build`
3. Upload `dist/` contents and `api/` folder to cPanel
4. Set up GitHub OAuth with your production URL
5. Configure OAuth credentials in cPanel
6. Test at `https://yourdomain.com/admin/`

That's it! You now have a complete local testing environment and production deployment workflow.
