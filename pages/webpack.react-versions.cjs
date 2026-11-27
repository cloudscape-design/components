// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * React versions the dev pages can be built and tested with. To add or remove a version, edit this map
 * (plus the matching npm aliases in package.json and the CI matrix).
 *
 * - `packages`: npm alias names for react and react-dom; omitted for the default version installed as `react`.
 * - `types`: npm alias names for @types/react and @types/react-dom; omitted for the default version.
 * - `mount`: mount implementation in pages/app/mount.
 */
const reactVersions = {
  16: { mount: 'react16.ts' },
  18: {
    mount: 'react18.ts',
    packages: { react: 'react18', reactDom: 'react-dom18' },
    types: { react: 'types-react18', reactDom: 'types-react-dom18' },
  },
  19: {
    mount: 'react18.ts',
    packages: { react: 'react19', reactDom: 'react-dom19' },
    types: { react: 'types-react19', reactDom: 'types-react-dom19' },
  },
};

const defaultReactVersion = '16';

function getReactVersion(version = process.env.REACT_VERSION || defaultReactVersion) {
  const config = reactVersions[version];
  if (!config) {
    throw new Error(`Unsupported REACT_VERSION "${version}". Supported: ${Object.keys(reactVersions).join(', ')}`);
  }
  return { version: String(version), ...config };
}

module.exports = { reactVersions, defaultReactVersion, getReactVersion };
