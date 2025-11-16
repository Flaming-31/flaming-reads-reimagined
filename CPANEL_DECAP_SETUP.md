# Deploying to cPanel with Decap CMS

This guide walks you through deploying your Christian bookstore website to a cPanel hosting environment and setting up Decap CMS for content management.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Part 1: Deploy to cPanel](#part-1-deploy-to-cpanel)
- [Part 2: Configure Decap CMS](#part-2-configure-decap-cms)
- [Part 3: Set Up OAuth Authentication](#part-3-set-up-oauth-authentication)
- [Part 4: Testing and Verification](#part-4-testing-and-verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:
- A cPanel hosting account with:
  - Node.js support (minimum v18)
  - SSH access (recommended)
  - SSL certificate (required for OAuth)
- A GitHub account with your repository
- FTP/SFTP credentials for your hosting
- Domain name configured and pointing to your hosting

## Part 1: Deploy to cPanel

### Step 1: Build Your Project Locally

1. Open terminal in your project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create production build:
   ```bash
   npm run build
   ```

4. This creates a `dist` folder with your production files

### Step 2: Configure Environment Variables

1. In your project root, ensure `.env` exists with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
   ```

2. Rebuild after setting environment variables:
   ```bash
   npm run build
   ```

### Step 3: Upload Files to cPanel

#### Option A: Using File Manager (Easier)

1. Log into cPanel
2. Open **File Manager**
3. Navigate to `public_html` (or your domain's root directory)
4. Delete any existing files (like `index.html`)
5. Upload all files from your local `dist` folder
6. Ensure the structure looks like:
   ```
   public_html/
   ├── assets/
   ├── admin/
   ├── images/
   ├── index.html
   └── ... other files
   ```

#### Option B: Using FTP/SFTP (Recommended)

1. Use an FTP client (FileZilla, WinSCP, Cyberduck)
2. Connect using your FTP credentials:
   - **Host**: ftp.yourdomain.com
   - **Username**: your_cpanel_username
   - **Password**: your_cpanel_password
   - **Port**: 21 (FTP) or 22 (SFTP)

3. Navigate to `public_html`
4. Upload contents of `dist` folder (not the folder itself)
5. Set correct permissions:
   - Folders: 755
   - Files: 644

#### Option C: Using SSH (Most Efficient)

1. Connect via SSH:
   ```bash
   ssh username@yourdomain.com
   ```

2. Navigate to web root:
   ```bash
   cd public_html
   ```

3. From your local machine, use SCP:
   ```bash
   scp -r dist/* username@yourdomain.com:~/public_html/
   ```

### Step 4: Configure .htaccess for SPA

Since this is a React SPA, create/edit `.htaccess` in `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```

### Step 5: Verify Deployment

1. Visit your domain: `https://yourdomain.com`
2. Verify the site loads correctly
3. Test navigation between pages
4. Check browser console for errors

## Part 2: Configure Decap CMS

### Step 1: Create OAuth Handler

For cPanel, you need to create a PHP OAuth handler since serverless functions aren't typically available.

#### Create `api/auth.php`:

```php
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$client_id = getenv('OAUTH_CLIENT_ID') ?: 'your_github_client_id';
$auth_url = "https://github.com/login/oauth/authorize?client_id={$client_id}&scope=repo,user";

header("Location: {$auth_url}");
exit;
?>
```

#### Create `api/callback.php`:

```php
<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/html');

$client_id = getenv('OAUTH_CLIENT_ID') ?: 'your_github_client_id';
$client_secret = getenv('OAUTH_CLIENT_SECRET') ?: 'your_github_client_secret';
$code = $_GET['code'] ?? '';

if (empty($code)) {
    die('Error: No authorization code received');
}

// Exchange code for token
$ch = curl_init('https://github.com/login/oauth/access_token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'client_id' => $client_id,
    'client_secret' => $client_secret,
    'code' => $code,
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$token = $data['access_token'] ?? '';

if (empty($token)) {
    die('Error: Failed to obtain access token');
}

// Return token to CMS
?>
<!DOCTYPE html>
<html>
<head>
    <title>Authentication Complete</title>
</head>
<body>
    <script>
        const data = {
            token: '<?php echo $token; ?>',
            provider: 'github'
        };
        window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify(data),
            window.location.origin
        );
        window.close();
    </script>
    <p>Authentication successful! This window should close automatically.</p>
</body>
</html>
```

### Step 2: Update config.yml

Update `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: Flaming-31/flaming-reads-reimagined
  branch: main
  base_url: https://yourdomain.com/api
  auth_endpoint: auth.php

publish_mode: editorial_workflow

media_folder: "public/images/uploads"
public_folder: "/images/uploads"

# ... rest of your collections config
```

### Step 3: Upload OAuth Files

1. Create `api` folder in `public_html`
2. Upload `auth.php` and `callback.php` to `public_html/api/`
3. Set file permissions to 644

## Part 3: Set Up OAuth Authentication

### Step 1: Create GitHub OAuth App

1. Go to GitHub: **Settings** → **Developer settings** → **OAuth Apps**
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: `Flaming Reads CMS`
   - **Homepage URL**: `https://yourdomain.com`
   - **Authorization callback URL**: `https://yourdomain.com/api/callback.php`
4. Click **"Register application"**
5. Note down your **Client ID**
6. Click **"Generate a new client secret"** and note it down

### Step 2: Configure OAuth Credentials

#### Option A: Using Environment Variables (If Supported)

1. In cPanel, look for **"PHP Configuration"** or **"MultiPHP INI Editor"**
2. Add:
   ```
   OAUTH_CLIENT_ID=your_github_client_id
   OAUTH_CLIENT_SECRET=your_github_client_secret
   ```

#### Option B: Using .env File

1. Create `.env` file in project root:
   ```
   OAUTH_CLIENT_ID=your_github_client_id
   OAUTH_CLIENT_SECRET=your_github_client_secret
   ```

2. Update PHP files to read from `.env`:
   ```php
   <?php
   // At the top of auth.php and callback.php
   if (file_exists(__DIR__ . '/../.env')) {
       $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
       foreach ($lines as $line) {
           if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
               list($key, $value) = explode('=', $line, 2);
               putenv(trim($key) . '=' . trim($value));
           }
       }
   }
   ?>
   ```

3. Secure the .env file with `.htaccess`:
   ```apache
   <Files .env>
       Order allow,deny
       Deny from all
   </Files>
   ```

#### Option C: Hardcode Credentials (Not Recommended)

Replace `getenv()` calls in PHP files with actual values:
```php
$client_id = 'your_actual_client_id';
$client_secret = 'your_actual_client_secret';
```

**Warning**: Only use this for testing. Never commit these files to GitHub.

### Step 3: Ensure SSL is Enabled

1. In cPanel, go to **"SSL/TLS Status"**
2. Ensure your domain has a valid SSL certificate
3. Force HTTPS with `.htaccess`:
   ```apache
   # Force HTTPS
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

## Part 4: Testing and Verification

### Step 1: Access CMS Admin

1. Navigate to: `https://yourdomain.com/admin/`
2. You should see the Decap CMS login screen

### Step 2: Test OAuth Login

1. Click **"Login with GitHub"**
2. You should be redirected to GitHub
3. Authorize the application
4. You should be redirected back to the CMS

### Step 3: Test Content Management

1. Try creating a new book:
   - Click **"Books"** → **"New Books"**
   - Fill in all fields
   - Upload an image
   - Click **"Publish"**

2. Verify in GitHub:
   - Check for new file in `content/books/`
   - Verify image in `public/images/uploads/`

### Step 4: Test on Live Site

1. Pull latest changes from GitHub:
   ```bash
   git pull origin main
   ```

2. Rebuild and redeploy:
   ```bash
   npm run build
   ```

3. Upload new `dist` files to cPanel

## Troubleshooting

### Issue: "Not Found" When Accessing /admin/

**Solution:**
1. Verify `.htaccess` file exists and is configured correctly
2. Check that `admin/index.html` exists in `public_html`
3. Clear browser cache
4. Verify mod_rewrite is enabled in cPanel

### Issue: PHP OAuth Files Not Working

**Solution:**
1. Check PHP version (needs 7.4+)
2. Verify curl is enabled: create `phpinfo.php`:
   ```php
   <?php phpinfo(); ?>
   ```
3. Check file permissions (should be 644)
4. View error logs in cPanel → **"Error Log"**

### Issue: "Failed to Load Entries"

**Solution:**
1. Verify GitHub repository name in `config.yml`
2. Check that you have write access to the repository
3. Ensure `content/` folders exist in your repo
4. Check browser console for detailed errors

### Issue: OAuth Callback Error

**Solution:**
1. Verify callback URL in GitHub OAuth app matches exactly: `https://yourdomain.com/api/callback.php`
2. Ensure SSL certificate is valid
3. Check that client ID and secret are correct
4. View PHP error logs

### Issue: Images Not Uploading

**Solution:**
1. Create `public/images/uploads/` folder if it doesn't exist
2. Set folder permissions to 755
3. Ensure folder exists in GitHub repository
4. Check media_folder path in `config.yml`

### Issue: Changes Not Syncing to Site

**Solution:**
1. Remember: Decap CMS saves to GitHub, not directly to your cPanel hosting
2. You need to pull changes from GitHub and rebuild
3. Consider setting up automated deployment (see below)

### Setting Up Automated Deployment

To automatically deploy when you make changes in Decap CMS:

#### Option 1: GitHub Actions (Recommended)

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
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
          VITE_SUPABASE_PROJECT_ID: ${{ secrets.VITE_SUPABASE_PROJECT_ID }}
      
      - name: Deploy to cPanel
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ftp.yourdomain.com
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: /public_html/
```

Add secrets in GitHub: **Settings** → **Secrets** → **Actions**

#### Option 2: cPanel Git Version Control

If your host supports it:
1. In cPanel, go to **"Git Version Control"**
2. Create a repository linked to your GitHub repo
3. Set up automatic pulls on push

## Next Steps

1. **Automated Deployment**: Set up GitHub Actions for automatic deployments
2. **Database Sync**: Create a cron job to sync markdown content with Supabase
3. **Backups**: Set up automated backups in cPanel
4. **Monitoring**: Use cPanel metrics to monitor site performance
5. **CDN**: Consider using Cloudflare for better performance

## Additional Resources

- [cPanel Documentation](https://docs.cpanel.net/)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [GitHub OAuth Apps Guide](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [.htaccess Tutorial](https://httpd.apache.org/docs/current/howto/htaccess.html)

## Security Best Practices

1. **Protect sensitive files**: Use `.htaccess` to block access to `.env`, config files
2. **Keep PHP updated**: Ensure latest stable PHP version in cPanel
3. **Use strong passwords**: For cPanel, FTP, and database access
4. **Regular backups**: Use cPanel backup feature regularly
5. **Monitor logs**: Check error logs for suspicious activity

---

**Need Help?** Contact your hosting provider's support or check cPanel's built-in documentation.
