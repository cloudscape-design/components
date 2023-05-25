// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const path = require('path');
const { task } = require('../utils/gulp-utils');
const { writeFile } = require('../utils/files');
const workspace = require('../utils/workspace');
const themeClassic = require('../../lib/style-dictionary/classic/metadata.js');
const themeVR = require('../../lib/style-dictionary/visual-refresh/metadata/index.js');

function createTokenDescriptions(source, targetPath) {
  const entries = Object.values(source).flatMap(tokens => Object.entries(tokens));
  const public = Object.fromEntries(
    entries
      .filter(([, metadata]) => metadata.public)
      .map(([key, metadata]) => [
        key,
        {
          description: metadata.description,
          public: !!metadata.public,
          themeable: !!metadata.themeable,
        },
      ])
  );
  writeFile(targetPath, JSON.stringify(public, null, 2));
}

function buildTokenDescriptionsClassic() {
  createTokenDescriptions(themeClassic, path.join(workspace.tokensToolkitPath, 'tokens-descriptions-classic.json'));
}

function buildTokenDescriptionsVR() {
  createTokenDescriptions(themeVR, path.join(workspace.tokensToolkitPath, 'tokens-descriptions-visual-refresh.json'));
}

function build() {
  buildTokenDescriptionsClassic();
  buildTokenDescriptionsVR();
  return Promise.resolve();
}

module.exports = task('build-tokens-toolkit', () => build());
