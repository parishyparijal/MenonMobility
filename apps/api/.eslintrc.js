module.exports = {
  extends: ["@menontrucks/eslint-config"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    // API-specific overrides if needed
  },
};
