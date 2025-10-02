# GitHub Pages Deployment

This repository is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

## Setup Instructions

To enable GitHub Pages deployment for your repository, follow these steps:

1. **Go to your repository on GitHub**
   - Navigate to: https://github.com/ivanbiletskyi/grimwild-ukr

2. **Configure GitHub Pages**
   - Click on **Settings** tab
   - In the left sidebar, click on **Pages**
   - Under **Source**, select **GitHub Actions**

3. **Push changes**
   - The workflow will automatically run when you push to the `main` branch
   - You can also manually trigger it from the **Actions** tab

4. **Access your site**
   - After deployment, your site will be available at:
   - `https://ivanbiletskyi.github.io/grimwild-ukr/`

## Manual Deployment

To manually trigger a deployment:
1. Go to the **Actions** tab in your repository
2. Select the **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Select the `main` branch and click **Run workflow**

## Local Development

For local development, the app will run at the root path:
```bash
cd website
yarn dev
```

The Vite config automatically handles the different base paths for local development (`/`) and GitHub Pages (`/grimwild-ukr/`).

## Troubleshooting

If deployment fails:
- Check the **Actions** tab for error logs
- Ensure GitHub Pages is enabled in repository settings
- Verify that the workflow has the correct permissions (Contents: read, Pages: write)

