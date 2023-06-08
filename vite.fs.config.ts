import { UserConfigExport, defineConfig } from "vitest/config";
import { baseConfig } from "./vite.config";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const cfg: UserConfigExport = baseConfig({ command, mode });

  cfg.base = "/community/fsdn";
  cfg.build = {
    ...cfg.build,
    outDir: "C:/inetpub/wwwroot/footstar_newdesign/community/fsdn",
    emptyOutDir: true
  };

  return cfg;

  // cfg.plugins ??= [];
  // cfg.plugins
  //   .push
  //   //splitVendorChunkPlugin(),
  //   // visualizer({
  //   //   template: "treemap", // or sunburst
  //   //   open: false,
  //   //   gzipSize: true,
  //   //   brotliSize: true,
  //   //   filename: "build/analyse.html" // will be saved in project's root
  //   // }) as PluginOption
  //   ();
  //     proxy: {
  //       "/img": {
  //         target: "https://nd.footstar.org",
  //         changeOrigin: true
  //       }
  //     }
  //   },
});
