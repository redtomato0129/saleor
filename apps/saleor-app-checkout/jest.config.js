/* eslint-disable import/no-anonymous-default-export */
const { pathsToModuleNameMapper } = require("ts-jest");
const requireJSON = require("json-easy-strip");
const { compilerOptions } = requireJSON("./tsconfig.json");

delete compilerOptions.paths["react"];

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  clearMocks: false,
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest/presets/default-esm",
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: {
        ...compilerOptions,
        jsx: "react-jsx",
        allowJs: true,
      },
    },
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!url-join|@saleor/app-sdk|node-fetch)"],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: "<rootDir>/",
    }),
    "^lodash-es/(.*)$": "lodash/$1",
  },
  setupFiles: ["./setupTestsBeforeEnv.ts"],
  setupFilesAfterEnv: ["./setupTestsAfterEnv.ts"],
  testEnvironment: "setup-polly-jest/jest-environment-node",
  // temporarily because they fail randomly in ci
  testPathIgnorePatterns: ["<rootDir>/__tests__/pages/api/webhooks/*"],
};
