// Force coloured formatter output even when stdout is a pipe rather than a real terminal,
// so the green progress dots keep their colour in every context.
// (We only set a default; an explicit FORCE_COLOR from the environment still wins.)
process.env.FORCE_COLOR = process.env.FORCE_COLOR || "1";

// A throwaway file in the OS temp dir (outside the repo). We point the Allure formatter's
// unused text stream here — see the note on `format` below. Using a temp file rather than
// the OS null device avoids Windows' reserved-name "NUL" quirks and keeps the repo clean.
const path = require("node:path");
const os = require("node:os");
const ALLURE_STREAM_SINK = path.join(os.tmpdir(), "cucumber-allure-stream.log");

module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["tests/features/support/*.ts", "tests/step_definitions/*.ts"],
    paths: ["tests/features/*.feature"],
    // Two formatters run together:
    //  - "allure-cucumberjs/reporter" writes raw result files into allure-results/ (the
    //    folder comes from formatOptions.resultsDir below). `allure generate` then turns
    //    those into the HTML report.
    //  - "progress" prints the classic green dots in the terminal (one . per passed step).
    //
    // THE CATCH: every cucumber formatter also has a text output stream that defaults to
    // stdout. If two formatters both default to stdout, cucumber silently keeps only one
    // and DROPS the other — which previously dropped Allure, so no results were written.
    // The Allure reporter never actually uses its text stream (it writes files instead),
    // so we redirect that stream to the OS null device. That leaves stdout solely to
    // "progress", and both formatters run.
    format: [`allure-cucumberjs/reporter:${ALLURE_STREAM_SINK}`, "progress"],
    formatOptions: {
      resultsDir: "allure-results",
    },
  },
};
