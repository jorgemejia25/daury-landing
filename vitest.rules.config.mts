import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)), "@content": fileURLToPath(new URL("./content", import.meta.url)) } },
  test: { environment: "node", include: ["tests/firestore*.test.ts"], fileParallelism: false, testTimeout: 25000, hookTimeout: 30000 },
});
