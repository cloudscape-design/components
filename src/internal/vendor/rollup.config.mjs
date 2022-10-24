// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import resolve from '@rollup/plugin-node-resolve';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from "fs";

const dirName = path.dirname(fileURLToPath(import.meta.url));

export default {
  input: './lib/components/internal/vendor/d3-scale.js',
  output: {
    dir: './lib/components/internal/vendor',
    format: 'es',
    banner: (chunkInfo) => {
      // Fetch the banner content from this folder based on the chunk name
      const content = readFileSync(path.join(dirName, `${chunkInfo.name}-licences-banner.txt`));
      return `/* ${content }*/`
    },
  },
  plugins: [
    resolve({
      extensions: ['.js'],
    }),
  ],
};
