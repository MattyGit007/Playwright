# Understanding the Key Files in This Project

Welcome! 👋 This document explains the important files in this project and what each one does.
When you open the project for the first time, all these files can look confusing. Don't worry —
by the end of this page you'll know what each one is for and why it's there.

> **Tip:** You don't need to memorise this. Just read it through once, then come back to it
> whenever you see a file you don't recognise.

---

## The "big picture" first

This is a **test automation project** built with **Playwright** (a tool for automatically
controlling a web browser) and written in **TypeScript** (JavaScript with type-checking added).
The tests run against **NBS Source** (`https://source.thenbs.com/`).

A project like this is really just a folder full of files. Some files contain your actual tests,
and others are **configuration** — they tell the tools *how* to behave. Let's go through them.

---

## The most important files

### `package.json` — the heart of your project ❤️

This is the single most important file. Think of it as the **ID card and instruction manual**
for the whole project. It contains:

- **Project details** — the name, version, author, and description.
- **Dependencies** — the list of external tools your project needs. The main ones here are
  `@playwright/test` (Playwright itself), `typescript`, `@types/node` (type information for
  Node.js), `dotenv` (loads secrets from a `.env` file), `eslint` (code quality checks),
  `husky` + `lint-staged` (run those checks automatically before you commit),
  `@cucumber/cucumber` and `allure-cucumberjs` (an alternative Cucumber-style test runner),
  and `@axe-core/playwright` (accessibility testing).
- **Scripts** — handy shortcut commands you can run with `npm run <name>`.

The scripts in this project are:

| Command | What it does |
| ------- | ------------ |
| `npm run test-headless` | Runs the tests in Chromium with no visible browser window. |
| `npm run test-headed` | Runs `NBS-homepage-full-test-set.spec.ts` in Chromium with the browser visible, one test at a time. |
| `npm run test-ui` | Opens Playwright's visual **UI mode**, so you can watch and step through tests. |
| `npm run test-debug` | Runs the tests in Playwright's step-by-step debugger. |
| `npm run test-trace` | Runs the tests in Chromium and records a full trace of every step. |
| `npm run trace` | Opens a recorded trace file in the Trace Viewer. |
| `npm run codegen` | Opens Playwright's code generator pointed at NBS Source, to help you record tests. |
| `npm run test:twice` | Runs the whole suite, and if it fails, runs it a second time. |
| `npm run lint` | Checks all `.ts` files for code-quality problems. |
| `npm run lint:fix` | Same, but automatically fixes what it can. |
| `npm run cucumber:report` | Generates the Allure report for the Cucumber tests. |
| `npm run cucumber:report:trace` | Same, but includes Playwright traces in the report. |

> ⚠️ **Watch the punctuation.** Most scripts here use a **hyphen** (`test-headless`), not a colon.
> Only `test:twice`, `lint:fix`, and the `cucumber:*` scripts use a colon. `npm run test:headless`
> will fail — it has to be `npm run test-headless`.

> **Why it matters:** When someone new clones this project, they run `npm install`, and npm reads
> `package.json` to download exactly the right tools. Everyone ends up with the same setup.

---

### `package-lock.json` — the exact recipe 🔒

You'll rarely edit this file by hand — and that's fine! While `package.json` says *roughly* which
versions you need (e.g. `"@playwright/test": "^1.57.0"` means "version 1.57.0, or any newer 1.x"),
`package-lock.json` records the **exact** versions that were actually installed, right down to the
tiniest sub-dependency.

> **Why it matters:** It guarantees that your machine, your teammate's machine, and the CI server
> all install *identical* versions. This avoids the classic "but it works on my computer!" problem.
> **Rule of thumb:** let the tools update it, and commit it to Git.

---

### `playwright.config.ts` — the control panel for Playwright ⚙️

This is the main configuration file for Playwright. It's where you set the "rules of the game" for
how your tests run. In this project it controls:

- **`testDir: './tests'`** — where your test files live (the `tests` folder).
- **`fullyParallel: false`** — tests within a file run one after another, not at the same time.
- **`forbidOnly: !!process.env.CI`** — fails the build if someone accidentally leaves a
  `test.only(...)` in the code. (`test.only` runs *just* that one test and silently skips the rest,
  which is handy locally and disastrous on the CI server.)
- **`retries: process.env.CI ? 2 : 0`** — on the CI server, automatically re-run a failed test up
  to twice to smooth over occasional flaky failures. Locally, no retries — you want to see the
  failure straight away.
