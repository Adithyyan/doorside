module.exports = {
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'script',
  },
  rules: {
    // Code style
    strict: 'off',
    'max-classes-per-file': 'off',
    'class-methods-use-this': 'off',
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'no-console': 'error',
    'prefer-destructuring': 'warn',
    'no-underscore-dangle': 'off',
    'no-param-reassign': ['error', { props: false }],
    'consistent-return': 'off',

    // Require braces on all if statements
    curly: ['error', 'all'],
    'nonblock-statement-body-position': 'off',

    // Async/await
    'no-await-in-loop': 'warn',
    'no-restricted-syntax': [
      'error',
      { selector: 'LabeledStatement', message: 'Labels are not allowed.' },
      { selector: 'WithStatement', message: 'with is not allowed.' },
    ],

    // Variable naming
    'id-length': ['error', { min: 2, exceptions: ['_', 'id', 'db', 'r', 'p', 'c', 'v'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

    // Imports
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.js', '**/*.spec.js'] }],

    // Misc
    'max-len': ['warn', { code: 140, ignoreStrings: true, ignoreTemplateLiterals: true }],
    'no-plusplus': 'off',
    radix: 'off',
  },
};
