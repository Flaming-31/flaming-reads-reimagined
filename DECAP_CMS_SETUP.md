# Decap CMS Setup Guide

This guide will help you set up Decap CMS (formerly Netlify CMS) for managing your Christian bookstore content.

## What is Decap CMS?

Decap CMS is a free, open-source content management system that allows you to manage your website content through a user-friendly interface. It stores all content in your Git repository, making it version-controlled and portable. Decap CMS is the community-led successor to Netlify CMS.

## Prerequisites

Before you begin, you'll need:
- A GitHub account
- Your repository hosted on GitHub
- Admin access to your repository

## Step-by-Step Setup

### 1. Verify Admin Folder Structure

Your project should already have the admin folder set up in the `public` directory:

```
public/
  admin/
    index.html
    config.yml
```

### 2. Configure Your Repository

Open `public/admin/config.yml` and update the backend section with your repository details:

```yaml
backend:
  name: github
  repo: your-github-username/your-repository-name
  branch: main
```

Replace `your-github-username/your-repository-name` with your actual GitHub repository path.

### 3. Enable GitHub OAuth

To allow Decap CMS to authenticate with GitHub, you need to set up OAuth:

#### Option A: Using Decap CMS OAuth Gateway (Recommended for Quick Setup)

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the form:
   - **Application name**: `Your Site Name CMS`
   - **Homepage URL**: `https://yourdomain.com` (or your Lovable preview URL)
   - **Authorization callback URL**: `https://api.decapcms.org/callback`
4. Click "Register application"
5. Copy the **Client ID**
6. Click "Generate a new client secret" and copy the **Client Secret**

Now update your `config.yml`:

```yaml
backend:
  name: github
  repo: your-github-username/your-repository-name
  branch: main
  auth_endpoint: https://api.decapcms.org/auth
  app_id: YOUR_CLIENT_ID
```

#### Option B: Self-Hosted OAuth (Advanced)

