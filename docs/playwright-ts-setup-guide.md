# Playwright TypeScript — New Project Setup Guide

A step-by-step guide to creating a brand new Playwright project with TypeScript from scratch.

---

## Step 1 — Install Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** v18 or higher — [Download here](https://nodejs.org/)
- **npm** (comes bundled with Node.js)
- **VS Code** — [Download here](https://code.visualstudio.com/) *(recommended)*

Verify Node.js is installed correctly:

```bash
node -v
npm -v
```

You should see version numbers printed for both. If not, install Node.js first before continuing.

---

## Step 2 — Create a New Project Folder

Create a folder for your project and navigate into it:

```bash
mkdir my-playwright-project
cd my-playwright-project
```

---

## Step 3 — Scaffold the Playwright Project

Run the official Playwright init command. This sets up everything automatically:

```bash
npm init playwright@latest
```

The setup wizard will ask you a series of questions. Answer them as follows:

| Prompt | Recommended Answer |
|---|---|
| Do you want to use TypeScript or JavaScript? | **TypeScript** |
| Where to put your end-to-end tests? | `tests` *(press Enter for default)* |
| Add a GitHub Actions workflow? | `false` *(unless you need CI now)* |
| Install Playwright browsers? | `true` |

The wizard installs `@playwright/test`, downloads Chromium, Firefox, and WebKit browsers, and generates a starter config and example test.

---

## Step 4 — Understand the Project Structure

After scaffolding, your project will look like this:

```
my-playwright-project/
├── tests/
│   └── example.spec.ts       ← Sample test file
├── playwright.config.ts      ← Global test configuration
├── package.json
└── package-lock.json
```

Two additional folders are generated when you run tests:

```
├── test-results/             ← Failure artifacts (screenshots, traces)
└── playwright-report/        ← HTML test report
```

---

## Step 5 — Open in VS Code

Open the project in VS Code:

```bash
code .
```

Then install the **Playwright Test for VS Code** extension. Search for `Playwright` in the Extensions panel (⇧⌘X on Mac / Ctrl+Shift+X on Windows). This gives you the ability to run, debug, and record tests directly from the editor.

---

## Step 6 — Review the Config File

Open `playwright.config.ts`. This is the central place to control how all your tests run:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',           // Where your tests live
  fullyParallel: true,          // Run tests in parallel
  retries: process.env.CI ? 2 : 0, // Retry on CI only
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',             // HTML report at playwright-report/index.html

  use: {
    baseURL: 'http://localhost:3000', // ← Update this to your app's URL
    trace: 'on-first-retry',         // Record trace on first retry
    screenshot: 'only-on-failure',   // Screenshot on failure
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

> **Tip:** Update `baseURL` to your app's local URL (e.g. `http://localhost:3000`) so you can use short relative paths like `page.goto('/')` in your tests instead of full URLs.

---

## Step 7 — Run the Example Test

Before writing anything, run the included example test to confirm everything is working:

```bash
npx playwright test
```

You'll see output like:

```
Running 6 tests using 6 workers

  6 passed (10s)
```

The example test runs against `https://playwright.dev/` across all three browsers. To run in just one browser while learning:

```bash
npx playwright test --project=chromium
```

---

## Step 8 — View the HTML Report

After running tests, open the visual report:

```bash
npx playwright show-report
```

This opens a browser window showing passed/failed tests, timings, screenshots, and traces. You'll use this regularly to investigate failures.

---

## Step 9 — Write Your First Test

Create a new file at `tests/first-test.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link works', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/.*intro/);
});
```

Run just this file:

```bash
npx playwright test tests/first-test.spec.ts
```

### What each part means

**`test(name, callback)`** — Defines a single test. The callback receives a `{ page }` fixture automatically injected by Playwright.

**`page.goto(url)`** — Navigates the browser to a URL.

**`expect(...).toHaveTitle()`** — An assertion that automatically waits and retries until it passes or times out. No manual waits needed.

**`async/await`** — All Playwright methods are asynchronous. Always `await` them or you'll get unexpected results.

---

## Step 10 — Use Codegen to Record Tests

Instead of writing locators by hand, let Playwright watch what you do and generate the code for you:

```bash
npx playwright codegen https://playwright.dev/
```

A browser window and a code panel open side-by-side. Click around the site and watch TypeScript code appear in real time. Copy what you need into your test file.

---

## Locators — Finding Elements

Playwright encourages user-facing, accessible locators. Prefer these in order:

```typescript
// By role (preferred — mirrors how users/screen readers see the page)
page.getByRole('button', { name: 'Submit' })
page.getByRole('link', { name: 'Home' })
page.getByRole('textbox', { name: 'Email' })

// By label (great for form inputs)
page.getByLabel('Password')

// By placeholder text
page.getByPlaceholder('Search...')

// By visible text
page.getByText('Welcome back')

// By test ID (use data-testid attribute in your HTML)
page.getByTestId('submit-button')

// CSS selector (last resort fallback)
page.locator('.my-class')
page.locator('#my-id')
```

**Best Practice:** Prefer `getByRole`, `getByLabel`, and `getByTestId` over CSS selectors. They are more resilient to UI changes.

---

## Common Actions

```typescript
// Navigation
await page.goto('https://example.com');
await page.goBack();
await page.reload();

// Clicking
await page.getByRole('button', { name: 'Sign In' }).click();
await page.getByRole('link', { name: 'About' }).click();

// Typing
await page.getByLabel('Username').fill('john@example.com');
await page.getByLabel('Password').fill('secret123');

// Selecting from dropdowns
await page.getByLabel('Country').selectOption('Australia');

// Checking checkboxes
await page.getByLabel('Remember me').check();

// Keyboard shortcuts
await page.keyboard.press('Enter');
await page.keyboard.press('Tab');

// Hovering
await page.getByRole('button', { name: 'Menu' }).hover();

// Waiting for an element to disappear
await page.waitForSelector('.loading', { state: 'hidden' });
```

---

## Assertions

Playwright assertions automatically wait (retry) until they pass or time out. No `sleep()` needed.

```typescript
// Page assertions
await expect(page).toHaveTitle('My App');
await expect(page).toHaveURL('https://example.com/dashboard');

// Element assertions
await expect(page.getByRole('heading')).toBeVisible();
await expect(page.getByText('Error')).not.toBeVisible();
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
await expect(page.getByRole('button', { name: 'Loading' })).toBeDisabled();
await expect(page.getByLabel('Email')).toHaveValue('user@example.com');
await expect(page.getByRole('list')).toContainText('Item 1');

// Count elements
await expect(page.getByRole('listitem')).toHaveCount(5);
```

---

## Running Tests

```bash
# Run all tests (headless by default)
npx playwright test

# Run with browser UI visible
npx playwright test --headed

# Run a specific file
npx playwright test tests/login.spec.ts

# Run tests matching a name
npx playwright test --grep "login"

# Run in a specific browser
npx playwright test --project=chromium

# Run in interactive UI mode (great for debugging)
npx playwright test --ui

# Debug a specific test (step through with DevTools)
npx playwright test --debug

# Run last failed tests only
npx playwright test --last-failed
```

---

## Test Hooks and Organization

Use `beforeEach` to share setup logic across tests in a file:

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Runs before every test in this file
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
});

