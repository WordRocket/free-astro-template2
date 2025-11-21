# Admin Panel Setup Guide

## Database Setup

To set up the CMS database, follow these steps:

1. Go to your Supabase project dashboard: https://0ec90b57d6e95fcbda19832f.supabase.co

2. Navigate to the SQL Editor in the left sidebar

3. Open the `init-database.sql` file in this project

4. Copy the entire SQL content and paste it into the SQL Editor

5. Click "Run" to execute the SQL and create all tables, policies, and sample data

## Accessing the Admin Panel

Once the database is set up, you can access the admin panel at:

```
http://localhost:4321/admin
```

No login is required as requested.

## Features

The admin panel includes:

### Posts Management
- Create, edit, and delete blog posts
- Write content in Markdown format
- Add hero images, excerpts, and SEO metadata
- Assign authors and categories
- Add multiple tags
- Publish or save as draft
- Auto-generate slugs from titles

### Authors Management
- Create and manage blog authors
- Add author bio and avatar
- Each author has a unique slug

### Categories Management
- Create and organize content categories
- Add category descriptions
- Each category has a unique slug

### Tags Management
- Create and manage post tags
- Tag posts for better organization
- Each tag has a unique slug

## Using the CMS

### Creating a New Post

1. Click "Posts" in the sidebar
2. Click "New Post" button
3. Fill in the required fields:
   - Title (required)
   - Slug (auto-generated from title, can be customized)
   - Content in Markdown (required)
4. Optional fields:
   - Excerpt
   - Hero Image URL
   - Author
   - Category
   - Tags (select multiple)
   - Meta Title
   - Meta Description
5. Check "Published" to make the post live
6. Click "Save Post"

### Managing Authors

1. Click "Authors" in the sidebar
2. Click "New Author" to add an author
3. Fill in name, email, slug, bio, and avatar URL
4. Click "Save Author"

### Managing Categories

1. Click "Categories" in the sidebar
2. Click "New Category"
3. Enter category name, slug, and description
4. Click "Save Category"

### Managing Tags

1. Click "Tags" in the sidebar
2. Click "New Tag"
3. Enter tag name and slug
4. Click "Save Tag"

## Markdown Support

The content editor supports full Markdown syntax:

- Headings: `# H1`, `## H2`, etc.
- Bold: `**text**`
- Italic: `*text*`
- Lists: `- item` or `1. item`
- Links: `[text](url)`
- Images: `![alt](url)`
- Code blocks: ` ```language` + code + ` ``` `
- And more!

## Security Notes

Since this CMS has no authentication (as requested), make sure:

1. Only deploy the admin panel to a private URL or protect it at the network level
2. Do not expose `/admin` route in production unless protected
3. Consider adding authentication in the future for production use

## Troubleshooting

### Cannot connect to database
- Check that your `.env` file has the correct Supabase credentials
- Verify the database tables were created successfully

### Changes not showing
- Make sure to click "Save" after editing
- Check the browser console for any errors

### Images not displaying
- Ensure image URLs are publicly accessible
- Use absolute URLs starting with `http://` or `https://`
