import { ConfigCreator } from "@gramypomagamy/eslint-config";
import globals from "globals";

const tsParser = ConfigCreator.createTsParser({
  tsconfigFilePaths: [
    "tsconfig.browser.json",
    "tsconfig.extension.json",
    "tsconfig.test.json",
  ],
});

const reactGlobalsConfig = {
  files: ["src/browser/**/*.tsx"],
  languageOptions: {
    globals: {
      ...globals.browser,
      React: "readonly",
      JSX: "readonly",
      NodeCG: "readonly",
      nodecg: "readonly",
    },
  },
};

//const reactRules = ConfigCreator.createReactRules({ folderPath: 'src/browser' });
const reactConfig = [reactGlobalsConfig];

const schemaConfig = ConfigCreator.createTsRules({ folderPath: "src/schemas" });
const extensionsRules = ConfigCreator.createTsRules({
  folderPath: "src/extension",
});

// Add Node.js environment for extension files to recognize NodeJS global types
const extensionsGlobalsConfig = {
  files: ["src/extension/**/*.ts"],
  languageOptions: {
    globals: {
      ...globals.node,
      NodeJS: "readonly",
    },
  },
};

const extensionsConfig = [...extensionsRules, extensionsGlobalsConfig];

const testConfig = ConfigCreator.createTestRules();

export default [
  ...tsParser,
  ...reactConfig,
  ...extensionsConfig,
  ...schemaConfig,
  ...testConfig,
];
