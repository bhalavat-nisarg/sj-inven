const { defineConfig } = require('eslint/config');
const angularConfigs = require('angular-eslint').configs;
const angular = require('@angular-eslint/eslint-plugin');
const template = require('@angular-eslint/eslint-plugin-template');
const tsParser = require('@typescript-eslint/parser');
const typescript = require('@typescript-eslint/eslint-plugin');
const templateParser = require('@angular-eslint/template-parser');

module.exports = defineConfig([
  { ignores: ['projects/**', 'www/**', 'android/**', 'node_modules/**'] },
  {
    files: ['src/**/*.ts'],
    extends: [angularConfigs.tsRecommended],
    languageOptions: { parser: tsParser },
    plugins: { '@angular-eslint': angular, '@typescript-eslint': typescript },
    rules: {
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@angular-eslint/no-empty-lifecycle-method': 'off',
      '@angular-eslint/component-class-suffix': ['error', { suffixes: ['Page', 'Component'] }],
      '@angular-eslint/component-selector': [
        'error', { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error', { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
    },
  },
  {
    files: ['src/**/*.html'],
    extends: [angularConfigs.templateRecommended],
    languageOptions: { parser: templateParser },
    plugins: { '@angular-eslint/template': template },
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'off',
    },
  },
]);
