# The Remitly Story - Interactive Fintech Case Study

An interactive, scroll-and-click website profiling the fintech company Remitly. This project acts as a cross between data journalism longform and a motion-comic pitch deck.

## Features
- **Cinematic Animations**: Built with Vanilla JS and GSAP for scroll and sequence animations.
- **Data Visualization**: Chart.js for revenue split, growth, and geographic scale.
- **Graceful Fallbacks**: The frontend can operate purely statically via `content.json` or dynamically fetch from a Python/Flask + SQLite backend.
- **Client/Server QR Codes**: Supports QR code generation on both frontend (qrcode.js) and backend (Python `qrcode` library).

## Deployment Instructions

### 1. Static Deploy (Netlify, GitHub Pages, Vercel)
Since this is a Single Page App (SPA) built with vanilla web technologies, you can deploy the frontend out-of-the-box without any build step:
- **Netlify**: Drag and drop the root folder (excluding `/backend`) into Netlify dropzone.
- **GitHub Pages**: Push this directory to your main branch, and enable GitHub pages from `/root`.
- The site will automatically fall back to fetching data from `data/content.json`.

### 2. Full-stack Deploy (Render, Railway)
To utilize the Python/SQL backend layer:
- Deploy the `/backend` folder.
- Ensure the server runs `backend/app.py`.
- **Environment Variables**: Set `SITE_URL` to the URL of your static frontend deploy for accurate server-side QR generation.
- On your static frontend, ensure the fetch requests point to your backend URL if it is not served from the same domain (requires CORS, which is enabled).

## Local Development
To run the full stack locally:
1. Navigate to `backend/` and install requirements: `pip install -r requirements.txt`
2. Seed the database: `python seed_db.py`
3. Run the Flask API: `python app.py` (Runs on port 5000)
4. Start a static server in the root directory (e.g., `python -m http.server 8000`)
5. Open `http://localhost:8000` in your browser.
