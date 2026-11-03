import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
const firebaseBrowserAliases = [
  ['@firebase/auth', '.'],
  ['@firebase/auth', './internal'],
  ['@firebase/auth-compat', '.'],
  ['@firebase/firestore', '.'],
  ['@firebase/firestore-compat', '.'],
].map(([name, subpath]) => {
  const manifest = require.resolve(`${name}/package.json`);
  const browserEntry = require(manifest).exports[subpath].browser.import;
  const specifier = name + (subpath === '.' ? '' : subpath.slice(1));
  return {
    find: new RegExp(`^${specifier.replaceAll('.', '\\.')}$`),
    replacement: resolve(dirname(manifest), browserEntry),
  };
});

export default defineConfig({
  // Firebase's Node exports contain gRPC; browser tests must use the browser SDK.
  resolve: { alias: firebaseBrowserAliases },
});