- **`workers: process.env.CI ? 2 : undefined`** — how many test *files* run in parallel. A "worker"
  is like a separate lane on a motorway. On CI it's fixed at 2; locally `undefined` means
  "Playwright picks a sensible number based on my CPU".
- **`reporter: [['html', { open: 'never' }]]`** — after a test run, Playwright builds an HTML report
  in `playwright-report/`. `open: 'never'` stops it from popping open a browser tab automatically.
- **`use: { ... }`** — settings shared by every test:
  - `trace: 'on-first-retry'` — record a detailed step-by-step trace when a test is retried.
  - `screenshot: 'only-on-failure'` — save a screenshot when a test fails.
  - `video: 'retain-on-failure'` — keep the video recording when a test fails.
- **`projects`** — the different browsers to test against: **Chromium** (Chrome), **Firefox**,
  **WebKit** (Safari), and **Microsoft Edge**.
- **`import 'dotenv/config'`** at the top — this loads the `.env` file so your tests can read
  secrets like the NBS login details.

> 📝 **Note:** There is no `timeout` setting in this file, so Playwright's **default of 30 seconds
> per test** applies. If you ever need longer, that's the setting you'd add.

> 💡 **Which browser actually runs?** It depends how you start the tests. `npm run test-headless`
> forces Chromium. The CI server runs **only Microsoft Edge**. Plain `npx playwright test` with no
> flags runs *all four* projects — so each test executes four times.

> **Why it matters:** Instead of repeating settings in every test, you set them **once** here and
> they apply everywhere. Change a setting in this file and it affects the whole test suite.

---

### `tsconfig.json` — the TypeScript rulebook 📘

This file configures **TypeScript**, the language the tests are written in. It tells the TypeScript
tooling how strict to be and which features to allow. In this project it sets `"strict": true`,
which turns on extra safety checks that catch mistakes *before* you even run the tests.

> **Why it matters:** You usually set this up once and forget about it. It quietly helps you write
> safer code by warning you about errors (like a typo in a variable name) as you type.

---

### `tests/` — where your actual tests live 🧪

This folder holds your test files. The main one is:

- **`tests/functional tests/NBS-homepage-full-test-set.spec.ts`** — the Playwright test suite for
  the NBS Source homepage. The `.spec` part of the name signals "this is a test specification".

There is also a second, **separate** set of tests written in a different style using Cucumber:

- **`tests/features/dyson-manufacturer.feature`** — a test written in plain English (Gherkin).
- **`tests/step_definitions/dyson_steps.ts`** — the code that makes each English sentence do
  something.
- **`tests/features/support/world.ts`** — Cucumber's setup file, which opens the browser.

A single test typically follows a simple pattern:
1. **Go** to a web page.
2. **Do** something (click a link, type into a box).
3. **Check** that the result is what you expected.

> **Why it matters:** This is the part you'll spend most of your time in. Everything else in this
> list exists to *support* the files in this folder.

---

### `pages/` — the Page Object Model 📄

Rather than putting selectors like `page.locator('#search-box')` directly in the tests, this project
keeps them in one class per web page:

- **`pages/base-page.ts`** — the parent class that every other page extends.
- **`pages/home-page.ts`** — the NBS Source homepage.
- **`pages/dyson-manufacturer-homepage.ts`** — the Dyson manufacturer page.

> **Why it matters:** When the website changes, you fix the selector in **one** Page Object instead
> of hunting through every test. This pattern is covered properly in
> `Training/02-page-object-model.md`.

---

### `fixtures/test-fixtures.ts` — handing Page Objects to your tests 🎁

A **fixture** is something Playwright sets up for you automatically before each test. This file
creates a fresh Page Object for every test, so your tests never have to write `new HomePage(page)`
themselves.

> ⚠️ **Important:** Because of this, tests in this project import `test` and `expect` from the
> **fixtures file**, *not* from `@playwright/test`. If you import from the wrong place, the Page
> Objects won't be available.

---

## Supporting files (good to know, but you'll touch them less)

### `.gitignore` — the "please ignore these" list 🙈

Git is the tool that tracks changes to your code. But some files and folders should **never** be
saved into Git — like `node_modules/` (the huge folder of downloaded dependencies), the generated
reports (`playwright-report/`, `allure-results/`, `test-results/`), and `.env` (which contains
passwords!). `.gitignore` lists exactly those things so Git leaves them alone.

> **Why it matters:** It keeps your repository small and clean, and stops secrets being published.
> Anyone can regenerate `node_modules` just by running `npm install`.

---

### `.env` — your local secrets 🔑

