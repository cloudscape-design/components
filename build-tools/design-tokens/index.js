// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { join } = require('path');
const transform = require('lodash/transform');

const { resolveThemeWithPaths } = require('@cloudscape-design/theming-build');
const workspace = require('../utils/workspace');
const { writeFile } = require('../utils/files');

const rootDir = join(__dirname, '../../');

function buildDocumentation() {
  ['classic', 'visual-refresh'].forEach(buildThemeDocumentation);
}

function buildThemeDocumentation(themeName) {
  const theme = require(join(rootDir, `lib/style-dictionary/${themeName}`)).default;
  const metadata = require(join(rootDir, `lib/style-dictionary/${themeName}/metadata`)).default;
  const { resolvedTheme, resolutionPaths } = resolveThemeWithPaths(theme);
  const variables = getClosestSassVariables(resolutionPaths, metadata);

  const documentation = transform(
    metadata,
    (result, value, key) => {
      if (value.public) {
        result.push(transformToken(key, value, resolvedTheme[key], variables[key]));
      }
    },
    []
  );
  writeFile(join(workspace.apiDocsPath, `styles/tokens-${themeName}.json`), JSON.stringify(documentation, null, 2));
}

function transformToken(jsName, { sassName, description, themeable }, value, variable) {
  return {
    name: sassName.replace(/^\$/, ''),
    description,
    themeable,
    value,
    variable,
  };
}

function getClosestSassVariables(variableChains, metadata) {
  return transform(
    variableChains,
    (result, value, token) => {
      if (Array.isArray(value)) {
        result[token] = value.length > 1 ? metadata[value[value.length - 1]].sassName : null;
      } else {
        result[token] = transform(
          value,
          (subResult, modeValue, modeKey) => {
            subResult[modeKey] = modeValue.length > 1 ? metadata[modeValue[modeValue.length - 1]].sassName : null;
          },
          {}
        );
      }
    },
    {}
  );
}
module.exports = { buildDocumentation };
