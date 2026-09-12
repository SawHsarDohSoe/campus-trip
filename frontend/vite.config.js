import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

import tailwindcss from "@tailwindcss/vite";

import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  const isGitHubPages = process.env.GITHUB_PAGES === "true";
  const base = isGitHubPages ? "/campus-trip/" : "/";
  const publicUrl = (fileName) => `${base}${fileName}`;

  return {
    base,
    plugins: [
    react(),

    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "campustrip-rocket.svg",
        "icons.svg",
        "campustrip-rocket-192.png",
        "campustrip-rocket-512.png",
        "campustrip-rocket-maskable-512.png",
      ],
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        navigateFallback: `${base}index.html`,
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "campustrip-google-font-stylesheets",
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//i,
            handler: "CacheFirst",
            options: {
              cacheName: "campustrip-google-font-files",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },

      manifest: {
        id: base,
        name: "CampusTrip",
        short_name: "CampusTrip",
        description: "Campus trip planning application for students.",
        theme_color: "#1E3A8A",
        background_color: "#EFF6FF",
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone"],
        start_url: base,
        scope: base,
        orientation: "any",
        lang: "en",
        categories: ["travel", "productivity", "education"],

        icons: [
          {
            src: publicUrl("campustrip-rocket-192.png"),
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: publicUrl("campustrip-rocket-512.png"),
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: publicUrl("campustrip-rocket-maskable-512.png"),
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Dashboard",
            short_name: "Home",
            description: "Open your CampusTrip dashboard",
            url: publicUrl("dashboard"),
            icons: [{ src: publicUrl("campustrip-rocket-192.png"), sizes: "192x192" }],
          },
          {
            name: "My Trips",
            short_name: "Trips",
            description: "View your trips",
            url: publicUrl("trips"),
            icons: [{ src: publicUrl("campustrip-rocket-192.png"), sizes: "192x192" }],
          },
          {
            name: "Join Trip",
            short_name: "Join",
            description: "Join a trip with a six-digit code",
            url: publicUrl("join-trip"),
            icons: [{ src: publicUrl("campustrip-rocket-192.png"), sizes: "192x192" }],
          },
        ],
      },
      }),
    ],
  };
});
