
# Rustmark Support Links

A private Progressive Web App (PWA) designed for quick and easy access to RustDesk client support links. This tool allows for fast lookup and connection to client devices connected to a private RustDesk server.

---

## Purpose & Privacy

This application is built for internal use to streamline support for your clients. All client IDs and connection details are stored locally within the application's data file (`clients.json`) and are intended for private use only. The application also connects to a private RustDesk server, ensuring that all remote access instances are managed within your secure environment and are not publicly available.

> **Please ensure this repository and deployed PWA remain private.**

## Features

- **Fast Client Lookup:** Instantly search for clients or devices by name.
- **One-Click Connection:** Directly launch RustDesk connections via custom protocol links (e.g., `rustdesk://`) with a single tap or click.
- **Progressive Web App (PWA):**
  - **Installable:** Add to your home screen or desktop for an app-like experience, bypassing the browser's UI.
  - **Offline Access:** Core application content (HTML, CSS, JS, images, and cached client data) is available even without an internet connection.
  - **Fast Loading:** Assets are cached for quick retrieval on subsequent visits.
- **Dark Mode Interface:** A clean, modern, and eye-friendly dark theme.

## Setup & Deployment

This project is a purely client-side Progressive Web App and does not require a separate backend server for its core functionality.

### Project Structure

Ensure your project directory contains the following files:

```
.
├── index.html          # Main application page (HTML structure)
├── style.css           # All application styles (CSS)
├── script.js           # Core application logic (jQuery, search, data rendering, Service Worker registration)
├── clients.json        # Your client data (Name, ID)
├── manifest.json       # PWA manifest file (for app metadata, icons, display mode)
├── sw.js               # Service Worker file (for caching and offline support)
├── browser.png         # Favicon and primary PWA icon (e.g., 512x512px)
└── logo.png            # Your company/brand logo image (used at the top of the app)
```

### `clients.json` Format

The `clients.json` file should be a JSON array of objects. Each object must represent a client and contain at least `NAME` and `ID` properties:

```json
[
  {
    "NAME": "Client A - Main PC",
    "ID": "rustdeskid_for_client_a"
  },
  {
    "NAME": "Client B - Server",
    "ID": "rustdeskid_for_client_b"
  },
  {
    "NAME": "Client C - Laptop",
    "ID": "rustdeskid_for_client_c"
  }
]
```

Ensure the ID matches the RustDesk ID format you expect.

---

## Local Development

Clone the repository:

```bash
git clone YOUR_PRIVATE_REPO_URL
cd rustmark-support-links
```

Serve Locally: To test the PWA capabilities (especially Service Worker), you need a local web server. If you have Python installed, you can use:

```bash
python3 -m http.server 8000
```

Then, open your web browser and navigate to [http://localhost:8000](http://localhost:8000).

---

## Deployment to a Static Hosting Service

This PWA is ideal for deployment on static site hosting platforms. All these services offer free tiers suitable for this application and provide automatic HTTPS, which is required for PWAs.

### Choose a Host:

- **Cloudflare Pages (Recommended):** Excellent performance, integrates directly with your Git repository (GitHub, GitLab, Bitbucket), and offers a generous free tier.
- **Netlify:** Easy to set up, continuous deployment from Git.
- **Vercel:** Developer-friendly, similar to Netlify.
- **GitHub Pages:** Free, direct integration if your repository is on GitHub.

### Connect & Deploy:

1. Push your project files (including `manifest.json` and `sw.js`) to your chosen Git repository.
2. Connect your Git repository to your preferred hosting service's dashboard.
3. The service will automatically detect your static files and deploy your PWA.

---

## Progressive Web App (PWA) Usage for End Users

For the best, app-like experience, you can "install" this web app on your device:

- **On Android (Chrome):** Open the app in Chrome, tap the 3-dot menu (top right), and select **"Add to Home screen"** or **"Install app."**
- **On iOS (Safari):** Open the app in Safari, tap the **Share** icon (the square with an arrow pointing up at the bottom of the screen), and select **"Add to Home Screen."**
- **On Desktop (Chrome/Edge):** Look for the **"Install"** icon (often a plus sign or a computer monitor with a download arrow) in the browser's address bar.

Once installed, the app will launch directly from your home screen/desktop icon, function offline (for previously cached data), and provide a fast, integrated experience.

---

## Updating Clients & App Features

Since this is a static PWA, updates are managed through your Git repository:

- **To add, update, or remove clients:** Modify the `clients.json` file directly in your repository.
- **To update app features, styles, or fix bugs:** Modify `index.html`, `style.css`, or `script.js`.

### To force a PWA update (e.g., after significant changes to core files):

1. Open `sw.js`.
2. Increment the `CACHE_NAME` constant (e.g., from `v1` to `v2`). This tells browsers there's a new version of your PWA to fetch.

**Deployment:** After making changes, commit and push your updates to your Git repository. Your connected hosting service will automatically detect the changes and redeploy the updated PWA. Users will automatically get the new version when they next visit the app (or upon the Service Worker's update cycle).

---

## Credits

Developed by Jeff Parrish's PC Services for private internal support.
