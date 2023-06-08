import react from "@vitejs/plugin-react";
import path from "path";
import { Plugin, ResolvedConfig, loadEnv } from "vite";
import { defineConfig } from "vitest/config";
//@ts-ignore
import { dependencies } from "./package.json";

const mainVendors = [
  "react",
  "react-router-dom",
  "react-dom",
  "react-redux",
  "@reduxjs/toolkit",
  "i18next",
  "react-i18next",
  "i18next-http-backend",
  "i18next-browser-languagedetector",
  "i18next-http-backend"
];

export const baseConfig = ({ command, mode }) => {
  console.log("command", command, mode);
  const env = loadEnv(mode, process.cwd(), "");

  const plugins = react();
  if (command === "build") plugins.push(fixEnsureWatchPlugin());

  return {
    define: { __APP_ENV__: env.APP_ENV },
    plugins,
    resolve: {
      alias: { "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap") }
    },
    server: { port: 8081, host: false, https: false },
    build: {
      outDir: "build",
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: mainVendors,
            ...renderChunks(dependencies)
          }
        }
      }
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "src/setupTests",
      mockReset: true
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(baseConfig);

function renderChunks(deps: Record<string, string>) {
  return Object.keys(deps).reduce((chunks, key) => {
    if (!mainVendors.includes(key)) chunks[key] = [key];
    return chunks;
  }, {});
}

// fix watch problem
function fixEnsureWatchPlugin(): Plugin {
  return {
    name: "read-config",
    apply: "build",

    configResolved(resolvedConfig: ResolvedConfig) {
      const ensureWatchPlugins = resolvedConfig.plugins.filter(
        (p) => p.name === "vite:ensure-watch"
      );

      ensureWatchPlugins.forEach((p) => {
        const orgLoad = p.load as Function;
        p.load = function (id) {
          if (id.endsWith("?commonjs-entry")) return null;
          return orgLoad.bind(this)(id);
        };
      });
    }
  };
}
