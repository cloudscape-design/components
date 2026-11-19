// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const path = require('path');
const fs = require('fs');
const { extractStyleApiDocs } = require('@cloudscape-design/component-toolkit/internal/style-api/docs');
const { generateSlotMixins } = require('@cloudscape-design/component-toolkit/internal/style-api/generate-slot-mixins');

const { writeFile, listPublicItems } = require('../utils/files');
const workspace = require('../utils/workspace');

const outDir = path.join(workspace.targetPath, 'components', 'styling');
const compiledStylesPath = component => path.join(workspace.targetPath, 'components', component, 'styles.scoped.css');

// Generates the slot mixins of every component with Style API docs, imported as
// `@cloudscape-design/components/styling/<component>`.
module.exports = function styleMixins() {
  for (const component of listPublicItems(workspace.sourcePath)) {
    const cssPath = compiledStylesPath(component);
    if (!fs.existsSync(cssPath)) {
      continue;
    }
    const docs = extractStyleApiDocs(fs.readFileSync(cssPath, 'utf8'));
    if (docs.slots.length > 0) {
      writeFile(path.join(outDir, `${component}.scss`), generateSlotMixins({ component, docs }));
    }
  }
  return Promise.resolve();
};
