// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('fs');
const path = require('path');
const { writeComponentsDocumentation, writeTestUtilsDocumentation } = require('@cloudscape-design/documenter');
const workspace = require('../utils/workspace');

// Dash-case names of the versioned beta components — the dirs matching the beta documenter glob
// (src/beta/<name>-<major.minor>/<component>/index.tsx). Used to flag their generated definitions.
function getBetaComponentNames(srcDir = 'src') {
  const betaRoot = path.join(srcDir, 'beta');
  if (!fs.existsSync(betaRoot)) {
    return [];
  }
  const names = [];
  for (const versionDir of fs.readdirSync(betaRoot)) {
    const versionPath = path.join(betaRoot, versionDir);
    if (!fs.statSync(versionPath).isDirectory()) {
      continue;
    }
    for (const component of fs.readdirSync(versionPath)) {
      if (fs.existsSync(path.join(versionPath, component, 'index.tsx'))) {
        names.push(component);
      }
    }
  }
  return names;
}

module.exports = function docs() {
  const componentsOutDir = path.join(workspace.apiDocsPath, 'components');

  // Document the stable components AND the versioned beta components into the SINGLE `components`
  // output (one combined glob → one index barrel; the documenter rewrites the index from its glob,
  // so a second same-outDir pass would clobber it). Beta components are NOT shipped as a separate
  // barrel; they live in `components` and are distinguished by the `releaseStatus: 'beta'` flag
  // stamped below.
  writeComponentsDocumentation({
    outDir: componentsOutDir,
    tsconfigPath: require.resolve('../../tsconfig.json'),
    publicFilesGlob: 'src/{*/index.tsx,beta/*/*/index.tsx}',
    extraExports: {
      FileDropzone: ['useFilesDragging'],
      IconProvider: ['defineIcons', 'IconRegistry', 'IconMap'],
      TagEditor: ['getTagsDiff'],
    },
  });

  // The documenter hard-codes `releaseStatus: 'stable'` with no tag override, so stamp the beta
  // components' generated definitions as `beta`. The website derives `isBeta` from this (beta page
  // header alert + nav badge), keeping the single components barrel with per-component flagging.
  for (const name of getBetaComponentNames('src')) {
    const definitionFile = path.join(componentsOutDir, `${name}.js`);
    if (!fs.existsSync(definitionFile)) {
      continue;
    }

    const definition = require(path.resolve(definitionFile));
    definition.releaseStatus = 'beta';
    fs.writeFileSync(definitionFile, `module.exports = ${JSON.stringify(definition, null, 2)};`);
  }

  writeTestUtilsDocumentation({
    outDir: path.join(workspace.apiDocsPath, 'test-utils-doc'),
    tsconfigPath: require.resolve('../../src/test-utils/tsconfig.json'),
    includeCoreMethods: false,
    domUtils: {
      root: 'src/test-utils/dom/index.ts',
      extraExports: ['default', 'ElementWrapper'],
    },
    selectorsUtils: {
      root: 'src/test-utils/selectors/index.ts',
      extraExports: ['default', 'ElementWrapper'],
    },
  });
  return Promise.resolve();
};
