# Scoops & Joy

## Development and validation

Use Node.js 22.22.3+, 24.15+, or 26+ and npm 11.12.1, matching CI. Install with
`npm ci`, start the app with `npm start`, and run:

- `npm run lint`
- `npm run build -- --configuration production`
- `npm test -- --watch=false --browsers=ChromiumHeadless`
- `npm test -- --watch=false --coverage` for browser coverage reports
- `npm run e2e` to build production and run the offline Playwright smoke tests
- `npm run audit` for the complete lockfile audit, including development,
  optional, and peer dependencies at every severity

The Angular 22 toolchain uses TypeScript 6.0 and Ionic 8. Existing NgModule
declarations, constructor injection, and structural directives are retained;
the lint configuration does not require converting them to newer styles.
Explicit eager change detection preserves updates from Firebase callbacks
under Angular 22's new default; TypeScript's previous non-strict behavior is
also declared explicitly. Angular template checking remains strict.
Browser tests stub Firebase reads and initialization so they do not contact the
live project. Tests now use Angular's supported Vitest/Playwright runner, retaining
all 22 existing assertions, including customer async rendering, status, navigation,
invoice dates, and menu wiring. `ChromiumHeadless` is the Playwright provider's
name for headless Chromium/Chrome (replacing Karma's `ChromeHeadless` name).
Set `CHROME_BIN` to an installed Chrome executable, or install a project-scoped
browser before running unit/E2E tests:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = ".playwright-browsers"
npx playwright install chromium
```

CI uses this scoped browser on both Node 22 and 24. It deliberately installs
npm 11.12.1 **before** `npm ci` to preserve Ionic's optional peer-lock parity.
The test-only esbuild target retains JIT/Zone.js behavior from the previous Karma
suite; the production Webpack build, strict template checking, eager change
detection, routes, Firebase compat APIs, and Capacitor 3 native packages remain
unchanged. Vitest explicitly selects Firebase's browser exports rather than its
Node/gRPC exports. `buffer`, already imported by the app's login/user forms, is
now a direct dependency instead of relying on retired tooling to provide it.

The retired Protractor files were generated starter stubs: their only assertion
expected “Start with Ionic UI Components”, which is not present in this app.
Their obsolete Angular builder no longer existed, and CI did not run them.
Playwright replaces that stale assertion with real login-form, home-card routing,
and Ionic menu smoke coverage against the production bundle. Every off-origin
request is blocked; tests do not submit credentials, authenticate, or access the
live database. The loopback-only static helper is owned and stopped by Playwright.

## Security dependency maintenance

- Protractor/WebDriver/request, Karma, and unused legacy ESLint plugins/reporters
  have been replaced, not audit-excluded. The full audit is a required CI step.
- ESLint 10 removes callable-minimatch 3 consumers. The minimatch 11 override
  patches remaining named-export consumers in ESLint/typescript-eslint;
  glob 14 patches the maintained Capacitor CLI/rimraf chain. Lint, builds, browser
  tests, and native builder smoke checks validate these API transitions.
- Ionic toolkit 13 supplies Angular-compatible schematics. Cordova targets now
  use the separately maintained `@ionic/cordova-builders` package; its scoped
  copy-webpack-plugin 14 override removes its vulnerable serializer parent.
  Capacitor CLI 8.6 replaces its obsolete xcode/uuid chain. Native runtime
  packages and the existing Android project are not migrated.
- Firebase 12.19 and even Firebase 13.2 still constrain their Node Firestore
  dependency to gRPC `~1.9.0`. A Firestore-scoped override selects patched
  `@grpc/grpc-js` 1.14.7 within the same major, without changing browser SDK APIs
  or upgrading/downgrading Firebase to evade the audit. The cited server-side
  certificate advisory is not an established browser-app exploit, but its
  affected version is nevertheless absent from the complete lockfile.

Keep these narrow dependency overrides until their parents adopt patched ranges;
do not remove audit gates or omit development/optional dependencies to obtain a
clean report.
