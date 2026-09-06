# Cloudflare Pages Deployment Runbook

This runbook outlines the steps to build, configure, and deploy the Sudoku Progressive Web App (PWA) to Cloudflare Pages.

---

## 1. Overview & Architecture

- **Hosting Platform**: Cloudflare Pages
- **Build Output**: Static assets bundled into `dist/` by Vite
- **PWA Service Worker**: Generated via `vite-plugin-pwa` (`dist/sw.js` and `manifest.webmanifest`)
- **CLI Tooling**: `wrangler` (v4+)

---

## 2. Prerequisites

1. **Node.js**: v20+ recommended
2. **Package Manager**: `npm`
3. **Cloudflare Account**: [dash.cloudflare.com](https://dash.cloudflare.com/)

---

## 3. Cloudflare Authentication & API Token Setup

To deploy non-interactively or via CI/CD, create a dedicated Cloudflare API Token:

### Creating the Token
1. Go to **[My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)**.
2. Click **Create Token** → scroll to the bottom and click **Create Custom Token**.
3. Name the token (e.g. `sudoku-pages-deploy`).
4. Configure **Permissions**:
   - `Account` → `Cloudflare Pages` → **Edit**
   - `Account` → `Account Settings` → **Read**
5. Configure **Account Resources**:
   - **Include** → `All accounts` (or your specific account).
6. Click **Continue to summary** → **Create Token** and copy the secret token string.

### Environment Variables
For automated deploys or CI/CD pipelines, expose the following environment variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | Custom API Token created above | `abc123...` |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID | `c18f2a0808e2f652551b260fdeca0918` |

---

## 4. Initial Project Creation

Before your first deployment, the Pages project container must exist in your Cloudflare account.

Run this command once:
```bash
npx wrangler pages project create sudoku-pwa --production-branch main
```

*(This has already been completed for the default `sudoku-pwa` deployment).*

---

## 5. Local Deployment (CLI)

To manually build and deploy from your local workstation:

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build the Production Bundle
```bash
npm run build
```
This runs TypeScript checking and Vite compilation, generating production files in `dist/`.

### Step 3: Deploy to Cloudflare Pages
```bash
npm run deploy
```
*(Or invoke wrangler directly)*:
```bash
npx wrangler pages deploy dist --project-name=sudoku-pwa
```

---

## 6. Continuous Deployment (CI/CD)

### Option A: Cloudflare Pages Git Integration (Recommended)
1. In Cloudflare Dashboard, navigate to **Compute (Workers) / Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Select repository `sybilsedge/sudoku`.
3. Configure Build Settings:
   - **Framework Preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Production branch**: `main`
4. Deploy! Cloudflare will automatically build and deploy every push to `main`.

### Option B: GitHub Actions Workflow
If you prefer deploying via GitHub Actions, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=sudoku-pwa
```

---

## 7. Troubleshooting & FAQ

### Error: `Authentication error [code: 10000]`
- **Cause**: The API token lacks `Cloudflare Pages: Edit` permissions or is scoped to a Zone instead of Account.
- **Fix**: Edit the token in the Cloudflare Dashboard to ensure `Account → Cloudflare Pages → Edit` is granted.

### Error: `The Pages project "sudoku-pwa" does not exist`
- **Cause**: Deploying before the project container is registered.
- **Fix**: Run `npx wrangler pages project create sudoku-pwa --production-branch main`.

### Service Worker & Cache Updates
- The app uses `vite-plugin-pwa` with `registerType: 'autoUpdate'`.
- When a new build is deployed, clients will fetch updated assets upon subsequent page visits or background service worker cache invalidation.
