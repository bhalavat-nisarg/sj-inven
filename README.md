# Scoops & Joy

## Development and validation

Use Node.js 22.22.3+, 24.15+, or 26+ and npm 11.12.1, matching CI. Install with
`npm ci`, start the app with `npm start`, and run:

- `npm run lint`
- `npm run build -- --configuration production`
- `npm test -- --watch=false --browsers=ChromeHeadless`

The Angular 22 toolchain uses TypeScript 6.0 and Ionic 8. Existing NgModule
declarations, constructor injection, and structural directives are retained;
the lint configuration does not require converting them to newer styles.
Explicit eager change detection preserves updates from Firebase callbacks
under Angular 22's new default; TypeScript's previous non-strict behavior is
also declared explicitly. Angular template checking remains strict.
Browser tests stub Firebase reads and initialization so they do not contact the
live project. Chrome or Chromium must be installed to run them.
