import { build } from "esbuild";

await build({
    entryPoints: ["src/main.ts"],
    bundle: true,
    format: "iife",
    platform: "browser",
    target: ["es2020"],
    outfile: "dist/app.js",
    sourcemap: true
});
