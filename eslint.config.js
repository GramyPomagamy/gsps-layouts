import { ConfigCreator } from '@gramypomagamy/eslint-config';

const tsParser = ConfigCreator.createTsParser({
  tsconfigFilePaths: ['tsconfig.browser.json', 'tsconfig.extension.json'],
});
const reactConfig = ConfigCreator.createReactRules({ folderPath: 'src/browser' });
const schemaConfig = ConfigCreator.createTsRules({ folderPath: 'src/schemas' });
const extensionConfig = ConfigCreator.createTsRules({ folderPath: 'src/extension' });

export default [...tsParser, ...reactConfig, ...extensionConfig, ...schemaConfig];
