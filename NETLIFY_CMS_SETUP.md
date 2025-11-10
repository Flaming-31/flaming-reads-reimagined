# Netlify CMS Setup Guide

This guide will help you set up Netlify CMS for managing your Christian bookstore content.

## What is Netlify CMS?

Netlify CMS is a free, open-source content management system that allows you to manage your website content through a user-friendly interface. It stores all content in your Git repository, making it version-controlled and portable.

## Step-by-Step Setup

### 1. Create Admin Folder

First, create a new folder in your `public` directory called `admin`:

```
public/
  admin/
    index.html
    config.yml
```

### 2. Create index.html

Create `public/admin/index.html` with the following content:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Content Manager</title>
  </head>
  <body>
    <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
  </body>
</html>
```

### 3. Create config.yml

Create `public/admin/config.yml` with your content collections:

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "public/images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "products"
    label: "Books"
    folder: "content/books"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Author", name: "author", widget: "string"}
      - {label: "Description", name: "description", widget: "text"}
      - {label: "Price", name: "price", widget: "number"}
      - {label: "Category", name: "category", widget: "string"}
      - {label: "Image", name: "image", widget: "image"}
      - {label: "Featured", name: "featured", widget: "boolean", default: false}
      - {label: "Stock", name: "stock", widget: "number", default: 0}
      - {label: "ISBN", name: "isbn", widget: "string", required: false}
      - {label: "Publisher", name: "publisher", widget: "string", required: false}
      - {label: "Pages", name: "pages", widget: "number", required: false}

  - name: "events"
    label: "Events"
    folder: "content/events"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "description", widget: "text"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Time", name: "time", widget: "string"}
      - {label: "Location", name: "location", widget: "string"}
      - {label: "Image", name: "image", widget: "image"}
      - {label: "Past Event", name: "is_past", widget: "boolean", default: false}

  - name: "authors"
    label: "Authors"
    folder: "content/authors"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Name", name: "name", widget: "string"}
      - {label: "Bio", name: "bio", widget: "text"}
      - {label: "Image", name: "image", widget: "image"}
      - {label: "Book Count", name: "book_count", widget: "number", default: 0}
```

### 4. Enable Netlify Identity

1. Go to your Netlify dashboard
2. Navigate to your site settings
3. Click on "Identity" in the left sidebar
4. Click "Enable Identity"

### 5. Enable Git Gateway

1. In the Identity settings
2. Scroll down to "Services"
3. Click "Enable Git Gateway"

### 6. Add Netlify Identity Widget (Optional)

To allow users to sign up directly from your site, add the Netlify Identity widget to your `index.html`:

```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

### 7. Invite Users

1. Go to Netlify Dashboard > Identity
2. Click "Invite users"
3. Enter email addresses for people who should have access to the CMS

## Accessing the CMS

Once setup is complete:

1. Go to `yourdomain.com/admin` (or `localhost:8080/admin` during development)
2. Sign in with your Netlify Identity credentials
3. Start managing your content!

## Content Management

### Managing Books

- **Add New Book**: Click "New Books" in the CMS
- Fill in all required fields (title, author, price, etc.)
- Upload a book cover image
- Click "Publish" to add it to your database

### Managing Events

- **Add New Event**: Click "New Events"
- Set the event date, time, and location
- Upload an event image
- Mark as "Past Event" when the event is over

### Managing Authors

- **Add New Author**: Click "New Authors"
- Add author bio and photo
- Update book count as you add their books

## Syncing with Database

After creating content in Netlify CMS, you'll need to sync it with your Supabase database. You have two options:

### Option 1: Manual Import
1. Export content from the `content/` folders
2. Import into Supabase using the Supabase dashboard

### Option 2: Automated Sync (Advanced)
Create a script to automatically sync CMS content to Supabase when changes are pushed to Git.

## Troubleshooting

### Can't access /admin
- Ensure `public/admin/index.html` exists
- Check that your site is deployed to Netlify
- Verify Git Gateway is enabled

### Authentication errors
- Make sure Netlify Identity is enabled
- Check that you've been invited as a user
- Clear browser cache and try again

### Images not uploading
- Verify `media_folder` path in config.yml
- Check file size limits
- Ensure proper permissions

## Next Steps

1. Customize the CMS configuration to match your needs
2. Set up automated workflows
3. Add custom preview templates
4. Configure editorial workflows for content approval

## Resources

- [Netlify CMS Documentation](https://www.netlifycms.org/docs/)
- [Netlify Identity Documentation](https://docs.netlify.com/visitor-access/identity/)
- [Git Gateway Documentation](https://docs.netlify.com/visitor-access/git-gateway/)

## Support

If you need help:
1. Check the [Netlify CMS Community Forum](https://www.netlifycms.org/community/)
2. Read the [official documentation](https://www.netlifycms.org/docs/)
3. Contact your development team
