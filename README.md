# Scoops & Joy

## Development and validation

Use Node.js 22.12 or newer. Install with `npm ci`, start the app with `npm start`,
and run:

- `npm run lint`
- `npm run build -- --configuration production`
- `npm test -- --watch=false --browsers=ChromeHeadless`

The Angular 21 toolchain uses TypeScript 5.9 and Ionic 8. Existing NgModule
declarations, constructor injection, and structural directives are retained;
the lint configuration does not require converting them to newer styles.
Browser tests stub Firebase reads and initialization so they do not contact the
live project. Chrome or Chromium must be installed to run them.
