// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import resolve from '@rollup/plugin-node-resolve';
import license from 'rollup-plugin-license';
import * as path from 'path';
import { fileURLToPath } from 'url';
import commenting from 'commenting';
import { readFileSync } from 'fs';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const vendorFolder = path.join(dirName, '../lib/components/internal/vendor');
const licensesFile = path.join(dirName, 'generated-third-party-licenses.txt');

export default ['d3-scale', 'react-virtual'].map(entry => ({
  input: `./src/internal/vendor/${entry}.js`,
  output: {
    dir: vendorFolder,
    format: 'es',
  },
  external: ['react', 'react-dom'],
  plugins: [
    resolve({
      extensions: ['.js'],
    }),
    license({
      thirdParty: {
        output: {
          file: path.join(dirName, `generated-third-party-licenses-${entry}.txt`),
          encoding: 'utf-8',
        },
      },
    }),
    attach3rdPartyLicenses(entry),
  ],
}));

// Rollup plugin which prepends the generated 3rd party licences content to the bundled code before writing the file.
function attach3rdPartyLicenses(entry) {
  return {
    name: 'attach-3rd-party-licences',
    generateBundle(_options, bundle) {
      const content = readFileSync(path.join(dirName, `generated-third-party-licenses-${entry}.txt`), 'utf8');
      const comment = commenting(content, { extension: '.js' });
      bundle[`${entry}.js`].code = `${comment}${bundle[`${entry}.js`].code}`;
    },
  };
}
