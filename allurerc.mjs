// Allure Report configuration.
// Docs: the "awesome" plugin is Allure 3's default modern report UI.
/** @type {import("@allurereport/plugin-api").Config} */
export default {
  name: "Cucumber Report",
  output: "allure-report",
  plugins: {
    awesome: {
      options: {
        // Open the report in night mode by default. ("light" | "dark" | "auto")
        theme: "dark",
        // Inline everything into a single self-contained index.html. This means the
        // report opens correctly by just opening the file (no web server needed), which
        // avoids the file:// "blank report" problem AND the server-locks-the-folder EPERM.
        singleFile: true,
      },
    },
  },
};
