import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // Minimal service worker - only cache the essentials
        globPatterns: ["**/*.{js,html,ico,svg}"],
        // More aggressive caching
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/unduck-5cf\.pages\.dev\/\.link\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "unduck-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      manifest: false, // No manifest needed for search engine usage
    }),
  ],
  build: {
    // Optimize build output
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 2, // Run compression twice for better results
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          bangs: ["./src/bang"],
        },
        // Optimize chunk names
        entryFileNames: "[name].[hash].js",
        chunkFileNames: "[name].[hash].js",
      },
    },
    // Target modern browsers for smaller output
    target: "es2020",
    // Source maps only for dev
    sourcemap: false,
    // Increase chunk size limit to suppress warning
    chunkSizeWarningLimit: 3000,
  },
});