test('can view dashboard', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('can view profile', async ({ page }) => {
  await page.getByRole('link', { name: 'Profile' }).click();
  await expect(page).toHaveURL('/profile');
});
```

### Grouping Tests

```typescript
test.describe('Authentication', () => {
  test('shows error on wrong password', async ({ page }) => { ... });
  test('redirects to dashboard on success', async ({ page }) => { ... });
});
```

---

## Page Object Model (POM)

As your test suite grows, encapsulate page interactions into reusable classes:

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  await expect(page).toHaveURL('/dashboard');
});
```

---

## Tracing and Debugging

### Pause Execution for Debugging

Insert `page.pause()` into any test to freeze execution and open Playwright Inspector:

```typescript
test('debug me', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // Opens Playwright Inspector — step through from here
});
```

### Enable Trace Recording

In `playwright.config.ts`, set the trace level under `use`:

```typescript
use: {
  trace: 'on-first-retry',       // Record on first retry (recommended default)
  // trace: 'on',                // Always record
  // trace: 'retain-on-failure', // Keep only on failure
}
```

### View a Trace

```bash
npx playwright show-trace test-results/path-to/trace.zip
```

Or drag-and-drop the `trace.zip` file to [trace.playwright.dev](https://trace.playwright.dev/) in your browser.

---

## Quick Reference

| Task | Command |
|---|---|
| Scaffold new project | `npm init playwright@latest` |
| Run all tests | `npx playwright test` |
| Run with UI mode | `npx playwright test --ui` |
| Run headed (browser visible) | `npx playwright test --headed` |
| Debug a test | `npx playwright test --debug` |
| Record a test with codegen | `npx playwright codegen <url>` |
| View HTML report | `npx playwright show-report` |
| View a trace file | `npx playwright show-trace <file>` |
| Install browsers | `npx playwright install` |

---

## Next Steps

- **[Playwright Docs](https://playwright.dev/docs/intro)** — Official documentation
- **[API Reference](https://playwright.dev/docs/api/class-playwright)** — Full API for all methods
- **[Best Practices](https://playwright.dev/docs/best-practices)** — Official recommendations
- **[Network Mocking](https://playwright.dev/docs/mock)** — Intercept and mock API responses
- **[Authentication](https://playwright.dev/docs/auth)** — Reuse login state across tests
- **[CI/CD Setup](https://playwright.dev/docs/ci)** — Run Playwright on GitHub Actions, GitLab, Jenkins
