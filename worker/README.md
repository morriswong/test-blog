# Decap CMS OAuth Worker Setup

This Cloudflare Worker handles OAuth authentication for Decap CMS with GitHub backend.

## Prerequisites

- Cloudflare account (free tier works)
- Node.js and npm installed
- GitHub account

## Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate with Cloudflare.

## Step 3: Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: `Test Blog CMS` (or any name you prefer)
   - **Homepage URL**: `https://test-blog-8s6.pages.dev`
   - **Application description**: (optional) `OAuth for Decap CMS`
   - **Authorization callback URL**: `https://test-blog-oauth.YOUR-SUBDOMAIN.workers.dev/callback`

     **Note**: You'll need to update this after deploying the worker to get your actual worker URL

4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy the **Client Secret**
7. Save both values - you'll need them in the next step

## Step 4: Deploy the Worker

From the `worker/` directory, run:

```bash
cd worker
wrangler deploy
```

After deployment, you'll see output like:
```
Published test-blog-oauth (X.XX sec)
  https://test-blog-oauth.YOUR-SUBDOMAIN.workers.dev
```

**Save this URL** - you'll need it for the next steps!

## Step 5: Set GitHub Secrets

Set your GitHub OAuth credentials as Worker secrets:

```bash
wrangler secret put GITHUB_CLIENT_ID
# Paste your Client ID when prompted

wrangler secret put GITHUB_CLIENT_SECRET
# Paste your Client Secret when prompted
```

## Step 6: Update GitHub OAuth App Callback URL

1. Go back to your GitHub OAuth App settings: https://github.com/settings/developers
2. Click on your app name
3. Update the **Authorization callback URL** to:
   ```
   https://test-blog-oauth.YOUR-SUBDOMAIN.workers.dev/callback
   ```
   (Replace with your actual Worker URL from Step 4)
4. Click **"Update application"**

## Step 7: Update Decap CMS Config

Edit `static/admin/config.yml` and replace `YOUR-WORKER-URL` with your actual Worker URL:

```yaml
backend:
  name: github
  repo: morriswong/test-blog
  branch: main
  base_url: https://test-blog-oauth.YOUR-SUBDOMAIN.workers.dev
  auth_endpoint: /auth
```

## Step 8: Deploy to Cloudflare Pages

Commit and push your changes:

```bash
git add .
git commit -m "Add Cloudflare Worker OAuth for Decap CMS"
git push
```

Cloudflare Pages will automatically deploy the updated site.

## Step 9: Test the CMS

1. Wait for Cloudflare Pages deployment to complete
2. Visit `https://test-blog-8s6.pages.dev/admin/`
3. Click **"Login with GitHub"**
4. Authorize the OAuth app when prompted
5. You should be redirected back to the CMS dashboard

## Troubleshooting

### "Not Found" error when clicking Login
- Verify the Worker URL in `static/admin/config.yml` matches your deployed Worker
- Check that Worker secrets are set correctly: `wrangler secret list`

### Authorization callback URL mismatch
- Make sure the callback URL in GitHub OAuth App settings matches your Worker URL + `/callback`

### Worker errors
- Check Worker logs: `wrangler tail`
- Verify secrets are set: `wrangler secret list`

### CMS doesn't redirect after login
- Check browser console for errors
- Verify the OAuth flow completes successfully
- Try clearing browser cache and cookies

## Updating the Worker

If you need to make changes to the Worker:

1. Edit `oauth.js`
2. Deploy: `wrangler deploy`
3. No need to update secrets unless they changed

## Worker Endpoints

- `/auth` - Starts the OAuth flow (redirects to GitHub)
- `/callback` - Handles the OAuth callback from GitHub
- `/` - Health check endpoint

## Cost

Cloudflare Workers free tier includes:
- 100,000 requests per day
- 10ms CPU time per request

This should be more than enough for a personal blog CMS.
