import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    /*
     * Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
     * Prevent vite from obscuring rust errors
     */
    clearScreen: false,
    // Tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
    },
    /*
     * To make use of `TAURI_DEBUG` and other env variables
     * https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
     */
    envPrefix: ["VITE_", "TAURI_"],
    build: {
    // Tauri supports es2021
        target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari14", // See https://react.fluentui.dev/?path=/docs/concepts-developer-browser-support-matrix--page
        // Don't minify for debug builds
        minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
        // Produce sourcemaps for debug builds
        sourcemap: !!process.env.TAURI_DEBUG,
    }
});
