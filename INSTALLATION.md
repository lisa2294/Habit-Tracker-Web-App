# Installation Guide

This guide gets the finished Habit app running locally and explains the required GitHub Pages setup.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** `20.19+` or `22.12+` — [download Node.js](https://nodejs.org/)
- **npm** (included with Node.js)
- **Git** — [download Git](https://git-scm.com/)

You can check your versions by running:
```bash
node --version
npm --version
git --version
```

## Quick Start

1. **Clone the finished repository**. Copy the raw URL, not a Markdown link:
   ```bash
   git clone https://github.com/lisa2294/Habit-Tracker-Web-App.git
   cd Habit-Tracker-Web-App
   ```

2. **Install the locked dependency versions**:
   ```bash
   npm ci
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open the exact URL printed by Vite**, normally:
   `http://localhost:5173/Habit-Tracker-Web-App/`

Keep that terminal running while using the app. Stop it with `Control+C`.

## Alternative Installation Methods

### Using GitHub CLI (if installed)
```bash
gh repo clone lisa2294/Habit-Tracker-Web-App
cd Habit-Tracker-Web-App
npm ci
npm run dev
```

### Download ZIP (without Git)
1. Go to the [GitHub repository](https://github.com/lisa2294/Habit-Tracker-Web-App)
2. Click the **"Code"** button → **"Download ZIP"**
3. Extract the ZIP file
4. Open terminal in the extracted folder
5. Run `npm ci`, followed by `npm run dev`

## Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` folder. You can serve them using any static file server:

```bash
npm run preview
```

## Troubleshooting

### Common Issues

**`npm ci` fails**
- Confirm that `node --version` is `20.19+` or `22.12+`.
- Confirm that you are inside the folder containing `package.json`.
- Keep `package-lock.json`; it is what makes classroom installs reproducible.
- If an interrupted install left a partial folder, remove only `node_modules`, then run `npm ci` again.

**Port 5173 is already in use**
- The dev server will automatically use the next available port
- Or specify a different port: `npm run dev -- --port 3000`

**"command not found: npm"**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal/command prompt

**The app does not load at `/`**
- Check that the terminal shows "ready in XXXms"
- Use the full path printed by Vite: `/Habit-Tracker-Web-App/`
- If you changed the repository name, update `base` in `vite.config.js` to match

**The build fails**
- Ensure all dependencies are installed
- Run `npm run lint` first to expose code errors
- Check that you're in the correct directory

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Offline Usage

Since this app uses localStorage for data storage, it works completely offline once loaded. No internet connection is required for core functionality after the initial setup.

## Deploying to GitHub Pages

The app is configured for automatic deployment to GitHub Pages.

### Automatic Deployment (Recommended)

1. **Enable GitHub Pages**:
   - Go to your repository **Settings** → **Pages**
   - Under **Build and deployment → Source**, select **GitHub Actions**
   - This step is required before the included workflow can deploy successfully

   GitHub Pages availability for a private repository depends on the account plan. If students need public access, deliberately make the repository public or use another hosting provider; do not change visibility accidentally.

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Wait for deployment** (2-3 minutes):
   - Check the **Actions** tab to monitor progress
   - Your site will be live at: `https://YOUR_USERNAME.github.io/Habit-Tracker-Web-App/`

The repository name and `base` in `vite.config.js` must match. For this project the base is `/Habit-Tracker-Web-App/`.

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# The built files are in the dist/ folder
# Upload these to your hosting provider
```

### Deployment to Other Platforms

**Vercel**:
```bash
npm install -g vercel
vercel
```

**Netlify**:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Static File Hosting**:
Upload the contents of the `dist/` folder to any static hosting service (AWS S3, Cloudflare Pages, etc.)

For the complete classroom workflow, including design prompts, responsive checks, frontend MVP scoping, Paper handoff, and GitHub publishing, see the [student demo guide](docs/student-demo-guide.md).
