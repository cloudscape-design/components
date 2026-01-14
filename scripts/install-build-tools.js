#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(
  __dirname,
  '..',
  'node_modules',
  '@cloudscape-design',
  'build-tools',
  'lib',
  'dev-pages-utils'
);
const targetDir = path.join(__dirname, '..', 'pages', 'shared-auto-build-tools');

if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true });
}

fs.mkdirSync(path.dirname(targetDir), { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });
