# Colombo Court Hotel & Spa — GitHub Pages preview

A preview copy of the website, prepared for internal review by the GM and the
owners. It is **not** the deployment copy for the live server.

Live preview once uploaded: **https://colombocourt.github.io/web/**

---

## Why this copy exists

The site's own copy (`Desktop\Claude\colombo-court`) is written for a site that
sits at the **root of a domain**, so its navigation links look like this:

    <a href="/wellness/">

On `colombocourt.github.io` the site does not sit at the root — it sits inside
the repository's folder, `/web/`. So the browser read `/wellness/` as
`colombocourt.github.io/wellness/`, which does not exist, and GitHub returned
404. That is exactly the error you saw.

In this copy every one of those links has been rewritten to include the folder:

    <a href="/web/wellness/">

Nothing else about the site was changed. The original folder was not touched.

---

## What is different from the live copy

| Change | Reason |
|---|---|
| Every root-relative `href` / `src` / `srcset` now begins `/web/` | So links resolve inside the repository folder |
| `assets/js/blog.js` builds `/web/blog/<slug>/` URLs | The blog loads articles with JavaScript and rewrites the address bar |
| `site.webmanifest` `start_url` is `/web/` | Matches the preview location |
| `.nojekyll` added | Stops GitHub's Jekyll step from touching the files |
| `robots.txt` disallows everything | A preview copy must never be indexed and compete with the real site |
| `api/` folder and `.htaccess` removed | PHP and Apache rules do not run on GitHub Pages |
| `capiEndpoint` blanked in `assets/js/main.js` | Its PHP relay is not present here, so nothing calls a dead URL |
| `_backup-v1/`, `blog/_src/`, `blog/_tpl/`, blog build scripts removed | Working files, not part of the site |

Analytics stay switched off, as on the live copy: the GA4, Clarity and Meta
Pixel IDs are still empty, so the preview collects nothing.

The `<link rel="canonical">` tags still point at `www.colombocourthotel.com`.
That is deliberate and correct — it tells search engines the real site is the
original.

---

## How to upload it

### The simple way, in the browser

1. Go to **https://github.com/colombocourt/web**
2. On the repository's main page click **Add file → Upload files**. The files
   already there will be replaced by the new ones of the same name, so there is
   nothing to delete first.
3. Open this folder, select **everything inside it** — all the files and all the
   folders, not the folder itself — and drag them onto the page.
   GitHub's web uploader takes 100 files at a time, so you may need two or three
   passes. `assets/img` alone holds several hundred images.
4. Write "Preview site for review" in the commit box and click **Commit changes**.
5. Go to **Settings → Pages**. Under "Build and deployment" set
   **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/ (root)`**,
   and click **Save**.
6. Wait two or three minutes, then open **https://colombocourt.github.io/web/**

### The faster way, with Git

If Git is installed, this uploads all 548 files in one go:

```bash
cd "C:/Users/User/OneDrive - Colombo Court Hotel and Spa/Desktop/colombo-court-github"
git init
git add -A
git commit -m "Preview site for review"
git branch -M main
git remote add origin https://github.com/colombocourt/web.git
git push -u origin main --force
```

Then do step 6 above.

---

## One thing to watch

The `/web/` in the links is the **repository's name**. It works because the
repository is called `web`.

- Rename the repository, and every link breaks again.
- Move this to the real domain, and the links break too — because there the site
  *does* sit at the root.

So: use this copy for GitHub only. When the site goes live on
`colombocourthotel.com`, upload the original folder
(`Desktop\Claude\colombo-court`), which is already correct for a domain root.

---

## Checks already run on this copy

Served locally at a `/web/` path and crawled end to end:

- 34 pages crawled, 453 assets requested — **0 broken links, 0 missing files**
- Navigation clicked through in a real browser: home → Wellness → Stay → Blog
- Blog articles open inline and the address bar updates correctly
- Article deep links (e.g. `/web/blog/high-tea-in-colombo/`) load directly
- Browser Back works after opening an article
- A wrong address shows the site's own styled "This door does not lead
  anywhere" page, with its images and fonts intact
- No JavaScript errors in the console
- Mobile (375px) and desktop layouts both render
- Total size 74.8 MB, largest single file 2.6 MB — inside GitHub's limits
