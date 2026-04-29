import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const backendUrl =
    process.env.VITE_API_BASE_URL ||
    env.VITE_API_BASE_URL ||
    "http://localhost:4000";

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
        },
        "/socket.io": {
          target: backendUrl,
          ws: true,
        },
      },
    },

    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes("node_modules")) return;

            if (id.includes("framer-motion")) return "motion";
            if (id.includes("@dnd-kit")) return "dnd";
            if (
              id.includes("socket.io-client") ||
              id.includes("engine.io-client")
            )
              return "socket";

            if (
              id.includes("@reduxjs") ||
              id.includes("react-redux") ||
              id.includes("redux-persist")
            )
              return "state";

            if (id.includes("react-dom") || id.includes("react/"))
              return "react";

            if (id.includes("react-icons")) return "icons";

            return "vendor";
          },
        },
      },
    },

    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
    },
  };
});
