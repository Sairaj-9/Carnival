# The Carnival Restaurant menu

This is a small Vue 2 + Vite website. The menu data stays in `menu.json`; the page reads it with `fetch('/menu.json')`. The Vue layout, interactions, and styles live together in `src/App.vue` to match this project setup.

## Run locally

Open a terminal in this folder and run:

```sh
npm install
npm run dev
```

Open the local address printed by Vite. The site must run from a local web server so the browser can fetch `menu.json`; opening `index.html` directly as a file will not work.

## Update menu items and prices

Edit `menu.json` and keep its JSON syntax valid. Each category contains sections, and each section contains `items`.

- For a regular price, change the item's `price` number.
- For Half/Full prices, edit the numbers in `variants` and keep their labels.
- For an unpriced item, keep `price: null` and its `priceNote`.
- When adding an item, include its `name`, `veg` value, price fields, and `special` value. The website uses those values for the diet dot, price, and Carnival Special tag.
- Keep item names and prices as printed on the restaurant's menu.

## Add or replace food images

Put image files in `public/assets/images/`. These files are served by Vite at `/assets/images/<filename>` and copied into the production build. The current photos are WebP images supplied for this menu.

- Hero slideshow paths are in `restaurant.heroImages`.
- Each category has an `image` path, or `null` when it has no photo. Categories without a photo use the orange gradient treatment.
- Categories with separate Veg and Non-Veg photos also have `image` paths on their section objects.
- To replace a photo, copy the new file into `public/assets/images/` and update the matching `image` path in `menu.json`. Keep the file name and extension in sync.

The orange Carnival Special dish cards use their category image; food photos are not assigned to individual dishes.

## Publish for free

For Netlify, run `npm run build` and deploy the generated `dist/` folder. Netlify can also connect to a Git repository with build command `npm run build` and publish directory `dist`.

GitHub Pages can host the built `dist/` output too. If the site is published below a repository subpath, configure Vite's `base` in `vite.config.js` to match that path before building so image and menu URLs resolve correctly.

## Owner follow-up

Please confirm what “APS” means on the printed menu. It may mean “as per size” or “market price,” but that is not confirmed.
