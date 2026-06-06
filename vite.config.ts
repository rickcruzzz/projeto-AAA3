// @lovable.dev/vite-tanstack-config already includes:
//   tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (auto-detects Vercel on Vercel),
//   componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: true,
});