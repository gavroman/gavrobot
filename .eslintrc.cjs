module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    env: {
        es2021: true,
        node: true,
    },
    extends: [
        'google',
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        indent: ['error', 4, {
            SwitchCase: 1,
        }],
        'semi-style': ['error', 'last'],
        semi: ['error'],
        'quote-props': ['error', 'as-needed'],
        'require-jsdoc': 0,
        'max-len': ['error', {code: 120}],
    },
};
