// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const path = require('path');
const fs = require('fs');
const { extractStyleApiDocs } = require('@cloudscape-design/component-toolkit/internal/style-api/docs');

const { writeFile, listPublicItems } = require('../utils/files');
const workspace = require('../utils/workspace');

const outDir = path.join(workspace.targetPath, 'components-definitions', 'style-api-doc');
const compiledStylesPath = component => path.join(workspace.targetPath, 'components', component, 'styles.scoped.css');

module.exports = function styleDocs() {
  for (const component of listPublicItems(workspace.sourcePath)) {
    const cssPath = compiledStylesPath(component);
    if (!fs.existsSync(cssPath)) {
      continue;
    }
    const docs = extractStyleApiDocs(fs.readFileSync(cssPath, 'utf8'));
    if (docs.slots.length > 0) {
      writeFile(path.join(outDir, `${component}.json`), JSON.stringify(docs, null, 2) + '\n');
    }
  }
  return Promise.resolve();
};
