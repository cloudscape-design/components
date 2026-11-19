// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const path = require('path');
const fs = require('fs');
const { extractStyleApiDocs } = require('@cloudscape-design/component-toolkit/internal/style-api/docs');

const { writeFile, listPublicItems } = require('../utils/files');
const workspace = require('../utils/workspace');

const outDir = path.join(workspace.targetPath, 'components-definitions', 'style-api-doc');
const compiledStylesPath = component => path.join(workspace.targetPath, 'components', component, 'styles.scoped.css');
const typesSource = path.join(
  path.dirname(require.resolve('@cloudscape-design/component-toolkit/internal/style-api/docs')),
  'docs.d.ts'
);

module.exports = function styleDocs() {
  const documented = [];
  for (const component of listPublicItems(workspace.sourcePath)) {
    const cssPath = compiledStylesPath(component);
    if (!fs.existsSync(cssPath)) {
      continue;
    }
    const docs = extractStyleApiDocs(fs.readFileSync(cssPath, 'utf8'));
    if (docs.slots.length > 0) {
      writeFile(path.join(outDir, `${component}.json`), JSON.stringify(docs, null, 2) + '\n');
      documented.push(component);
    }
  }
  writeFile(
    path.join(outDir, 'index.js'),
    `module.exports = {\n${documented.map(name => `  ${JSON.stringify(name)}: require('./${name}.json'),`).join('\n')}\n};\n`
  );
  writeFile(path.join(outDir, 'interfaces.d.ts'), fs.readFileSync(typesSource, 'utf8'));
  writeFile(
    path.join(outDir, 'index.d.ts'),
    `import { StyleApiDocs } from './interfaces';\ndeclare const docs: Record<string, StyleApiDocs>;\nexport = docs;\n`
  );
  return Promise.resolve();
};
