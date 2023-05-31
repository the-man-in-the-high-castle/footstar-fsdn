import react from "@vitejs/plugin-react";
import path from "path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: { __APP_ENV__: env.APP_ENV },
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
      https: true,
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
        },
        "/**/*.asp": {
          target: "https://nd.footstar.org"
        },
        "/img/**": {
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
  };
});
