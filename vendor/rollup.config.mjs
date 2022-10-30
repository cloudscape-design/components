// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import resolve from '@rollup/plugin-node-resolve';
import license from 'rollup-plugin-license';
import * as path from 'path';
import { fileURLToPath } from 'url';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const d3LicencesFile = path.join(dirName, 'generated-d3-scale-third-party-licenses.txt');

export default {
  input: './src/internal/vendor/d3-scale.js',
  output: {
    dir: './src/internal/vendor',
    format: 'es',
  },
  plugins: [
    resolve({
      extensions: ['.js'],
    }),
    license({
      // First, the licence plugin attaches d3-scale related 3rd party licences to the bundle.
      banner: {
        content: {
          file: d3LicencesFile,
          encoding: 'utf-8',
        },
      },

      // After attaching, it generates the d3-scale related 3rd party licences.
      // That's why we need to store the generated licence file.
      thirdParty: {
        output: {
          file: d3LicencesFile,
          encoding: 'utf-8',
        },
      },
    }),
  ],
};
