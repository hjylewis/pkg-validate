module.exports = {
    extends: ['prettier'],
    env: {
        es6: true,
        node: true,
    },
    extends: 'eslint:recommended',
    rules: {
        indent: ['error', 2],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
    },
}
