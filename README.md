# Drew Glassman Portfolio

A personal analytics portfolio built with React + Vite.

---

## Deploy: GitHub → Vercel (step by step)

### Step 1: Install prerequisites

Make sure you have these installed on your computer:
- **Node.js** (v18+): https://nodejs.org
- **Git**: https://git-scm.com

You can verify by running:
```bash
node --version
git --version
```

### Step 2: Set up the project locally

Unzip this project folder, open a terminal, and navigate into it:
```bash
cd drew-glassman-portfolio
npm install
```

Test it locally:
```bash
npm run dev
```
Open http://localhost:5173 in your browser to see it running.

### Step 3: Create a GitHub repo

1. Go to https://github.com/new
2. Name it something like `portfolio` (or whatever you want)
3. Keep it **Public** (required for free Vercel hosting)
4. Do NOT initialize with a README (you already have one)
5. Click **Create repository**

### Step 4: Push your code to GitHub

Back in your terminal, run these commands (replace YOUR_USERNAME with your GitHub username):

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

### Step 5: Deploy on Vercel

1. Go to https://vercel.com and sign up with your **GitHub account**
2. Click **"Add New..."** → **"Project"**
3. Find and select your `portfolio` repo
4. Vercel will auto-detect it's a Vite project — no config needed
5. Click **"Deploy"**
6. Wait ~30 seconds — done! You'll get a live URL like `portfolio-abc123.vercel.app`

### Step 6: Custom domain (optional)

1. In Vercel, go to your project → **Settings** → **Domains**
2. Add your custom domain (e.g., `drewglassman.com`)
3. Follow Vercel's instructions to update your DNS records

---

## Updating your site

Any time you push changes to GitHub, Vercel auto-deploys:

```bash
git add .
git commit -m "Added new project"
git push
```

Your live site updates in ~30 seconds.

---

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173
