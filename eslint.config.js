const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'show-ip/js/jquery.js',
      'show-ip/js/MD5.js',
      'show-ip/js/clipboard.min.js',
      'show-ip/bs/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.webextensions,
        $: 'readonly',
        jQuery: 'readonly',
        MD5: 'readonly',
        ClipboardJS: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'warn',
    },
  },
  {
    files: ['show-ip/js/ip.js', 'show-ip/js/iputils.js'],
    languageOptions: {
      globals: {
        IPUtils: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
  },
  {
    files: ['eslint.config.js', 'jest.config.js', 'scripts/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
  },
];
