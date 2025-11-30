import { ConfigCreator } from '@gramypomagamy/eslint-config';
import globals from 'globals';

const tsParser = ConfigCreator.createTsParser({
  tsconfigFilePaths: ['tsconfig.browser.json', 'tsconfig.extension.json'],
});
const reactConfig = ConfigCreator.createReactRules({ folderPath: 'src/browser' });
const schemaConfig = ConfigCreator.createTsRules({ folderPath: 'src/schemas' });
const extensionsConfig = ConfigCreator.createTsRules({ folderPath: 'src/extension' });

// Add Node.js environment for extension files to recognize NodeJS global types
const nodeGlobalsConfig = {
  files: ['src/extension/**/*.ts'],
  languageOptions: {
    globals: {
      ...globals.node,
      NodeJS: 'readonly',
    },
  },
};

const extensionConfig = [...extensionsConfig, nodeGlobalsConfig];

export default [...tsParser, ...reactConfig, ...extensionConfig, ...schemaConfig]