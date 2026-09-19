# A Letter For You — Dearest Sir 💌

An intimate digital letter web page featuring a video envelope opening animation, high-resolution letter display, and smooth reverse folding animation.

## 📁 Files for GitHub Pages Deployment

All the necessary static web files are placed directly in this root directory:

- `index.html` — The main webpage entry point.
- `style.css` — Responsive styling and seamless transitions.
- `script.js` — Interactive touch controller (forward opening & reverse closing).
- `letterns.png` — The high-resolution letter artwork.
- `nscardani.mp4` — The forward opening video animation.
- `nscardanirev.mp4` — The reverse closing video animation.
- `.nojekyll` — Ensures all media and assets are served properly on GitHub Pages without Jekyll processing.

---

## 🚀 How to Publish to GitHub Pages

1. **Push this repository to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit: Digital Letter Web Page"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click on **Settings** (⚙️) tab.
   - On the left sidebar, click on **Pages**.
   - Under **Build and deployment > Branch**:
     - Select branch: `main`
     - Select folder: `/ (root)`
   - Click **Save**.

3. **View your live website**:
   - Within 1–2 minutes, GitHub will provide you with a live link:
     `https://<YOUR_USERNAME>.github.io/<YOUR_REPO_NAME>/`

---

## 💻 Local Preview with Node.js (Optional)

If you want to run it locally with Node.js at any time:
```bash
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
