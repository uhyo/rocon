module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false,
        },
      },
    ],
    // waiting for https://github.com/typescript-eslint/typescript-eslint/issues/2309 to fix
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    // does not work well with JSX syntax
    "@typescript-eslint/no-unused-vars": ["off"],
  },
};