This file holds the NBS login credentials used by the tests. It is **deliberately not committed to
Git** (see `.gitignore`), so it won't exist when you first clone the project — you'll need to get a
copy from a teammate. `playwright.config.ts` loads it via `import 'dotenv/config'`.

> **Why it matters:** Passwords must never go into a Git repository. On the CI server the same
> values are supplied as **GitHub Secrets** instead.

---

### `.github/workflows/playwright.yml` — the robot that runs your tests 🤖

This file sets up **CI (Continuous Integration)**. It lives inside the special `.github` folder and
tells **GitHub Actions** to automatically run your tests every time code is pushed to `main`/`master`
or a pull request is opened against them. It:

1. Checks out the code and installs Node.js 24.15.0.
2. Runs `npm ci` to install the dependencies.
3. Installs the Microsoft Edge browser.
4. Runs `npx playwright test --project="Microsoft Edge"`, passing in the `NBS_USERNAME` and
   `NBS_PASSWORD` GitHub Secrets.
5. Uploads the `playwright-report/` folder so you can download and read it, kept for 7 days.

> **Why it matters:** You don't have to *remember* to run the tests — GitHub runs them for you on
> every change. If someone breaks something, you find out straight away.

---

### `eslint.config.js` + `.husky/` — automatic code quality 🧹

**ESLint** scans your TypeScript for common mistakes and style problems; `eslint.config.js` holds its
rules. **Husky** hooks into Git so that when you run `git commit`, `lint-staged` automatically runs
ESLint over just the files you changed.

> **Why it matters:** Problems get caught on your machine, before they ever reach a pull request.
> If a commit is unexpectedly rejected, this is usually why — read the error and fix the lint issue.

---

### `FRAMEWORK.md` — the project's welcome page 📖

This project doesn't have a `README.md`. Instead, `FRAMEWORK.md` is the document to read first: it
explains the Page Object Model framework, the folder structure, and how to write a new test.

> **Why it matters:** It's the friendly front door to your project, and the fastest way to
> understand how the pieces fit together before you write your first test.

---

### `scripts/`, `cucumber.js`, `allurerc.mjs` — the reporting setup 📊

`cucumber.js` and `allurerc.mjs` configure the Cucumber test runner and the Allure report. The two
files in `scripts/` are what the `npm run cucumber:report` commands actually execute to build that
report.

> **Why it matters:** You'll only need these if you're working on the Cucumber side of the project.
> The main Playwright suite doesn't use them.

---

### Generated folders — safe to delete 🗑️

`playwright-report/`, `test-results/`, `allure-results/`, `artifacts/`, and `axe-report.html` are all
**output**, created fresh each time you run the tests. They're all in `.gitignore`.

---

### `node_modules/` — the downloaded toolbox 📦

This is a large, auto-generated folder containing all the dependencies from `package.json`. You
**never** edit anything inside it by hand, and (thanks to `.gitignore`) it's never committed to Git.

> **Why it matters:** It's created automatically by `npm install`. If it ever gets corrupted, you
> can safely delete the whole folder and run `npm install` again to rebuild it.

---

## Quick reference cheat sheet

| File / Folder                      | In one sentence                                              |
| ---------------------------------- | ------------------------------------------------------------ |
| `package.json`                     | The heart of the project: details, dependencies, scripts.    |
| `package-lock.json`                | Locks the exact versions so everyone installs the same set.  |
| `playwright.config.ts`             | The control panel for how Playwright runs your tests.        |
| `tsconfig.json`                    | The rulebook for the TypeScript language.                    |
| `tests/`                           | Where your actual test files live.                           |
| `pages/`                           | One class per web page, holding its locators and actions.    |
| `fixtures/test-fixtures.ts`        | Builds the Page Objects and hands them to each test.         |
| `.gitignore`                       | Tells Git which files to ignore.                             |
| `.env`                             | Your local NBS credentials — never committed to Git.         |
| `.github/workflows/playwright.yml` | Automatically runs the tests on GitHub in Edge (CI).         |
| `eslint.config.js` + `.husky/`     | Code-quality checks that run automatically before a commit.  |
| `FRAMEWORK.md`                     | The welcome page explaining how the framework works.         |
| `scripts/`, `cucumber.js`, `allurerc.mjs` | Configuration for the Cucumber tests and Allure report. |
| `node_modules/`                    | The auto-downloaded folder of dependencies.                  |

---

## What to do next

1. Open each file mentioned above and see if you can spot the settings we talked about.
2. Try running the tests with `npm run test-ui` and watch them run in the browser.
3. Read `FRAMEWORK.md`, then move on to `02-page-object-model.md`.

Happy testing! 🎉
