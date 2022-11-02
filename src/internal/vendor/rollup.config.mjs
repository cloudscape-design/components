// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import resolve from '@rollup/plugin-node-resolve';
import license from 'rollup-plugin-license';
import * as path from 'path';
import { fileURLToPath } from 'url';
import commenting from 'commenting';
import { readFileSync } from 'fs';

const dirName = path.dirname(fileURLToPath(import.meta.url));

const vendorFileName = 'd3-scale.js';
const vendorFile = path.join(dirName, '../../../lib/components/internal/vendor', vendorFileName);
const d3LicencesFile = path.join(dirName, 'generated-third-party-licenses.txt');

export default {
  input: vendorFile,
  output: {
    file: vendorFile,
    format: 'es',
  },
  plugins: [
    resolve({
      extensions: ['.js'],
    }),
    license({
      thirdParty: {
        output: {
          file: d3LicencesFile,
          encoding: 'utf-8',
        },
      },
    }),
    attach3rdPartyLicenses(),
  ],
};

// Rollup plugin which prepends the generated 3rd party licences content to the bundled code before writing the file.
function attach3rdPartyLicenses() {
  return {
    name: 'attach-3rd-party-licences',
    generateBundle(options, bundle) {
      const content = readFileSync(d3LicencesFile, 'utf8');
      const comment = commenting(content, { extension: '.js' });
      bundle[vendorFileName].code = `${comment}${bundle[vendorFileName].code}`;
    },
  };
}
