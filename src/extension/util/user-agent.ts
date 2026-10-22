import { get } from './nodecg';

const { bundleName, bundleVersion } = get();

export const USER_AGENT = `${bundleName}/${bundleVersion}`;
