import { spawn } from "node:child_process";
import path from "node:path";

const args = process.argv.slice(2);
const astroBin = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "astro.cmd" : "astro"
);

const child = spawn(astroBin, args, {
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: "1"
  },
  shell: process.platform === "win32",
  stdio: "inherit"
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
