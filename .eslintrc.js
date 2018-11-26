module.exports = {
    parser: 'babel-eslint',
    env: {
        node: true,
    },
    extends: [
        "eslint:recommended",
        "google",
    ],
    parserOptions: {
        ecmaVersion: 7,
        sourceType: "module",
    }
};
