import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./src/sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  /**
   * Auto-generate types when running `sanity dev` / `sanity build`.
   * Manual run: `pnpm typegen`.
   */
  autoUpdates: true,
  typegen: {
    enabled: true,
    path: "./src/**/*.{ts,tsx,js,jsx}",
    schema: "schema.json",
    generates: "./sanity.types.ts",
    overloadClientMethods: true,
  },
});
