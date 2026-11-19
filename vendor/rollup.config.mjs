// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import resolve from '@rollup/plugin-node-resolve';
import commenting from 'commenting';
import { readFileSync } from 'fs';
import * as path from 'path';
import license from 'rollup-plugin-license';
import { fileURLToPath } from 'url';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const vendorFolder = path.join(dirName, '../lib/components/internal/vendor');

export default ['d3-scale', 'react-virtual'].map(entry => ({
  input: `./src/internal/vendor/${entry}.js`,
  output: {
    dir: vendorFolder,
    format: 'es',
  },
  external: ['react', 'react-dom'],
  onwarn(warning, warn) {
    // Suppress circular dependency warnings for d3-interpolate
    // These are known harmless circular dependencies acknowledged by d3 maintainers
    // See: https://github.com/d3/d3-interpolate/issues/58, https://github.com/d3/d3-interpolate/issues/71
    if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.ids.some(id => id.includes('d3-interpolate'))) {
      return;
    }
    warn(warning);
  },
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
