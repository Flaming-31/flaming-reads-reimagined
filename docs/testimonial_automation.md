# Testimonial Automation

## Overview
The public testimonial form still posts through the PHP proxy into Google Apps Script. Extend the script so that every submission does two extra things:

1. **Creates (or updates) a markdown file in this repo under `content/testimonials/` with `approved: false`.**
2. **Emails the admin team** so they know to review the testimonial inside Decap CMS.

Once the markdown file lands in `content/testimonials/`, the existing CMS editorial workflow can approve the testimonial by flipping `approved` to `true` and publishing.

---

## GitHub automation (new markdown file per testimonial)

1. **Create a GitHub Personal Access Token (PAT)** with `repo` scope.
   - Go to <https://github.com/settings/tokens> → *Fine-grained tokens* or *Classic tokens*.
   - Restrict it to this repo if using a fine-grained token.

2. **Store the token securely in Apps Script** using the Properties service:
   ```javascript
   const GITHUB_TOKEN = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
   ```
   In the Apps Script editor: `Project Settings → Script properties → Add property` named `GITHUB_TOKEN` with your PAT.

3. **Add helper code to Apps Script** (inside the same project handling testimonial submissions):
   ```javascript
   const REPO_OWNER = 'Flaming-31';
   const REPO_NAME = 'flaming-reads-reimagined';
   const REPO_BRANCH = 'main'; // adjust if you use a different default branch

   function createTestimonialFile({ name, rating, message }) {
     const slug = `${Date.now()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
     const frontmatter = [
       '---',
       `name: ${JSON.stringify(name)}`,
       `rating: ${rating}`,
       `message: |\n  ${message.replace(/\n/g, '\n  ')}`,
       'approved: false',
       '---',
       '',
       ''
     ].join('\n');

     const path = `content/testimonials/${slug}.md`;

     const payload = {
       message: `feat(testimonial): add ${name}`,
       content: Utilities.base64Encode(frontmatter),
       branch: REPO_BRANCH,
     };

     const response = UrlFetchApp.fetch(
       `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
       {
         method: 'put',
         contentType: 'application/json',
         headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
         },
         payload: JSON.stringify(payload),
         muteHttpExceptions: true,
       },
     );

     if (response.getResponseCode() >= 300) {
       throw new Error(`GitHub error: ${response.getContentText()}`);
     }
   }
   ```

4. **Call `createTestimonialFile` inside `doPost`** after appending to Google Sheets. Wrap it in `try/catch` so a GitHub failure doesn’t block the user-facing response:
   ```javascript
   try {
     createTestimonialFile({ name, rating, message });
   } catch (err) {
     console.error('Unable to sync testimonial to GitHub', err);
   }
   ```

The new markdown files will appear in the repo with `approved: false`. Editors can open the entry in Decap CMS → toggle `Approved` to true → publish.

---

## Email notification via Apps Script

After appending to the sheet (or after the GitHub call), send an email so admins see the submission instantly:

```javascript
const ADMIN_EMAILS = ['info@flamingbooks.com.ng'];

function notifyAdmins({ name, rating, message }) {
  const subject = `New Testimonial Submitted: ${name}`;
  const body = `Name: ${name}\nRating: ${rating}\n\n${message}`;
  MailApp.sendEmail(ADMIN_EMAILS.join(','), subject, body);
}
```

Invoke `notifyAdmins({ name, rating, message });` inside `doPost` near the end. If you prefer multiple recipients, list them all in `ADMIN_EMAILS`.

> **Contact + Subscription notifications**
>
> Follow the same pattern in the *contact* and *subscription* Apps Script files:
>
> ```javascript
> const CONTACT_ADMIN_EMAILS = ['info@flamingbooks.com.ng'];
> function notifyContactAdmins({ name, email, subject, message }) {
>   const subjectLine = `New Contact Form: ${name}`;
>   const body = [
>     `Name: ${name}`,
>     `Email: ${email}`,
>     subject ? `Subject: ${subject}` : '',
>     '',
>     message,
>   ].filter(Boolean).join('\n');
>   MailApp.sendEmail(CONTACT_ADMIN_EMAILS.join(','), subjectLine, body);
> }
> ```
>
> ```javascript
> const SUBSCRIBE_ADMIN_EMAILS = ['info@flamingbooks.com.ng'];
> function notifySubscribeAdmins(email) {
>   MailApp.sendEmail(
>     SUBSCRIBE_ADMIN_EMAILS.join(','),
>     'New Newsletter Subscription',
>     `A new subscriber joined the list: ${email}`,
>   );
> }
> ```
>
> Call these helpers after each successful `sheet.appendRow(...)` in the respective scripts so admins are alerted for every contact or subscription form submission.

---

## Summary of changes needed in Apps Script

1. Store `GITHUB_TOKEN` in Script Properties.
2. Paste the helper functions (`createTestimonialFile`, `notifyAdmins`).
3. Inside `doPost`, after writing to Sheets:
   ```javascript
   createTestimonialFile({ name, rating, message });
   notifyAdmins({ name, rating, message });
   ```
4. Redeploy the Web App.

With these adjustments, every testimonial submission will:
- Append to the Google Sheet (existing behavior).
- Email admins immediately.
- Commit a markdown record with `approved: false` so the CMS workflow can approve/reject it before it appears on the site.
