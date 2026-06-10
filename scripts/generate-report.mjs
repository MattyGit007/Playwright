// Orchestrates everything behind `npm run cucumber:report`:
//   1. Wipe the old Allure results + report so runs don't accumulate.
//   2. Run the cucumber scenarios (writes fresh results into allure-results/).
//   3. Generate the self-contained, dark-theme Allure report (config: allurerc.mjs).
//   4. Open the report in the default browser.
//
// This is a Node script rather than a one-line npm chain because it needs to:
//   - work the same on Windows / macOS / Linux,
//   - ALWAYS generate the report even when scenarios fail (that's when you want it most),
//   - clean up beforehand.
// The report is single-file (see allurerc.mjs), so there is no web server to start, no
// folder lock, and it opens correctly straight from disk.
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";

const isWin = process.platform === "win32";
const run = (cmd, args) => spawnSync(cmd, args, { stdio: "inherit", shell: isWin });

// 1. Clean — the report is rebuilt from scratch on every run.
rmSync("allure-results", { recursive: true, force: true });
rmSync("allure-report", { recursive: true, force: true });

// 2. Run cucumber WITHOUT trace. stdio:"inherit" attaches it to your real terminal so the green
//    progress dots stream live. We keep its exit code but do NOT stop on failure.
const cucumber = run("npx", ["cucumber-js"], { TRACE: "off" });

// 3. Build the HTML report from the results we just produced.
run("npx", ["allure", "generate", "./allure-results"]);

// 4. Open the single-file report in the default browser (no server needed).
const report = "allure-report/index.html";
if (isWin) spawnSync(`start "" "${report}"`, { stdio: "inherit", shell: true });
else spawnSync(process.platform === "darwin" ? "open" : "xdg-open", [report], { stdio: "inherit" });

// Preserve cucumber's pass/fail exit code (useful for CI).
process.exit(cucumber.status ?? 0);
