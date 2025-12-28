# Chef Brand Frontend

A premium, minimalist frontend for a chef brand website built with HTML5, Tailwind CSS (CDN), and vanilla JavaScript.

Recommended structure (browser-ready, no build tools):

```
/ (project root)
├─ index.html           # Home (built)
├─ about.html           # Brand story (to build)
├─ services.html        # Booking services (to build)
├─ shop.html            # Shop / products (to build)
├─ contact.html         # Contact (to build)
├─ README.md
├─ /js
│  └─ main.js           # All UI interactions
├─ /assets
│  └─ (icons, images)   # Optional local assets; this demo uses Unsplash links
```

Notes:
- Tailwind is loaded via CDN for simplicity with a small `tailwind.config` override.
- Fonts use Google Fonts (serif for headings, sans-serif for body).
- Booking and Checkout are simulated modals (frontend-only).
- Main interactions: mobile menu, modal open/close, form validation, smooth scrolling.

Performance & Production Checklist:
- Replace the CDN Tailwind approach with a local, built CSS file so you can run PurgeCSS (or Tailwind's built-in JIT) to remove unused utility classes and produce a **minified** stylesheet (`styles.min.css`). This typically reduces CSS by >90% for small sites.
- Convert large images to WebP/AVIF and serve responsive widths (use `srcset` and `sizes`) and proper `width`/`height` attributes to avoid CLS. Use an image optimization pipeline (Squoosh, Sharp, or an image CDN like Cloudinary/Imgix).
- Enable GZIP/Brotli compression and long cache headers for static assets (images, CSS, JS) on your web server or CDN.
- Use `rel=preconnect` for fonts and `rel=preload` for critical images (hero/LCP) — implemented in the demo.
- Minify JavaScript (a `js/main.min.js` is included) and load it with `defer` to reduce render-blocking.
- Audit with Lighthouse and WebPageTest; prioritize LCP, TTFB & CLS.

If you want, I can:
- Add an automated image optimization step to the repo (Node.js + Sharp).
- Configure an NPM script to build Tailwind and output a minified CSS file.
- Add `og:` and Twitter meta tags for richer social previews.

How to use:
- Open `index.html` in a browser and test responsiveness.

Scaling notes are included in the comments in the HTML and at the end of the README.