For production sites, you may want to host your own OAuth server. See the [Decap CMS documentation](https://decapcms.org/docs/authentication-backends/) for details.

### 4. Configure Access

Add authorized users by updating your `config.yml`:

```yaml
backend:
  name: github
  repo: your-github-username/your-repository-name
  branch: main

# Optional: Editorial workflow for content approval
publish_mode: editorial_workflow
```

### 5. Content Collections

Your CMS is pre-configured with the following collections:

- **Books**: Manage your book inventory
- **Events**: Create and manage church events
- **Authors**: Add author profiles
- **Testimonials**: Collect and approve customer testimonials

Each collection is already configured with the appropriate fields.

### 6. Accessing the CMS

Once setup is complete:

1. Navigate to `yourdomain.com/admin` (or your preview URL + `/admin`)
2. Click "Login with GitHub"
3. Authorize the application
4. Start managing your content!

## Content Management

### Managing Books

1. Click "Books" in the left sidebar
2. Click "New Books" to add a book
3. Fill in all fields:
   - Title, Author, Description
   - Price, Category, Stock
   - Upload a book cover image
   - Optional: ISBN, Publisher, Publication Date, Pages
4. Mark as "Featured" to display on homepage
5. Click "Publish" to add it to your repository

The book will be saved as a markdown file in `content/books/` and needs to be synced to your Supabase database.

### Managing Events

1. Click "Events" in the left sidebar
2. Click "New Events"
3. Fill in event details:
   - Title, Description
   - Date and Time
   - Location
   - Upload an event image
4. Mark "Past Event" when the event is over
5. Click "Publish"

### Managing Authors

1. Click "Authors" in the left sidebar
2. Click "New Authors"
3. Add:
   - Author name
   - Biography
   - Profile photo
   - Book count
4. Click "Publish"

### Managing Testimonials

1. Click "Testimonials" in the left sidebar
2. Review submitted testimonials
3. Check "Approved" to display on your site
4. Click "Publish"

## Syncing Content with Database

**Important**: Content created in Decap CMS is stored in your Git repository as markdown files. To display this content on your website, you need to sync it with your Supabase database.

### Manual Sync Process

1. After creating content in Decap CMS, the files are committed to your repository
2. You need to manually insert this data into your Supabase database
3. Go to your Lovable project → Cloud tab → Database
4. Insert the data from your markdown files into the appropriate tables

### Automated Sync (Recommended)

For a better workflow, you can create a GitHub Action or edge function that:
1. Listens for commits to the `content/` folder
2. Parses the markdown files
3. Automatically inserts/updates records in Supabase

Example edge function approach (create in Lovable):
```typescript
// This is a simplified example
import { createClient } from '@supabase/supabase-js';

Deno.serve(async (req) => {
  // Triggered by GitHub webhook
  const payload = await req.json();
  
  // Parse markdown files from commit
  // Extract frontmatter data
  // Insert into Supabase
  
  return new Response('Synced', { status: 200 });
});
```

## Workflow Options

### Editorial Workflow (Optional)

Enable editorial workflow for content approval process:

```yaml
publish_mode: editorial_workflow
```

This creates three columns:
- **Drafts**: Content being worked on
- **In Review**: Content ready for review
- **Ready**: Approved content ready to publish

### Direct Publishing

Keep the default simple workflow where content is published immediately:

```yaml
publish_mode: simple
```

## Troubleshooting

### Can't access /admin

- Verify `public/admin/index.html` exists
- Check that your site is deployed
- Try accessing `/admin/` with a trailing slash
- Clear browser cache

### Authentication errors

- Verify GitHub OAuth app is created correctly
- Check that the callback URL is `https://api.decapcms.org/callback`
- Make sure your Client ID is correct in `config.yml`
- Verify you have access to the repository

### "Config could not be loaded"

- Verify `config.yml` is in the correct location (`public/admin/config.yml`)
- Check that the YAML syntax is valid
- Ensure repository path is correct
- Make sure branch name matches your repository

### Images not uploading

- Verify `media_folder` path in config.yml is correct
- Default is `public/images/uploads`
- Check that you have write permissions to the repository
- Ensure images are under 10MB (GitHub limit)

### Changes not appearing on website

- Remember: Decap CMS saves to Git, but you need to sync with Supabase
- Check that the data is in your repository
- Verify the sync process to Supabase database
- Check RLS policies allow reading the data

## User Management

### Adding Team Members

With GitHub backend, access control is managed through GitHub:

1. **Repository Collaborators**: Add users as collaborators to your GitHub repository
   - Go to your repository → Settings → Collaborators
   - Add users by their GitHub username
   - They'll have full access to the CMS

2. **GitHub Teams** (Organization repos only):
   - Create teams in your GitHub organization
   - Add team members
   - Give the team access to the repository

### Permission Levels

- **Admin**: Full access to create, edit, and delete content
- **Write**: Can create and edit content
- **Read**: View-only access (cannot use CMS)

## Media Management

### Image Guidelines

- **Recommended formats**: JPEG, PNG, WebP
- **Book covers**: 600x900px or similar aspect ratio
- **Event images**: 1200x630px (landscape)
- **Author photos**: 400x400px (square)
- **File size**: Keep under 5MB for best performance

### Media Storage

Images are stored in your repository at:
```
public/images/uploads/
```

These images are version-controlled with Git and can be accessed via:
```
https://yourdomain.com/images/uploads/filename.jpg
```

## Advanced Configuration

### Custom Preview Templates

You can customize how content appears in the CMS preview pane. See [Decap CMS Preview Templates documentation](https://decapcms.org/docs/customization/).

### Widgets and Customization

Decap CMS supports various widgets:
- Rich text editor
- Markdown editor
- Image upload
- Date/time picker
- Relation (link to other content)
- List (repeatable fields)

### Custom Backend

For advanced setups, you can use different backends:
- GitHub (default, recommended)
- GitLab
- Bitbucket
- Git Gateway (requires Netlify)

## Security Best Practices

1. **Repository Access**: Only give access to trusted team members
2. **Branch Protection**: Consider protecting your main branch
3. **Review Workflow**: Use editorial workflow for content approval
4. **Regular Backups**: Your content is in Git, but regular backups are still recommended
5. **Environment Variables**: Never commit secrets in config.yml

## Migration from Netlify CMS

If you previously used Netlify CMS, Decap CMS is fully compatible. The main changes:

1. Update the script in `index.html` from `netlify-cms` to `decap-cms`
2. Change `backend.name` from `git-gateway` to `github` (or keep git-gateway if using Netlify)
3. All content and configuration remain the same

## Next Steps

1. Customize the CMS configuration to match your needs
2. Set up automated sync to Supabase (recommended)
3. Add custom preview templates
4. Configure editorial workflows if needed
5. Train your team on using the CMS

## Resources

- [Decap CMS Official Documentation](https://decapcms.org/docs/)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Decap CMS Community](https://decapcms.org/community/)
- [Configuration Options](https://decapcms.org/docs/configuration-options/)

## Support

For help with:
- **Decap CMS issues**: Check the [Decap CMS documentation](https://decapcms.org/docs/) and [community forum](https://decapcms.org/community/)
- **GitHub issues**: See [GitHub support](https://support.github.com/)
- **Your website/database**: Contact your development team
