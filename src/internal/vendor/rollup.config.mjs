// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import resolve from '@rollup/plugin-node-resolve';
import license from 'rollup-plugin-license';
import * as path from 'path';
import { fileURLToPath } from 'url';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const d3LicencesFile = path.join(dirName, 'd3-scale-third-party-licenses.txt');

export default {
  input: './lib/components/internal/vendor/d3-scale.js',
  output: {
    dir: './lib/components/internal/vendor',
    format: 'es',
  },
  plugins: [
    resolve({
      extensions: ['.js'],
    }),
    license({
      thirdParty: {
        // Extract d3-scale related 3rd party licences.
        output: {
          file: d3LicencesFile,
          encoding: 'utf-8',
        },
      },

      banner: {
        // Attach d3-scale related 3rd party licences to the bundle.
        content: {
          file: d3LicencesFile,
          encoding: 'utf-8',
        },
      },
    }),
  ],
};
