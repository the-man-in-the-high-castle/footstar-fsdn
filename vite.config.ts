import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/community/fsdn/",
  plugins: [react()],
  resolve: {
    alias: {
      "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap")
    }
  },
  server: {
    //open: true,
    port: 8080,
    host: true,
    proxy: {
      // "/api/players": {
      //   target:
      //     "https://nd.footstar.org/community/fsdn_api.asp?method=squad&x=1",
      //   changeOrigin: true,
      //   headers: { "X-Fs-Header": "on" }
      // },
      "/community/fsdn_api.asp": {
        target: "https://nd.footstar.org",
        changeOrigin: true,
        headers: { "X-Fs-Header": "on" }
      }
    }
  },
  build: {
    outDir: "C:/inetpub/wwwroot/footstar_newdesign/community/fsdn",
    sourcemap: true,
    emptyOutDir: true
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true
  }
});
